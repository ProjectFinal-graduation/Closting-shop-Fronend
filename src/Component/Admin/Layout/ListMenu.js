import { LogoutOutlined, ShoppingCartOutlined, TagOutlined, UserOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import Cookies from "js-cookie";
import { connect } from 'react-redux';

function ListMenu(props) {
    const { onClose, Token, Role } = props;
    const [dataSoure, setDataSoure] = useState([]);
    const navigation = useNavigate();
    const location = useLocation();
    const HandleClick = (value) => {
        if (onClose !== undefined) {
            onClose();
        }
        navigation(`${value.key}`);
    }
    const HandleLogout = (value) => {
        Cookies.remove("userToken");
        navigation('/admin/login');
    }
    const Keys = {
        "dashboard": "dashboard",
        "order": "order",
        "cloth": "cloth",
        "user": "user",
        "model": "model",
        "category": "category",
        "province": "province",
        "dress-collection": "dress-Collection",
        "banner": "banner"
    }


    useEffect(() => {
        if (Token !== "") {
            const item = [];
            item.push({
                icon: <div style={{ left: "0", marginLeft: 10 }} className='position-absolute top-0 h-100 d-flex align-item-center p-3'>
                    <svg clas xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" className=" bi bi-border-all" viewBox="0 0 16 16">
                        <path d="M0 0h16v16H0zm1 1v6.5h6.5V1zm7.5 0v6.5H15V1zM15 8.5H8.5V15H15zM7.5 15V8.5H1V15z" />
                    </svg>
                </div>
                ,
                style: { minHeight: 80 },
                className: "d-flex justify-content-center align-items-center",
                label: 'Dashboard',
                key: "dashboard"
            });
            item.push({
                icon: <div style={{ left: "0", marginLeft: 10 }} className='position-absolute top-0 h-100 d-flex align-item-center p-3'>
                    <ShoppingCartOutlined style={{ fontSize: 20 }} />
                </div>,
                style: { minHeight: 80 },
                className: "d-flex justify-content-center align-items-center",
                label: "Order",
                key: "order"
            });
            item.push({
                icon: <div style={{ left: "0", marginLeft: 10 }} className='position-absolute top-0 h-100 d-flex align-item-center p-3'>
                    <img width="20" height="20" src="https://img.icons8.com/pastel-glyph/20/clothes--v2.png" alt="clothes--v2" /></div>,
                style: { minHeight: 80 },
                className: "d-flex justify-content-center align-items-center",
                label: "Cloth",
                key: "cloth"
            });
            if (Role.toLowerCase() === "admin") {
                item.push({
                    icon: <div style={{ left: "0", marginLeft: 10 }} className='position-absolute top-0 h-100 d-flex align-item-center p-3'>
                        <UserOutlined style={{ fontSize: 20 }} />
                    </div>,
                    label: "User",
                    style: { minHeight: 80 },
                    className: "d-flex justify-content-center align-items-center",
                    key: "user"
                });
                item.push({
                    icon: <div style={{ left: "0", marginLeft: 10 }} className='position-absolute top-0 h-100 d-flex align-item-center p-3'>
                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" className="bi bi-person-bounding-box" viewBox="0 0 16 16">
                            <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5" />
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                        </svg>
                    </div>,
                    style: { minHeight: 80 },
                    className: "d-flex justify-content-center align-items-center",
                    label: "Model",
                    key: "model"
                });

                item.push({
                    icon: <div style={{ left: "0", marginLeft: 10 }} className='position-absolute top-0 h-100 d-flex align-item-center p-3'>
                        <TagOutlined style={{ fontSize: 20 }} />
                    </div>,
                    style: { minHeight: 80 },
                    className: "d-flex justify-content-center align-items-center",
                    label: "Category",
                    key: "category"
                });
                item.push({
                    icon: <div style={{ left: "0", marginLeft: 10 }} className='position-absolute top-0 h-100 d-flex align-item-center p-3'>
                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 576 512"><path d="M565.6 36.2C572.1 40.7 576 48.1 576 56V392c0 10-6.2 18.9-15.5 22.4l-168 64c-5.2 2-10.9 2.1-16.1 .3L192.5 417.5l-160 61c-7.4 2.8-15.7 1.8-22.2-2.7S0 463.9 0 456V120c0-10 6.1-18.9 15.5-22.4l168-64c5.2-2 10.9-2.1 16.1-.3L383.5 94.5l160-61c7.4-2.8 15.7-1.8 22.2 2.7zM48 136.5V421.2l120-45.7V90.8L48 136.5zM360 422.7V137.3l-144-48V374.7l144 48zm48-1.5l120-45.7V90.8L408 136.5V421.2z" /></svg>
                    </div>,
                    style: { minHeight: 80 },
                    className: "d-flex justify-content-center align-items-center",
                    label: "Province",
                    key: "province"
                });
                item.push({
                    icon: <div style={{ left: "0", marginLeft: 10 }} className='position-absolute top-0 h-100 d-flex align-item-center p-3'>
                        <img width="20" height="20" src="https://img.icons8.com/pastel-glyph/20/clothes--v2.png" alt="clothes--v2" />
                    </div>,
                    style: { minHeight: 80 },
                    className: "d-flex justify-content-center align-items-center",
                    label: "Collection",
                    key: "dress-Collection"
                });
                item.push({
                    icon: <div style={{ left: "0", marginLeft: 10 }} className='position-absolute top-0 h-100 d-flex align-item-center p-3'>
                        <img width="20" height="20" src="https://img.icons8.com/pastel-glyph/20/clothes--v2.png" alt="clothes--v2" />
                    </div>,
                    style: { minHeight: 80 },
                    className: "d-flex justify-content-center align-items-center",
                    label: "Banner",
                    key: "banner"
                });
            }
            setDataSoure([...item]);
        }
    }, [Token])
    return (
        <div className='d-flex flex-column justify-content-between min-vh-100'>
            <Menu
                selectedKeys={[Keys[location.pathname.split("/")[2] ? location.pathname.split("/")[2].toLowerCase() : ""] ?? ""]}
                onClick={HandleClick}
                className="fw-bold"
                items={dataSoure} />
            <Menu
                onClick={HandleLogout}
                className="fw-bold"
                items={
                    [{
                        icon: <div style={{ left: "0", marginLeft: 10 }} className='position-absolute top-0 h-100 d-flex align-item-center p-3'>
                            <LogoutOutlined style={{ fontSize: 20 }} />
                        </div>,
                        style: { minHeight: 80 },
                        className: "d-flex justify-content-center align-items-center",
                        label: "Logout",
                        key: "logout"
                    }]} />
        </div >
    )
}


const mapDispatchToProps = (dispatch) => ({ dispatch })

const mapStateToProps = (state) => ({
    Token: state.TokenReducer.Token,
    Role: state.TokenReducer.Role
})

export default connect(mapStateToProps, mapDispatchToProps)(ListMenu);