import { Form, Select } from 'antd'
import React, { useState } from 'react'
import { GetRequired } from '../../../Asset/Validated/Validated';

export default function PaymentStatusesSelect({ disabled, mode, Name }) {
    const [paymentStatuses, setPaymentStatuses] = useState([{
        value: "Not Paid",
        label: "Not Paid"
    },
    {
        value: "Paid",
        label: "Paid"
    },
    {
        value: "Refunded",
        label: "Refunded"
    }]);

    return (
        <Form.Item label="Payment Statuses" name={Name} rules={[{
            ...GetRequired("PaymentStatuses")
        }]}>
            <Select options={paymentStatuses} placeholder="PaymentStatuses" mode={mode}
                showSearch autoClearSearchValue disabled={disabled}
                allowClear />
        </Form.Item>
    )
}
