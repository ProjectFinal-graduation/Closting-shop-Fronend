import '../../CSS/Customer.css';
import { HomeOutlined, MenuOutlined, SearchOutlined, ShoppingOutlined } from '@ant-design/icons'
import { Badge } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import SearchDrawer from '../../Component/Drawer/SearchDrawer'
import { List_Image } from '../../Image/ListImage';
import { connect } from 'react-redux'
import ListMenu from '../../Component/ListMenu'
import ListMenuDrawer from '../../Component/Drawer/ListMenuDrawer'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import CurrencyDropDown from '../../Component/CurrencyDropDown';
import { getCookie } from '../../Asset/Cookie';
import ChangePageModalConfirm from '../../Component/Modal/ChangePageModalConfirm';
import httpClient from '../../Utils/request';
import { CLOTH_CART } from '../../Config/App';


function DefaultPage(props) {
    const { Data } = props;
    const [Show, setShow] = useState(false);
    const [MustGoToPath, setMustGoToPath] = useState("");
    const location = useLocation();
    const MobileNavRef = useRef();
    const [ShowSearchDrawer, setShowSearchDrawer] = useState(false);
    const [ShowMenuDrawer, setShowMenuDrawer] = useState(false);

    const navigation = useNavigate();

    useEffect(() => {
        const Data = getCookie("Cart");
        if (Data !== "") {
            let param = JSON.parse(Data).map(item => ({
                "clothId": item.ClothId,
                "size": item.SizeId,
                "quantity": item.Quantity
            }))
            httpClient.post(CLOTH_CART, { clothes: param })
                .then((res) => {
                    if (res.status === 200) {
                        res.data.forEach((item, index) => {
                            res.data[index].image = item.imagePaths;
                        })
                        props.dispatch({
                            type: "CART-COOKIE",
                            payload: {
                                Data: res.data
                            }
                        });
                    }
                }).catch((err) => {
                    console.error(err);
                });
        }

        let lastScrollTop = window.scrollY || document.documentElement.scrollTop;
        document.addEventListener('scroll', (e) => {
            const scrollTopPosition = window.scrollY || document.documentElement.scrollTop;
            if (scrollTopPosition > lastScrollTop) {
                MobileNavRef.current.style.marginBottom = '0px';
            } else if (scrollTopPosition < lastScrollTop) {
                MobileNavRef.current.style.marginBottom = '-50px';
            }
            lastScrollTop =
                scrollTopPosition <= 0 ? 0 : scrollTopPosition;
        });
    }, [])

    const HandleOrderValidate = async (link) => {
        if (location.pathname === "/order/profile") {
            setMustGoToPath(link);
            setShow(true);
        } else {
            navigation(link);
        }
    }

    return (
        <div className='M-Container'>
            <div className='M-Header'>
                <div className='M-Max-Responsive-1024'>
                    <MenuOutlined onClick={() => { setShowMenuDrawer(true) }} style={{ fontSize: 22 }} />
                </div>
                <div>
                    <div role='button' onClick={() => HandleOrderValidate("/")}>
                        <LazyLoadImage className='M-Logo-Responsive' src={List_Image.Logo} alt={"Narcis Logo"} />
                    </div>
                </div>
                <div className='M-Max-Responsive-1024'>
                    <SearchOutlined onClick={() => { setShowSearchDrawer(true) }} style={{ fontSize: 22 }} />
                </div>
                <div className='mt-4 w-100 d-none d-lg-flex justify-content-center position-relative'>
                    <ListMenu HandleOrderValidate={HandleOrderValidate} />
                    <div className='d-flex position-absolute' style={{ right: 0 }}>
                        <SearchOutlined onClick={() => { setShowSearchDrawer(true) }} style={{ fontSize: 22 }} />
                        <Badge className='m-3' count={Data.length}>
                            <ShoppingOutlined onClick={() => {
                                HandleOrderValidate('/order/cart');
                            }} className='ms-3' style={{ fontSize: 22 }} />
                        </Badge>
                    </div>
                </div>
                <div className='M-Recently-Nav d-flex align-items-center M-Min-Responsive-1024'>
                    <div role='button' className='text-dark text-decoration-none' onClick={() => HandleOrderValidate("/View-Recently")}>VIEWED</div>
                    <CurrencyDropDown />
                </div>
            </div>
            <div className='M-Content'>
                <Outlet />
            </div>
            <div className='M-Footer'>
                <div role='button' style={{ width: "fit-content" }} onClick={() => HandleOrderValidate('/')} >
                    <LazyLoadImage className='M-Logo-Responsive' src={List_Image.Logo} alt={"Narcis Logo"} />
                </div>
            </div>
            <div ref={MobileNavRef} style={{ borderTop: '1px solid', borderColor: 'lightgrey' }} className='M-Mobile-Nav'>
                <div>
                    <SearchOutlined onClick={() => {
                        setShowSearchDrawer(true)
                    }} style={{ fontSize: 22 }} />
                </div>
                <div>
                    <HomeOutlined onClick={() => {
                        HandleOrderValidate('/');
                    }} style={{ fontSize: 22 }} />
                </div>
                <div>
                    <Badge count={Data.length}>
                        <ShoppingOutlined onClick={() => {
                            HandleOrderValidate('/order/cart');
                        }} style={{ fontSize: 22 }} />
                    </Badge>
                </div>
            </div>
            <SearchDrawer HandleOrderValidate={HandleOrderValidate} show={ShowSearchDrawer} onClose={() => setShowSearchDrawer(false)} />
            <ListMenuDrawer HandleOrderValidate={HandleOrderValidate} show={ShowMenuDrawer} onClose={() => setShowMenuDrawer(false)} />
            <ChangePageModalConfirm MustGoToPath={MustGoToPath} Show={Show} OnClose={() => { setShow(false); }} />
        </div >
    )
}

const mapStateToProps = (state) => ({
    Data: state.CartReducer.Data,
})

const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(DefaultPage);