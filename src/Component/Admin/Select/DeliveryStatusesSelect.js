import { Form, Select } from 'antd'
import React, { useState } from 'react'
import { GetRequired } from '../../../Asset/Validated/Validated';

export default function DeliveryStatusesSelect({ disabled, mode, Name }) {
    const [deliveryStatuses, setDeliveryStatuses] = useState([{
        value: "Pending",
        label: "Pending"
    },
    {
        value: "Processing",
        label: "Processing"
    },
    {
        value: "Delivered",
        label: "Delivered"
    }]);

    return (
        <Form.Item label="Delivery Status" name={Name} rules={[{
            ...GetRequired("DeliveryStatuses")
        }]}>
            <Select options={deliveryStatuses} placeholder="DeliveryStatuses" mode={mode}
                showSearch autoClearSearchValue disabled={disabled}
                allowClear />
        </Form.Item>
    )
}
