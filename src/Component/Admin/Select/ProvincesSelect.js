import { Form, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import httpClient from '../../../Utils/request';
import { PROVINCE } from '../../../Config/App';

export default function ProvincesSelect(name) {
    const [Data, setData] = useState([]);
    const [Loading, setLoading] = useState(true);
    useEffect(() => {
        httpClient.get(PROVINCE)
            .then(res => {
                setLoading(false);
                const Temp = [];
                if (res.status === 200) {
                    res.data.forEach(item => {
                        Temp.push({
                            value: item._id + "/" + item.name_en,
                            label: item.name_en
                        });
                    })
                    setData([...Temp]);
                }
            })
            .catch(err => {
                setLoading(false);
                console.log(err);
            })
    }, [])
    return (
        <Form.Item name={ 'Province'} label="Province" rules={[
            { required: true, message: "Please input Province" }
        ]}>
            <Select className='w-100' options={Data} autoClearSearchValue allowClear showSearch placeholder="Provinces" loading={Loading}>
            </Select>
        </Form.Item>
    )
}
