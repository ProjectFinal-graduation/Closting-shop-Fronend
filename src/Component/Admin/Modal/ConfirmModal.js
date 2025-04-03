import { Button, Form, Modal } from 'antd'
import React from 'react'

export default function ConfirmModal({ Warning, Text, HandleSubmit, Show, OnClose }) {
    const [form] = Form.useForm();

    const HandleClose = () => {
        OnClose();
    }

    const HandleOk = () => {
        HandleSubmit();
        HandleClose();
    }
    return (
        <Modal centered footer={false} open={Show} onCancel={HandleClose}>
            <Form layout='vertical' onFinish={HandleOk} form={form} className='p-3 pb-0 w-100 d-flex align-items-center flex-column'>
                <h1>Are you sure?</h1>
                {Text && <h4 className='text-center'>{Text}</h4>}
                {Warning && <h5 className='text-center'>{Warning}</h5>}
                <div className='d-flex justify-content-around w-100 mt-5'>
                    <Button onClick={HandleClose}>NO</Button>
                    <Button htmlType='submit'>YES</Button>
                </div>
            </Form>
        </Modal>
    )
}
