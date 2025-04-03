import { CloseOutlined } from "@ant-design/icons";
import { Button, Divider, List, Typography, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { NumericFormat } from "react-number-format";
import { connect } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import httpClient from "../../../Utils/request";
import { CLOTH_RECENT } from "../../../Config/App";
function RecentlyPage(props) {
  const { Currency } = props;
  const [Data, setData] = useState([]);
  const [Loading, setLoading] = useState(true);
  const navigation = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    if (typeof Cookies.get('clothIds') === 'undefined') Cookies.set('clothIds', JSON.stringify([]));
    const clothIds = JSON.parse(Cookies.get("clothIds"));

    await httpClient.post(CLOTH_RECENT, { listCloth: clothIds })
      .then(res => {
        res.data.forEach((item, index) =>
          res.data[index].image = item.imagePaths[0],
        );
        setData([...res.data]);
        setLoading(false);
      })
      .catch(error => console.log(error))
  };

  const HandleViewProduct = (record) => {
    navigation("/product/" + record._id);
  }

  const HandleDelete = (record) => {
    const clothIds = JSON.parse(Cookies.get("clothIds"));
    let newId = clothIds.filter(item => item !== record._id)
    Cookies.set('clothIds', JSON.stringify(newId));
    fetchData();
  }

  return (
    <Spin spinning={Loading}>
      <div className="M-Container-Detail">
        <div className="mt-5">
          <h5>Recently viewed products</h5>
          <Divider className="border-4 border-dark" />
        </div>
        <div>
          <List
            dataSource={Data}
            renderItem={(item) => {
              return (
                <div className="position-relative">
                  <div className="d-flex w-100">
                    <LazyLoadImage
                      src={item.image}
                      width={"100px"}
                      height={"100px"}
                      className="object-fit-cover"
                    />
                    <div className="ms-3 d-flex flex-column justify-content-between w-100">
                      <div>{item.name}</div>
                      {
                        item.discount > 0 &&
                        <Typography.Text delete className="standard-font-size">
                          <NumericFormat
                            value={(item.price * Currency.Multiple).toFixed(2)}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={Currency.Symbol}
                          />
                        </Typography.Text>
                      }
                      <div className="standard-font-size">
                        <NumericFormat
                          value={(
                            (item.price - (item.price * item.discount) / 100) *
                            Currency.Multiple
                          ).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={Currency.Symbol}
                        />
                      </div>
                      <div className="d-flex justify-content-end w-100">
                        <Button className="rounded-0 bg-dark text-white" onClick={() => HandleViewProduct(item)}>
                          View Product
                        </Button>
                      </div>
                    </div>
                    <div className="M-Recently-Delete-Icon" role="button" onClick={() => HandleDelete(item)}>
                      <CloseOutlined />
                    </div>
                  </div>
                  <Divider />
                </div>
              );
            }}
          />
        </div>
      </div>
    </Spin >
  );
}

const mapStateToProps = (state) => ({
  Currency: {
    Multiple: state.MoneyReducer.Multiple,
    Name: state.MoneyReducer.Name,
    Symbol: state.MoneyReducer.Symbol,
  },
});

export default connect(mapStateToProps)(RecentlyPage);
