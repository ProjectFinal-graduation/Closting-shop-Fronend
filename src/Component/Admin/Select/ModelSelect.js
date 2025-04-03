import React, { useEffect, useState } from 'react'
import { Form, Select } from 'antd';
import { GetRequired } from '../../../Asset/Validated/Validated';
import { connect } from 'react-redux';
import httpClient from '../../../Utils/request';
import { MODEL } from '../../../Config/Admin';

function ModelSelect(props) {
    const { Name, Token } = props;
    const [Data, setData] = useState([]);
    const [Loading, setLoading] = useState(true);
    useEffect(() => {
        if (Token !== "") {
            httpClient.get(MODEL)
                .then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        const Temp = [];
                        res.data.forEach(item => {
                            Temp.push({
                                label: item.name,
                                value: item._id + '/' + item.name
                            })
                        });
                        setData([...Temp]);
                    }
                })
                .catch(err => {
                    setLoading(false);
                    console.log(err);
                });
        }
    }, [Token])
    return (
        <Form.Item label="Model" name={Name} rules={[{
            ...GetRequired("Model")
        }]}>
            <Select loading={Loading} showSearch autoClearSearchValue placeholder='Model' options={Data} />
        </Form.Item>
    )
}


const mapDispatchToProps = (dispatch) => ({ dispatch })

const mapStateToProps = (state) => ({
    Token: state.TokenReducer.Token,
    Role: state.TokenReducer.Role
})

export default connect(mapStateToProps, mapDispatchToProps)(ModelSelect);