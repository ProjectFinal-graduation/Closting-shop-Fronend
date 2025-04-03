import { Button, Input, Spin, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import DeletePopover from '../../../Component/Admin/Popover/DeletePopover';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ClothDetailModal from '../../../Component/Admin/Modal/ClothDetailModal';
import { Notification } from '../../../Asset/ShowNotification';
import { connect } from 'react-redux';
import httpClient from '../../../Utils/request';
import { CLOTH } from '../../../Config/Admin';

function Cloth(props) {
    const { Token, Role } = props;
    const [dataSource, setdataSource] = useState([]);
    const [typingTimer, settypingTimer] = useState();
    const [Loading, setLoading] = useState(true);
    const [ModalViewData, setModalViewData] = useState({});
    const [ShowModalView, setShowModalView] = useState(false);
    const [CurrentPage, setCurrentPage] = useState(1);
    const [TotalCloth, setTotalCloth] = useState(0);
    const [Search, setSearch] = useState("");
    const navigation = useNavigate();
    const HandleAdd = () => {
        navigation(`/Admin/Cloth-Form`);
    }
    const HandleEdit = (record) => {
        navigation(`/Admin/Cloth-Edit/${record._id}`);
    }
    const HandleViewData = (record) => {
        setModalViewData({ ...record });
        setShowModalView(true);
    }
    const HandleDelete = (record) => {
        setLoading(true);
        httpClient.delete(CLOTH + `/${record._id}`)
            .then(res => {
                if (res.status === 404) {
                    setLoading(false);
                    Notification.ShowError("Error " + res.status, res.message);
                } else if (res.status === 200) {
                    Notification.ShowSuccess("Success", res.message);
                    GetData();
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
    const GetData = (text) => {
        setLoading(true);
        const Params = `?search=${text !== undefined ? text : Search}&pageSize=10&pageNo=${CurrentPage}`
        httpClient.get(CLOTH + Params)
            .then(res => {
                setLoading(false);
                if (res.status === 200) {
                    res.data.forEach((item, index) => {
                        res.data[index].key = item._id;
                        res.data[index].Thumbnail = item.imagePaths[0];
                    })
                    setdataSource([...res.data]);
                    setTotalCloth(res.total);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
    const HandleChangeSearch = (e) => {
        clearTimeout(typingTimer);
        settypingTimer(setTimeout(() => {
            if (CurrentPage > 1) {
                setCurrentPage(1);
            } else {
                GetData(e.target.value);
            }
        }, 500));
        setSearch(e.target.value);
    }

    const HandleOnSearch = (text) => {
        clearTimeout(typingTimer);
        settypingTimer(setTimeout(() => {
            if (CurrentPage > 1) {
                setCurrentPage(1);
            } else {
                GetData(text);
            }
        }, 500));
        setSearch(text)
    }

    useEffect(() => {
        if (Token !== "") {
            GetData();
        }
    }, [CurrentPage, Token])

    return (
        <Spin spinning={Loading}>
            <h3>
                Cloth
            </h3>
            <div className='mt-4 d-flex justify-content-between'>
                <Input.Search placeholder='Name' className='M-Input-Tool'
                    onChange={HandleChangeSearch}
                    onSearch={HandleOnSearch} />
                {
                    Role.toLowerCase() === "admin" &&
                    <Button onClick={HandleAdd}>ADD</Button>
                }
            </div>
            <div className='mt-4'>
                <Table
                    locale={{
                        emptyText: <h1>No Cloth Found</h1>,
                    }}
                    className='M-Overflow-Table'
                    dataSource={dataSource}
                    pagination={{
                        position: "bottom",
                        align: "center",
                        pageSize: 10,
                        showSizeChanger: false,
                        current: CurrentPage,
                        total: TotalCloth,
                        onChange: (count) => setCurrentPage(count)
                    }}
                    columns={[{
                        title: "ID",
                        className: "text-center",
                        dataIndex: "id",
                        render: (_, record) => _
                    }, {
                        title: "Image",
                        className: "text-center",
                        dataIndex: "Thumbnail",
                        render: (_, record) => <div className='d-flex justify-content-center'>
                            <LazyLoadImage effect='blur' src={record.Thumbnail} width={"100px"} height={"100px"} className='object-fit-cover' />
                        </div>
                    }, {
                        title: "Name",
                        className: "text-center",
                        dataIndex: "name",
                        onFilter: (value, record) => {
                            return String(record.name).toLowerCase().includes(value.toLowerCase());
                        }
                    }, {
                        title: "Price",
                        className: "text-center",
                        dataIndex: "price",
                        render: (value) => value + " $"
                    }, {
                        title: "Discount",
                        className: "text-center",
                        dataIndex: "discount"
                    }, {
                        title: "Action",
                        className: "text-center",
                        dataIndex: "Action",
                        render: (_, record) => <span className='d-flex justify-content-around align-items-center'>
                            {
                                Role.toLowerCase() === "admin" &&
                                <EditOutlined className='text-primary' style={{ fontSize: 20 }} onClick={() => { HandleEdit(record) }} />
                            }
                            <EyeOutlined className='text-success' style={{ fontSize: 20 }} onClick={() => { HandleViewData(record) }} />
                            {
                                Role.toLowerCase() === "admin" &&
                                <DeletePopover HandleDelete={() => HandleDelete(record)} />
                            }
                        </span>
                    }]}>
                </Table>
            </div>
            <ClothDetailModal OpenData={ModalViewData} OnClose={() => setShowModalView(false)} Show={ShowModalView} />
        </Spin>
    )
}

const mapDispatchToProps = (dispatch) => ({ dispatch })

const mapStateToProps = (state) => ({
    Token: state.TokenReducer.Token,
    Role: state.TokenReducer.Role
})

export default connect(mapStateToProps, mapDispatchToProps)(Cloth);