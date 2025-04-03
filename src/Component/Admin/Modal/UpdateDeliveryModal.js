import { Button, Form, Input, Modal, Spin, Upload } from 'antd'
import React, { useState } from 'react'
import { checkFile } from '../../../Asset/Validated/Validated'
import { Notification } from '../../../Asset/ShowNotification';
import { PlusOutlined } from '@ant-design/icons';
import { ConvertImageAntdToOrigin, getBase64, GetRemainingImage } from '../../../Asset/Tool Helper/Tool';
import ImageGroupPreview from '../../ImageGroupPreview';
import DeliveryStatusesSelect from '../Select/DeliveryStatusesSelect';
import { ORDER_STATUS } from '../../../Config/Constants';
import httpClient from '../../../Utils/request';
import { ORDER } from '../../../Config/Admin';

export default function UpdateDeliveryModal({ Token, GetOrder, OrderId, UserId, Show, OnClose, Data }) {
    const [form] = Form.useForm();
    const [Loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [ImagePreview, setImagePreview] = useState("");
    const [PreviewShow, setPreviewShow] = useState(false);
    const [SaveData, setSaveData] = useState({});

    const HandleOpenChange = (value) => {
        if (value) {
            form.setFieldValue("deliveryStatus", Data.status.delivery);
            form.setFieldValue("deliveryManPhoneNumber", Data.deliveryManPhoneNumber ?? "");
            if (Data.status.deliveryProofImage.length > 0) {
                setFileList([...Data.status.deliveryProofImage.map((item, index) => ({
                    uid: (index + 1) * -1,
                    name: 'image.png',
                    status: 'done',
                    url: item,
                }))]);
            }
            setSaveData({
                "deliveryStatus": Data.status.delivery,
                "deliveryManPhoneNumber": Data.deliveryManPhoneNumber
            });
        } else {
            setFileList([]);
        }
    }


    const ConvertObjectToFormData = (Data) => {
        const formData = new FormData();
        Object.keys(Data).forEach((key) => {
            if (Array.isArray(Data[key])) {
                Data[key].forEach((item, index) => {
                    if (key === "deliveryProofImage" && item instanceof File) {
                        formData.append(key, item);
                    } else {
                        formData.append(key + "[]", item);
                    }
                })
            }
            else {
                formData.append(key, Data[key]);
            }
        })
        return formData;
    };

    const HandleSubmit = (NewData) => {
        setLoading(true);
        try {
            var Check = false;
            Object.keys(SaveData).forEach(key => {
                if (NewData[key] !== SaveData[key]) {
                    Check = true;
                }
            })

            NewData.orderId = OrderId;
            if (NewData.deliveryProofImage !== undefined && NewData.deliveryProofImage.length > 0) {
                Check = true;
                NewData.deliveryProofImage = ConvertImageAntdToOrigin(NewData.deliveryProofImage.filter(item => typeof item.uid === 'string'));
            } else {
                NewData.deliveryProofImage = null;
            }

            if (Check === true) {
                NewData.oldDeliveryProofImage = GetRemainingImage(fileList);
                const formData = ConvertObjectToFormData(NewData);
                httpClient.post(ORDER + "/UpdateDelivery", formData, { "Content-Type": "multipart/form-data" })
                    .then((res) => {
                        setLoading(false);
                        if (res.status === 200) {
                            Notification.ShowSuccess("Success", res.message);
                            HandleClose();
                            GetOrder(OrderId);
                        } else {
                            Notification.ShowError("Error " + res.status, res.message);
                        }
                    }).catch((err) => {
                        setLoading(false);
                        console.log(err.message);
                        Notification.ShowError("Error 500", err.message);
                    });
            } else {
                setLoading(false);
                Notification.ShowSuccess('Success', "Nothing has been changed");
                HandleClose();
            }
        } catch (error) {
            setLoading(false);
            console.log(error.message);
            Notification.ShowError("Error 500", error.message);
        }
    }

    const HandleClose = () => {
        OnClose();
    }

    const HandlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setImagePreview(file.url || file.preview);
        setPreviewShow(true);
    }

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    return (
        <Modal centered footer={false} open={Show} onCancel={HandleClose} afterOpenChange={HandleOpenChange}>

            <Spin spinning={Loading}>
                <Form layout='vertical' onFinish={HandleSubmit} form={form} className='p-3 pb-0 w-100 d-flex align-items-center flex-column'>
                    <h1>
                        {
                            [ORDER_STATUS.CANCELLED, ORDER_STATUS.COMPLETED].includes(Data && Data.status.order) ?
                                "View"
                                :
                                "Update"
                        } Delivery Status</h1>
                    <h4>Order Number: {Data && Data.id}</h4>
                    <div className='w-100 mt-4'>
                        <DeliveryStatusesSelect disabled={[ORDER_STATUS.CANCELLED, ORDER_STATUS.COMPLETED].includes(Data && Data.status.order)} Name={"deliveryStatus"} />
                        <Form.Item label="Deliverer contact number" name={"deliveryManPhoneNumber"}
                            rules={[{
                                min: 9,
                                max: 10,
                                message: "Phone Number must be 9-10"
                            }, {
                                validator(_, value) {
                                    var regex = /[a-zA-Z]/;
                                    if (regex.test(value)) {
                                        return Promise.reject("Invaild Phone Number");
                                    }
                                    if (!regex.test(value) && value !== "" && value.length >= 9 && value.length <= 10 && value[0] !== '0') {
                                        return Promise.reject("Phone Number should start with a 0");
                                    }
                                    return Promise.resolve();
                                }
                            }]}>
                            <Input disabled={[ORDER_STATUS.CANCELLED, ORDER_STATUS.COMPLETED].includes(Data && Data.status.order)} allowClear placeholder='Phone Number' maxLength={10} />
                        </Form.Item>
                        <Form.Item label="Proof Delivery"
                            getValueFromEvent={checkFile}
                            name={"deliveryProofImage"}>
                            <Upload
                                listType="picture-circle"
                                beforeUpload={(file) => {
                                    return false;
                                }}
                                fileList={fileList}
                                onChange={handleChange}
                                onPreview={HandlePreview}
                                maxCount={3}
                                multiple
                            >
                                {
                                    (![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(Data && Data.status.order) && fileList.length < 3) &&
                                    <button style={{ border: 0, background: 'none' }} type="button">
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </button>
                                }
                            </Upload>
                        </Form.Item>
                    </div>
                    <Form.Item className='d-flex justify-content-center'>
                        {
                            ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(Data && Data.status.order) &&
                            <Button htmlType='submit'>SUBMIT</Button>
                        }
                    </Form.Item>
                </Form>
                <ImageGroupPreview Images={[ImagePreview]} Show={PreviewShow} OnClose={() => setPreviewShow(false)} />
            </Spin>
        </Modal>
    )
}