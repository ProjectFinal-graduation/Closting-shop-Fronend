import { Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { Notification } from '../Asset/ShowNotification';
import httpClient from '../Utils/request';
import { CATEGORY } from '../Config/App';

export default function ListMenu({ isInline = false, onClose, HandleOrderValidate }) {
    const [Items, setItems] = useState(undefined);
    useEffect(() => {
        httpClient.get(CATEGORY)
            .then((result) => {
                const Temp = [];
                result.data.forEach((item) => {
                    const TempChild = [];
                    if (item.childs.length > 0) {
                        TempChild.push({
                            label: "ALL",
                            key: item._id + "/"
                        });
                        item.childs.forEach(child => {
                            TempChild.push({
                                label: child.name,
                                key: child._id,
                            });
                        })
                    }
                    Temp.push({
                        label: item.name,
                        key: item._id,
                        children: TempChild.length > 0 && TempChild
                    })
                })
                setItems([...Temp]);

            }).catch((err) => {
                Notification.ShowError("Error 505", "Internal Server Error");
            });;
    }, [])
    return (
        <Menu
            onClick={(value) => {
                if (value.keyPath.length > 1) {
                    if (isInline) onClose();
                    if (value.key.includes(value.keyPath[1]))
                        HandleOrderValidate(`/category/${value.keyPath[1]}`);
                    else
                        HandleOrderValidate(`/category/${value.keyPath[1]}/${value.keyPath[0]}`);
                }
                else {
                    if (isInline) onClose();
                    HandleOrderValidate(`/category/${value.key}`);
                }
            }}
            disabledOverflow={true}
            mode={isInline === true ? "inline" : 'horizontal'}
            items={
                Items
            } >
        </Menu >
    )
}
