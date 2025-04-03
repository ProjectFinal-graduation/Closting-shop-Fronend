import { Button, DatePicker, Input, Select, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../../Asset/ShowNotification';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import httpClient from '../../../Utils/request';
import { GET_ORDER } from '../../../Config/Admin';
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

function Order(props) {
  const { Token, Role } = props;
  const [typingTimer, settypingTimer] = useState();
  const [Search, setSearch] = useState("");
  const [CurrentPage, setCurrentPage] = useState(1);
  const [Total, setTotal] = useState(0);
  const [dataSource, setdataSource] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState({
    Order: "",
    Delivery: "",
    Payment: ""
  });
  const [Sort, setSort] = useState({
    "By": "ASC",
    "Mode": "1"
  });
  const [Loading, setLoading] = useState(true);
  const navigation = useNavigate();
  const HandleAdd = () => {
    navigation('/Admin/Order-Form');
  }

  const GetData = (text) => {
    setLoading(true);
    if (Token !== "") {
      let Params = {
        "PageIndex": CurrentPage,
        "Limit": 10,
      };

      if (startDate) {
        Params.StartDate = dayjs(startDate).toDate();
      }

      if (endDate) {
        Params.EndDate = dayjs(endDate).toDate();
      }

      if (text || Search) {
        Params.Search = text ?? Search;
      }

      if (status.Delivery) {
        Params.DeliveryStatus = status.Delivery;
      }

      if (status.Order) {
        Params.OrderStatus = status.Order;
      }

      if (status.Payment) {
        Params.PaymentStatus = status.Payment;
      }

      httpClient.post(GET_ORDER, Params)
        .then((res) => {
          setLoading(false);
          if (res.status === 200) {
            res.data.forEach((item, index) => {
              res.data[index].cityProvince = item.cityProvince.name_en;
              res.data[index].key = item._id;
              res.data[index].CurrentStatus = item.status.order;
              res.data[index].DeliveryStatus = item.status.delivery;
              res.data[index].PaymentStatus = item.status.payment;
            })
            setTotal(res.total);
            setdataSource([...res.data]);
          } else {
            setTotal(res?.total || 0);
            setdataSource([]);
          }
        }).catch((err) => {
          setLoading(false);
          console.log(err.message);
          Notification.ShowError(err.message);
        });
    }
  }

  const HandleChangeSearch = (e) => {
    setSearch(e.target.value);
    clearTimeout(typingTimer);
    settypingTimer(setTimeout(() => {
      if (CurrentPage > 1) {
        setCurrentPage(1);
      } else {
        GetData(e.target.value)
      }
    }, 500));
  }

  const HandleOnSearch = (text) => {
    setSearch(text)
    clearTimeout(typingTimer);
    settypingTimer(setTimeout(() => {
      if (CurrentPage > 1) {
        setCurrentPage(1);
      } else {
        GetData(text)
      }
    }, 500));
  }

  useEffect(() => {
    setLoading(false);
    GetData();
  }, [CurrentPage, Sort, Token])

  const HandleEdit = (record) => {
    navigation(`/Admin/Manage-Order/${record._id}`);
  }

  const HandleChange = (dateRange) => {
    if (dateRange !== null) {
      var StartDate = new Date(dateRange[0].toString());
      var EndDate = new Date(dateRange[1].toString());

      EndDate.setDate(EndDate.getDate() + 1)

      setStartDate(StartDate);
      setEndDate(EndDate);
    }
    else {
      setStartDate(dateRange);
      setEndDate(dateRange);
    }
  }

  const onChangeStatus = (value, type) => {
    setStatus({ ...status, [type]: value });
  }

  return (
    <Spin spinning={Loading}>
      <div>
        <h3>
          Order
        </h3>
      </div>
      <div className='mt-4 d-flex flex-column gap-3'>
        <div className='d-flex flex-md-row flex-column gap-3 justify-content-between align-items-center'>
          <Input.Search placeholder='Name EN' className='w-100'
            onChange={HandleChangeSearch}
            onSearch={HandleOnSearch} />
          <RangePicker className='w-100'
            onChange={HandleChange}
          />
        </div>
        <div className='d-flex flex-md-row flex-column gap-3 align-items-center justify-content-between'>
          <Select
            onSelect={(value) => onChangeStatus(value, "Delivery")}
            options={[
              {
                value: "Pending",
                label: "Pending"
              },
              {
                value: "Processing",
                label: "Processing"
              },
              {
                value: "Delivered",
                label: "Delivered"
              }
            ]} allowClear onClear={() => onChangeStatus(0, "Delivery")}
            placeholder="Delivery Status" className='w-100' />

          <Select
            onSelect={(value) => onChangeStatus(value, "Order")}
            options={[
              {
                value: "Pending",
                label: "Pending"
              }, {
                value: "Processing",
                label: "Processing"
              }, {
                value: "Delivering",
                label: "Delivering"
              }, {
                value: "Completed",
                label: "Completed"
              },
              {
                value: "Cancelled",
                label: "Cancelled"
              }
            ]} allowClear onClear={() => onChangeStatus(0, "Order")} placeholder="Order Status"
            className='w-100' />

          <Select
            className='w-100'
            onSelect={(value) => onChangeStatus(value, "Payment")}
            options={[
              {
                value: "Not Paid",
                label: "Not Paid"
              }, {
                value: "Paid",
                label: "Paid"
              }, {
                value: "Refunded",
                label: "Refunded"
              }
            ]} allowClear onClear={() => onChangeStatus(0, "Payment")} placeholder="Payment Status" />
        </div>
        <div className='d-flex justify-content-between gap-5'>

          <Button className='w-50' onClick={HandleAdd}>ADD</Button>

          <Button className='w-50' onClick={() => {
            if (CurrentPage > 1) {
              setCurrentPage(1);
            } else {
              GetData()
            }
          }}>Search</Button>
        </div>
      </div>
      <div className='mt-4'>
        <Table
          locale={{
            emptyText: <h1>No Order Found</h1>,
          }}
          dataSource={dataSource}
          className='M-Remove-Padding-Table M-Overflow-Table'
          pagination={{ position: "bottom", align: "center", pageSize: 10, current: CurrentPage, total: Total, showSizeChanger: false, onChange: (count) => setCurrentPage(count) }}
          columns={[
            {
              className: 'text-center',
              title: "ID",
              dataIndex: "id"
            }, {
              className: 'text-center',
              title: "Full name",
              dataIndex: "fullName"
            }, {
              className: 'text-center',
              title: "Phonenumber",
              dataIndex: "phone"
            }, {
              className: 'text-center',
              title: "Total",
              dataIndex: "totalPrice",
              render: (_, record) => record.totalPrice + "$"
            }, {
              className: 'text-center',
              title: "Province",
              dataIndex: "cityProvince",
              render: (_, record) => _,
            }, {
              className: 'text-center',
              title: "Status",
              dataIndex: "status.order",
              render: (value, item) => item.status.order,
            },
            {
              className: 'text-center',
              title: "Delivery Status",
              dataIndex: "status.delivery",
              render: (value, item) => item.status.delivery,
            },
            {
              className: 'text-center',
              title: "Payment Status",
              dataIndex: "status.payment",
              render: (value, item) => item.status.payment,
            }, {
              className: 'text-center',
              title: "Action",
              render: (_, record) => {
                if (["Completed", "Cancelled"].includes(record.status.order)) {
                  return <EyeOutlined className='text-success' style={{ fontSize: 20 }} onClick={() => { HandleEdit(record) }} />
                }
                return <EditOutlined className='text-primary' style={{ fontSize: 20 }} onClick={() => { HandleEdit(record) }} />
              }
            }
          ]}
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

export default connect(mapStateToProps, mapDispatchToProps)(Order);