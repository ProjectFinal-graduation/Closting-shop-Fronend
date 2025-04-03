import { Breadcrumb, Steps, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ChangePageModalConfirm from '../../../Component/Modal/ChangePageModalConfirm';

function CartDetailPage(props) {
    const navigation = useNavigate();
    const [Show, setShow] = useState(false);
    const [MustGoToPath, setMustGoToPath] = useState("");
    const location = useLocation();
    const temp = {
        cart: 0,
        profile: 1,
        completed: 2
    };
    const [current, setcurrent] = useState(temp[location.pathname.split('/')[2]]);
    const onChange = (value) => {
        setcurrent(value);
        if (value === 0) {
            HandleOrderValidate('/order/cart')
        } else if (value === 1) {
            navigation('/order/profile');
        } else if (value === 2) {
            navigation('/order/completed');
        }
    }
    useEffect(() => {
        if (location.pathname.includes('/order/cart')) {
            setcurrent(0);
        }
        if (location.pathname.includes('/order/profile')) {
            if (location.state === null) {
                navigation('/order/cart');
            } else {
                setcurrent(1);
            }
        }
        if (location.pathname.includes('/order/completed')) {
            if (location.state === null) {
                navigation('/order/profile');
            } else {
                setcurrent(2);
            }
        }
    }, [location])

    const HandleOrderValidate = async (link) => {
        if (location.pathname === "/order/profile") {
            setMustGoToPath(link);
            setShow(true);
        } else {
            navigation(link);
        }
    }


    return (
        <Container>
            <div className='d-flex justify-content-end'>
                <Breadcrumb
                    items={[{
                        title: <div role='button' onClick={() => HandleOrderValidate("/")} style={{ textDecoration: 'none' }}>Home</div>,
                    }, {
                        title: <Typography.Text strong>Shopping Busket</Typography.Text>,
                    }]}></Breadcrumb>
            </div>
            <div>
                <Typography.Title level={2} className='fw-bold text-center'>
                    Shopping Busket
                </Typography.Title>
            </div>
            <div className='mt-5'>
                <Steps
                    current={current}
                    onChange={onChange}
                    status='process'
                    className="site-navigation-steps"
                    items={[
                        {
                            title: 'Shopping Cart',
                            disabled: (location.state === null)
                        },
                        {
                            title: 'Fill out the order form',
                            disabled: (location.state === null && location.state !== true)
                        },
                        {
                            title: 'Order completed',
                            disabled: (location.state !== true)
                        },
                    ]}
                />
            </div>
            <div className='mt-5 mb-5'>
                <Outlet />
            </div>
            <ChangePageModalConfirm MustGoToPath={MustGoToPath} Show={Show} OnClose={() => { setShow(false); }} />
        </Container>
    )
}


const mapStateToProps = (state) => ({
    Data: state.CartReducer.Data
})

const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(CartDetailPage);