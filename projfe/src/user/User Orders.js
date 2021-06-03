import React, { useEffect, useState } from 'react';
import { isAuthenticated } from '../auth/helper';
import Base from '../core/Base';

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


import { getOrders } from './helper/userapicalls';


const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  });

  const { user, token } = isAuthenticated();
  
  
  
  
const UserOrders=()=>{
    const [orders, setOrders] = useState([]);
    
  
  function Row(props ) {
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
          <TableCell >{row._id}</TableCell>
          <TableCell >{row.transaction_id}</TableCell>
          <TableCell >{row.status}</TableCell>
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
                      <TableCell >Address</TableCell>
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
                    <TableCell >{row.address.name}<br/>{row.address.address.line1}<br/>
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
                <TableCell >Status</TableCell>
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


export default UserOrders;