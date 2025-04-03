import { EditOutlined } from '@ant-design/icons';
import { Input, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import ProvinceModal from '../../../Component/Admin/Modal/ProvinceModal';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../../Utils/request';
import { PROVINCE } from '../../../Config/Admin';

function Province(props) {
    const { Token, Role } = props;
    const navigation = useNavigate();
    const [ShowEditModal, setShowEditModal] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [UpdateData, setUpdateData] = useState({});
    const [dataSource, setdataSource] = useState([]);
    const [Search, setSearch] = useState("");
    useEffect(() => {
        setLoading(true);
        if (Token !== "") {
            if (Role.toLowerCase() !== "admin") {
                navigation("/admin/dashboard");
            } else {
                GetData();
            }
        }
    }, [Token])

    const GetData = () => {
        setLoading(true);
        httpClient.get(PROVINCE)
            .then(res => {
                setLoading(false);
                if (res.status === 200) {
                    res.data.forEach((item, index) => {
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
    return (
        <Spin spinning={Loading}>
            <div>
                <h3>
                    Province
                </h3>
            </div>
            <div className='mt-4 d-flex justify-content-between'>
                <Input.Search placeholder='Name EN' className='M-Input-Tool'
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                    onSearch={(text) => {
                        setSearch(text)
                    }} />
            </div>
            <div className='mt-4'>
                <Table
                    locale={{
                        emptyText: <h1>No Province Found</h1>,
                    }}
                    className='M-Overflow-Table'
                    columns={[
                        {
                            title: "No",
                            className: 'text-center',
                            render: (item, _, index) => index + 1
                        },
                        {
                            title: "Name KH",
                            className: 'text-center',
                            dataIndex: "name_kh",
                        }, {
                            title: "Name EN",
                            className: 'text-center',
                            dataIndex: "name_en",
                            filteredValue: [Search],
                            onFilter: (value, record) => {
                                return String(record.name_en).toLowerCase().includes(value.toLowerCase());
                            }
                        }, {
                            title: "Delivery Fee",
                            className: 'text-center',
                            dataIndex: "deliveryFee",
                            render: (_) => _ + " $"
                        }, {
                            title: "Action",
                            dataIndex: "Action",
                            className: "text-center",
                            key: "Action",
                            render: (_, record) => {
                                return <div key={record.Id} ><EditOutlined className='text-primary' style={{ fontSize: 20 }}
                                    onClick={() => {
                                        setShowEditModal(true);
                                        setUpdateData(record);
                                    }} /></div>
                            }
                        }]} dataSource={dataSource} />
            </div>
            <ProvinceModal Token={Token} GetData={GetData} Show={ShowEditModal} OnClose={() => setShowEditModal(false)} Data={UpdateData} setData={setUpdateData} />
        </Spin>
    )
}

const mapDispatchToProps = (dispatch) => ({ dispatch })

const mapStateToProps = (state) => ({
    Token: state.TokenReducer.Token,
    Role: state.TokenReducer.Role
})

export default connect(mapStateToProps, mapDispatchToProps)(Province);