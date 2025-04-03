import { Button, Form, InputNumber, Modal, Image, Carousel } from "antd";
import React from "react";
import SizesSelect from "../Select/SizesSelect";
import { GetRequired } from "../../../Asset/Validated/Validated";

export default function SelectClothModal({
  ResetSelect,
  Show,
  OnClose,
  ClothSelected,
  clothsTobeOrdered,
  setClothsTobeOrdered,
}) {
  const [form] = Form.useForm();
  const HandleOpenChange = (value) => {
    if (value === false) {
      form.setFieldValue("Quantity", "");
      form.setFieldValue("Size", null);
      ResetSelect();
    }
  };

  const HandleSubmit = (NewData) => {
    NewData.price = ClothSelected.price;
    NewData.Image = ClothSelected.imagePaths[0];
    NewData._id = ClothSelected._id;
    var isClothAlreadyExisted = false;
    clothsTobeOrdered.forEach((cloth) => {
      if (cloth.Size === NewData.Size && cloth.Image === NewData.Image) {
        cloth.Quantity += NewData.Quantity;
        isClothAlreadyExisted = true;
      }
    });
    if (isClothAlreadyExisted === true) setClothsTobeOrdered([...clothsTobeOrdered]);
    else setClothsTobeOrdered([...clothsTobeOrdered, NewData]);
    HandleClose();
  };
  const HandleClose = () => {
    OnClose();
  };

  return (
    <Modal
      centered
      footer={false}
      open={Show}
      onCancel={HandleClose}
      afterOpenChange={HandleOpenChange}
    >
      <Form
        onFinish={HandleSubmit}
        form={form}
        layout="vertical"
        className="p-3 pb-0 w-100 d-flex align-items-center flex-column"
      >
        <h3>{ClothSelected.Name === undefined ? "" : ClothSelected.Name}</h3>
        <Form.Item name={"Image"}>
          <Carousel autoplay draggable>
            {ClothSelected.imagePaths.map((imagePath, index) => (
              <div key={index}>
                <Image
                  src={imagePath}
                  alt="Image"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            ))}
          </Carousel>
        </Form.Item>

        <SizesSelect Name="Size" Id={ClothSelected.Id}/>
        <Form.Item label="Quantity" name={"Quantity"} rules={[GetRequired("Quantity")]}>
          <InputNumber
            className="w-100"
            placeholder="Quantity"
            min={1}
          />
        </Form.Item>
        <Form.Item className="d-flex justify-content-center">
          <Button htmlType="submit">Add</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
