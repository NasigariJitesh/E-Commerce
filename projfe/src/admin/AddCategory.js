import { Button, FormControl, FormHelperText, Grid, Input, InputLabel, Snackbar } from '@material-ui/core';
import React, { useState } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { isAuthenticated } from '../auth/helper';
import Base from '../core/Base';
import { createCategory } from './helper/adminapicall';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '50%',
    },
  },
  button: {
    margin: theme.spacing(1),
  },
}));


 
const AddCategory=()=>{
    const classes = useStyles();
    const [name, setName] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [open, setOpen] = useState(false);

    const{user,token} = isAuthenticated();
    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }
    const handleChange=event=>{
        setError("");
        setName(event.target.value)
    }
   
    const handleClose = (event, reason) => {
        setOpen(false);
        
      };
    const onSubmit= (event)=>{
        event.preventDefault();
        setError("");
        setSuccess(false);
        setOpen(true);
        createCategory(user._id,token,{name}).then(response=>{
                if(response.error){
                    setError(response.error);
                }
                else{
                    setError("");
                    setSuccess(true);
                    setName("");
                }
            }
        ).catch(err=>console.log("Error in creating category",err));
    }
    const successMessage= () =>{
        return(
            <Snackbar open={(open && success)} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Category created Successfuly
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
    const categoryForm=()=>(
        <Grid container xs={12} sm={12} md={6} lg={6} xl={6}>
        <FormControl fullWidth = {true}>
            <InputLabel htmlFor="Category">Category</InputLabel>
            <Input id="Category" aria-describedby="my-helper-text" onChange={handleChange}/>
            <FormHelperText id="my-helper-text">For Example: Painting</FormHelperText>
        </FormControl>
        <Button variant="contained" color="primary" className={classes.button} startIcon={<AddIcon />} onClick={onSubmit}>
            Add Category
        </Button>
        </Grid>
    )
    return (
        <div >
            <Base>
                {successMessage()}
                {errorMessage()}
                {categoryForm()}
                
            </Base>
        </div>
    )
}

export default AddCategory;
