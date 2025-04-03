import { List, Spin, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import ViewProduct from '../../../Component/ViewProduct';
import { useLocation } from 'react-router-dom';
import { Notification } from '../../../Asset/ShowNotification';
import httpClient from '../../../Utils/request';
import { CLOTH } from '../../../Config/App';

export default function SearchCloth() {
    const [Search, setSearch] = useState("");
    const [CurrentPage, setCurrentPage] = useState(1);
    const [TotalCloth, setTotalCloth] = useState(0);
    const [dataSource, setdataSource] = useState([]);
    const location = useLocation();
    const [Loading, setLoading] = useState(true);
    useEffect(() => {
        window.scrollTo(0, 0)
        setLoading(true);
        let search = location.pathname.split("/")[2];
        setSearch(search);
        httpClient.get(CLOTH + `?search=${search}&pageNo=${CurrentPage}&pageSize=${20}`)
            .then(res => {
                setLoading(false);
                if (res.status === 200) {
                    res.data.forEach((item, index) => {
                        res.data[index].image = item.imagePaths;
                    })
                    setTotalCloth(res.total);
                    setdataSource([...res.data]);
                } else {
                    setTotalCloth(res.total);
                    setdataSource([]);
                }
            })
            .catch(err => {
                setLoading(false);
                Notification.ShowError("Error 500", "Internal server error");
                console.error(err);
            })
    }, [location, CurrentPage])
    return (
        <Spin spinning={Loading}>
            <Container className='mt-md-5 mt-0 p-md-5 p-3 text-center'>
                <Typography.Title level={3} className='fw-bold'>{("Search Result : " + Search).toLocaleUpperCase()}
                </Typography.Title>
                <List
                    locale={{
                        emptyText: <h1>No CLothes Found</h1>,
                    }}
                    pagination={{ position: "bottom", align: "center", pageSize: 20, current: CurrentPage, total: TotalCloth, onChange: (count) => setCurrentPage(count) }}
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
                    dataSource={dataSource}
                    renderItem={(item) => (
                        <List.Item>
                            <ViewProduct Data={item} />
                        </List.Item>
                    )}>
                </List>
            </Container>
        </Spin >
    )
}
