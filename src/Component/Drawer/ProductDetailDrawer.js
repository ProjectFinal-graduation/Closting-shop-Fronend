import { Drawer, Image, Spin, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import ProductDetailInput from '../ProductDetailInput';
import { Notification } from '../../Asset/ShowNotification';
import httpClient from '../../Utils/request';
import { CLOTH } from '../../Config/App';

function ProductDetailDrawer(props) {
    const [Size, setSize] = useState(undefined);
    const [Quantity, setQuantity] = useState(0);
    const [Data, setData] = useState(undefined);
    const [Loading, setLoading] = useState(false);
    const { Show, Id, onClose } = props;
    const HandleClose = () => {
        onClose();
    }

    useEffect(() => {
        if (Show === true) {
            setLoading(true);
            httpClient.get(CLOTH + `/${Id}`)
                .then((result) => {
                    setLoading(false);
                    if (result.status === 200) {
                        const Data = result.data;
                        setData({
                            _id: Data._id,
                            name: Data.name,
                            image: Data.imagePaths,
                            price: Data.price,
                            discount: Data.discount,
                            category: Data.category,
                            description: Data.description,
                            sizes: Data.sizes,
                            code: Data.code
                        });
                    }
                }).catch((err) => {
                    setLoading(false);
                    Notification.ShowError("Error 500", err.message);
                    console.error(err);
                });
        }
    }, [Show])

    return (
        <Drawer closable open={Show} onClose={HandleClose}>
            <Spin spinning={Loading}>
                <Typography.Title level={4}>
                    Select option
                </Typography.Title>
                <div>
                    {
                        Data &&
                        <Image className='M-Aspect object-fit-contain' src={Data.image[0]} ></Image>
                    }
                </div>
                <Typography.Title level={4} className='mt-3'>
                    {Data && Data.name}
                </Typography.Title>
                {Data &&
                    <ProductDetailInput onClose={onClose} Data={Data} Size={Size} setSize={setSize} Quantity={Quantity} setQuantity={setQuantity} />
                }
            </Spin>
        </Drawer>
    )
}


export default ProductDetailDrawer;