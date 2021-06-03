import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth/helper'
import StripeCheckout from "react-stripe-checkout"
import { API } from '../backend'
import { cartEmpty } from './helper/cartHelper'
import { createOrder, payment } from './helper/coreapicalls'
import PaymentIcon from '@material-ui/icons/Payment';
import { Button, Chip, Typography } from '@material-ui/core'



const Stripecheckout = (
    {products,
    setReload=f=>f,
    reload=undefined
}) => {
    const [data, setData] = useState({
        loading:"false",
        error:"",
        success:false,
        address:""
    })
    const usertoken=isAuthenticated()&&isAuthenticated().token;
    const userId=isAuthenticated()&&isAuthenticated().user._id;
    const getTotalPrice=()=>{
        let total = 0;
        products.map(product=>{
            total= total+(product.price*product.count);
        });
        return total;
    }
    const makePayment=token=>{
        payment(token,products).then(response=>{
            console.log("payment",response);
            const orderData= {
                products:products,
                transaction_id: response.id,
                amount: response.amount,
                address:{
                    name:response.billing_details.name,
                    address:response.billing_details.address
                }
            }
            createOrder(userId,usertoken,orderData);
            cartEmpty(()=>{
                console.log("emptying cart")
            });
            setReload(!reload);
        }).catch(err => console.log(err));
    }
    const showStripebutton=()=>{
        return isAuthenticated() ?(
            <StripeCheckout
                stripeKey={process.env.REACT_APP_STRIPE}
                token={makePayment}
                amount={getTotalPrice()*100}
                name="Pay Now"
                currency="inr"
                shippingAddress
                billingAddress>
                <Button color="primary" variant="contained" startIcon={<PaymentIcon /> }>Pay with Stripe</Button>
            </StripeCheckout>
        ):(
            <Link to="/signin">
                <Button
                    color="primary"
                    variant="contained"
                    startIcon={<PaymentIcon /> }>
                        Login to pay
                </Button>
            </Link>
        )
    }
    return (
        <Typography variant="h6" color="primary">
            
            Total : ₹ <Chip size="medium" label={getTotalPrice()} color="primary"/><br /><br/>
            {showStripebutton()}          
        </Typography>
    )
}

export default Stripecheckout
