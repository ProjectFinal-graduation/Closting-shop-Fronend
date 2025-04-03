import { Button, Input, Spin, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { EditOutlined } from '@ant-design/icons';
import DeletePopover from '../../../Component/Admin/Popover/DeletePopover';
import { Notification } from '../../../Asset/ShowNotification';
import { connect } from 'react-redux';
import httpClient from '../../../Utils/request';
import { MODEL } from '../../../Config/Admin';

function Model(props) {
    const { Token, Role } = props;
    const [Search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [dataSource, setdataSource] = useState([]);
    const navigation = useNavigate();
    const HandleAdd = () => {
        navigation(`/Admin/Model-Form`);
    }

    const HandleEdit = (record) => {
        navigation(`/Admin/Model-Edit/${record._id}`);
    }
    const HandleDelete = (record) => {
        httpClient.delete(MODEL + `/${record._id}`)
            .then(res => {
                if (res.status === 200) {
                    Notification.ShowSuccess("Success", res.message);
                    GetData();
                } else {
                    Notification.ShowError("Error 404", res.message);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
    const GetData = () => {
        setLoading(true);
        httpClient.get(MODEL)
            .then(res => {
                setLoading(false);
                if (res.status === 200) {
                    res.data.forEach((_, index) => {
                        res.data[index].key = res.data[index]._id;
                    })
                    setdataSource([...res.data]);
                }
            })
            .catch(err => {
                setLoading(false);
                console.log(err);
            });
    }

    useEffect(() => {
        if (Token !== "") {
            if (Role.toLowerCase() !== "admin") {
                navigation("/admin/dashboard");
            } else {
                GetData();
            }
        }
    }, [Token])
    return (
        <Spin spinning={loading}>
            <h3>
                Model
            </h3>
            <div className='mt-4 d-flex justify-content-between'>
                <Input.Search placeholder='Name' className='M-Input-Tool'
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                    onSearch={(text) => {
                        setSearch(text)
                    }} />
                <Button onClick={HandleAdd}>ADD</Button>
            </div>
            <div className='mt-4'>
                <Table
                    locale={{
                        emptyText: <h1>No Model Found</h1>,
                    }}
                    dataSource={dataSource}
                    className='M-Remove-Padding-Table M-Overflow-Table'
                    columns={[{
                        title: "Profile",
                        className: "text-center",
                        dataIndex: "profilePicture",
                        render: (_, item) => <div className='d-flex justify-content-center'>
                            <LazyLoadImage effect='blur' src={item.profilePicture} width={"100px"} height={"100px"} className='object-fit-cover' />
                        </div>
                    }, {
                        title: "Name",
                        className: "text-center",
                        dataIndex: "name",
                        filteredValue: [Search],
                        onFilter: (value, record) => {
                            return String(record.name).toLowerCase().includes(value.toLowerCase());
                        }
                    }, {
                        title: "Height",
                        className: "text-center",
                        dataIndex: "height",
                        render: (_, record) => record.height + 'cm'
                    }, {
                        title: "Weight",
                        className: "text-center",
                        dataIndex: "weight",
                        render: (_, record) => record.weight + 'kg'
                    },
                    {
                        title: "Top",
                        className: "text-center",
                        dataIndex: "top"
                    }, {
                        title: "Bottom",
                        className: "text-center",
                        dataIndex: "bottom"
                    },
                    {
                        title: "Action",
                        className: "text-center",
                        dataIndex: "action",
                        render: (_, record) => <span className='d-flex justify-content-around'>
                            <EditOutlined className='text-primary' style={{ fontSize: 20 }} onClick={() => { HandleEdit(record) }} />
                            <DeletePopover HandleDelete={() => HandleDelete(record)} />
                        </span>
                    }

                    ]} />
            </div>
        </Spin>
    )
}

const mapDispatchToProps = (dispatch) => ({ dispatch })

const mapStateToProps = (state) => ({
    Token: state.TokenReducer.Token,
    Role: state.TokenReducer.Role
})

export default connect(mapStateToProps, mapDispatchToProps)(Model);