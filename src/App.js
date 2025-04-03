import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/js/dist/dropdown';
import "./App.css";
import 'swiper/css';
import 'swiper/css/scrollbar';

import 'react-lazy-load-image-component/src/effects/blur.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { Suspense } from 'react';
import CartDetail from './Page/Customer/CartDetail/CartDetail';
import CustomerInfo from './Page/Customer/CartDetail/CustomerInfo';
import OrderCompleted from './Page/Customer/CartDetail/OrderCompleted';

//Customer
const HomePage = React.lazy(() => import('./Page/Customer/HomePage'));

const CustomerDefaultPage = React.lazy(() => import('./Page/Customer/DefaultPage'));

const CartDetailPage = React.lazy(() => import('./Page/Customer/CartDetail/CartDetailPage'));

const ProductDetailPage = React.lazy(() => import('./Page/Customer/ProductDetail/ProductDetailPage'));

const CategoryPage = React.lazy(() => import('./Page/Customer/Category/CategoryPage'));

const RecentlyPage = React.lazy(() => import('./Page/Customer/RecentlyDetail/RecentlyPage'));

const SearchPage = React.lazy(() => import('./Page/Customer/SearchCloth/SearchCloth'));

//Admin
const Login = React.lazy(() => import('./Page/Admin/Login'));

const AdminDashboard = React.lazy(() => import('./Page/Admin/Dashboard/Dashboard'));

const AdminMiddleware = React.lazy(() => import('./Page/Admin/Middleware'));
const AdminDefaultPage = React.lazy(() => import('./Page/Admin/DefaultLayout'));

const AdminUser = React.lazy(() => import('./Page/Admin/User/User'));
const AdminUserForm = React.lazy(() => import('./Page/Admin/User/UserForm'));

const AdminModel = React.lazy(() => import('./Page/Admin/Model/Model'));
const AdminModelForm = React.lazy(() => import('./Page/Admin/Model/ModelForm'));

const AdminOrder = React.lazy(() => import('./Page/Admin/Order/Order'));
const AdminOrderForm = React.lazy(() => import('./Page/Admin/Order/OrderForm'));

const AdminCloth = React.lazy(() => import('./Page/Admin/Cloth/Cloth'));
const AdminClothForm = React.lazy(() => import('./Page/Admin/Cloth/ClothForm'));

const AdminCategory = React.lazy(() => import('./Page/Admin/Category/Category'));
const AdminCategoryForm = React.lazy(() => import('./Page/Admin/Category/CategoryForm'));

const AdminDressCollection = React.lazy(() => import("./Page/Admin/DressCollection/DressCollection"));
const AdminDressCollectionForm = React.lazy(() => import("./Page/Admin/DressCollection/DressCollectionForm"));

const AdminBanner = React.lazy(() => import('./Page/Admin/Banner/Banner'));
const AdminBannerForm = React.lazy(() => import('./Page/Admin/Banner/BannerForm'));

const AdminManageOrder = React.lazy(() => import('./Page/Admin/Manage Order/ManageOrder'));

const AdminProvince = React.lazy(() => import('./Page/Admin/Province/Province'));

const Error404 = React.lazy(() => import('./Page/404/Error404'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Suspense> <CustomerDefaultPage></CustomerDefaultPage></Suspense>}>
          <Route index element={<Suspense> <HomePage /></Suspense>}></Route>
          <Route path='product/:name' element={<Suspense> <ProductDetailPage /> </Suspense>}></Route>
          <Route path='order' element={<Suspense> <CartDetailPage /></Suspense>}>
            <Route index path='cart' element={<Suspense><CartDetail /></Suspense>}></Route>
            <Route path='profile' element={<Suspense><CustomerInfo /></Suspense>}></Route>
            <Route path='completed' element={<Suspense><OrderCompleted /></Suspense>}></Route>
          </Route>
          <Route path='view-Recently' element={<Suspense><RecentlyPage /></Suspense>} />
          <Route path='category/:name/:child' element={<Suspense><CategoryPage /></Suspense>}></Route>
          <Route path='category/:name' element={<Suspense><CategoryPage /></Suspense>}></Route>
          <Route path='search/:search' element={<Suspense><SearchPage /></Suspense>}></Route>
        </Route>

        <Route path='/admin' element={<Suspense><AdminMiddleware /></Suspense>}>
          <Route path='' element={<Suspense><AdminDefaultPage /></Suspense>}>
            <Route index path='dashboard' element={<Suspense><AdminDashboard /></Suspense>}></Route>

            <Route path='banner' element={<Suspense><AdminBanner /></Suspense>}></Route>
            <Route path='banner-Form' element={<Suspense><AdminBannerForm /></Suspense>}></Route>

            <Route path='dress-collection' element={<Suspense><AdminDressCollection /></Suspense>}></Route>
            <Route path='dress-collectionForm' element={<Suspense><AdminDressCollectionForm /></Suspense>}></Route>

            <Route path='user' element={<Suspense><AdminUser /></Suspense>}></Route>
            <Route path='user-form' element={<Suspense><AdminUserForm /></Suspense>}></Route>
            <Route path='user-edit/:id' element={<Suspense><AdminUserForm /></Suspense>}></Route>

            <Route path='cloth' element={<Suspense><AdminCloth /></Suspense>}></Route>
            <Route path='cloth-form' element={<Suspense><AdminClothForm /></Suspense>}></Route>
            <Route path='cloth-edit/:id' element={<Suspense><AdminClothForm /></Suspense>}></Route>

            <Route path='model' element={<Suspense><AdminModel /></Suspense>}></Route>
            <Route path='model-form' element={<Suspense><AdminModelForm /></Suspense>}></Route>
            <Route path='model-edit/:id' element={<Suspense><AdminModelForm /></Suspense>}></Route>

            <Route path='category' element={<Suspense><AdminCategory /></Suspense>}></Route>
            <Route path='category-form' element={<Suspense><AdminCategoryForm /></Suspense>}></Route>
            <Route path='category-edit/:id' element={<Suspense><AdminCategoryForm /></Suspense>}></Route>

            <Route path='province' element={<Suspense><AdminProvince /></Suspense>}></Route>

            <Route path='order' element={<Suspense><AdminOrder /></Suspense>}></Route>
            <Route path='order-form' element={<Suspense><AdminOrderForm /></Suspense>}></Route>
            <Route path='manage-order/:id' element={<Suspense><AdminManageOrder /></Suspense>}></Route>
          </Route>
          <Route path='login' element={<Suspense><Login /></Suspense>}></Route>
        </Route>
        <Route path='*' element={<Suspense><Error404 /></Suspense>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
