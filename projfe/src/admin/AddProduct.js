import React, { useEffect, useState } from "react";
import { createProduct, getCategories } from './helper/adminapicall';
import { isAuthenticated } from '../auth/helper';
import { Redirect } from 'react-router-dom';
import Base from '../core/Base';
import {  withStyles } from '@material-ui/core/styles';
import { Box, Button, FormControl, FormHelperText, Grid, Input, InputBase, InputLabel, MenuItem, Select, Snackbar } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import Alert from "@material-ui/lab/Alert";
const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  button: {
    margin: theme.spacing(1),
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);



const AddProduct = () => {
  const {user,token}=isAuthenticated();
  
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
  const [open, setOpen] = useState(false);
  const { error,categories,loading,createdProduct,didRedirect,formdata } = values;
  const preload=()=>{
    getCategories().then(res=>{
      if(res.error){
        setValues({...values, error:res.error});
      }
      else{
        setValues({...values, categories:res,formdata: new FormData()});
      }
    });
  };

  useEffect(() => {
    preload();  
  },[]);
  const handleClose = (event, reason) => {
    setOpen(false);
    
  };
  const onSubmit = (event) => {
    
    event.preventDefault();
    setOpen(true);
    setValues({...values, error:"", loading:true});
    
    createProduct(user._id,token,formdata).then(res=>{
      if(res.error){
        setValues({...values, loading:false, error:res.error});
      }
      else{
        setValues({...values, name: "",
        description: "",
        price: "",
        stock: "",
        photo:"",
        loading:false,
        createdProduct:res.name,
        didRedirect:true,
      });
      }
    });
  };

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
    if(didRedirect){
      return <Redirect to="/admin/products"/>
    } 
  }
  const createProductForm = () => (
    <Box m={3}>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <InputLabel >
          <InputBase onChange={handleChange("photo")} type="file" name="photo" accept="image" placeholder="choose a file"/>
        </InputLabel>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <FormControl fullWidth = {true}>
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input id="name" name="name" aria-describedby="my-helper-text" onChange={handleChange("name")}/>
            <FormHelperText id="my-helper-text">Your Product Name </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <FormControl fullWidth = {true}>
            <InputLabel htmlFor="description">Description</InputLabel>
            <Input id="description" name="description" aria-describedby="my-helper-text" onChange={handleChange("description")}/>
            <FormHelperText id="my-helper-text">Wite About Your Product</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <FormControl fullWidth = {true}>
            <InputLabel htmlFor="price">Price</InputLabel>
            <Input id="price" name="price" type="Number" aria-describedby="my-helper-text" onChange={handleChange("price")} inputProps={{ min: "0", step: "10" }}/>
            <FormHelperText id="my-helper-text">Price in Rupees</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <FormControl fullWidth = {true}>
            <InputLabel htmlFor="stock">Stock</InputLabel>
            <Input id="stock" name="stock" type="Number" aria-describedby="my-helper-text" onChange={handleChange("stock")} inputProps={{ min: "0", step: "10" }}/>
            <FormHelperText id="my-helper-text">Total Stock Available for Sale</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <FormControl fullWidth = {true}>
        
        <Select name="category" onChange={handleChange("category")} id="category" input={<BootstrapInput />}>
        {categories &&
          categories.map((category,index)=>(
            <MenuItem key={index} value={category._id}>{category.name}</MenuItem>
          ))}
        </Select>
            <FormHelperText id="category">Select a category</FormHelperText>
        </FormControl>
      </Grid>
      
    </Grid>
    <Button variant="contained" color="primary"  startIcon={<AddIcon />} onClick={onSubmit}>
    Add Product
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

export default AddProduct;

