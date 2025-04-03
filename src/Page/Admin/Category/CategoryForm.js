import { Button, Form, Input, Select, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardFooter, CardHeader } from 'react-bootstrap'
import { GetRequired } from '../../../Asset/Validated/Validated';
import { Notification } from '../../../Asset/ShowNotification';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import httpClient from '../../../Utils/request';
import { CATEGORY } from '../../../Config/Admin';
import StackForMobile from '../../../Component/StackForMobile';

function CategoryForm(props) {
  const { Role, Token } = props;
  const [disableParent, setDisableParent] = useState(false);
  const [form] = Form.useForm();
  const [Loading, setLoading] = useState(true);
  const [ParentCategory, setParentCategory] = useState([]);
  const [SaveData, setSaveData] = useState({});
  const navigation = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const IsUpdate = pathname.toLocaleLowerCase().includes('edit');
  useEffect(() => {
    const GetCate = async (Current) =>
      httpClient.get(CATEGORY)
        .then(res => {
          setLoading(false);
          if (res.status === 200) {
            const TempData = [];
            res.data.forEach((item, index) => {
              if (Current !== item._id && !item.parent) {
                TempData.push({
                  key: item._id,
                  value: item._id + '/' + item.name,
                  label: item.name
                });
              }
            })
            setParentCategory([...TempData]);
          } else {
            Notification.ShowError("Error 404", res.message);
          }
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
        })
    if (IsUpdate) {
      if (Token !== "") {
        let Current = {};
        httpClient.get(CATEGORY + `/${pathname.split('/')[3]}`)
          .then(res => {
            if (res.status === 200) {
              form.setFieldValue('name', res.data.name);
              if (res.data.parent && res.data.parent !== null) {
                form.setFieldValue('parent', res.data.parent._id + "/" + res.data.parent.name);
              }

              if (res.data.child.length > 0) {
                setDisableParent(true);
              }
              setSaveData({
                name: res.data.name,
                parent: "" + res.data.parent?._id
              });
              Current = res.data._id;
            } else if (res.status === 404) {
              Notification.ShowError('Error 404', res.message);
              navigation(`/admin/category`);
            }
          })
          .catch(err => {
            console.log(err);
          })
          .then(() => GetCate(Current));
      }
    } else {
      if (Token !== "") {
        if (Role.toLowerCase() !== "admin") {
          navigation("/admin/dashboard");
        } else {
          GetCate();
        }
      }
    }

  }, [IsUpdate, pathname, form, Token])

  const HandleSubmit = (Data) => {
    setLoading(true);
    if (Data.parent !== undefined) {
      Data.parent = Data.parent.split('/')[0];
    }
    if (IsUpdate) {
      var Check = false;
      Object.keys(Data).forEach(key => {
        if (Data[key] !== SaveData[key]) {
          Check = true;
        }
      })
      if (Check === true) {
        httpClient.put(CATEGORY + `/${pathname.split('/')[3]}`, Data)
          .then(res => {
            setLoading(false);
            if (res.status === 200) {
              Notification.ShowSuccess("Success", res.message);
              navigation(`/admin/category`);
            } else {
              Notification.ShowError("Error", res.message);
            }
          })
          .catch(err => {
            setLoading(false);
            console.log(err);
          });
      } else {
        Notification.ShowSuccess('Success', "Nothing has been changed");
        navigation(`/admin/category`);
      }
    } else {
      httpClient.post(CATEGORY, Data)
        .then(res => {
          setLoading(false);
          if (res.status === 200) {
            Notification.ShowSuccess("Success", res.message);
            navigation('/admin/category');
          } else {
            Notification.ShowError("Error 404", res.message);
          }
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
        });
    }
  }
  return (
    <Spin spinning={Loading}>
      <div>
        <StackForMobile Header={""} />
      </div>
      <Form form={form} layout='vertical' onFinish={HandleSubmit}>
        <Card className='border-0'>
          <CardHeader className='border-0 bg-white'>
            <h1>{IsUpdate ? 'Edit Category information' : 'Category Form'}</h1>
          </CardHeader>
          <CardBody>
            <Form.Item name={"name"} label="Name" rules={[GetRequired("Name")]}>
              < Input placeholder='Name' />
            </Form.Item>
            {
              !disableParent &&
              <Form.Item name={"parent"} label="Parent">
                <Select allowClear showSearch placeholder="Parent" options={ParentCategory}></Select>
              </Form.Item>
            }
          </CardBody>
          <CardFooter className='border-0 bg-white d-flex justify-content-center'>
            <Button htmlType='submit'>SUBMIT</Button>
          </CardFooter>
        </Card>
      </Form >
    </Spin>
  )
}

const mapDispatchToProps = (dispatch) => ({ dispatch })

const mapStateToProps = (state) => ({
  Token: state.TokenReducer.Token,
  Role: state.TokenReducer.Role
})

export default connect(mapStateToProps, mapDispatchToProps)(CategoryForm);