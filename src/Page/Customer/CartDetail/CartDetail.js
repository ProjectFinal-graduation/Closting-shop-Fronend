import { Button, Checkbox, Col, Collapse, Divider, Image, InputNumber, List, Row } from 'antd';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import TotalPriceView from '../../../Component/TotalPriceView';
import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import ChangeSizeModal from '../../../Component/Modal/ChangeSizeModal';
import { NumericFormat } from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../../Asset/ShowNotification';

function CartDetail(props) {
    const navigation = useNavigate();
    const { Data, Currency } = props;
    const [SelectedItem, setSelectedItem] = useState([]);
    const [dataSource, setdataSoure] = useState([]);
    const [SelectedAll, setSelectedAll] = useState(false);
    const [ChangeData, setChangeData] = useState(undefined);
    const [ModalChangeData, setModalChangeData] = useState(false);
    useEffect(() => {
        const Temp = [];
        Data.forEach(item => {
            Temp.push({
                _id: item._id,
                checked: false,
                size: item.Detail.Size
            });
        })
        setSelectedItem([...Temp]);
        setdataSoure([...Data]);
    }, [Data]);

    const HandleSave = (newData, Size) => {
        props.dispatch({
            type: "DELETE-DATA",
            payload: newData
        })

        props.dispatch({
            type: "ADD-CART",
            payload: {
                ...newData,
                Detail: {
                    Quantity: newData.Detail.Quantity,
                    Size: Size
                }
            }
        })
    }
    const HandleDelete = (DeleteData) => {
        props.dispatch({
            type: "DELETE-DATA",
            payload: DeleteData
        })
    }
    const onChange = (Id, SizeId) => {
        SelectedItem.forEach((item, index) => {
            if (item._id === Id && item.size === SizeId) {
                SelectedItem[index].checked = !SelectedItem[index].checked;
                return;
            }
        })
        setSelectedItem([...SelectedItem]);

        const check = SelectedItem.filter(item => item.checked === true);
        if (check.length === SelectedItem.length)
            setSelectedAll(true);
        else
            setSelectedAll(false);
    }
    const HandleSelect = () => {
        SelectedItem.forEach((item, index) => {
            SelectedItem[index].checked = !SelectedAll;
        })
        setSelectedItem([...SelectedItem]);
        setSelectedAll(!SelectedAll);
    }
    const HandleOrderAllProduct = () => {
        if (Data.length > 0) {
            const Cookie = Data.map(item => ({
                ClothId: item._id,
                Quantity: item.Detail.Quantity,
                SizeId: item.Detail.Size
            }));

            navigation("/order/profile", { state: { Data: Cookie } });
        } else {
            Notification.ShowWarning("Warning","There isn`t any product in your cart");
        }
    }

    const HandleOrderAlone = (Cloth) => {
        const Cookie = [Cloth].map(item => ({
            ClothId: item._id,
            Quantity: item.Detail.Quantity,
            SizeId: item.Detail.Size
        }));

        navigation("/order/profile", { state: { Data: Cookie } });
    }

    const HandleOrderSelected = () => {
        let NewData = Data.filter(item => SelectedItem.some(obj => obj.checked === true && obj._id === item._id && obj.size === item.Detail.Size));
        NewData = NewData.map(item => ({
            ClothId: item._id,
            Quantity: item.Detail.Quantity,
            SizeId: item.Detail.Size
        }));
        if (NewData.length > 0) {
            navigation("/order/profile", { state: { Data: NewData } });
        } else {
            Notification.ShowWarning("Warning", "Please select 1 product");
        }
    }

    return (
        <div>
            <Row gutter={[40, 20]}>
                <Col xs={24} lg={16}>
                    <Collapse
                        bordered={false}
                        items={[{
                            key: '1',
                            headerClass: "fw-bold",
                            label: 'shopping cart items',
                            children: <div className='p-3'>
                                <div className='p-3'>
                                    <h5>
                                        General products ({Data.length})
                                    </h5>
                                </div>
                                {
                                    Data.length !== 0 &&
                                    <div>
                                        <List
                                            renderItem={(item) => {
                                                return <Row className='position-relative'>
                                                    <Col span={2}>
                                                        <Checkbox className='pe-3 rounded-0' checked={SelectedItem.filter(selected => selected._id === item._id && selected.size === item.Detail.Size)[0].checked}
                                                            onChange={
                                                                () => onChange(item._id, item.Detail.Size)
                                                            }>
                                                        </Checkbox>
                                                    </Col>
                                                    <Col span={22}>
                                                        <div className='d-flex gap-3'>
                                                            <Image className='M-Cart-Image-View' preview={false} src={item.image[0]} />
                                                            <div>
                                                                <div>
                                                                    {item.name}
                                                                </div>
                                                                <div>
                                                                    <NumericFormat value={((item.price - item.price * item.discount / 100) * Currency.Multiple).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={Currency.Symbol} />
                                                                </div>
                                                                <div>
                                                                    {Currency.Symbol} <span className='text-danger'>-0</span>
                                                                </div>
                                                                <div>
                                                                    <NumericFormat value={(50 * Currency.Multiple).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={Currency.Symbol} />
                                                                    <span className='ms-2'>free shipping</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='mt-3 p-3'>
                                                            [Option: {item.Detail.Size}]
                                                            <a href='#none' className='ms-3 M-Change-Size-Option-Link' onClick={() => {
                                                                setChangeData({ ...item });
                                                                setModalChangeData(true)
                                                            }}>
                                                                Change options
                                                            </a>
                                                        </div>
                                                        <Row className='mt-3'>
                                                            <Col span={10}>
                                                                Quantity
                                                            </Col>
                                                            <Col span={14} className='d-flex justify-content-end align-items-center'>
                                                                <div role='button' onClick={() => {
                                                                    if (item.Detail.Quantity > 1) {
                                                                        item.Detail.Quantity = item.Detail.Quantity - 1;
                                                                        props.dispatch({
                                                                            type: "UPDATE-DATA",
                                                                            payload: item
                                                                        })
                                                                    }
                                                                }} className='user-select-none h-100 d-flex justify-content-center align-items-center' style={{ width: 30, border: '1px solid', borderColor: 'lightgrey' }}>
                                                                    <MinusOutlined />
                                                                </div>
                                                                <div className='h-100 d-flex justify-content-center align-items-center' style={{ width: 100, border: '1px solid', borderColor: 'lightgrey', borderLeft: 0, borderRight: 0 }}>
                                                                    <InputNumber className='border-0'
                                                                        value={item.Detail.Quantity}
                                                                        onChange={(value) => {
                                                                            if (value >= 1) {
                                                                                item.Detail.Quantity = value;
                                                                                props.dispatch({
                                                                                    type: "UPDATE-DATA",
                                                                                    payload: item
                                                                                })
                                                                            }
                                                                        }} />
                                                                </div>
                                                                <div role='button' onClick={() => {
                                                                    item.Detail.Quantity = item.Detail.Quantity + 1;
                                                                    props.dispatch({
                                                                        type: "UPDATE-DATA",
                                                                        payload: item
                                                                    })
                                                                }} className='user-select-none h-100 d-flex justify-content-center align-items-center' style={{ width: 30, border: '1px solid', borderColor: 'lightgrey' }}>
                                                                    <PlusOutlined />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Divider />
                                                        <div className='d-flex justify-content-between'>
                                                            <div>
                                                                Order amount
                                                            </div>
                                                            <div>
                                                                <span className='fw-bold'>
                                                                    <NumericFormat value={(item.Detail.Quantity * (item.price - item.price * item.discount / 100) * Currency.Multiple).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={Currency.Symbol} />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex gap-3 mt-3'>
                                                            <Button onClick={() => HandleOrderAlone(item)} style={{ height: 50 }} block className='rounded-0'>Place an Order</Button>
                                                        </div>
                                                    </Col>
                                                    <Divider />
                                                    <div className='top-0 position-absolute' style={{ right: 0 }}>
                                                        <CloseOutlined className='text-danger' onClick={() => HandleDelete(item)} />
                                                    </div>
                                                </Row>
                                            }}
                                            dataSource={dataSource} />
                                    </div>
                                }
                            </div>
                        }]}
                    />
                </Col>
                <Col xs={24} lg={8}>
                    <TotalPriceView />
                    <div className='mt-3'>
                        <Button onClick={HandleOrderAllProduct} style={{ height: 50 }} block className='bg-dark text-white border-0 rounded-0'>Order all products</Button>
                    </div>
                    <div className='mt-3'>
                        <Button onClick={HandleOrderSelected} style={{ height: 50 }} block className='rounded-0'>Order selected product</Button>
                    </div>
                </Col>
            </Row>
            <Button className='w-100 mt-3 rounded-0' style={{ height: 50 }} onClick={HandleSelect}>
                {SelectedAll ? 'Unselect All' : 'Select All'}
            </Button>
            <ChangeSizeModal
                Show={ModalChangeData}
                HandleSave={HandleSave}
                OnClose={() => {
                    setModalChangeData(false);
                    setChangeData(undefined);
                }}
                Data={ChangeData} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CartDetail);