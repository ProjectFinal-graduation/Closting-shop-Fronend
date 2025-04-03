import React, { useEffect } from 'react'
import { Upload, Form, Row, Col, Select, Button } from 'antd';
import { Card, CardBody, CardFooter, CardHeader } from 'react-bootstrap'
import CategoriesSelect from '../../../Component/Admin/Select/CategoriesSelect';
import { GetRequired } from '../../../Asset/Validated/Validated';
import { GetSelected } from '../../../Asset/Tool Helper/Tool';
import { UploadOutlined } from '@ant-design/icons';
import { Notification } from '../../../Asset/ShowNotification';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import httpClient from '../../../Utils/request';
import { BANNER } from '../../../Config/Admin';
import StackForMobile from '../../../Component/StackForMobile';

function BannerForm(props) {
    const { Token, Role } = props;
    const navigation = useNavigate();
    const HandleSubmit = (Data) => {
        Data.categoryId = GetSelected(Data.categoryId);
        const formdata = new FormData();
        formdata.append("image", Data.image.file);
        formdata.append("isPcBanner", Data.isPcBanner);
        formdata.append("categoryId", Data.categoryId);
        httpClient.post(BANNER, formdata)
            .then((res) => {
                if (res.status === 200) {
                    Notification.ShowSuccess("Success", res.message);
                    navigation("/Admin/Banner");
                } else if (res.status === 400) {
                    Notification.ShowError("Error " + 400, res.message);
                }
            }).catch((err) => {
                Notification.ShowError("Error " + 500, err.message);
                console.error(err);
            });
    }

    useEffect(() => {
        if (Token !== "") {
            if (Role.toLowerCase() !== "admin") {
                navigation("/admin/dashboard");
            }
        }
    }, [Token])

    const propsUpload = {
        name: 'file',
        onChange(info) {

        },
    };
    return (
        <div>
            <div>
                <StackForMobile Header={""} />
            </div>
            <Form layout='vertical' onFinish={HandleSubmit}>
                <Card className='border-0'>
                    <CardHeader className='border-0 bg-white'>
                        <h1>Banner Form</h1>
                    </CardHeader>
                    <CardBody>
                        <Row gutter={[30, 0]}>
                            <Col xs={24} lg={12}>
                                <Form.Item name={"isPcBanner"} label="Device" rules={[GetRequired("Device")]}>
                                    <Select placeholder="Select Device" className='w-100' options={[{
                                        label: "PC",
                                        value: 1
                                    }, {
                                        label: "Mobile",
                                        value: 0
                                    }]} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <CategoriesSelect Name={"categoryId"} />
                            </Col>
                            <Col xs={24}>
                                <Form.Item label="Image" name="image" rules={[GetRequired("Image")]}>

                                    <Upload maxCount={1} beforeUpload={() => false} {...propsUpload}>
                                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter className='p-3 border-0 bg-white d-flex justify-content-center'>
                        <Button htmlType='submit'>SUBMIT</Button>
                    </CardFooter>
                </Card>
            </Form>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => ({ dispatch })

const mapStateToProps = (state) => ({
    Token: state.TokenReducer.Token,
    Role: state.TokenReducer.Role
})

export default connect(mapStateToProps, mapDispatchToProps)(BannerForm);