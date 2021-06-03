import React from 'react'
import Base from './Base';
import { Grid, Typography } from '@material-ui/core';
import Card from './card'
const CategoryProducts=(props)=> {
    return (
        <div>
        <Grid container spacing={1}> 
            {props.filterProducts.map((product,index)=>{
                return(
                    <Grid item key = {index} xs={12} sm={12} md={6} lg={4} xl={4}>
                        {product ?
                        <Card product={product} showcategory={false} addtoCart={true} admin={false} removefromCart={false}/> : 
                        <Typography varaiant='h3' componenet='h2'>No Products Are Available in the selected category</Typography>}
                    </Grid>                
                )}
            )}
        </Grid>   
    </div>
    )
}
export default CategoryProducts;
