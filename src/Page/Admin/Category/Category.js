import { Button, Input, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import DeletePopover from '../../../Component/Admin/Popover/DeletePopover';
import { Notification } from '../../../Asset/ShowNotification';
import { connect } from 'react-redux';
import httpClient from '../../../Utils/request';
import { CATEGORY } from '../../../Config/Admin';

function Category(props) {
    const { Token, Role } = props;
    const [Loading, setLoading] = useState(true);
    const [dataSource, setdataSource] = useState([]);
    const [Search, setSearch] = useState("");
    const navigation = useNavigate();
    const HandleAdd = () => {
        navigation('/Admin/Category-Form');
    }
    const HandleEdit = (record) => {
        navigation(`/Admin/Category-Edit/${record._id}`);
    }
    const HandleDelete = (record) => {
        setLoading(true);
        httpClient.delete(CATEGORY + `/${record._id}`)
            .then(res => {
                setLoading(false);
                if (res.status === 200) {
                    Notification.ShowSuccess("Success", res.message);
                    GetData();
                } else {
                    Notification.ShowError("Error 404", res.message);
                }
            })
            .catch(err => {
                setLoading(false);
                console.log(err);
            })
    }
    const GetData = () => {
        setLoading(true);
        httpClient.get(CATEGORY)
            .then(res => {
                setLoading(false);
                if (res.status === 200) {
                    res.data.forEach((_, index) => {
                        res.data[index].key = res.data[index]._id;
                    })
                    setdataSource([...res.data])
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
        <Spin spinning={Loading}>
            <h3>
                Category
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
                        emptyText: <h1>No Category Found</h1>,
                    }}
                    className='M-Overflow-Table'
                    dataSource={dataSource}
                    columns={[
                        {
                            title: "No",
                            className: 'text-center',
                            dataIndex: "",
                            render: (_, item, index) => index + 1
                        },
                        {
                            dataIndex: 'name',
                            className: "text-center",
                            title: "Name",
                            filteredValue: [Search],
                            onFilter: (value, record) => {
                                return String(record.name).toLowerCase().includes(value.toLowerCase());
                            }
                        },
                        {
                            dataIndex: "parent",
                            className: "text-center",
                            title: "Parent",
                            render: (_, record) => {
                                if (!record.parent || record.parent === null) {
                                    return "None";
                                } else {
                                    return record.parent.name
                                }
                            }
                        },
                        {
                            title: "Action",
                            className: "text-center w-25",
                            dataIndex: "action",
                            render: (_, record) => <span className='d-flex justify-content-around'>
                                <EditOutlined className='text-primary' style={{ fontSize: 20 }} onClick={() => { HandleEdit(record) }} />
                                <DeletePopover HandleDelete={() => HandleDelete(record)} />
                            </span>
                        }]}
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

export default connect(mapStateToProps, mapDispatchToProps)(Category);