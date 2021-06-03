import { Avatar, Box, Collapse, FormControl, Grid, IconButton, InputLabel, makeStyles, OutlinedInput, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { deepOrange } from '@material-ui/core/colors';
import React, { useEffect, useState } from 'react'
import { isAuthenticated } from '../auth/helper';
import Base from '../core/Base'
import { getUser, updateUser } from './helper/userapicalls';
import EditIcon from '@material-ui/icons/Edit';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Alert from '@material-ui/lab/Alert';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
      },
    large: {
      width: theme.spacing(15),
      height: theme.spacing(15),
      color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
    },
  }));
  const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  });
const {user,token} = isAuthenticated();
function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
  
    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>   
          <TableCell >{row.name}</TableCell>
          <TableCell >{row.quantity}</TableCell>
          <TableCell >{Math.round(row.amount) / 100}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell >Transaction Id</TableCell>
                      <TableCell>Category Name</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  <TableRow>
                  
                    <TableCell component="th" scope="row">
                        {row.transaction_id}
                    </TableCell>
                    <TableCell >{row.category.name}</TableCell>
                    <TableCell wrap >{row.description}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
const Profile=({match})=>{
    const classes = useStyles();
    const [values, setValues] = useState({
        name:"",
        lastname:"",
        email:"",
        purchases:[],
        role:"",
        error:"",
    });
    const [editmode,setEditmode]=useState(false);
    const [msgopen, setmsgOpen] = React.useState(false);
    const [success,setsuccess]=useState(false);
    const preload=(userId)=>{
        getUser(userId,token).then(userprofile => {
            if (userprofile.error) {
               setValues({...values, error: userprofile.error});
            } else {
                setValues({
                    ...values,
                    name:userprofile.name,
                    lastname:userprofile.lastname,
                    email:userprofile.email,
                    purchases:userprofile.purchases,
                    role:userprofile.role,
                    error:"",
                })
                
            }
        });
      };
    
      useEffect(() => {
        preload(match.params.userId);  
      },[]);
    const handleChange = fieldname=> event=>{
        setValues({...values, [fieldname]:event.target.value});
    };
    const handleClose = (event, reason) => {
        setmsgOpen(false);
        
      };
     
    const successMessage= () =>{
        return(
            <Snackbar open={(msgopen && success)} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Profile Updated Successfuly
                </Alert>
            </Snackbar>
        );
    };
    const errorMessage= () =>{
        return(
            <Snackbar open={(msgopen && values.error)} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    {values.error}
                </Alert>
            </Snackbar>
        );
    };
    const updateuser=()=>{
        updateUser(user._id,token,values).then(userprofile=>{
            if (userprofile.error) {
                setValues({...values, error: userprofile.error});
            } else {
                setValues({
                     ...values,
                     name:userprofile.name,
                     lastname:userprofile.lastname,
                     email:userprofile.email,
                     purchaselist:userprofile.purchaselist,
                     role:userprofile.role,
                     error:"",
                })
                setsuccess(true);
            }
        })
    }
    
    const purchasetable=()=>{
        return(
            <Box m={2}>
            <h2>Purchases</h2>
          <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
              <TableHead>
              <TableRow>
                  <TableCell />
                  <TableCell >Product Name</TableCell>
                  <TableCell >Count</TableCell>
                  <TableCell>Amount</TableCell>
              </TableRow>
              </TableHead>
              <TableBody>
              {values.purchases.map((purchase,index) => (
                  <Row key={index} row={purchase} />
              ))}
              </TableBody>
          </Table>
          </TableContainer>
          </Box>
        )
    }
    const userprofile=()=>{
        return(
        <Box m={3} >
            
        <form>
        <Grid container alignItems='flex-end' spacing={2}>
            <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
            </Grid>
            <Grid item  xs={1} sm={1} md={1} lg={1} xl={1}>
            {!editmode&&(<IconButton color='default' onClick={()=>{setEditmode(true)}}>
                <EditIcon />
                </IconButton>)}
            {editmode&&(<IconButton color='default' onClick={()=>{
                updateuser();
                setmsgOpen(true);
                setEditmode(false);
            }}>
                <CheckCircleOutlineIcon />
                </IconButton>)}
            </Grid>
            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <Avatar className={classes.large}>{values.name.charAt(0)}{values.lastname ? values.lastname.charAt(0): ""}</Avatar>
            </Grid>
            <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
            <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="component-outlined1" shrink>Name</InputLabel>
                <OutlinedInput readOnly={!editmode} id="component-outlined1" value={values.name} onChange={handleChange("name")} label="Name" />
            </FormControl>          
            </Grid>
            <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
            <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="component-outlined2" shrink> Last Name</InputLabel>
                <OutlinedInput readOnly={!editmode} id="component-outlined2" value={values.lastname} onChange={handleChange("lastname")} label="Last Name" />
            </FormControl>          
            </Grid>
            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
            <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="component-outlined3" shrink> Role</InputLabel>
                <OutlinedInput readOnly={true} id="component-outlined3" value={values.role===1?"Seller":"User"} onChange={handleChange("lastname")} label="Role" />
            </FormControl>
            </Grid>
            <Grid item  xs={12} sm={12} md={10} lg={10} xl={10}>
            <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="component-outlined4" shrink> E-mail Address</InputLabel>
                <OutlinedInput readOnly={true} id="component-outlined4" value={values.email} onChange={handleChange("lastname")} label="E-mail Address" />
            </FormControl>          
            </Grid>
        </Grid>
        </form>
    </Box>
        )
    }
    return (
        <Base>
            {userprofile()}
            {purchasetable()}
            {successMessage()}
            {errorMessage()}
        </Base>
    )
};

export default Profile;
