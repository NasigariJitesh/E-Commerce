import React, { useEffect, useState } from 'react'
import Base from './Base';
import { getCategories } from '../admin/helper/adminapicall';
import {getProductsByCategories} from './helper/coreapicalls';
import CategoryProducts from './CategoryProducts';
import { Avatar, Box, Grid, makeStyles, Typography } from '@material-ui/core';
import { deepOrange } from '@material-ui/core/colors';
const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    orange: {width: theme.spacing(3),
        height: theme.spacing(3),
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    }
}));
const Categories = () => {
    const classes = useStyles();
    const [categories, setCategories] = useState([]);
    const [filteredProducts,setFilteredProducts]=useState([]);
    const preload = () => {
        getCategories().then(data => {
            if (data.error) {
            console.log(data.error);
            } else {
                setCategories(data);
            }
        });
    };

  useEffect(() => {
    preload();
  }, []);
  const filterProducts=(categoryId)=>{
      console.log(categoryId);
      getProductsByCategories(categoryId)
      .then(data=>{
        setFilteredProducts(data);
      })
  }
  const renderSelectCategories=()=>{
      return (
        <Box>              
            <Typography variant='h4' component='h3'>
            All categories:
            </Typography>
            <Grid container>
                    {categories.map((category, index)=>{
                        return(
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4} >
                            <div onClick={()=>filterProducts(category._id)} key={index} >
                            <Typography variant='h6' component='h5'><Avatar className={classes.orange}>{category.name.charAt(0)}</Avatar>
                            {category.name}
                            </Typography>
                            </div>
                            </Grid>
                        );
                    })}
            </Grid>
        </Box>

      )
  }
    return (
        
        <Base>
            {filteredProducts.length>0?<CategoryProducts filterProducts={filteredProducts}/>:
            renderSelectCategories()
            }
        </Base>
    )
}

export default Categories;
