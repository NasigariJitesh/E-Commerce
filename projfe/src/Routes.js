import React from 'react';
import {BrowserRouter,Switch,Route} from 'react-router-dom';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';
import Categories from './core/Categories';
import ManageProducts from './admin/ManageProducts';
import Orders from './admin/Orders';
import UpdateProduct from './admin/UpdateProduct';
import AdminRoute from './auth/helper/AdminRoutes';
import PrivateRoute from './auth/helper/PrivateRoutes';
import Cart from './core/Cart';
import Home from "./core/Home";
import Signin from './user/Signin';
import Signup from './user/Signup';
import Profile from './user/Profile';
import UserOrders from './user/User Orders';


export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/cart" exact component={Cart} />
                <Route path="/signup" exact component={Signup} />
                <Route path="/signin" exact component={Signin} />
                <Route path="/profile/:userId" exact component={Profile} />
                <Route path="/category" exact component={Categories} />
                <AdminRoute path="/admin/create/category" exact component={AddCategory} />
                <AdminRoute path="/admin/create/product" exact component={AddProduct} />
                <AdminRoute path="/admin/products" exact component={ManageProducts} />
                <AdminRoute path="/admin/product/update/:productId" exact component={UpdateProduct} />
                <AdminRoute path="/admin/orders" exact component={Orders} />
                <PrivateRoute path="/user/orders" exact component={UserOrders} />
            </Switch>
        </BrowserRouter>
    );
}


