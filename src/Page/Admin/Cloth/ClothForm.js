import { Button, Col, Form, Input, InputNumber, Row, Spin, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardFooter, CardHeader } from 'react-bootstrap'
import { GetRequired, checkFile } from '../../../Asset/Validated/Validated';
import { PlusOutlined } from '@ant-design/icons';
import ImageGroupPreview from '../../../Component/ImageGroupPreview';
import { ConvertImageAntdToOrigin, GetRemainingImage, GetSelected, getBase64 } from '../../../Asset/Tool Helper/Tool';
import { Notification } from '../../../Asset/ShowNotification'
import CategoriesSelect from '../../../Component/Admin/Select/CategoriesSelect';
import ModalSelect from '../../../Component/Admin/Select/ModelSelect';
import SizesSelect from '../../../Component/Admin/Select/SizesSelect';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import httpClient from '../../../Utils/request';
import { CLOTH } from '../../../Config/Admin';
import StackForMobile from '../../../Component/StackForMobile';

function ClothForm(props) {
    const { Token, Role } = props;
    const [form] = Form.useForm();
    const [Loading, setLoading] = useState(true);
    const [SaveData, setSaveData] = useState({});
    const [PreviewShow, setPreviewShow] = useState(false);
    const [ImagePreview, setImagePreview] = useState("");
    const [fileList, setFileList] = useState([]);
    const navigation = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const IsUpdate = pathname.toLocaleLowerCase().includes(`edit`);

    const CheckChanges = (Data, SaveData) => {
        var Check = false;
        Object.keys(Data).forEach(key => {
            if (Data[key] === null) {
                if (null == SaveData[key]) {
                    Check = true;
                }
            } else if (Array.isArray(SaveData[key])) {
                Data[key].forEach((item, index) => {
                    if (Data[key][index] !== SaveData[key][index]) {
                        Check = true;
                    }
                })
            } else if (Data[key] !== SaveData[key]) {
                Check = true;
            }
        })
        return Check;
    }

    const HandleSubmit = (Data) => {
        setLoading(true);
        Data.categoryId = GetSelected(Data.categoryId);
        Data.modelId = GetSelected(Data.modelId);
        if (IsUpdate) {
            Data.imagePaths = GetRemainingImage(fileList);
            var Check = CheckChanges(Data, SaveData);
            if (Data.images !== undefined) {
                Check = true;
                Data.images = ConvertImageAntdToOrigin(Data.images.filter(item => typeof item.uid === 'string'));
            } else {
                Data.images = null;
            }
            if (Check === true) {
                Data.ID = pathname.split('/')[3];
                const fileForm = ConvertObjectToFormData(Data);
                httpClient.put(CLOTH + `/${Data.ID}`, fileForm, { "Content-Type": "multipart/form-data" })
                    .then(res => {
                        setLoading(false);
                        if (res.status === 200) {
                            Notification.ShowSuccess("Success", res.message);
                            navigation('/Admin/Cloth');
                        } else {
                            Notification.ShowError("Error " + res.status, res.message);
                        }
                    })
                    .catch(err => {
                        setLoading(false);
                        console.log(err);
                    })
            } else {
                Notification.ShowSuccess('Success', "Nothing has been changed");
                navigation('/Admin/Cloth');
            }
        } else {
            Data.images = ConvertImageAntdToOrigin(Data.images);
            const fileForm = ConvertObjectToFormData(Data);
            httpClient.post(CLOTH, fileForm)
                .then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        Notification.ShowSuccess("Success", res.message);
                        navigation(`/admin/cloth`);
                    } else {
                        Notification.ShowError("Error " + res.status, res.message);
                    }
                })
                .catch(err => {
                    setLoading(false);
                    console.log(err);
                });
        }
    }

    const ConvertObjectToFormData = (Data) => {
        const formData = new FormData();
        Object.keys(Data).forEach((key) => {
            if (Array.isArray(Data[key])) {
                Data[key].forEach((item, index) => {
                    if (key === "images" && item instanceof File) {
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


    useEffect(() => {
        if (IsUpdate) {
            if (Token !== "") {
                if (Role.toLowerCase() === "admin") {
                    httpClient.get(CLOTH + `/${pathname.split('/')[3]}`)
                        .then(res => {
                            setLoading(false);
                            if (res.status === 200) {
                                const Data = res.data;
                                form.setFieldValue("name", Data.name);
                                form.setFieldValue("price", Data.price);
                                form.setFieldValue("discount", Data.discount);
                                form.setFieldValue("categoryId", Data.category ? (Data.category._id + '/' + Data.category.name) : "");
                                form.setFieldValue("modelId", Data.model ? (Data.model._id + '/' + Data.model.name) : "");
                                form.setFieldValue("sizes", Data.sizes);
                                form.setFieldValue("code", Data.code);
                                form.setFieldValue("description", Data.description);
                                const TempFileList = [];
                                Data.imagePaths.forEach((item, index) => {
                                    TempFileList.push({
                                        uid: (index + 1) * -1,
                                        name: 'image.png',
                                        status: 'done',
                                        url: item,
                                    });
                                })
                                setFileList([...TempFileList]);
                                setSaveData({
                                    "name": Data.name,
                                    "price": Data.price,
                                    "discount": Data.discount,
                                    "categoryId": "" + Data.category?._id,
                                    "modelId": "" + Data.model._id,
                                    "sizes": Data.sizes,
                                    "code": Data.code,
                                    "description": Data.description,
                                    "remainingImages": Data.imagePaths.map((item) => item)
                                });
                            } else {
                                Notification.ShowError("Error " + res.status, res.message);
                                if (res.StatusCode === 404) {
                                    navigation(`/admin/cloth`);
                                }
                            }
                        })
                        .catch(err => {
                            setLoading(false);
                            console.log(err);
                        })
                } else {
                    navigation("/admin/dashboard");
                }
            }
        } else {
            setLoading(false);
        }
    }, [IsUpdate, pathname, form, Token])

    const HandlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setImagePreview(file.url || file.preview);
        setPreviewShow(true);
    }
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    return (
        <Spin spinning={Loading}>
            <div>
                <StackForMobile path={"/admin/cloth"} Header={""} />
            </div>
            <Form form={form} layout='vertical'
                onFinish={HandleSubmit}>
                <Card className='border-0'>
                    <CardHeader className='border-0 bg-white'>
                        <h1>{IsUpdate ? 'Edit Cloth information' : 'Cloth Form'}</h1>
                    </CardHeader>
                    <CardBody>
                        <Row
                            gutter={[30, 0]}
                        >
                            <Col xs={24}>
                                <Form.Item label="Name" name={"name"} rules={[{
                                    ...GetRequired("Name")
                                }]}>
                                    <Input placeholder='Name' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item label="Price" name={"price"} rules={[{
                                    ...GetRequired("Price")
                                }]}>
                                    <InputNumber className='w-100' placeholder='Price' min={1} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item label="Discount" name={"discount"} rules={[{
                                    ...GetRequired("Discount")
                                }]}>
                                    <InputNumber className='w-100' placeholder='Discount' min={0} max={100} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <CategoriesSelect Name={"categoryId"} />
                            </Col>
                            <Col xs={24} lg={12}>
                                <ModalSelect Name={"modelId"} />
                            </Col>
                            <Col xs={24} lg={12}>
                                <SizesSelect mode={"multiple"} Name={"sizes"} />
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item label="Code" name={"code"} rules={[{
                                    ...GetRequired("Code")
                                }]}>
                                    <Input placeholder='Code' />
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item label="Description" name={"description"} rules={[{
                                    ...GetRequired("Description")
                                }]}>
                                    <Input.TextArea rows={4} placeholder='Description' />
                                </Form.Item>
                            </Col>

                            <Col xs={24} >
                                <Form.Item
                                    label="Images"
                                    name={"images"}
                                    getValueFromEvent={checkFile}
                                    rules={IsUpdate ? [() => ({
                                        validator(_, value) {
                                            return fileList.length > 0 ? Promise.resolve() : Promise.reject("Image needed")
                                        }
                                    })] : [{
                                        ...GetRequired("Images")
                                    }]}
                                >

                                    <Upload.Dragger
                                        listType="picture-circle"
                                        beforeUpload={(file) => {
                                            return false;
                                        }}
                                        fileList={fileList}
                                        onChange={handleChange}
                                        onPreview={HandlePreview}
                                        multiple
                                    >
                                        <button style={{ border: 0, background: 'none' }} type="button">
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload (Click or Drag your file here)</div>
                                        </button>
                                    </Upload.Dragger>
                                </Form.Item>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter className='p-3 border-0 bg-white d-flex justify-content-center'>
                        <Button htmlType='submit'>SUBMIT</Button>
                    </CardFooter>
                </Card>
                <ImageGroupPreview Images={[ImagePreview]} Show={PreviewShow} OnClose={() => setPreviewShow(false)} />
            </Form >
        </Spin>
    )
}

const mapDispatchToProps = (dispatch) => ({ dispatch })

const mapStateToProps = (state) => ({
    Token: state.TokenReducer.Token,
    Role: state.TokenReducer.Role
})

export default connect(mapStateToProps, mapDispatchToProps)(ClothForm);