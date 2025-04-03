import { Button, Col, Form, Input, Row, Select, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardFooter, CardHeader } from 'react-bootstrap'
import { GetRequired } from '../../../Asset/Validated/Validated';
import { useLocation, useNavigate } from 'react-router-dom';
import { Notification } from '../../../Asset/ShowNotification';
import { connect } from 'react-redux';
import httpClient from '../../../Utils/request';
import { USER } from '../../../Config/Admin';
import StackForMobile from '../../../Component/StackForMobile';

function UserForm(props) {
    const { Token, Role } = props;
    const [form] = Form.useForm();
    const [Loading, setLoading] = useState(false);
    const [SaveData, setSaveData] = useState({});
    const navigation = useNavigate();
    const location = useLocation();
    const pathname = location.pathname.toLocaleLowerCase();
    const IsUpdate = pathname.includes('edit');
    const HandleSubmit = (Data) => {
        setLoading(true);
        if (IsUpdate) {
            var Check = false;
            Object.keys(Data).forEach(key => {
                if (Data[key] !== SaveData[key]) {
                    Check = true;
                    return;
                }
            })
            if (Check === true) {
                httpClient.put(USER + `/${pathname.split('/')[3]}`, Data)
                    .then(res => {
                        setLoading(false);
                        if (res.status === 200) {
                            Notification.ShowSuccess("Success", res.message);
                            navigation(`/Admin/User`);
                        } else {
                            Notification.ShowError("Error", res.message);
                        }
                    })
                    .catch(err => {
                        setLoading(false);
                        console.log(err);
                    })
            } else {
                Notification.ShowSuccess("Success", "Nothing has been changed");
                navigation(`/admin/user`);
            }
        } else {
            httpClient.post(USER, Data)
                .then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        Notification.ShowSuccess("Success", res.message);
                        navigation(`/admin/user`);
                    }
                    else {
                        Notification.ShowError(res.message);
                    }
                })
                .catch(err => {
                    setLoading(false);
                    console.log(err);
                });
        }
    }
    useEffect(() => {
        if (IsUpdate) {
            setLoading(true);
            if (Token !== "") {
                if (Role.toLocaleLowerCase() !== "admin") {
                    navigation("/admin/dashboard");
                }
                else {
                    httpClient.get(USER + `/${pathname.split('/')[3]}`)
                        .then(res => {
                            setLoading(false);
                            if (res.status === 200) {
                                const Data = res.data;
                                form.setFieldValue("username", Data.username);
                                form.setFieldValue("password", Data.password);
                                form.setFieldValue("confirmPassword", Data.password);
                                form.setFieldValue("phoneNumber", Data.phoneNumber);
                                form.setFieldValue("email", Data.email);
                                form.setFieldValue("chatId", Data.chatId);
                                form.setFieldValue("role", Data.role);
                                setSaveData({
                                    "username": Data.username,
                                    "password": Data.password,
                                    "confirmPassword": Data.password,
                                    "phoneNumber": Data.phoneNumber,
                                    "email": Data.email,
                                    "chatId": Data.chatId,
                                    "role": Data.role
                                });
                            } else if (res.status === 404) {
                                Notification.ShowError("Error 404", res.message);
                                navigation(`/admin/user`);
                            }
                        })
                        .catch(err => {
                            setLoading(false);
                            console.log(err);
                        })
                }
            }
        }
    }, [location, form, IsUpdate, pathname, Token])
    return (
        <Spin spinning={Loading}>
            <div>
                <StackForMobile Header={""} />
            </div>
            <Form
                form={form}
                layout='vertical'
                onFinish={HandleSubmit}>
                <Card className='border-0'>
                    <CardHeader className='border-0 bg-white'>
                        <h1>{IsUpdate ? 'Edit User information' : 'User Form'}</h1>
                    </CardHeader>
                    <CardBody>
                        <Row gutter={[40, 0]}>
                            <Col xs={24}>
                                <Form.Item label="Username" name={"username"}
                                    rules={[{
                                        ...GetRequired("Username")
                                    }
                                    ]}>
                                    <Input
                                        allowClear
                                        placeholder='Username' autoComplete='off' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}
                                rules={[{

                                }]}>
                                <Form.Item label="Telegram ID" name={"chatId"}>
                                    <Input allowClear placeholder='Telegram ID' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item label="Role" name={"role"} rules={[{
                                    ...GetRequired("Role")
                                }]}>
                                    <Select
                                        allowClear
                                        placeholder="Pick a Roles"
                                        options={[{
                                            value: "admin",
                                            label: "Admin"
                                        }, {
                                            value: "user",
                                            label: "User"
                                        }]}>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item label="Password" name={"password"}
                                    rules={[{
                                        ...GetRequired("Password")
                                    }, {
                                        min: 8,
                                        message: "Password must be at least 8 letter"
                                    }]}>
                                    <Input.Password
                                        allowClear
                                        placeholder='Password' autoComplete='new-password' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item label="Confirm Password" name={"confirmPassword"}
                                    dependencies={['password']}
                                    rules={[{
                                        ...GetRequired("Confirm Password")
                                    }, ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (value !== "" && value !== getFieldValue('password')) {
                                                return Promise.reject("Password and confirm password not match");
                                            }
                                            return Promise.resolve();
                                        }
                                    })]}>
                                    <Input.Password allowClear placeholder='Confirm Password' autoComplete='new-password' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item label="Email" name={"email"}
                                    rules={[{
                                        ...GetRequired("Email")
                                    }, {
                                        type: 'email',
                                        message: "Invalid Email"
                                    }]}>
                                    <Input allowClear placeholder='Email' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item label="Phonenumber" name={"phoneNumber"}
                                    rules={[{
                                        ...GetRequired("Phonenumber")
                                    }, {
                                        min: 9,
                                        max: 10,
                                        message: "Phonenumber must be 9-10"
                                    }, {
                                        validator(_, value) {
                                            var regex = /[a-zA-Z]/;
                                            if (regex.test(value)) {
                                                return Promise.reject("Phonenumber should not contain an string");
                                            }
                                            if (!regex.test(value) && value !== "" && value.length >= 9 && value.length <= 10 && value[0] !== '0') {
                                                return Promise.reject("Phonenumber should start with a 0");
                                            }
                                            return Promise.resolve();
                                        }
                                    }]}>
                                    <Input allowClear placeholder='Phonenumber' maxLength={10} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter className='border-0 bg-white p-3 d-flex justify-content-center'>
                        <Button htmlType='submit'>SUBMIT</Button>
                    </CardFooter>
                </Card>
            </Form >
        </Spin>
    )
}


const mapDispatchToProps = (dispatch) => ({ dispatch })

const mapStateToProps = (state) => ({
    Token: state.TokenReducer.Token,
    Role: state.TokenReducer.Role
})

export default connect(mapStateToProps, mapDispatchToProps)(UserForm);