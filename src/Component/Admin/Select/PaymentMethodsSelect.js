import { Form, Select } from 'antd'
import React, { useState } from 'react'
import { GetRequired } from '../../../Asset/Validated/Validated';

export default function PaymentMethodsSelect({ disabled, mode, Name }) {
    const [paymentMethods, setPaymentMethods] = useState([{
        value: "Cash",
        label: "Cash"
    },
    {
        value: "Bank",
        label: "Bank"
    }]);

    return (
        <Form.Item label="Payment Methods" name={Name} rules={[{
            ...GetRequired("PaymentMethods")
        }]}>
            <Select options={paymentMethods} placeholder="PaymentMethods" mode={mode}
                showSearch autoClearSearchValue disabled={disabled}
                allowClear />
        </Form.Item>
    )
}
