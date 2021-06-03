import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import Base from './Base';
import Card from './card';
import { loadcart } from './helper/cartHelper';
import Stripecheckout from './Stripecheckout';

const Cart = () => {
    const [products, setProducts] = useState([]);
    const [reload, setReload] = useState(false);
    useEffect(() => {
        setProducts(loadcart());
    }, [reload])
    const loadTheCart=(products)=>{
        return(
            <Grid container spacing={1}>
                {products.map((product,index)=>(
                    <Grid item key = {index} xs={12} sm={12} md={6} lg={4} xl={4}>
                        <Card product={product} showcategory={true} addtoCart={false} admin={false} removefromCart={true}
                            setReload={setReload}
                            reload={reload}
                        />
                     </Grid>  
                ))}
            </Grid>  
        );
    }
    const checkout=()=>{
        return <Stripecheckout
            products={products}
            setReload={setReload}
            reload={reload}
        />
    }

    return (
        <Base title="" description="">
            <Grid item>{(products)?checkout():""}</Grid><br/>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>{(products && products.length>0)?loadTheCart(products):(<h4>No products in cart</h4>)}</Grid>
        </Base>
    )
}

export default Cart
