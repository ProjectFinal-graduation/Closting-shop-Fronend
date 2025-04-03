import { Breadcrumb } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';

export default function CategoryBreadcrumb({ CurrentCategory, Category, Child }) {
    const location = useLocation();
    const [itemBreadcrumb, setitemBreadcrumb] = useState([{
        title: <Link style={{ textDecoration: 'none' }} to={'/'}>Home</Link>,
    },
    {
        title: Category.name,
    }]);
    useEffect(() => {
        const Data = [{
            title: <Link style={{ textDecoration: 'none' }} to={'/'}>Home</Link>,
        },
        {
            title: Category.name,
        }];
        if (location.pathname.split('/')[3] !== undefined)
            Data.push({
                title: CurrentCategory,
            })
        setitemBreadcrumb([...Data]);
    }, [CurrentCategory])
    return (
        <div className='p-3 d-none d-lg-flex justify-content-end'>
            <Breadcrumb
                items={itemBreadcrumb}
            />
        </div>
    )
}
