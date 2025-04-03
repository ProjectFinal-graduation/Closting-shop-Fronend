import { Button, Form, InputNumber, Modal } from 'antd'
import React from 'react'
import { Notification } from '../../../Asset/ShowNotification';
import httpClient from '../../../Utils/request';
import { PROVINCE } from '../../../Config/Admin';

export default function ProvinceModal({ Token, GetData, Show, OnClose, Data, setData }) {
    const [form] = Form.useForm();
    const HandleOpenChange = (value) => {
        if (value === true) {
            form.setFieldValue("cost", Data.deliveryFee);
        } else {
            form.setFieldValue("cost", null);
        }
    }

    const HandleSubmit = (NewData) => {
        httpClient.put(PROVINCE + `/${Data._id}`, { deliveryFee: NewData.cost })
            .then(res => {
                if (res.status === 200) {
                    Notification.ShowSuccess(res.message, "DeliveryFee successfully updated");
                    GetData();
                    HandleClose();
                } else {
                    Notification.ShowSuccess("Error", res.message);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    const HandleClose = () => {
        setData({});
        OnClose();
    }
    return (
        <Modal centered footer={false} open={Show} onCancel={HandleClose} afterOpenChange={HandleOpenChange}>
            <Form onFinish={HandleSubmit} form={form} className='p-3 pb-0 w-100 d-flex align-items-center flex-column'>
                <h1>{Data.Name_en === undefined ? "" : Data.Name_en}</h1>
                <h4>Update DeliveryFee</h4>
                <Form.Item name={"cost"} className='w-100 mt-4'>
                    <InputNumber className='w-100' />
                </Form.Item>
                <Form.Item className='d-flex justify-content-center'>
                    <Button htmlType='submit'>SUBMIT</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
