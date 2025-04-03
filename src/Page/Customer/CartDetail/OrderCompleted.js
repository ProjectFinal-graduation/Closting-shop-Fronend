import { CheckCircleFilled } from '@ant-design/icons'
// import { Typography } from 'antd'
import React from 'react'

export default function OrderCompleted() {
    return (
        <div className='d-flex justify-content-center align-items-center'>
            <div className='text-center'>
                <h2>
                    Order Completed
                    <CheckCircleFilled className='ms-3 text-success'/>
                </h2>
                <h1>
                    Our staff will contact you shortly
                </h1>
            </div>
        </div>
    )
}
