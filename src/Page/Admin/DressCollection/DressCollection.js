import { Button, Input, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { EyeOutlined } from "@ant-design/icons";
import DeletePopover from "../../../Component/Admin/Popover/DeletePopover";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ClothDetailModal from "../../../Component/Admin/Modal/ClothDetailModal";
import { Notification } from "../../../Asset/ShowNotification";
import { connect } from "react-redux";
import httpClient from "../../../Utils/request";
import { CLOTH_COLLECTION } from "../../../Config/Admin";

function DressCollection(props) {
  const { Token, Role } = props;
  const [dataSource, setdataSource] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [ModalViewData, setModalViewData] = useState({});
  const [ShowModalView, setShowModalView] = useState(false);
  const [Search, setSearch] = useState("");

  const navigation = useNavigate();
  const HandleAdd = () => {
    navigation(`/Admin/Dress-CollectionForm`);
  };
  const HandleViewData = (record) => {
    setModalViewData({ ...record });
    setShowModalView(true);
  };
  const HandleDelete = (record) => {
    setLoading(true);

    httpClient.delete(CLOTH_COLLECTION + `/${record._id}`)
      .then((res) => {
        if (res.status === 404) {
          setLoading(false);
          Notification.ShowError("Error " + res.status, res.message);
        } else if (res.status === 200) {
          Notification.ShowSuccess("Success", res.message);
          GetData();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const GetData = () => {
    httpClient.get(CLOTH_COLLECTION)
      .then((res) => {
        setLoading(false);
        console.log(res);
        if (res.status === 200) {
          res.data.forEach((item, index) => {
            res.data[index].key = item._id;
            res.data[index].Thumbnail = item.imagePaths[0];
          });
          setdataSource([...res.data]);
        } else {
          setdataSource([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (Token !== "") {
      if (Role.toLowerCase() !== "admin") {
        navigation("/");
      } else {
        GetData();
      }
    }
  }, [Token]);
  return (
    <Spin spinning={Loading}>
      <h3>Dress Collection</h3>
      <div className="mt-4 d-flex justify-content-between">
        <Input.Search
          placeholder="Name"
          className="M-Input-Tool"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          onSearch={(text) => {
            setSearch(text);
          }}
        />
        <Button onClick={HandleAdd}>ADD</Button>
      </div>
      <div className="mt-4">
        <Table
          locale={{
            emptyText: <h1>No Cloth Found</h1>,
          }}
          className="M-Overflow-Table"
          dataSource={dataSource}
          columns={[
            {
              title: "Image",
              className: "text-center",
              dataIndex: "Thumbnail",
              render: (_, record) => (
                <div className="d-flex justify-content-center">
                  <LazyLoadImage
                    effect="blur"
                    src={record.Thumbnail}
                    width={"100px"}
                    height={"100px"}
                    className="object-fit-cover"
                  />
                </div>
              ),
            },
            {
              title: "Name",
              className: "text-center",
              dataIndex: "name",
              filteredValue: [Search],
              onFilter: (value, record) => {
                return String(record.name)
                  .toLowerCase()
                  .includes(value.toLowerCase());
              },
            },
            {
              title: "Price",
              className: "text-center",
              dataIndex: "price",
            },
            {
              title: "Discount",
              className: "text-center",
              dataIndex: "discount",
              render: (_) => _ + "%"
            },
            {
              title: "Action",
              className: "text-center",
              dataIndex: "Action",
              render: (_, record) => (
                <span className="d-flex justify-content-around">
                  <DeletePopover HandleDelete={() => HandleDelete(record)} />
                  <EyeOutlined
                    className="text-success"
                    style={{ fontSize: 20 }}
                    onClick={() => {
                      HandleViewData(record);
                    }}
                  />

                </span>
              ),
            },
          ]}
        ></Table>
      </div>
      <ClothDetailModal
        OpenData={ModalViewData}
        setData={setModalViewData}
        OnClose={() => setShowModalView(false)}
        Show={ShowModalView}
      />
    </Spin>
  );
}

const mapDispatchToProps = (dispatch) => ({ dispatch })

const mapStateToProps = (state) => ({
  Token: state.TokenReducer.Token,
  Role: state.TokenReducer.Role
})

export default connect(mapStateToProps, mapDispatchToProps)(DressCollection);