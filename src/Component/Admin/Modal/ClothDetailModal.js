import { Carousel, Image, Modal, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { Notification } from '../../../Asset/ShowNotification';
import httpClient from '../../../Utils/request';
import { CLOTH } from '../../../Config/Admin';

export default function ClothDetailModal({ Show, OnClose, OpenData }) {
    const [Data, setData] = useState(undefined);
    const [Loading, setLoading] = useState(false);
    const HandleClose = () => {
        OnClose();
    }

    useEffect(() => {
        if (Show === true && OpenData) {
            setLoading(true);
            httpClient.get(CLOTH + `/${OpenData._id}`)
                .then((res) => {
                    setLoading(false)
                    if (res.status === 200) {
                        setData({ ...res.data });
                    } else {
                        setData(undefined);
                        Notification.ShowError("Error", res.message);
                    }
                }).catch((err) => {
                    setLoading(false);
                    console.log(err);
                });
        } else {
            setData(undefined);
        }
    }, [Show])

    return (
        <Modal centered footer={false} open={Show} onCancel={HandleClose}>
            <Spin spinning={Loading}>
                <div className='p-0 pt-5 p-md-5 d-flex align-items-center flex-column gap-3'>
                    <div className='w-100'>
                        <Carousel
                            className='w-100'
                            lazyLoad={true}
                            draggable
                            autoplay
                            style={{ fontSize: 20 }}
                        >
                            {Data && Data.imagePaths.map((item, index) => {
                                return <Image width={"100%"} className='M-Aspect object-fit-cover' preview={false} src={item} key={index} />
                            })}
                        </Carousel>
                    </div>
                    {/* <div>
                        Id : {Data && Data._id}
                    </div> */}
                    <div>
                        Name : {Data && Data.name}
                    </div>
                    <div>
                        Category : {Data && Data.category && Data.category.name}
                    </div>
                    <div>
                        Code : {Data && Data.code}
                    </div>
                    <div>
                        Price : {Data && Data.price}
                    </div>
                    <div>
                        Discount : {Data && Data.discount}
                    </div>
                    {/* <div>
                        Model ID : {Data && Data.model && Data.model._id}
                    </div> */}
                    <div>
                        Model : {Data && Data.model && Data.model.name}
                    </div>
                    <div>
                        Sizes : {Data && Data.sizes && Data.sizes.map((item, index) => index !== 0 ? ", " + item : item)}
                    </div>
                </div>
            </Spin>
        </Modal>
    )
}
