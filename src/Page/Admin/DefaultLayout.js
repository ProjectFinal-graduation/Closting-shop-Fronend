import React, { useState } from 'react'
import '../../CSS/Admin.css';
import { Layout } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { LazyLoadImage } from 'react-lazy-load-image-component'
import ListMenu from '../../Component/Admin/Layout/ListMenu';
import { Outlet } from 'react-router';
import MenuDrawer from '../../Component/Admin/Drawer/MenuDrawer';
import { List_Image } from '../../Image/ListImage';

export default function DefaultLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [DrawerOpen, setDrawerOpen] = useState(false);
    return (
        <Layout className='M-Container'>
            <Layout.Sider className=' min-vh-100 bg-tranparent d-none d-md-block' collapsed={collapsed} collapsible trigger={null} theme='light'>
                <div className='min-vh-100 position-sticky top-0'>
                    <ListMenu />
                </div>
            </Layout.Sider>
            <Layout>
                <Layout.Header className='p-0'>
                    <div className='w-100 position-fixed top-0' style={{ zIndex: 200 }}>
                        <div className='M-Header'>
                            <div className='M-Logo-Container'>
                                <LazyLoadImage src={List_Image.Logo} className='M-Logo' />
                            </div>
                            <div className='M-Mobile-Drawer-Icon'>
                                <MenuOutlined className='M-Icon d-none d-md-block' onClick={() => setCollapsed(!collapsed)} />
                                <MenuOutlined className='M-Icon d-block d-md-none' onClick={() => { setDrawerOpen(true) }} />
                            </div>
                        </div>
                    </div>
                </Layout.Header>
                <Layout className='p-3 pt-4 mt-2 p-md-5 pt-md-4'>
                    <Layout.Content className='M-Content'>
                        <Outlet />
                    </Layout.Content>
                </Layout>
            </Layout>
            <MenuDrawer onClose={() => setDrawerOpen(false)} show={DrawerOpen} />
        </Layout>
    )
}
