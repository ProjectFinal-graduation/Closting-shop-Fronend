import { Button, Col, List, Row, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardFooter, CardHeader } from 'react-bootstrap'
import ShowCustomerInfo from "./ShowCustomerInfo";
import { useLocation, useNavigate } from 'react-router-dom';
import { Notification } from '../../../Asset/ShowNotification';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import DeletePopover from '../../../Component/Admin/Popover/DeletePopover';
import CancelOrderModal from '../../../Component/Admin/Modal/CancelOrderModal';
import UpdatePaymentModal from '../../../Component/Admin/Modal/UpdatePaymentModal';
import UpdateDeliveryModal from '../../../Component/Admin/Modal/UpdateDeliveryModal';
import ConfirmModal from '../../../Component/Admin/Modal/ConfirmModal';
import Cookies from "js-cookie";
import { connect } from 'react-redux';
import httpClient from "../../../Utils/request";
import { ORDER } from '../../../Config/Admin';
import { ORDER_STATUS } from '../../../Config/Constants';
import StackForMobile from '../../../Component/StackForMobile';

function ManageOrder(props) {
    const { Token, Role } = props;
    const userId = Cookies.get("userId");
    const location = useLocation();
    const navigation = useNavigate();
    const [ID, setID] = useState("");
    const [Data, setData] = useState(undefined);
    const [dataSource, setdataSource] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [ShowCancelModal, setShowCancelModal] = useState(false);
    const [ShowUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);
    const [ShowUpdateDeliveryModal, setShowUpdateDeliveryModal] = useState(false);
    const [ShowAcceptOrderConfirmModal, setShowAcceptOrderConfirmModal] = useState(false);
    const [CurrentDeleteClothID, setCurrentDeleteClothID] = useState(0);
    const [ShowDeleteClothConfirmModal, setShowDeleteClothConfirmModal] = useState(false);
    const [ShowEndOrderConfirmModal, setShowEndOrderConfirmModal] = useState(false);
    useEffect(() => {
        if (Token !== "") {
            const ID = location.pathname.split('/')[3];
            setID(ID);
            if (ID !== undefined) {
                GetOrder(ID);
            }
        }
    }, [location, Token])

    const GetOrder = (ID) => {
        httpClient.get(ORDER + `/${ID}`)
            .then((res) => {
                setLoading(false);
                if (res.status === 200) {
                    setData({ ...res.data });
                    setdataSource([...res.data.clothAndQuantities]);
                }
                else {
                    Notification.ShowError("Error " + res.status, res.message);
                    if (res.status === 404) {
                        navigation("/admin/order");
                    }
                }
            }).catch((err) => {
                setLoading(false);
                console.error(err);
                Notification.ShowError("Error 500", err.message);
            });
    }

    const HandleDelete = (record) => {
        const Params = {
            "orderId": ID,
            "clothId": record.cloth._id,
            "size": record.sizes
        };

        httpClient.post(ORDER + "/RemoveClothFromOrder", Params)
            .then((res) => {
                if (res.status === 200) {
                    GetOrder(ID);
                    setShowDeleteClothConfirmModal(false);
                    Notification.ShowSuccess("Success", res.message)
                }
                else {
                    Notification.ShowError("Error " + res.status, res.message)
                }
            }).catch((err) => {
                Notification.ShowError("Error 505", err.message)
            });
    }
    const HandleCancelOrder = () => {
        setShowCancelModal(true);
    }
    const HandleUpdatePaymentOrder = () => {
        setShowUpdatePaymentModal(true);
    }
    const HandleUpdateModalOrder = () => {
        setShowUpdateDeliveryModal(true);
    }
    const HandleAcceptOrder = () => {
        setShowAcceptOrderConfirmModal(true);
    }

    const HandleEndOrder = () => {
        setShowEndOrderConfirmModal(true);
    }

    const StartEndOrder = () => {
        const Params = {
            "orderId": ID,
        };
        setLoading(true);
        httpClient.post(ORDER + "/EndOrder", Params)
            .then((res) => {
                setLoading(false);
                if (res.status === 200) {
                    Notification.ShowSuccess("Success", res.message);
                    GetOrder(ID);
                } else {
                    Notification.ShowWarning("Warning", res.message);
                }
            }).catch((err) => {
                setLoading(false);
                console.error(err);
                Notification.ShowError("Error 500", err.message);
            });
    }

    const StartAcceptOrder = () => {
        const Params = {
            "orderId": ID,
        }
        setLoading(true);
        httpClient.post(ORDER + "/AcceptOrder", Params)
            .then((res) => {
                setLoading(false);
                if (res.status === 200) {
                    Notification.ShowSuccess("Success", res.message);
                    GetOrder(ID);
                }
                else {
                    Notification.ShowError("Error " + res.status, res.Message);
                }
            }).catch((err) => {
                setLoading(false);
                console.error(err);
                Notification.ShowError("Error 500", err.message);
            });
    }
    return (
        <Spin spinning={Loading}>
            <div>
                <StackForMobile path={"/admin/order"} Header={""} />
            </div>
            <Card>
                <CardHeader className='border-0 pt-4 pb-4'>
                    <h3 className='text-center'>Manage Order</h3>
                    {
                        (Data && [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(Data.status.order)) &&
                        <>
                            <h5 className='text-center'>Employee Name: {Data && Data.employee?.username}</h5>
                            <h5 className='text-center'>Employee Id: {Data && Data.employee?.code}</h5>
                            {
                                (Data && [ORDER_STATUS.CANCELLED].includes(Data.status.order)) &&
                                <h5 className='text-center'>Cancelled Reason: {Data && Data.cancelNote}</h5>
                            }
                        </>
                    }
                </CardHeader>
                <CardBody>
                    <Row gutter={[20, 0]}>
                        <Col xs={24} lg={10}>
                            <ShowCustomerInfo Data={Data} />
                        </Col>
                        <Col xs={24} lg={14}>
                            <List dataSource={dataSource}
                                style={{ maxHeight: "400px", overflowY: "scroll" }}
                                renderItem={(item, index) => {
                                    return (
                                        <div className='d-flex gap-3 border pe-4'>
                                            <div>
                                                <LazyLoadImage className='object-fit-cover' width={"100px"} height={"100px"} src={item.cloth.imagePaths[0]} />
                                            </div>
                                            <div className='d-flex flex-column justify-content-center gap-1'>
                                                <div>Code : {item.cloth.code}</div>
                                                <div>Name : {item.cloth.name}</div>
                                                <div>Size : {item.sizes}</div>
                                                <div>Quantity : {item.quantity}</div>
                                            </div>

                                            <div className='me-0 ms-auto d-flex align-items-center'>
                                                {
                                                    (Data && ![ORDER_STATUS.DELIVERING, ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(Data.status.order)) &&
                                                    <DeletePopover HandleDelete={() => {
                                                        if (Data && Data.clothAndQuantities.length === 1) {
                                                            setCurrentDeleteClothID(item);
                                                            setShowDeleteClothConfirmModal(true);
                                                        } else {
                                                            HandleDelete(item)
                                                        }
                                                    }} />
                                                }
                                            </div>
                                        </div>
                                    )
                                }}
                            />
                        </Col>
                    </Row>
                </CardBody>
                <CardFooter className='border-0 pt-4 pb-4 d-flex justify-content-around w-100'>
                    <div className='d-flex justify-content-between w-100 gap-3' style={{ flexWrap: "wrap" }}>
                        {
                            (Data && ![ORDER_STATUS.CANCELLED, ORDER_STATUS.COMPLETED].includes(Data.status.order)) &&
                            <Button style={{ minWidth: "150px" }} onClick={HandleCancelOrder}>Cancel Order</Button>
                        }
                        {
                            Data && Data.status.order === ORDER_STATUS.PENDING ?
                                <Button style={{ minWidth: "150px" }} onClick={HandleAcceptOrder}>Accept Order</Button>
                                :
                                <>
                                    <Button style={{ minWidth: "150px" }} onClick={HandleUpdatePaymentOrder}>{Data && [ORDER_STATUS.CANCELLED, ORDER_STATUS.COMPLETED].includes(Data.status.order) ? "View" : "Update"} Payment</Button>
                                    <Button style={{ minWidth: "150px" }} onClick={HandleUpdateModalOrder}>{Data && [ORDER_STATUS.CANCELLED, ORDER_STATUS.COMPLETED].includes(Data.status.order) ? "View" : "Update"} Delivery</Button>
                                    {(Data && ![ORDER_STATUS.CANCELLED, ORDER_STATUS.COMPLETED].includes(Data.status.order)) &&
                                        <Button style={{ minWidth: "150px" }} onClick={HandleEndOrder}>End Order</Button>
                                    }
                                </>
                        }
                    </div>
                </CardFooter>
            </Card>
            <CancelOrderModal Data={Data} OrderId={ID} Token={Token} UserId={userId} OnClose={() => setShowCancelModal(false)} Show={ShowCancelModal} />
            <UpdatePaymentModal Data={Data} Token={Token} OrderId={ID} GetOrder={GetOrder} UserId={userId} OnClose={() => setShowUpdatePaymentModal(false)} Show={ShowUpdatePaymentModal} />
            <UpdateDeliveryModal Data={Data} Token={Token} OrderId={ID} GetOrder={GetOrder} UserId={userId} OnClose={() => setShowUpdateDeliveryModal(false)} Show={ShowUpdateDeliveryModal} />
            <ConfirmModal Text={"Make sure you have called customer and confirm"} HandleSubmit={StartAcceptOrder} OnClose={() => setShowAcceptOrderConfirmModal(false)} Show={ShowAcceptOrderConfirmModal} />
            <ConfirmModal Text={"This is the last cloth in your order"} HandleSubmit={() => HandleDelete(CurrentDeleteClothID)} OnClose={() => setShowDeleteClothConfirmModal(false)} Show={ShowDeleteClothConfirmModal} />
            <ConfirmModal Warning={"Make sure everything is finish"} Text={"after you end your order you wont be able to update anything to your data"} HandleSubmit={StartEndOrder} OnClose={() => setShowEndOrderConfirmModal(false)} Show={ShowEndOrderConfirmModal} />
        </Spin>
    )
}

const mapDispatchToProps = (dispatch) => ({ dispatch })

const mapStateToProps = (state) => ({
    Token: state.TokenReducer.Token,
    Role: state.TokenReducer.Role
})

export default connect(mapStateToProps, mapDispatchToProps)(ManageOrder);