import { Card } from 'antd'
import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import ProductDetailDrawer from './Drawer/ProductDetailDrawer';
import { connect } from 'react-redux';
import { NumericFormat } from 'react-number-format';
import Cookies from "js-cookie";
function ViewProduct(props) {
  const { Data, Currency } = props;
  const [DrawerShow, setDrawerShow] = useState(false);
  const navigation = useNavigate();
  const HandleView = () => {
    if (typeof Cookies.get('clothIds') === 'undefined') Cookies.set('clothIds', JSON.stringify([]));
    const clothIds = JSON.parse(Cookies.get('clothIds'));
    if (!clothIds.includes(Data._id)) {
      clothIds.push(Data._id);
      if (clothIds.length === 11) clothIds.shift();
      Cookies.set('clothIds', JSON.stringify(clothIds));
    }

    navigation(`/product/${Data._id}`, {
      state: {
        Data: Data
      }
    });
  }
  return (
    <Card className='border-0'
      cover={
        <div onClick={HandleView} className='M-Image-Container' role='button' aria-label={Data.name}>
          {
            Data.discount > 0 &&
            <div className='text-white Discount-Box d-flex justify-content-center align-items-center' style={{ zIndex: 5, borderRadius: '50%', backgroundColor: 'black' }}>
              {Data.discount}%
            </div>
          }
          <LazyLoadImage
            alt='Product-Image'
            width={"100%"}
            className='M-Show-Image'
            effect="blur"
            style={{ zIndex: 1 }}
            src={Data.image[0]} />
          <div className='M-Image-Hover-Botton-Container'>
            <Button
              className='M-Image-Hover-Botton'
              onClick={(event) => {
                event.stopPropagation();
                setDrawerShow(true);
              }} >ADD</Button>
          </div>
        </div>
      }
    >
      <Card.Meta
        className='text-start'
        title={
          <p className='m-0 standard-text-overflow' role='button' onClick={HandleView}>{Data.name}</p>
        }
        description={
          <div>
            {
              Data && Data.discount > 0 &&
              <div>
                <p className='M-Delete-Text m-0  standard-font-size'>
                  <NumericFormat value={(Data.price * Currency.Multiple).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={Currency.Symbol} />
                </p>
              </div>
            }
            <div className='mt-1'>
              <p className='m-0 standard-font-size'>
                  <NumericFormat value={((Data.price - Data.price * Data.discount / 100) * Currency.Multiple).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={Currency.Symbol} />
              </p>
            </div>
          </div>
        }>
      </Card.Meta>
      <ProductDetailDrawer Show={DrawerShow} Id={Data._id} onClose={() => setDrawerShow(false)} />
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

export default connect(mapStateToProps)(ViewProduct);
