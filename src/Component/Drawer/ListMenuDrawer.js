import { Divider, Drawer, Image } from 'antd'
import React from 'react'
import ListMenu from '../ListMenu'
import { List_Image } from '../../Image/ListImage'
import { CloseOutlined } from '@ant-design/icons'
import CurrencyDropDown from '../CurrencyDropDown'

export default function ListMenuDrawer({ HandleOrderValidate, isInline, show, onClose }) {
    const HandleClose = () => {
        onClose();
    }
    return (
        <Drawer placement='left' onClose={HandleClose} open={show} closable={false}>
            <CloseOutlined onClick={onClose} className='position-absolute' style={{ fontSize: 25, right: 25, top: 25, fontWeight: 400 }} />
            <div className='d-flex flex-column align-items-center mt-4'>
                <div role='button' onClick={() => HandleOrderValidate("/").then(() => onClose())}>
                    <Image preview={false} className='M-Logo-Responsive' src={List_Image.Logo} />
                </div>
                <div role='button' className='d-flex align-items-center mt-4'>
                    <div className='text-dark text-decoration-none' onClick={() => HandleOrderValidate("/View-Recently").then(() => onClose())}>VIEWED</div>
                    <Divider type='vertical' />
                    <CurrencyDropDown HandleClose={HandleClose} />
                </div>
            </div>
            <Divider />
            <ListMenu HandleOrderValidate={HandleOrderValidate} isInline={true} onClose={HandleClose} />
        </Drawer>
    )
}
