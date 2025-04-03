import { Image } from 'antd'
import React from 'react'

export default function ImageGroupPreview({ Images, Show, OnClose }) {
    return (
        <Image.PreviewGroup preview={{ visible: Show, onVisibleChange: OnClose }}>
            {Images.map((item, index) => {
                return <Image className={'d-none'} key={index} src={item} />
            })}
        </Image.PreviewGroup>
    )
}
