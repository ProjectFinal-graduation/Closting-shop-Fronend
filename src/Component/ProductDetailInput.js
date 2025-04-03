import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Divider, InputNumber, Row, Typography } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Notification } from "../Asset/ShowNotification";
import { NumericFormat } from "react-number-format";
import Cookies from "js-cookie";

function ProductDetailInput(props) {
  const { NotDrawer, Data, Size, setSize, setQuantity, Quantity, Currency } =
    props;
  const navigation = useNavigate();
  useEffect(() => {
    if (typeof Cookies.get("clothIds") === "undefined")
      Cookies.set("clothIds", JSON.stringify([]));
    const clothIds = JSON.parse(Cookies.get("clothIds"));
    if (Data.Id > 0) {
      if (!clothIds.includes(Data._id)) {
        clothIds.push(Data._id);
        if (clothIds.length === 11) clothIds.shift();
        Cookies.set("clothIds", JSON.stringify(clothIds));
      }
    }
  }, []);
  const HandleBuy = () => {
    if (Quantity !== 0 && Size !== undefined) {
      let NewData = Data;
      NewData.Detail = {
        Quantity: Quantity,
        Size: Size,
      };

      const Param = [NewData].map((item) => ({
        ClothId: item._id,
        Quantity: item.Detail.Quantity,
        SizeId: item.Detail.Size,
      }));
      navigation("/order/profile", { state: { Data: Param } });
    } else {
      Notification.ShowWarning(
        "Warning",
        "Please provide Size in other to add product to cart"
      );
    }
  };

  const HandleAddCart = () => {
    if (Quantity !== 0 && Size !== undefined) {
      setQuantity(0);
      setSize(undefined);
      Notification.ShowSuccess("Success", "Product has been added to Busket");
      props.dispatch({
        type: "ADD-CART",
        payload: {
          ...Data,
          Detail: {
            Quantity: Quantity,
            Size: Size,
          },
        },
      });
      if (props.onClose !== undefined) {
        props.onClose();
      }
      if (NotDrawer === true) {
        navigation(-1);
      }
    } else {
      Notification.ShowWarning(
        "Warning",
        "Please provide Size in other to add product to cart"
      );
    }
  };
  return (
    <>
      <Row gutter={[0, 20]}>
        <Col span={24}>
          <Row>
            <Col xs={24} lg={4}>
              Size
            </Col>
            <Col lg={19} xs={24} className="d-flex gap-2 mt-3 mt-lg-0">
              {
                (Data && Data.sizes.length) === 0 &&
                <div className="col">
                  <span>
                    not available
                  </span>
                </div>
              }
              <div className="d-flex gap-3" style={{ flexWrap: "wrap" }}>
                {
                  Data && Data.sizes.map((item, index) => {
                    return (
                      <div
                        key={index}
                        role="button"
                        onClick={() => {
                          setSize(item);
                          if (Quantity === 0) setQuantity(1);
                        }}
                        style={{
                          border: "1px solid",
                          borderColor:
                            Size === item ? "black" : "lightgrey",
                          width: 40,
                          height: 25,
                        }}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div>{item}</div>
                      </div>
                    );
                  })}
              </div>
            </Col>
            <Col lg={4}></Col>
            <Col xs={24} lg={19} className="mt-2">
              {
                (Data && Data.sizes.length) !== 0 &&
                <Typography.Text>
                  [Required] Please select an option
                </Typography.Text>
              }
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            {
              (Data && Data.sizes.length) !== 0 &&
              <>
                <Col xs={24} lg={4}>
                  Quantity
                </Col>
                <Col xs={24} lg={20} className="d-flex mt-3 mt-lg-0">
                  <div
                    role="button"
                    onClick={() => {
                      if (Quantity > 1) setQuantity((pre) => pre - 1);
                    }}
                    className="h-100 d-flex justify-content-center align-items-center"
                    style={{
                      width: 30,
                      border: "1px solid",
                      borderColor: "lightgrey",
                    }}
                  >
                    <MinusOutlined />
                  </div>
                  <div
                    className="h-100 d-flex justify-content-center align-items-center"
                    style={{
                      width: 100,
                      border: "1px solid",
                      borderColor: "lightgrey",
                      borderLeft: 0,
                      borderRight: 0,
                    }}
                  >
                    <InputNumber
                      className="border-0"
                      value={Quantity}
                      onChange={(text) => {
                        if (text >= 1) {
                          setQuantity(text);
                        }
                      }}
                    />
                  </div>
                  <div
                    role="button"
                    onClick={() => {
                      setQuantity(Quantity + 1);
                    }}
                    className="h-100 d-flex justify-content-center align-items-center"
                    style={{
                      width: 30,
                      border: "1px solid",
                      borderColor: "lightgrey",
                    }}
                  >
                    <PlusOutlined />
                  </div>
                </Col>
              </>
            }
            <Col span={19} className="mt-2">
              <Typography.Text>
                (Minimum order quantity of 1 or more )
              </Typography.Text>
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider style={{ border: "1px solid", borderColor: "lightgrey" }} />
      <div className="d-flex justify-content-between ">
        <div className="M-Total-Font-Size M-Font-Color">
          TOTAL <span className="d-block d-sm-none"></span>(QUANTITY)
        </div>
        <div className="d-flex align-items-center">
          <Typography.Title level={3}>
            {Size === undefined ? (
              Currency.Symbol + "0"
            ) : (
              <NumericFormat
                value={(
                  (Data.price - (Data.price * Data.discount) / 100) *
                  Quantity *
                  Currency.Multiple
                ).toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={Currency.Symbol}
              />
            )}
          </Typography.Title>
          <span>({Quantity} items)</span>
        </div>
      </div>
      {
        (Data && Data.sizes.length) !== 0 &&
        <div className="d-flex gap-3 mt-3">
          <Button
            style={{ height: 60, borderRadius: 0 }}
            className="w-50 bg-dark text-white border-0"
            onClick={HandleBuy}
          >
            BUY IT NOW
          </Button>
          <Button
            style={{ height: 60, borderRadius: 0 }}
            className="w-50"
            onClick={HandleAddCart}
          >
            CART
          </Button>

        </div>
      }
    </>
  );
}

const mapStateToProps = (state) => ({
  Currency: {
    Multiple: state.MoneyReducer.Multiple,
    Name: state.MoneyReducer.Name,
    Symbol: state.MoneyReducer.Symbol,
  },
});
const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetailInput);
