import { DeleteOutlined } from '@ant-design/icons'
import { Button, Popover } from 'antd'
import React, { useState } from 'react'

export default function DeletePopover({ HandleDelete }) {
    const [open, setopen] = useState(false);
    const handleOpenChange = (newOpen) => {
        setopen(newOpen);
    };
    return (
        <div>
            <Popover
                content={
                    <div className='d-flex justify-content-around'>
                        <Button onClick={() => setopen(false)}>Close</Button>
                        <Button onClick={() => {
                            setopen(false);
                            HandleDelete();
                        }
                        }>Yes</Button>
                    </div>
                }
                title="Are you sure you want to delete this?"
                trigger="click"
                open={open}
                onOpenChange={handleOpenChange}
            >
                <DeleteOutlined className='text-danger' style={{ fontSize: 20 }} onClick={() => setopen(true)} />
            </Popover>
        </div>
    )
}
