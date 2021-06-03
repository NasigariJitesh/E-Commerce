import React, { useEffect, useState } from "react";
import { isAuthenticated } from '../auth/helper';
import { Redirect } from 'react-router-dom';
import { getCategories, getProduct, updateProduct } from './helper/adminapicall';
import Base from '../core/Base';
import { Box, Button, FormControl, Grid, InputLabel, OutlinedInput, Snackbar } from '@material-ui/core';
import UpdateIcon from '@material-ui/icons/Update';
import Alert from '@material-ui/lab/Alert';

const UpdateProduct=({match})=>{
    const {user,token}=isAuthenticated();
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        photo:"",
        categories:[],
        category:"",
        error:"",
        loading:false,
        createdProduct:"",
        didRedirect:false,
        formdata:""
    });

  const { name, description, price, stock,error,loading,createdProduct,didRedirect,formdata } = values;
  const preload=(productId)=>{
    getProduct(productId).then(res=>{
      if(res.error){
        setValues({...values, error:res.error});
      }
      else{
        preloadCategories();
        setValues({...values, 
            name: res.name,
            description: res.description,
            price: res.price,
            stock: res.stock,
            category:res.category._id,
            loading:false,
            formdata:new FormData()
        });
      }
    });
  };

  useEffect(() => {
    preload(match.params.productId);  
  },[]);
  const handleClose = (event, reason) => {
    setOpen(false);
    
  };
  const onSubmit = event => {
    event.preventDefault();
    setOpen(true);
    setValues({ ...values, error: "", loading: true });

    updateProduct(match.params.productId, user._id, token, formdata).then(
      data => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            description: "",
            price: "",
            photo: "",
            stock: "",
            loading: false,
            createdProduct: data.name,
            didRedirect:true
          });
        }
      }
    );
  };
  const preloadCategories=()=>{
      getCategories().then(res=>{
        if(res.error){
          setValues({...values, error:res.error});
        }
        else{
          setValues({
            categories:res,
            formdata:new FormData()
          });
        }
      })
  }
  const handleChange = fieldname=> event=>{
    const fieldvalue = (fieldname === "photo" ? event.target.files[0] : event.target.value);
    formdata.set(fieldname,fieldvalue);
    setValues({...values, [fieldname]:fieldvalue});
  };
  const loadingMessage= () =>{
    return(
      <Snackbar open={(open && loading)} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="info">
                Loading....
            </Alert>
        </Snackbar>
    );
  };
  const successMessage= () =>{
    return(
        <Snackbar open={(open && createdProduct)} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
                {createdProduct} Added Successfuly
            </Alert>
        </Snackbar>
    );
};
const errorMessage= () =>{
    return(
        <Snackbar open={(open && error)} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
                {error}
            </Alert>
        </Snackbar>
    );
};
  const performRedirect = ()=>{
    setTimeout(3000);
    if(didRedirect){
        return <Redirect to="/admin/products"/>
    }
}
  const createProductForm = () => (
    <Box m={3}>
      <form>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="component-outlined" shrink>Name</InputLabel>
            <OutlinedInput id="component-outlined" value={name} onChange={handleChange("name")} label="Name" />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="component-outlined" shrink>Description</InputLabel>
            <OutlinedInput id="component-outlined" value={description} onChange={handleChange("description")} label="Description" />
          </FormControl>          
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <FormControl variant="outlined" fullWidth >
            <InputLabel htmlFor="component-outlined" shrink>Price</InputLabel>
            <OutlinedInput id="component-outlined" type={Number} value={price} onChange={handleChange("price")} label="Price" />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <FormControl variant="outlined" fullWidth >
            <InputLabel htmlFor="component-outlined" shrink>Stock</InputLabel>
            <OutlinedInput id="component-outlined" type={Number} value={stock} onChange={handleChange("stock")} label="Stock" />
          </FormControl>
        </Grid>
      </Grid>
    </form><br/>
    <Button variant="contained" color="primary"  startIcon={<UpdateIcon />} onClick={onSubmit}>
        Update Product
    </Button>
    </Box>
  );

  return (
      <Base>
        {successMessage()}
        {errorMessage()}
        {loadingMessage()}
        {createProductForm()}
        
        {performRedirect()}
      </Base>
      
  );
};


export default UpdateProduct;