import { Button, Col, Form, Input, Row, Typography, Spin } from 'antd'
import React, { useState } from 'react'
import ProvincesSelect from '../../../Component/Admin/Select/ProvincesSelect';
import { Notification } from '../../../Asset/ShowNotification';
import { useNavigate, useLocation } from 'react-router-dom';
import httpClient from '../../../Utils/request';
import { ORDER } from '../../../Config/App';

export default function CustomerInfo() {
    const navigation = useNavigate();
    const location = useLocation();
    const [Loading, setLoading] = useState(false);

    const HandleSubmit = (Data) => {
        setLoading(true);
        Data.ClothSizeQuantities = location?.state?.Data.map(i => ({
            sizes: i.SizeId,
            cloth: i.ClothId,
            quantity: i.Quantity
        }));
        Data.provinceId = Data.Province.split('/')[0];
        if (Data.note === undefined) {
            Data.note = "";
        }
        httpClient.post(ORDER, Data)
            .then((result) => {
                setLoading(false);
                if (result.status === 200) {
                    navigation('/order/completed', { state: true });
                    Notification.ShowSuccess(result.message);
                } else {
                    Notification.ShowSuccess(result.message);
                }
            }).catch((err) => {
                setLoading(false);
                console.log(err);
            });;
    }

    return (
        <Spin spinning={Loading} className='p-3 p-md-0'>
            <Typography.Title level={4} className='text-center'>
                Contact information
            </Typography.Title>
            <div className='mt-5'>
                <Form layout='vertical' onFinish={HandleSubmit}>
                    <Row gutter={[12, 12]}>
                        <Col xs={24} md={12}>
                            <Form.Item name={'name'} label="Name" rules={[
                                { required: true, message: "Please input Name" }
                            ]}>
                                <Input placeholder='Name' />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Phone Number" name={"phone"}
                                rules={[{ required: true, message: "Please input Phonenumber" }, {
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
                                <Input allowClear placeholder='Phone Number' maxLength={10} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <ProvincesSelect />
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name={'address'} label="Address" rules={[
                                { required: true, message: "Please input Address" }
                            ]}>
                                <Input placeholder='Address' />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item name={'note'} label="Note">
                                <Input.TextArea rows={4} placeholder='Note' />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <div className='d-flex justify-content-center'>
                                <Button htmlType='submit' className='border-0 bg-dark text-white M-Completed-Order-Button'>Complete Order</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Spin>
    )
}
