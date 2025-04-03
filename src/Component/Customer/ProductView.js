import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { NumericFormat } from 'react-number-format';
import { connect } from 'react-redux';

function ProductView(props) {
  const { Data, Currency } = props;
  return (
    <div className='d-flex'>
      <LazyLoadImage style={{ aspectRatio: "1/1" }} src={Data.image} className='Search-Image-Size' />
      <div className='ms-3 d-flex justify-content-around flex-column'>
        <div className='standard-text-overflow'>
          Name: {Data.name}
        </div>
        <div>
          Code: {Data.code}
        </div>
        <div className='standard-font-size'>
          Price: <NumericFormat value={((Data.price * Data.discount / 100) * Currency.Multiple).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={Currency.Symbol} />
        </div>
      </div>
    </div>
  )
}


const mapStateToProps = (state) => ({
  Currency: {
    Multiple: state.MoneyReducer.Multiple,
    Name: state.MoneyReducer.Name,
    Symbol: state.MoneyReducer.Symbol
  }
})

export default connect(mapStateToProps)(ProductView);