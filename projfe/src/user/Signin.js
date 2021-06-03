import React,{useState} from "react";
import Base from "../core/Base";
import {Link, Redirect} from "react-router-dom";
import { authenticate, isAuthenticated, signin } from "../auth/helper";
import { Box, Button, Grid, IconButton, InputAdornment, InputLabel, makeStyles, OutlinedInput, Snackbar, TextField, Typography } from "@material-ui/core";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
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
const Signin = ()=>{
    const classes = useStyles();
    const [values, setValues] = useState({
        email:"",
        password:"",
        error:"",
        loading:false,
        didRedirect:false,
        showPassword: false,
    });

    const {email,password,error,loading,didRedirect} = values;
    
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
        event.preventDefault();
        setOpen(true);
        setValues({...values,error:false,loading:true});
        signin({email,password})
        .then(res=>{
            if(res.error){
                setValues({...values,password:"", error:res.error,loading:false})
            }   
            else{
                authenticate(res,()=>{
                    setValues({
                       ...values,
                       didRedirect: true
                    })
                })
                
            }
        })
        .catch((err)=>{console.log("SignIn failed")});
    }

    const signInForm=()=>{
        return(
            <Box m={3}>
            <Typography component="h1" variant="h5">
                Sign In
            </Typography>
            <form className={classes.form} noValidate>
            <Grid container alignItems='center' spacing={2}>
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
            onClick={onSubmit}
            variant="contained"
            color="primary"
            className={classes.submit}>
               Sign In
            </Button>
            </Grid>
        </Box>
        );
    };
    const performRedirect = ()=>{
        if(didRedirect){return <Redirect to="/" />}
    }
    const loadingMessage= () =>{
        return(
          <Snackbar open={(open && loading)} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info">
                    Loading....
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
        <Base title="Sign In" description="A page for user to sign in">
            {loadingMessage()}
            {errorMessage()}
            {signInForm()}
            {performRedirect()}
            <p className="text-white text-center">{JSON.stringify(values)}</p>
        </Base>
    )
};
 export default Signin;