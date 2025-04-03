import { Button, Col, Form, Input, Row, Spin } from "antd";
import React, { useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "react-bootstrap";
import ProvincesSelect from "../../../Component/Admin/Select/ProvincesSelect";
import ClothesSelect from "../../../Component/Admin/Select/ClothesSelect";
import { connect } from "react-redux";
import { GetRequired } from "../../../Asset/Validated/Validated";
import { Notification } from "../../../Asset/ShowNotification";
import { useNavigate } from "react-router-dom";
import httpClient from "../../../Utils/request";
import { ORDER } from "../../../Config/Admin";
import StackForMobile from "../../../Component/StackForMobile";

function OrderForm(props) {
  const navigation = useNavigate();
  const [form] = Form.useForm();
  const [Loading, setLoading] = useState(false);
  const [clothsTobeOrdered, setClothsTobeOrdered] = useState([]);
  const HandleSubmit = (Data) => {
    if (clothsTobeOrdered.length > 0) {
      setLoading(true);
      Data.ClothSizeQuantities = [];
      clothsTobeOrdered.forEach((item) => {
        Data.ClothSizeQuantities.push({
          cloth: item._id,
          sizes: item.Size,
          quantity: item.Quantity,
        });
      });
      Data.cityProvince = Data.Province.split('/')[0];
      if (Data.note === undefined) {
        Data.note = "";
      }

      httpClient.post(ORDER, Data)
        .then((res) => {
          setLoading(false);
          if (res.status === 200) {
            navigation("/admin/Manage-Order/" + res.data._id);
            Notification.ShowSuccess("Success", res.message);
          } else {
            Notification.ShowError("Error", res.message);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } else {
      Notification.ShowWarning("Warning", "Clothes required to make an order");
    }
  };

  const ResetSelect = () => {
    form.setFieldValue("clothSizeQuantities", null);
  };

  return (
    <Spin spinning={Loading}>
      <div>
        <StackForMobile path={"/admin/order"} Header={""} />
      </div>
      <Form form={form} layout="vertical" onFinish={HandleSubmit}>
        <Card className="border-0">
          <CardHeader className="border-0 bg-white">
            <h1>Order Form</h1>
          </CardHeader>
          <CardBody>
            <Row gutter={[24]}>
              <Col xs={24} md={12}>
                <Form.Item label="Customer Name" name={"fullName"} rules={[GetRequired("Customer Name")]}>
                  <Input placeholder="Customer Name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Address" name={"address"} rules={[GetRequired("Address")]}>
                  <Input placeholder="Address" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Phonenumber" name={"phone"}
                  rules={[{
                    ...GetRequired("Phonenumber")
                  }, {
                    min: 9,
                    max: 10,
                    message: "Phonenumber must be 9-10"
                  }, {
                    validator(_, value) {
                      var regex = /[a-zA-Z]/;
                      if (regex.test(value)) {
                        return Promise.reject("Phonenumber should not contain an string");
                      }
                      if (!regex.test(value) && value !== "" && value.length >= 9 && value.length <= 10 && value[0] !== '0') {
                        return Promise.reject("Phonenumber should start with a 0");
                      }
                      return Promise.resolve();
                    }
                  }]}>
                  <Input allowClear placeholder='Phonenumber' maxLength={10} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <ProvincesSelect />
              </Col>
              <Col xs={24}>
                <Form.Item label="Note" name={"note"}>
                  <Input.TextArea placeholder="Note" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <ClothesSelect
                  ResetSelect={() => ResetSelect()}
                  Name="clothSizeQuantities"
                  setClothsTobeOrdered={setClothsTobeOrdered}
                  clothsTobeOrdered={clothsTobeOrdered}
                />
              </Col>
            </Row>
          </CardBody>
          <CardFooter className="border-0 bg-white d-flex justify-content-center">
            <Button htmlType="submit">SUBMIT</Button>
          </CardFooter>
        </Card>
      </Form>
    </Spin>
  );
}

const mapDispatchToProps = (dispatch) => ({ dispatch })

const mapStateToProps = (state) => ({
  Token: state.TokenReducer.Token,
  Role: state.TokenReducer.Role
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderForm);