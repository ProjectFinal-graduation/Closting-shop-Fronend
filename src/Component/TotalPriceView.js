import { Col, Divider, Row, Typography } from 'antd';
import React from 'react'
import { NumericFormat } from 'react-number-format';
import { connect } from 'react-redux';

function TotalPriceView(props) {
    const { Data, Currency } = props;
    const Total = Data.reduce((accumulator, currentValue) => {
        const temp = currentValue.Detail.Quantity * (currentValue.price - (currentValue.price * currentValue.discount / 100));
        return temp + accumulator;
    }, 0);
    return (
        <div className='p-4' style={{ border: '1px solid black' }}>
            <Row>
                <Col span={14}>
                    Total product amount
                </Col>
                <Col span={10} className='text-end'>
                    <NumericFormat value={(Total * Currency.Multiple).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={Currency.Symbol} />
                </Col>
            </Row>
            <Row className='mt-3'>
                <Col span={14}>
                    total shipping cost
                </Col>
                <Col span={10} className='text-end'>
                    {/* {Currency.Symbol} 0 */}
                    50$ up free delivery
                </Col>
            </Row>
            <Divider />
            <Row>
                <Col span={14}>
                    <Typography.Title level={4}>
                        Expected payment amount
                    </Typography.Title>
                </Col>
                <Col span={10} className='text-end'>
                    <Typography.Title level={4}>
                        <NumericFormat value={(Total * Currency.Multiple).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={Currency.Symbol} />
                    </Typography.Title>
                </Col>
            </Row>
        </div>
    )
}

const mapStateToProps = (state) => ({
    Data: state.CartReducer.Data,
    Currency: {
        Multiple: state.MoneyReducer.Multiple,
        Name: state.MoneyReducer.Name,
        Symbol: state.MoneyReducer.Symbol
    }
})

const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(TotalPriceView);
