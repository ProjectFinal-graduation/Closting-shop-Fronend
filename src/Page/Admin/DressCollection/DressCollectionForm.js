import { Button, Input, Spin, Table, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ClothDetailModal from "../../../Component/Admin/Modal/ClothDetailModal";
import { connect } from "react-redux";
import httpClient from "../../../Utils/request";
import { CLOTH, CLOTH_COLLECTION } from "../../../Config/Admin";

function DressCollectionForm(props) {
  const { Token, Role } = props;
  const [dataSource, setdataSource] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [ModalViewData, setModalViewData] = useState({});
  const [ShowModalView, setShowModalView] = useState(false);
  const [Search, setSearch] = useState("");
  const [
    clothIdListToBeAddedToCollection,
    setClothIdListToBeAddedToCollection,
  ] = useState([]);
  const navigation = useNavigate();
  const HandleAddToCollection = () => {
    if (clothIdListToBeAddedToCollection.length === 0) return;
    clothIdListToBeAddedToCollection.forEach((clothId) => {
      httpClient.post(CLOTH_COLLECTION, { clothId: clothId })
        .then((res) => {
          setLoading(false);
          if (res.status === 200) {
            navigation(`/Admin/Dress-Collection`);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    });
  };

  const getData = async () => {
    await httpClient.get(CLOTH).then(res => {
      if (res.status === 200) {
        res.data.forEach((item, index) => {
          res.data[index].key = item._id;
          res.data[index].Thumbnail = item.imagePaths[0];
        });

        const clothesNotInCollection = res.data.filter(item => item.isInCollection !== true);
        setdataSource([...clothesNotInCollection]);
      } else {
        setdataSource([]);
      }
      setLoading(false);
    }).catch(error => {
      console.log(error);
      setLoading(false);
    })
  }

  useEffect(() => {
    if (Token !== "") {
      if (Role.toLowerCase() !== "admin") {
        navigation("/admin/dashboard");
      } else {
        getData();
      }
    }
  }, [Token]);
  const addToCollection = (e, clothId) => {
    if (e.target.checked) {
      setClothIdListToBeAddedToCollection([
        ...clothIdListToBeAddedToCollection,
        clothId,
      ]);
    } else {
      const index = clothIdListToBeAddedToCollection.findIndex(
        (id) => id === clothId
      );
      if (index !== -1) {
        const updatedClothId = [
          ...clothIdListToBeAddedToCollection.slice(0, index),
          ...clothIdListToBeAddedToCollection.slice(index + 1),
        ];
        setClothIdListToBeAddedToCollection(updatedClothId);
      }
    }
  };

  return (
    <Spin spinning={Loading}>
      <h3>Cloth</h3>
      <div className="mt-4 d-flex justify-content-between">
        <Input.Search
          placeholder="Name EN"
          className="M-Input-Tool"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          onSearch={(text) => {
            setSearch(text);
          }}
        />
        <Button onClick={() => navigation(`/Admin/Dress-Collection`)}>BACK</Button>

        {clothIdListToBeAddedToCollection.length > 0 ? (
          <Button onClick={HandleAddToCollection}>ADD TO COLLECTION</Button>
        ) : (
          <Button onClick={HandleAddToCollection} disabled>ADD TO COLLECTION</Button>
        )}
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
            },
            {
              title: "Action",
              className: "text-center",
              dataIndex: "Action",
              render: (_, record) => (
                <span className="d-flex justify-content-around">
                  <Checkbox
                    onChange={(e) => addToCollection(e, record._id)}
                  ></Checkbox>
                </span>
              ),
            },
          ]}
        ></Table>
      </div>
      <ClothDetailModal
        Data={ModalViewData}
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

export default connect(mapStateToProps, mapDispatchToProps)(DressCollectionForm);