import { Card, Image } from 'antd'
import React from 'react'
import { NumericFormat } from 'react-number-format';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function SwiperViewProduct(props) {
    const { Data, Currency } = props;
    const navigation = useNavigate();
    const HandleView = () => {
        navigation(`/product/${Data._id}`);
    }
    return (
        <Card className='border-0'
            cover={<Image onClick={HandleView}
                style={{ aspectRatio: "1/1", objectFit: "cover" }}
                preview={{
                    visible: false,
                    maskClassName: "bg-transparent",
                    mask:
                        <Card.Meta
                            className='M-Swiper-View-Product p-4 text-start'
                            title={
                                <p className='m-0' role='button' onClick={HandleView}>{Data.name}</p>
                            }
                            description={
                                <div>
                                    {
                                        Data.sizes.length === 0 &&
                                        <div>
                                            <span>
                                                not available
                                            </span>
                                        </div>
                                    }
                                    <div>
                                        {
                                            Data.discount > 0 &&
                                            <p className='M-Delete-Text m-0 standard-font-size'>
                                                <NumericFormat value={(Data.price * Currency.Multiple).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={Currency.Symbol} />
                                            </p>
                                        }
                                    </div>
                                    <div className='mt-1'>
                                        <p className='m-0 standard-font-size'>
                                                <NumericFormat value={((Data.price - Data.price * Data.discount / 100) * Currency.Multiple).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={Currency.Symbol} />
                                        </p>
                                    </div>
                                </div>
                            }>
                        </Card.Meta>

                }} src={Data.image[0]} />}
        >
        </Card>
    )
}


const mapStateToProps = (state) => ({
    Currency: {
        Multiple: state.MoneyReducer.Multiple,
        Name: state.MoneyReducer.Name,
        Symbol: state.MoneyReducer.Symbol
    }
})

export default connect(mapStateToProps)(SwiperViewProduct);
