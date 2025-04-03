import { List, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap';
import ViewProduct from '../../Component/ViewProduct';
import { connect } from 'react-redux';
import DressCollection from './DressCollection';
import { Notification } from '../../Asset/ShowNotification';
import BannerCollection from '../../Component/Collection/BannerCollection';
import { NEW_ARRIVAL } from '../../Config/App';
import httpClient from '../../Utils/request';

function HomePage(props) {
    const [dataSource, setdataSource] = useState([]);
    const [Loading, setLoading] = useState(true);
    useEffect(() => {
        httpClient.get(NEW_ARRIVAL)
            .then(res => {
                setLoading(false);
                if (res.status === 200) {
                    res.data.forEach((item, index) => {
                        res.data[index].image = item.imagePaths;
                    })
                    setdataSource([...res.data]);
                }
                else {
                    setdataSource([]);
                }
            })
            .catch(err => {
                setLoading(false);
                Notification.ShowError("Error 500", "Internal server error");
                console.error(err);
            })
    }, [])

    return (
        <Spin spinning={Loading}>
            <BannerCollection />
            <Container className='mt-md-5 mt-0 p-md-5 p-3 text-center'>
                <Typography.Title level={3} className='fw-bold'>NEW ARRIVALS
                </Typography.Title>
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
                    pagination={false}
                    dataSource={dataSource}
                    renderItem={(item) => (
                        <List.Item>
                            <ViewProduct Data={item} />
                        </List.Item>
                    )}>
                </List>
                <DressCollection />
            </Container>
        </Spin >
    )
}

const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(null, mapDispatchToProps)(HomePage);