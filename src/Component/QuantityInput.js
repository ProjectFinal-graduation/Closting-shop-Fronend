import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, InputNumber } from 'antd';
import React from 'react'

export default function QuantityInput({ Quantity, setQuantity, Size }) {
    return (
        <Col span={19} className='d-flex'>
            <div role='button' onClick={() => { if (Quantity > 1) setQuantity(pre => pre - 1) }} className='h-100 d-flex justify-content-center align-items-center' style={{ width: 30, border: '1px solid', borderColor: 'lightgrey' }}>
                <MinusOutlined />
            </div>
            <div className='h-100 d-flex justify-content-center align-items-center' style={{ width: 100, border: '1px solid', borderColor: 'lightgrey', borderLeft: 0, borderRight: 0 }}>
                <InputNumber className='border-0' max={Size.Quantity}
                    value={Quantity}
                    onChange={(text) => {
                        if (text >= 1 && text <= Size.quantity) {
                            setQuantity(text);
                        }
                    }} />
            </div>
            <div role='button' onClick={() => {
                if (Size.quantity > Quantity) { setQuantity(Quantity + 1); }
            }} className='h-100 d-flex justify-content-center align-items-center' style={{ width: 30, border: '1px solid', borderColor: 'lightgrey' }}>
                <PlusOutlined />
            </div>
        </Col>
    )
}
