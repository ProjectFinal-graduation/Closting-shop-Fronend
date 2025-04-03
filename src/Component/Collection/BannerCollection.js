import React, { useEffect, useState } from 'react'
import { Carousel } from 'antd';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import httpClient from '../../Utils/request';
import { BANNER } from '../../Config/App';

export default function BannerCollection() {
    const [Image_Banner_PC, setImage_Banner_PC] = useState([]);
    const [Image_Banner_Mobile, setImage_Banner_Mobile] = useState([]);

    useEffect(() => {
        httpClient.get(BANNER)
            .then((res) => {
                setImage_Banner_PC([...res.data.filter(i => i.isPcBanner)]);
                setImage_Banner_Mobile([...res.data.filter(i => i.isPcBanner === false)]);
            }).catch((err) => {
                console.log(err);
            });
    }, [])

    const getNavigate = (item) => {
        const text = item && item.category
            ? (item.category?.parent ? `${item.category?.parent?._id}/${item.category?._id}` : item.category?._id)
            : "#";
        return `/category/` + text
    }
    return (
        <div>
            <Carousel
                className='d-none d-lg-block'
                lazyLoad={true}
                draggable
                autoplay
                style={{ fontSize: 20 }}
            >
                {Image_Banner_PC.map((item, index) => {
                    return <a href={getNavigate(item)} key={index}>
                        <LazyLoadImage alt='Image-Bander' width={'100%'}
                            src={item.imagePath}
                            className='M-Banner-PC' />
                    </a>
                })}
            </Carousel>
            <Carousel
                className='d-block d-lg-none'
                lazyLoad={true}
                draggable
                autoplay
                style={{ fontSize: 20 }}
            >
                {Image_Banner_Mobile.map((item, index) => {
                    return <a href={getNavigate(item)} key={index}>
                        <LazyLoadImage alt='Image-Bander' width={'100%'}
                            src={item.imagePath}
                            className='M-Banner-Mobile' />
                    </a>
                })}
            </Carousel>
        </div >
    )
}
