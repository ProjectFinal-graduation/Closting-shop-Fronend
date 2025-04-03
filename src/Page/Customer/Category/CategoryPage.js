import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import StackForMobile from '../../../Component/StackForMobile';
import { Col, List, Row, Spin, Typography } from 'antd';
import { Button, Form } from 'react-bootstrap';
import ViewProduct from '../../../Component/ViewProduct';
import { connect } from 'react-redux';
import CategoryBreadcrumb from './CategoryBreadcrumb';
import { Notification } from '../../../Asset/ShowNotification';
import httpClient from '../../../Utils/request';
import { CATEGORY, CLOTH_CATEGORY } from '../../../Config/App';

function CategoryPage(props) {
    const navigation = useNavigate();
    const location = useLocation();
    const [Loading, setLoading] = useState(true);
    const [TotalCloth, setTotalCloth] = useState(0);
    const [CurrentPage, setCurrentPage] = useState(1);
    const [CurrentCategory, setCurrentCategory] = useState({
        name: "",
        _id: 0
    });
    const [Category, setCategory] = useState({
        "_id": "",
        "name": "",
        "childs": []
    });
    const [CurrentType, setCurrentType] = useState(0);
    const [TypeButton, setTypeButton] = useState([]);
    const [dataSource, setdataSource] = useState([]);
    const [Sort, setSort] = useState({
        Mode: 0,
        By: "ASC"
    });

    useEffect(() => {
        try {
            const categorySpilt = location.pathname.split('/');
            let Child = categorySpilt[3] || undefined;
            httpClient.get(CATEGORY + `/${categorySpilt[2]}`)
                .then((result) => {
                    if (Child !== undefined) {
                        setCurrentCategory({
                            name: result.data.childs.filter(item => item._id === Child)[0].name,
                            _id: result.data.childs.filter(item => item._id === Child)[0]._id
                        })
                    }
                    else {
                        setCurrentCategory({
                            name: result.data.name,
                            _id: result.data._id
                        });
                    }
                    setCategory({
                        _id: result.data._id,
                        name: result.data.name,
                        childs: [result.data.childs],
                    })
                    if (result.data.childs.length > 0) {
                        setTypeButton([{ _id: result.data._id, name: "All" }, ...result.data.childs]);
                        setCurrentType(Child !== undefined ? result.data.childs.filter(item => item._id === Child)[0]._id : result.data._id);
                    } else {
                        setTypeButton([]);
                    }
                }).catch((err) => {
                    setLoading(false);
                    Notification.ShowError("Error 500", err.message);
                });
        }
        catch (err) {
            setLoading(false);
            Notification.ShowError("Error 500", err.message);
        }
    }, [location])
    useEffect(() => {
        if (CurrentCategory._id !== 0)
            GetData(CurrentCategory._id);
    }, [Sort, CurrentCategory, CurrentPage])

    const GetData = (Id) => {
        setLoading(true);
        try {
            const Params = {
                "categoryId": Id,
                "Sort": Sort.Mode === 0 ? null : Sort,
                "pageSize": 20,
                "pageNo": CurrentPage
            };
            httpClient.post(CLOTH_CATEGORY, Params)
                .then((result) => {
                    setLoading(false);
                    if (result.status === 200) {
                        result.data.forEach((item, index) => {
                            result.data[index].image = item.imagePaths;
                            result.data[index].model = item.code;
                            result.data[index].category = item.category.name;
                        })
                        setdataSource([...result.data]);
                        setTotalCloth(result.Total);
                    }
                    else {
                        setdataSource([]);
                        setTotalCloth(0);
                    }
                }).catch((err) => {
                    setLoading(false);
                    console.log(err.message);
                });
        }
        catch (err) {
            setLoading(false);
            Notification.ShowError("Error 500", err.message);
        }
    }
    return (
        <Spin spinning={Loading}>
            <div className='M-Max-Responsive-1024'>
                <StackForMobile Header={CurrentCategory.name} />
            </div>
            <div className='M-Container-Detail'>
                <CategoryBreadcrumb Category={Category} CurrentCategory={CurrentCategory.name} />
                <h2 className='pb-5 pt-5 fw-bold d-none d-lg-flex justify-content-center'>
                    {CurrentCategory.name}
                </h2>
                <Row gutter={[12, 12]}>
                    {TypeButton.map(item => {
                        return <Col key={item._id}>
                            <Button
                                onClick={() => {
                                    setCurrentType(item._id);
                                    if (item._id !== Category._id)
                                        navigation(`/category/${Category._id}/${item._id}`);
                                    else
                                        navigation(`/category/${Category._id}`);
                                }}
                                className={'border-dark rounded-pill pe-3 ps-3 ' + (CurrentType !== item._id ? 'text-dark bg-white' : "bg-dark")
                                }> {item.name}</Button>
                        </Col>
                    })}
                </Row>
                <div>
                    <div className='mt-5 mb-5 d-block d-md-flex justify-content-between align-items-center'>
                        <div className='text-center'>
                            <Typography.Text>
                                There are a total of {dataSource.length} products.
                            </Typography.Text>
                        </div>
                        <div className='mt-3 mt-md-0'>
                            <Form.Select onChange={(event) => setSort(JSON.parse(event.target.value))}>
                                <option value={JSON.stringify({ Mode: 0, By: "ASC" })} onClick={() => { setSort("") }}>
                                    Sort
                                </option>
                                <option value={JSON.stringify({ Mode: 3, By: "DESC" })}>New Product</option>
                                <option value={JSON.stringify({ Mode: 2, By: "ASC" })}>Product Name</option>
                                <option value={JSON.stringify({ Mode: 1, By: "ASC" })}>Low Price</option>
                                <option value={JSON.stringify({ Mode: 1, By: "DESC" })}>High Price</option>
                                <option value={JSON.stringify({ Mode: 3, By: "DESC" })}>Special offer</option>
                            </Form.Select>
                        </div>
                    </div>
                    {
                        (Loading === false && TotalCloth === 0) ?
                            <div><h1 className='text-center'>No Clothes found</h1></div>
                            :
                            <List
                                className='mt-4'
                                grid={{
                                    gutter: [25, 40],
                                    xs: 2,
                                    sm: 2,
                                    md: 3,
                                    lg: 4,
                                    xl: 4,
                                    xxl: 4,
                                }}
                                pagination={{ position: "bottom", align: "center", pageSize: 20, current: CurrentPage, total: TotalCloth, onChange: (count) => setCurrentPage(count) }}
                                dataSource={dataSource}
                                renderItem={(item) => (
                                    <List.Item>
                                        <ViewProduct Data={item} dispatch={props.dispatch} />
                                    </List.Item>
                                )}>
                            </List>
                    }
                </div>
            </div>
        </Spin >
    )
}


const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(null, mapDispatchToProps)(CategoryPage);