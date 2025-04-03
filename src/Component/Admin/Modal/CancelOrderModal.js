import { Button, Form, Input, Modal } from 'antd'
import React from 'react'
import { GetRequired } from '../../../Asset/Validated/Validated';
import { Notification } from '../../../Asset/ShowNotification';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../../Utils/request';
import { ORDER } from '../../../Config/Admin';

export default function CancelOrderModal({ Data, Token, OrderId, UserId, Show, OnClose }) {
    const [form] = Form.useForm();
    const navigation = useNavigate();

    const HandleSubmit = (NewData) => {
        NewData.orderId = OrderId;
        NewData.cancelNote = NewData.NoteReason;

        httpClient.post(ORDER + "/CancelOrder", NewData)
            .then((res) => {
                if (res.status === 200) {
                    Notification.ShowSuccess("Success", res.message);
                    navigation("/admin/order");
                } else {
                    Notification.ShowError("Error " + res.status, res.message);
                }
            }).catch((err) => {
                console.log(err.message);
                Notification.ShowError("Error 500", err.message);
            });
    }

    const HandleClose = () => {
        OnClose();
    }
    return (
        <Modal centered footer={false} open={Show} onCancel={HandleClose}>
            <Form layout='vertical' onFinish={HandleSubmit} form={form} className='p-3 pb-0 w-100 d-flex align-items-center flex-column'>
                <h1>Cancel Order</h1>
                <h4>Order Number: {Data && Data.id}</h4>
                <Form.Item name={"NoteReason"} label="Reason" className='w-100 mt-4' rules={[GetRequired("Reason")]}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item className='d-flex justify-content-center'>
                    <Button htmlType='submit'>SUBMIT</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
