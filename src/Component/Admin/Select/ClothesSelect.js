import { Select, Form, Table } from "antd";
import React, { useEffect, useState } from "react";
import SelectClothModal from "../../../Component/Admin/Modal/SelectClothModal";
import { LazyLoadImage } from "react-lazy-load-image-component";
import DeletePopover from "../Popover/DeletePopover";
import httpClient from "../../../Utils/request";
import { CLOTH } from "../../../Config/Admin";

export default function ClothesSelect({
  mode,
  Name,
  ResetSelect,
  clothsTobeOrdered,
  setClothsTobeOrdered,
}) {
  const [ShowEditModal, setShowEditModal] = useState(false);
  const [clothSelected, setClothSelected] = useState("");
  const [Data, setData] = useState([]);
  const [Loading, setLoading] = useState(true);
  const HandleDelete = (record) => {
    const index = clothsTobeOrdered.findIndex(
      (cloth) => cloth.Image === record.Image
    );
    if (index !== -1) {
      const updatedCloths = [
        ...clothsTobeOrdered.slice(0, index),
        ...clothsTobeOrdered.slice(index + 1),
      ];
      setClothsTobeOrdered(updatedCloths);
    }
  };
  useEffect(() => {
    httpClient.get(CLOTH)
      .then((res) => {
        setLoading(false);

        if (res.status === 200) {
          const Temp = [];
          res.data.forEach((item) => {
            Temp.push({
              label: item.name,
              value: JSON.stringify(item),
            });
          });
          setData([...Temp]);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);
  const selectCloth = (value, label) => {
    setClothSelected(JSON.parse(value));
    setShowEditModal(true);
  };
  const optionRender = (Data) => {
    Data = JSON.parse(Data.key);
    return (
      <div className="d-flex align-items-center justify-content-between">
        <img
          className="object-fit-cover"
          style={{ width: "100px", height: "100px", objectPosition: "75% 25%" }}
          src={Data.imagePaths[0]}
          alt="..."
        />
        <p>{Data.name}</p> <p>{Data.price}$</p>{" "}
      </div>
    );
  };
  return (
    <>
      <Form.Item label="Clothes" name={Name}>
        <Select
          onSelect={selectCloth}
          options={Data}
          optionRender={optionRender}
          placeholder="Clothes"
          showSearch
          autoClearSearchValue
          allowClear
          loading={Loading}
        ></Select>


      </Form.Item>
      {clothsTobeOrdered.length > 0 ? (
        <div className="mt-4">
          <Table
            title={() => <div>Total Price : <span className="standard-font-size">{clothsTobeOrdered.reduce((current, value) => current + value.price, 0)}$</span></div>}
            locale={{
              emptyText: <h1>No Province Found</h1>,
            }}
            className="M-Overflow-Table"
            columns={[
              {
                title: "No",
                className: "text-center",
                dataIndex: "",
                render: (value, item, index) => index + 1
              },
              {
                title: "Image",
                className: "text-center",
                dataIndex: "Image",
                key: "Image",
                render: (_, record) => (
                  <div
                    key={record.Image}
                    className="d-flex justify-content-center"
                  >
                    <LazyLoadImage
                      effect="blur"
                      src={record.Image}
                      style={{ objectPosition: "75% 25%" }}
                      width={"100px"}
                      height={"100px"}
                      className="object-fit-cover"
                    />
                  </div>
                ),
              },
              {
                title: "Price",
                className: "text-center",
                dataIndex: "price",
                key: "Price",
                render: (_, record) => record.price + "$"
              },
              {
                title: "Size",
                className: "text-center",
                dataIndex: "Size",
                key: "Size",
                render: (_, record) => record.Size
              },
              {
                title: "Quantity",
                className: "text-center",
                dataIndex: "Quantity",
                key: "Quantity",

                onFilter: (value, record) => {
                  return String(record.Name_en)
                    .toLowerCase()
                    .includes(value.toLowerCase());
                },
              },
              {
                title: "Action",
                dataIndex: "Action",
                className: "text-center",
                key: "Action",
                render: (_, record) => {
                  return (
                    <div key={record.Image}>
                      <DeletePopover
                        HandleDelete={() => HandleDelete(record)}
                      />
                    </div>
                  );
                },
              },
            ]}
            dataSource={clothsTobeOrdered}
          />
        </div>
      ) : ""}
      {clothSelected ? (
        <SelectClothModal
          setClothSelected={setClothSelected}
          clothsTobeOrdered={clothsTobeOrdered}
          setClothsTobeOrdered={setClothsTobeOrdered}
          Show={ShowEditModal}
          ResetSelect={() => ResetSelect()}
          OnClose={() => setShowEditModal(false)}
          ClothSelected={clothSelected}
        />
      ) : ""}
    </>
  );
}
