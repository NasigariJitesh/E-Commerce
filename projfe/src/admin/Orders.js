import React, { useEffect, useState } from 'react';
import { isAuthenticated } from '../auth/helper';
import Base from '../core/Base';
import { getOrders, updateStatus } from './helper/adminapicall';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { FormControl, InputBase, MenuItem, Select } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
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
const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  });

  const { user, token } = isAuthenticated();
  
  
  
  
const Orders=()=>{
    const [orders, setOrders] = useState([]);
    
  
  function Row(props ) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const [editmode,setEditmode]=useState(false);
    const [status,setStatus]=useState(row.status);
    const classes = useRowStyles();
    const handleChange=event=>{
      setStatus(event.target.value);
    }
    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell >{row._id}</TableCell>
          <TableCell >{row.transaction_id}</TableCell>
          <TableCell >{row.user.name}</TableCell>
          <TableCell >
            
            {editmode ? <FormControl fullWidth = {true}><Select name="status" value={status} onChange={handleChange} id="status" input={<BootstrapInput />}>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Processing">Processing</MenuItem>
            <MenuItem value="Received">Received</MenuItem>
        </Select></FormControl>: status }
            
          </TableCell>
          <TableCell >{editmode?(<IconButton color='default' onClick={()=>{
                updateStatus(row._id,user._id,token,status);
                setEditmode(false);
            }}>
                <CheckCircleOutlineIcon />
                </IconButton>):(<IconButton color='default' onClick={()=>{setEditmode(true)}}>
                <EditIcon />
                </IconButton>)
            }</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Product Count</TableCell>
                      <TableCell >Amount</TableCell>
                      <TableCell >Total</TableCell>
                      <TableCell wrap >Address</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                        {row.product.name}
                    </TableCell>
                    <TableCell >{row.product.count}</TableCell>
                    <TableCell >{row.product.price}</TableCell>
                    <TableCell >
                        {Math.round(row.amount) / 100}
                    </TableCell>
                    <TableCell wrap>{row.address.name}<br/>{row.address.address.line1}<br/>
                    {row.address.address.city}-{row.address.address.postal_code}<br/>{row.address.address.country}
                    </TableCell>
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
    
    const preload = () => {
        getOrders(user._id, token).then(data => {
            if (data.error) {
            console.log(data.error);
            } else {
                setOrders(data);
            }
        });
    };

  useEffect(() => {
    preload();
  }, []);
 
  return (
    <Base >
        <h2>Orders</h2>
        <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
            <TableHead>
            <TableRow>
                <TableCell />
                <TableCell>Order Id</TableCell>
                <TableCell >Transaction Id</TableCell>
                <TableCell >User Name</TableCell>
                <TableCell >Status</TableCell>
                <TableCell ></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {orders.map((order,index) => (
                <Row key={index} row={order} />
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    </Base>
    )
}

export default Orders;