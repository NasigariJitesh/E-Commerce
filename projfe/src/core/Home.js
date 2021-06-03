import { Box, Button, Container, Grid, GridList, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import "../styles.css";
import Base from './Base';
import Card from './card';
import { getProducts } from './helper/coreapicalls';
const useStyles = makeStyles((theme) => ({
    scrollable: {
        overflow: "auto"
      }
}));
let page=1;
export default function Home() {
    const classes = useStyles();
    const [products, setProducts] = useState([]);
    const [error,setError]= useState(false);
    
    const loadAllProducts=()=>{
        getProducts(page).then(
            res=>{
                if(res.error){
                    setError(res.error);
                }
                else{
                    setProducts(res);
                }
            }
        );
    };
    useEffect(() => {
        loadAllProducts();
    }, [])
    const search=(itemName)=>{
        let filteredProducts=products.filter(product=>product.name.toLowerCase().includes(itemName.target.value.toLowerCase()));
        setProducts(filteredProducts);
        if(itemName.target.value==='')loadAllProducts()
    }
    
    return (
        <Base filterSearch={(query)=>search(query)} title="Home Page">
          
            <Grid container spacing={1} > 
                {products.map((product,index)=>{
                    return(
                        <Grid item key = {index} xs={12} sm={12} md={6} lg={4} xl={4}>
                            <Card product={product} showcategory={true} addtoCart={true} admin={false} removefromCart={false}/>
                        </Grid>                
                    )}
                )}
                
            </Grid>  
            <Grid container spacing={1}>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} >
            <Box display="flex" flexDirection="row">
                <Button disabled={page<=1} onClick={()=>{page = page-1;loadAllProducts(page); window.scrollTo(0, 0);}}>Previous</Button>
            </Box>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} >
            <Box display="flex" flexDirection="row-reverse">
                <Button disabled={products.length<12} onClick={()=>{page = page+1; loadAllProducts(page);window.scrollTo(0, 0);} }>Next</Button>
            </Box>
            </Grid>
            </Grid> 
        </Base>
    );
}
