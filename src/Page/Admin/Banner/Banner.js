import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Table, Select, Spin } from 'antd';
import DeletePopover from '../../../Component/Admin/Popover/DeletePopover';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Notification } from '../../../Asset/ShowNotification';
import { connect } from 'react-redux';
import httpClient from '../../../Utils/request';
import { BANNER } from '../../../Config/Admin';

function Banner(props) {
    const { Token, Role } = props;
    const [dataSource, setdataSource] = useState();
    const [Selected, setSelected] = useState("BannersForPc");
    const navigation = useNavigate();
    const [Loading, setLoading] = useState(true);
    const HandleAdd = () => {
        navigation("/Admin/Banner-Form");
    }
    const HandleSelect = (value) => {
        setSelected(value);
    }

    useEffect(() => {
        GetData();
    }, [Selected, Token])

    const GetData = () => {
        setLoading(true);
        if (Token !== "") {
            if (Role.toLowerCase() !== 'admin') {
                navigation("/");
            } else {
                httpClient.get(BANNER)
                    .then((res) => {
                        setLoading(false);

                        if (Selected === "BannersForPc") {
                            res.data = res.data.filter(i => i.isPcBanner);
                        } else {
                            res.data = res.data.filter(i => i.isPcBanner === false);
                        }
                        let Data = [...res.data];
                        Data.forEach((item, index) => {
                            Data[index].key = item._id;
                        })
                        setdataSource([...Data]);
                    }).catch((err) => {
                        setLoading(false);
                        Notification.ShowError("Error 505", err.message);
                        console.error(err.message);
                    });
            }
        }
    }

    const HandleDelete = (record) => {
        setLoading(true);
        httpClient.delete(BANNER + `/${record._id}`)
            .then((res) => {
                setLoading(false);
                if (res.status === 200) {
                    Notification.ShowSuccess("Success", res.message);
                    GetData();
                } else {
                    Notification.ShowError("Error " + res.status, res.message);
                }
            }).catch((err) => {
                setLoading(false);
                Notification.ShowError("Error 505", err.message);
                console.error(err.message);
            });
    }

    return (
        <Spin spinning={Loading}>
            <h3>
                Banner
            </h3>
            <div className='mt-4 d-flex justify-content-between'>
                <Select onSelect={HandleSelect} defaultValue={"BannersForPc"} className='M-Input-Tool' options={[{
                    label: "PC",
                    value: "BannersForPc"
                }, {
                    label: "Mobile",
                    value: "BannersForMobile"
                }]} />
                <Button onClick={HandleAdd}>ADD</Button>
            </div>
            <div className='mt-4'>
                <Table
                    locale={{
                        emptyText: <h1>No Banner found</h1>
                    }}
                    className='M-Overflow-Table'
                    columns={[
                        {
                            title: "No",
                            className: "w-auto text-center",
                            dataIndex: "",
                            render: (value, _, index) => index + 1
                        }, {
                            title: "Image",
                            className: "w-75 text-center",
                            dataIndex: "imagePath",
                            render: (record) => <LazyLoadImage src={record} className={Selected === "BannersForPc" ? 'M-Banner-PC' : "M-Banner-Mobile"} />
                        }, {
                            title: "Action",
                            className: "text-center",
                            _style: { width: "10%" },
                            dataIndex: "Action",
                            render: (_, record) => <span className='d-flex justify-content-around'>
                                <DeletePopover HandleDelete={() => HandleDelete(record)} />
                            </span>
                        }]}
                    dataSource={dataSource}
                />
            </div>
        </Spin>
    )
}

const mapDispatchToProps = (dispatch) => ({ dispatch })

const mapStateToProps = (state) => ({
    Token: state.TokenReducer.Token,
    Role: state.TokenReducer.Role
})

export default connect(mapStateToProps, mapDispatchToProps)(Banner);