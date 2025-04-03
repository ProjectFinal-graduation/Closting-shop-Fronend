import { Form, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { GetRequired } from '../../../Asset/Validated/Validated';
import { Notification } from '../../../Asset/ShowNotification';
import { connect } from 'react-redux';
import httpClient from '../../../Utils/request';
import { CLOTH } from '../../../Config/Admin';

function SizesSelect(props) {
    const { mode, Name, Id } = props;
    const { Token, Role } = props;
    const [Data, setData] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [Sizes, setSizes] = useState([{
        value: "XS",
        label: "XS"
    },
    {
        value: "S",
        label: "S"
    },
    {
        value: "M",
        label: "M"
    },
    {
        value: "L",
        label: "L"
    },
    {
        value: "XL",
        label: "XL"
    },
    {
        value: "XXL",
        label: "XXL"
    }]);
    useEffect(() => {
        setLoading(true);
        if (Token !== "") {
            if (Id !== undefined) {
                httpClient.get(CLOTH + `/${Id}`)
                    .then((res) => {
                        setLoading(false)
                        if (res.status === 200) {
                            // setData({ ...res.Data });
                            const Temp = [];
                            res.data.sizes.forEach((item) => {
                                Temp.push({
                                    value: item,
                                    label: item
                                });
                            })
                            setData([...Temp]);
                        } else {
                            setData(undefined);
                            Notification.ShowError("Error", res.Message);
                        }
                    }).catch((err) => {
                        setLoading(false);
                        console.log(err);
                    });
            } else {
                setLoading(false);
                setData([...Sizes]);
            }
        }
    }, [Id, Token])

    return (
        <Form.Item label="Sizes" name={Name} rules={[{
            ...GetRequired("Sizes")
        }]}>
            <Select loading={Loading} options={Data} placeholder="Sizes" mode={mode}
                showSearch autoClearSearchValue
                allowClear />
        </Form.Item>
    )
}


const mapDispatchToProps = (dispatch) => ({ dispatch })

const mapStateToProps = (state) => ({
    Token: state.TokenReducer.Token,
    Role: state.TokenReducer.Role
})
export default connect(mapStateToProps, mapDispatchToProps)(SizesSelect);