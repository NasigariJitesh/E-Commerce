import React,{useState} from "react"
import Base from "../core/Base"
import {Link} from "react-router-dom"
import { signup } from "../auth/helper";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Box, Button, Grid, IconButton, InputAdornment, InputLabel, makeStyles, OutlinedInput, Snackbar, TextField, Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));
const Signup = ()=>{
    const classes = useStyles();
    const [values, setValues] = useState({
        name:"",
        lastname:"",
        email:"",
        password:"",
        error:"",
        success:false,
        showPassword: false,
    });

    const {name,lastname,email,password,error,success} = values;
    const [open, setOpen] = useState(false);
    const handleClose = (event, reason) => {
      setOpen(false);
      
    };
    const handleChange = fieldname=> event=>{
        setValues({...values, error:false, [fieldname]:event.target.value})
    };
    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
      };
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
    const onSubmit = event=>{
        setOpen(true);
        event.preventDefault();
        setValues({...values,error:false});
        signup({name,lastname,email,password})
        .then(res=>{
            if(res.error){
                setValues({...values, error:res.error,success:false})
            }   
            else{
                setValues({
                    name:"",
                    lastname:"",
                    email:"",
                    password:"",
                    error:"",
                    success:true
                })
            }
        })
        .catch((err)=>{console.log("error in signup")});
    }
    
    const signUpForm=()=>{
       return(
        <Box m={3}>
            <Typography component="h1" variant="h5">
                Sign up
            </Typography>
            <form className={classes.form} noValidate>
            <Grid container alignItems='center' spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                        autoComplete="fname"
                        name="name"
                        variant="outlined"
                        onChange={handleChange("name")}
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        value={name}
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                        autoComplete="lname"
                        name="lastname"
                        variant="outlined"
                        onChange={handleChange("lastname")}
                        required
                        fullWidth
                        id="firstName"
                        label="Last Name"
                        value={lastname}
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                    <TextField
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        onChange={handleChange("email")}
                        required
                        fullWidth
                        value={email}
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={values.showPassword ? 'text' : 'password'}
                        value={values.password}
                        onChange={handleChange('password')}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                        }
                        labelWidth={70}
                    />
                </Grid>
            </Grid>
            </form><br/>
            <Grid item xs={6} sm={6} md={4} lg={3} xl={3}>
            <Button type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={onSubmit}
            className={classes.submit}>
               Sign Up
            </Button>
            </Grid>
        </Box>

            /*<div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form>
                        <div className="form-group">
                            <label >Name</label>
                            <input className="form-control" onChange={handleChange("name")} value={name} type="text" />
                        </div>
                        <div className="form-group">
                            <label >E-mail</label>
                            <input className="form-control" onChange={handleChange("email")} value={email} type="email" />
                        </div>
                        <div className="form-group">
                            <label >Password</label>
                            <input className="form-control" onChange={handleChange("password")} value={password} type="password" />
                        </div>
                        <button onClick={onSubmit} className="btn-success btn-block">Sign Up</button>
                    </form>
                </div>
            </div>*/
       )
    }
    const successMessage= () =>{
        return(
            <Snackbar open={(success && open )} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                Account created successfully <Link to="/signin">Login Here</Link>
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
    return(
        <Base>
            {successMessage()}
            {errorMessage()}
            {signUpForm()}
        </Base>
    )
}
 export default Signup