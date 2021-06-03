import { Box, Button, Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/helper';
import Base from '../core/Base';
import { deleteProduct, getProductsByUser } from './helper/adminapicall';
import Card from '../core/card';
let page=1;
const ManageProducts=()=>{

    const [products, setProducts] = useState([]);
    const {user,token} = isAuthenticated();

    const preload = ()=>{
        //console.log(user._id);
        getProductsByUser(user._id,token,page).then(
            res=>{
                if(res.error){
                    console.log("Error in loading all products",res.err);
                }
                else{
                    setProducts(res);
                }
            }
        )
    }
    useEffect(() => {
        preload();
    }, []);
    
    return (
        <Base > 
            <Grid container spacing={1}> 
                {products.map((product,index)=>{
                    return(
                        <Grid item key = {index} xs={12} sm={12} md={6} lg={4} xl={4}>
                            <Card product={product} admin={true} addtoCart={false} removefromCart={false}/>
                        </Grid>                
                    )}
                )}
            </Grid>
            <Grid container spacing={1}>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} >
            <Box display="flex" flexDirection="row">
                <Button disabled={page<=1} onClick={()=>{page = page-1;getProductsByUser(user._id,token,page);}}>Previous</Button>
            </Box>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} >
            <Box display="flex" flexDirection="row-reverse">
                <Button disabled={products.length<12} onClick={()=>{page = page+1; getProductsByUser(user._id,token,page);}}>Next</Button>
            </Box>
            </Grid>
            </Grid>  
        </Base>
    )
}

export default ManageProducts;
