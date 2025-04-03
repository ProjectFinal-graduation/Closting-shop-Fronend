import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import httpClient from "../../Utils/request";
import "../../CSS/Admin.css";
import { Button, Form, Grid, Input, Spin, theme } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useLocation, useNavigate } from "react-router-dom";
import { Notification } from "../../Asset/ShowNotification";
import { List_Image } from "../../Image/ListImage";
import { LOGIN } from "../../Config/Admin";
const { useToken } = theme;
const { useBreakpoint } = Grid;

export default function AnotherLogin(props) {
  const { token } = useToken();
  const location = useLocation();
  const screens = useBreakpoint();
  const navigation = useNavigate();
  const [Loading, setLoading] = useState(false);
  const onFinish = async (data) => {
    setLoading(true);
    await httpClient.post(LOGIN, data)
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          var expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 1);
          Cookies.set("userToken", res.data?.token, { expires: expirationDate });
          Cookies.set("userId", res.data?.user?._id, { expires: expirationDate });
          if (location.state && location.state.pathname !== "/admin/login") {
            navigation(location.state.pathname);
          } else {
            navigation("/admin/dashboard");
          }
        } else {
          Notification.ShowError(res.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.message);
      });
  };
  useEffect(() => {
    if (Cookies.get("userToken"))
      navigation('/admin');
  }, []);
  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px",
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%",
    },
    forgotPassword: {
      float: "right",
    },
    header: {
      marginBottom: token.marginXL,
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
    },
    text: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
    },
  };

  return (
    <Spin spinning={Loading}>
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.header} className="d-flex justify-content-center">
            <div>
              <LazyLoadImage src={List_Image.Logo} height={"60px"} className="mb-3" />
            </div>
          </div>

          <Form
            className="mt-5"
            name="normal_login"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input autoComplete="off" prefix={<MailOutlined className="me-2" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password
                autoComplete="current-password"
                prefix={<LockOutlined className="me-2" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: "0px" }}>
              <Button block="true" type="primary" htmlType="submit">
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </Spin>
  );
}
