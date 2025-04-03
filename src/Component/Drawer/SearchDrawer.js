import { CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { Drawer, Typography, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import ProductView from '../Customer/ProductView';
import httpClient from '../../Utils/request';
import { CLOTH } from '../../Config/App';

export default function SearchDrawer({ HandleOrderValidate, onClose, show }) {
    const [dataSource, setdataSource] = useState([]);
    const [typingTimer, settypingTimer] = useState();
    const [Search, setSearch] = useState("");
    const [Loading, setLoading] = useState(false);
    const HandleSearch = () => {
        if (Search !== "") {
            try {
                setLoading(true);
                httpClient.get(CLOTH + `?search=${Search}&pageNo=${1}&pageSize=${20}`)
                    .then((res) => {
                        setLoading(false);
                        if (res.status === 200) {
                            const Options = [];
                            res.data.forEach((item, index) => {
                                res.data[index].image = item.imagePaths[0];
                                Options.push({
                                    title: "",
                                    label: JSON.stringify(res.data[index]),
                                    value: res.data[index]._id + "/" + res.data[index].name + "/" + res.data[index].code
                                });
                            })
                            setdataSource([...Options]);
                        }
                        else {
                            setdataSource([]);
                        }
                    }).catch((err) => {
                        setLoading(false);
                        console.log(err);
                    });
            }
            catch (err) {
                console.log(err);
            }
        } else {
            setdataSource([]);
        }
    }

    const HandleChangeValue = (value) => {
        setSearch(value);
    }
    const HandleRender = (record) => {
        const Data = JSON.parse(record.label);
        return <ProductView Data={Data} />
    }

    const HandleSelected = (Data) => {
        HandleOrderValidate("/product/" + Data.split('/')[0]);
        setdataSource([]);
        onClose();
    }

    const HandleSearchAll = () => {
        if (Search !== "") {
            HandleOrderValidate("/search/" + Search);
            setdataSource([]);
            onClose();
        }
    }

    useEffect(() => {
        clearTimeout(typingTimer);
        settypingTimer(setTimeout(HandleSearch, 500));
    }, [Search])

    return (
        <Drawer style={{ overflow: "visible" }} open={show} placement='top' closeIcon={false} onClose={onClose} className='d-flex'>
            <CloseOutlined onClick={onClose} className='position-absolute' style={{ fontSize: 30, right: 25, top: 25, fontWeight: 400 }} />
            <div className='h-100 w-100 d-flex justify-content-center align-items-center'>
                <div className='M-Search-Input-Container d-flex flex-column justify-content-center align-items-center'>
                    <div className='text-center'>
                        <Typography.Title level={2} className='fw-bold'>SEARCH</Typography.Title>
                    </div>
                    <div className='M-Search-Input p-0 pt-lg-3 pb-lg-3 d-flex mt-3' style={{ borderBottom: "1px solid black" }}>
                        <Select value={""} onBlur={(event) => { event.preventDefault(); setSearch(Search); }} onSelect={HandleSelected} loading={Loading} showSearch onSearch={HandleChangeValue} optionRender={HandleRender} options={dataSource} className='w-100 border-0 M-Search-Select' />
                        <SearchOutlined onClick={HandleSearchAll} style={{ fontSize: 25 }} />
                    </div>
                </div>
            </div>
        </Drawer>
    )
}
