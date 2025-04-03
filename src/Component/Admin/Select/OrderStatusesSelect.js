import { Form, Select } from 'antd'
import React, { useState } from 'react'
import { GetRequired } from '../../../Asset/Validated/Validated';

export default function OrderStatusesSelect({ mode,Name }) {
    const [orderStatuses, setOrderStatuses] = useState([{
        value: 1 + "/Pending",
        label: "Pending"
    },
    {
        value: 2 + "/Processing",
        label: "Processing"
    },
    {
        value: 3 + "/Delivering",
        label: "Delivering"
    },
    {
        value: 4 + "/Completed",
        label: "Completed"
    },
    {
        value: 5 + "/Cancelled",
        label: "Cancelled"
    }]);

    return (
        <Form.Item label="Order Status" name={Name} rules={[{
            ...GetRequired("OrderStatuses")
        }]}>
            <Select options={orderStatuses} placeholder="OrderStatuses" mode={mode}
                showSearch autoClearSearchValue
                allowClear />
        </Form.Item>
    )
}
