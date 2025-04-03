import React, { useEffect, useState } from 'react'
import SwiperViewProduct from '../../Component/SwiperViewProduct';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Scrollbar } from 'swiper/modules';
import { Typography, Spin } from 'antd';
import ViewProduct from '../../Component/ViewProduct';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import httpClient from '../../Utils/request';
import { CLOTH_COLLECTION } from '../../Config/App';

export default function DressCollection() {
    const [dataSource, setdataSource] = useState([]);
    const [Loading, setLoading] = useState(true);
    useEffect(() => {
        httpClient.get(CLOTH_COLLECTION)
            .then((res) => {
                setLoading(false);
                if (res.status === 200) {
                    res.data.forEach((item, index) => {
                        res.data[index].image = item.imagePaths;
                    })
                    setdataSource([...res.data]);
                }
                else {
                    setdataSource([]);
                }
            }).catch((err) => {
                console.log(err);
            });
    }, [])
    return (
        <Spin spinning={Loading}>
            {
                (dataSource.length > 0) &&
                <div className='position-relative'>
                    <div className='d-flex justify-content-between M-Icon-Container'>
                        <div className='M-Arrow-Swiper-Left user-select-none'>
                            <LeftOutlined width={25} height={25}
                                onClick={() => {
                                    const swiper = document.getElementById('Swiper-ID').swiper;
                                    swiper.slidePrev(1000);
                                }} />
                        </div>
                        <div className='M-Arrow-Swiper-Right user-select-none'>
                            <RightOutlined width={25} height={25} onClick={() => {
                                const swiper = document.getElementById('Swiper-ID').swiper;
                                swiper.slideNext(1000);
                            }} />
                        </div>
                    </div>

                    <Typography.Title level={3} className='fw-bold mt-5 pt-5'>
                        DRESS COLLECTION
                    </Typography.Title>
                    <div className='p-3 overflow-hidden' style={{ position: 'relative' }}>
                        <Swiper
                            id='Swiper-ID'
                            breakpoints={{
                                0: {
                                    slidesPerView: 1
                                },
                                400: {
                                    slidesPerView: 2
                                },
                                700: {
                                    slidesPerView: 3
                                }
                            }}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                            slidesPerView={3}
                            slidesPerGroup={1}
                            spaceBetween={30}
                            scrollbar={{
                                draggable: true,
                                dragSize: 60,
                                snapOnRelease: true
                            }}
                            modules={[Autoplay, Scrollbar]}
                            className="mySwiper mt-lg-4 mt-0"
                        >
                            {dataSource.map((item, index) => {
                                return <SwiperSlide key={index}>
                                    <div className='M-Min-Responsive-1024'>
                                        <SwiperViewProduct Data={item} />
                                    </div>
                                    <div className='M-Max-Responsive-1024'>
                                        <ViewProduct Data={item} />
                                    </div>
                                </SwiperSlide>
                            })}
                        </Swiper>
                    </div>
                </div>
            }
        </Spin>
    )
}
