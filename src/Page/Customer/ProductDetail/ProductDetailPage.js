import { Breadcrumb, Carousel, Col, Divider, Image, Row, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ProductDetailInput from '../../../Component/ProductDetailInput';
import ImageGroupPreview from '../../../Component/ImageGroupPreview';
import StackForMobile from '../../../Component/StackForMobile';
import SuggestCollection from './SuggestCollection';
import { connect } from 'react-redux';
import { NumericFormat } from 'react-number-format';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Notification } from '../../../Asset/ShowNotification';
import httpClient from '../../../Utils/request';
import { CLOTH } from '../../../Config/App';


function ProductDetailPage(props) {
    const { Currency } = props;
    const [CurrentImage, setCurrentImage] = useState("");
    const [ShowGroupPreview, setShowGroupPreview] = useState(false);
    const location = useLocation();
    const [Loading, setLoading] = useState(true);
    const [Size, setSize] = useState({});
    const [Data, setData] = useState({
        _id: 0,
        name: "",
        image: [],
        price: 0,
        discount: 0,
        category: "",
        description: "",
        sizes: [],
        code: ""
    });
    const [Quantity, setQuantity] = useState(0);
    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        const id = location.pathname.split('/')[2];
        httpClient.get(CLOTH + `/${id}`)
            .then((result) => {
                setLoading(false);
                if (result.status === 200) {
                    const Data = result.data;
                    setData({
                        _id: Data._id,
                        name: Data.name,
                        image: Data.imagePaths,
                        price: Data.price,
                        discount: Data.discount,
                        category: Data.category,
                        description: Data.description,
                        sizes: Data.sizes,
                        code: Data.code
                    });
                    setCurrentImage(Data.imagePaths[0]);
                }
            }).catch((err) => {
                setLoading(false);
                Notification.ShowError("Error 500", err.message);
                console.error(err);
            });
    }, [location])

    if (Loading === false && Data._id === 0) {
        return <div><h1 className='text-center'>
            Product not found
        </h1>
        </div>
    }
    return (
        <Spin spinning={Loading}>
            <div className='M-Max-Responsive-1024'>
                <div>
                    <StackForMobile Header={"Product details"} />
                </div>
                <div>
                    <Carousel
                        lazyLoad={true}
                        draggable
                        autoplay
                        style={{ fontSize: 20 }}
                    >
                        {Data.image.map((item, index) => {
                            return <Image width={"100vw"} style={{ objectFit: "cover",  }} className='M-Aspect carosel-image' preview={false} src={item} key={index} />
                        })}
                    </Carousel>
                </div>
            </div>
            <div className='M-Container-Detail'>
                <div className='p-3 d-none d-lg-flex justify-content-end'>
                    <Breadcrumb
                        items={[
                            {
                                title: <Link style={{ textDecoration: 'none' }} to={'/'}>Home</Link>,
                            },
                            {
                                title: <Link style={{ textDecoration: 'none' }} to={`/category/${Data.category._id}`}>{Data.category.name}</Link>,
                            },
                        ]}
                    />
                </div>
                <Row gutter={150} className='me-0 ms-0'>
                    <Col lg={12} className='M-Min-Responsive-1024 M-Remove-Col-Padding'>
                        <div className='w-100' style={{ aspectRatio: '1/1.2' }}>
                            <Image style={{ aspectRatio: '1/1.2', objectFit: "cover" }} src={CurrentImage} className='w-100' preview={{ visible: false }} onClick={() => { setShowGroupPreview(true) }} />
                        </div>
                        <div className='d-flex gap-3 mt-4'>
                            {
                                Data.image[0] &&
                                <Image onMouseOver={() => {
                                    setCurrentImage(Data.image[0]);
                                }} src={Data.image[0]} className='object-fit-cover' width={100} height={100} />
                            }
                            {
                                Data.image[1] &&
                                <Image onMouseOver={() => {
                                    setCurrentImage(Data.image[1]);
                                }} src={Data.image[1]} className='object-fit-cover' width={100} height={100} />
                            }
                            {
                                Data.image[2] &&
                                <Image onMouseOver={() => {
                                    setCurrentImage(Data.image[2]);
                                }} src={Data.image[2]} className='object-fit-cover' width={100} height={100} />
                            }
                            {
                                Data.image[3] &&
                                <Image onMouseOver={() => {
                                    setCurrentImage(Data.image[3]);
                                }} src={Data.image[3]} className='object-fit-cover' width={100} height={100} />
                            }
                        </div>
                    </Col>
                    <Col lg={12} className='p-0 mt-5 mt-lg-0' style={{ borderTop: "3px solid black" }}>
                        <Row>
                            <Col span={20}>
                                <Typography.Title level={2} className='pt-4 pb-4'>{Data.name}</Typography.Title>
                            </Col>
                        </Row>
                        {
                            Data.discount > 0 &&
                            <div className='text-white Discount-Box d-flex justify-content-center align-items-center' style={{ borderRadius: '50%', backgroundColor: 'black' }}>
                                {Data.discount}%
                            </div>
                        }
                        <Row gutter={[0, 20]}>
                            <Col span={24}>
                                <Row>
                                    <Col xs={10} lg={6}>
                                        DESCRIPTION
                                    </Col>
                                    <Col xs={14} lg={18} className='M-Font-Size-For-Text'>
                                        {Data.description}
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row>
                                    <Col xs={10} lg={6}>
                                        MODEL#
                                    </Col>
                                    <Col xs={14} lg={18}>
                                        {Data.code}
                                    </Col>
                                </Row>
                            </Col>
                            {
                                Data.discount > 0 &&
                                <Col span={24}>
                                    <Row>
                                        <Col xs={10} lg={6}>
                                            O. PRICE
                                        </Col>
                                        <Col xs={14} lg={18}>
                                            <Typography.Text delete>
                                                <NumericFormat value={(Data.price * Currency.Multiple).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={Currency.Symbol} />
                                            </Typography.Text>
                                        </Col>
                                    </Row>
                                </Col>
                            }
                            <Col span={24}>
                                <Row>
                                    <Col xs={10} lg={6}>
                                        {Data.discount > 0 && "C."} PRICE
                                    </Col>
                                    <Col xs={14} lg={18}>
                                        <NumericFormat value={((Data.price - (Data.price * Data.discount / 100)) * Currency.Multiple).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={Currency.Symbol} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Divider style={{ border: '1px solid', borderColor: "lightgrey" }} />
                        <ProductDetailInput NotDrawer={true} Data={Data} Size={Size} setSize={setSize} setQuantity={setQuantity} Quantity={Quantity} />
                        <div>
                            <Typography.Paragraph>
                                <br />
                                NARCIS' average delivery time is approximately 2 to 3 days.
                                <br />
                                <br />
                                We produce and inspect all products ourselves, and manage inventory, so
                                all orders are shipped the same or next day.
                                <br />
                                <br />
                                Orders over 50,000 won receive free shipping.
                            </Typography.Paragraph>
                        </div>
                    </Col>
                </Row>
                <div className='d-flex flex-column gap-5'>
                    {Data.image.map((item, index) => {
                        return <LazyLoadImage key={index} src={item} className='w-100 M-Aspect' />
                    })}
                </div>
                <div className='mt-5'>
                    <SuggestCollection id={Data.category._id} DontInclude={Data._id} />
                </div>
                <ImageGroupPreview Images={Data.image} Show={ShowGroupPreview} OnClose={() => setShowGroupPreview(false)} />
            </div>
        </Spin>
    )
}

const mapStateToProps = (state) => ({
    Currency: {
        Multiple: state.MoneyReducer.Multiple,
        Name: state.MoneyReducer.Name,
        Symbol: state.MoneyReducer.Symbol
    }
})

export default connect(mapStateToProps)(ProductDetailPage);
