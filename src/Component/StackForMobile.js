import { LeftOutlined } from '@ant-design/icons';
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function StackForMobile({path, Header}) {
    const navigation = useNavigate();
    return (
        <div className='p-3 d-flex align-items-center position-relative'>
            <LeftOutlined className='ms-0 ms-lg-4 position-absolute left-0' style={{ fontSize: 20 }} onClick={() => { navigation(path ?? -1); }} />
            <h5 className='w-100 fw-bold text-center'>
                {Header}
            </h5>
        </div>
    )
}
