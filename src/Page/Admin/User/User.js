import { Button, Input, Spin, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { EditOutlined } from '@ant-design/icons';
import DeletePopover from '../../../Component/Admin/Popover/DeletePopover';
import { Notification } from '../../../Asset/ShowNotification';
import { connect } from 'react-redux';
import httpClient from '../../../Utils/request';
import { USER } from '../../../Config/Admin';
import Cookies from "js-cookie";

function User(props) {
  const userId = Cookies.get("userId");
  const { Token, Role } = props;
  const [dataSource, setdataSource] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [Search, setSearch] = useState("");
  const navigation = useNavigate();

  const HandleAdd = () => {
    navigation('/Admin/User-Form');
  }

  const HandleEdit = (record) => {
    navigation(`/Admin/User-Edit/${record._id}`);
  }

  const HandleDelete = (record) => {
    httpClient.delete(USER + "/" + record._id)
      .then(res => {
        if (res.status === 200) {
          Notification.ShowSuccess("Success", res.message);
          GetData();
        } else {
          Notification.ShowError("Error", res.message);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  const GetData = () => {
    setLoading(true);
    httpClient.get(USER)
      .then(res => {
        setLoading(false);
        if (res.status === 200) {
          res.data.forEach((_, index) => {
            res.data[index].key = res.data[index]._id;
          })
          setdataSource([...res.data]);
        } else {
          setdataSource([]);
        }
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
        setdataSource([]);
      })
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
        User
      </h3>
      <div className='mt-4 d-flex justify-content-between'>
        <Input.Search placeholder='Search by Username' className='M-Input-Tool'
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
            emptyText: <h1>No User Found</h1>,
          }}
          className='M-Overflow-Table'
          dataSource={dataSource}
          columns={[
            {
              title: "Id",
              className: 'text-center',
              dataIndex: "code",
            },
            {
              title: "Username",
              className: "text-center",
              dataIndex: "username",
              filteredValue: [Search],
              onFilter: (value, record) => {
                return String(record.username).toLowerCase().includes(value.toLowerCase());
              }
            }, {
              title: "PhoneNumber",
              className: "text-center",
              dataIndex: "phoneNumber"
            }, {
              title: "Email",
              className: "text-center",
              dataIndex: "email"
            }, {
              title: "Telegram ID",
              className: "text-center",
              dataIndex: "chatId"
            },
            {
              title: "Action",
              className: "text-center",
              dataIndex: "action",
              render: (_, record) => <span className='d-flex justify-content-around'>
                <EditOutlined className='text-primary' style={{ fontSize: 20 }} onClick={() => { HandleEdit(record) }} />
                {
                  userId !== record._id &&
                  <DeletePopover HandleDelete={() => HandleDelete(record)} />
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(User);