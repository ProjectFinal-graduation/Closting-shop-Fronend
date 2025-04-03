import { Button, Col, Form, Input, InputNumber, Row, Select, Spin, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardFooter, CardHeader } from 'react-bootstrap'
import { GetRequired, checkFile } from '../../../Asset/Validated/Validated'
import { PlusOutlined } from '@ant-design/icons'
import { Notification } from '../../../Asset/ShowNotification'
import { ConvertImageAntdToOrigin, getBase64 } from '../../../Asset/Tool Helper/Tool';
import { useLocation, useNavigate } from 'react-router-dom'
import ImageGroupPreview from '../../../Component/ImageGroupPreview';
import { connect } from 'react-redux'
import httpClient from '../../../Utils/request'
import { MODEL } from '../../../Config/Admin'
import StackForMobile from '../../../Component/StackForMobile'

function ModelForm(props) {
    const { Token, Role } = props;
    const [form] = Form.useForm();
    const [loading, setloading] = useState(true);
    const [PreviewShow, setPreviewShow] = useState(false);
    const [SaveData, setSaveData] = useState({});
    const [ImagePreview, setImagePreview] = useState("");
    const [fileList, setFileList] = useState([]);
    const navigation = useNavigate();
    const location = useLocation();
    const pathname = location.pathname.toLocaleLowerCase();
    const IsUpdate = pathname.includes("edit");
    const Sizes = [{
        label: "XS",
        value: "XS"
    }, {
        label: "S",
        value: "S"
    }, {
        label: "M",
        value: "M"
    }, {
        label: "L",
        value: "L"
    }, {
        label: "XL",
        value: "XL"
    }, {
        label: "XXL",
        value: "XXL"
    }]

    const HandleSubmit = (Data) => {
        setloading(true);
        if (IsUpdate) {
            var Check = false;
            Object.keys(Data).forEach(key => {
                if (Data[key] !== SaveData[key]) {
                    Check = true;
                }
            })
            if (Data.profile !== undefined) {
                Check = true;
                Data.image = ConvertImageAntdToOrigin(Data.profile)[0];
            } else {
                Data.image = null;
            }
            if (Check === true) {
                Data.ID = pathname.split('/')[3];
                const formData = ConvertObjectToFormData(Data);

                httpClient.put(MODEL + `/${pathname.split('/')[3]}`, formData)
                    .then(res => {
                        setloading(false);
                        if (res.status === 200) {
                            Notification.ShowSuccess('Success', res.message);
                            navigation(`/Admin/Model`);
                        } else {
                            Notification.ShowError("Error", res.message);
                        }
                    })
                    .catch(err => {
                        setloading(false);
                        console.log(err);
                    });
            } else {
                Notification.ShowSuccess('Success', "Nothing has been changed");
                navigation(`/Admin/Model`);
            }
        } else {
            Data.image = ConvertImageAntdToOrigin(Data.profile)[0];
            const formData = ConvertObjectToFormData(Data);

            httpClient.post(MODEL, formData)
                .then(res => {
                    setloading(false);
                    if (res.status === 200) {
                        Notification.ShowSuccess("Success", res.message);
                        navigation(`/Admin/Model`);
                    }
                })
                .catch(err => {
                    setloading(false);
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

    const HandlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setImagePreview(file.url || file.preview);
        setPreviewShow(true);
    }
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    useEffect(() => {
        if (IsUpdate) {
            if (Token !== "") {
                if (Role.toLowerCase() !== "admin") {
                    navigation("/admin/dashboard");
                }
                else {
                    httpClient.get(MODEL + `/${pathname.split('/')[3]}`)
                        .then(res => {
                            setloading(false);
                            if (res.status === 200) {
                                const Data = res.data;
                                form.setFieldValue("name", Data.name);
                                form.setFieldValue("age", Data.age);
                                form.setFieldValue("height", Data.height);
                                form.setFieldValue("weight", Data.weight);
                                form.setFieldValue("bottom", Data.bottom);
                                form.setFieldValue("top", Data.top);
                                setFileList([...[
                                    {
                                        uid: '-1',
                                        name: 'image.png',
                                        status: 'done',
                                        url: Data.profilePicture,
                                    }
                                ]]);
                                setSaveData({
                                    "name": Data.name,
                                    "age": Data.age,
                                    "height": Data.height,
                                    "weight": Data.weight,
                                    "bottom": Data.bottom,
                                    "top": Data.top
                                });
                            }
                            else {
                                Notification.ShowError("Error 404", res.message);
                            }
                        })
                        .catch(err => {
                            setloading(false);
                            console.log(err);
                        })
                }
            }
        } else {
            setloading(false);
        }
    }, [location, form, IsUpdate, pathname, Token])
    return (
        <Spin spinning={loading}>
            <div>
                <StackForMobile Header={""} />
            </div>
            <Form
                requiredMark={"optional"}
                layout='vertical' form={form} onFinish={HandleSubmit}>
                <Card className='border-0'>
                    <CardHeader className='border-0 bg-white'>
                        <h1>{IsUpdate ? 'Edit Model information' : 'Model Form'}</h1>
                    </CardHeader>
                    <CardBody>
                        <Row gutter={[30, 20]}>
                            <Col xs={24} lg={12}>
                                <Form.Item label="Name" name={"name"} rules={[{
                                    ...GetRequired("Name")
                                }]}>
                                    <Input placeholder='Name' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item label="Age" name={"age"}
                                    rules={[
                                        (getFieldValue) => ({
                                            validator(_, value) {
                                                if (value === null || (value >= 1 && value <= 125)) {
                                                    return Promise.resolve();
                                                }
                                                if (value <= 1) {
                                                    return Promise.reject("Min age is 1 year old");
                                                }
                                                return Promise.reject("Max age is 125 year old");
                                            }
                                        })
                                    ]}
                                >
                                    <InputNumber className='w-100' placeholder='Age' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item label="Height (cm)" name={"height"} rules={[{
                                    ...GetRequired("Height")
                                }]}>
                                    <InputNumber className='w-100' placeholder='Height' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item label="Weight (kg)" name={"weight"} rules={[{
                                    ...GetRequired("Weight")
                                }]}>
                                    <InputNumber className='w-100' placeholder='Weight' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item label="Bottom" name={"bottom"} rules={[{
                                    ...GetRequired("Bottom")
                                }]}>
                                    <Select options={Sizes} placeholder="Bottom Sizes">
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item label="Top" name={"top"} rules={[{
                                    ...GetRequired("Top")
                                }]}>
                                    <Select options={Sizes} placeholder="Top Sizes">
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item label="Profile"
                                    getValueFromEvent={checkFile}
                                    name={"profile"}
                                    rules={IsUpdate ? [] : [{
                                        ...GetRequired("Profile")
                                    }]}>
                                    <Upload
                                        listType="picture-circle"
                                        beforeUpload={(file) => {
                                            return false;
                                        }}
                                        fileList={fileList}
                                        onChange={handleChange}
                                        onPreview={HandlePreview}
                                        maxCount={1}
                                    >
                                        <button style={{ border: 0, background: 'none' }} type="button">
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter className='border-0 bg-white d-flex justify-content-center align-items-center p-3'>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModelForm);