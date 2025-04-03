import { Form, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { GetRequired } from '../../../Asset/Validated/Validated';
import httpClient from '../../../Utils/request';
import { CATEGORY } from '../../../Config/Admin';

export default function CategoriesSelect({ Name }) {
    const [Data, setData] = useState([]);
    const [Loading, setLoading] = useState(true);

    useEffect(() => {
        httpClient.get(CATEGORY)
            .then(res => {
                setLoading(false);
                if (res.status === 200) {
                    const Temp = [];
                    res.data.forEach(item => {
                        Temp.push({
                            label: item.name,
                            value: item._id + "/" + item.name
                        });
                    })
                    setData([...Temp])
                }
            })
            .catch(err => {
                console.log(err);
            })
    }, [])
    return (
        <Form.Item label="Category" name={Name} rules={[{
            ...GetRequired("Category")
        }]}>
            <Select loading={Loading} showSearch autoClearSearchValue placeholder='Category' options={Data} />
        </Form.Item>
    )
}
