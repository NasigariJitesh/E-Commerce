import React, {  Fragment, useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom';
import { addproducttocart, removeproductfromcart,changeproductcount } from './helper/cartHelper';
import ImageHelper from './helper/ImageHelper';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { red } from '@material-ui/core/colors';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { Button, Slider,Typography,IconButton,Card,CardMedia,CardContent,CardActions,Collapse, Link} from '@material-ui/core';
import { deleteProduct } from '../admin/helper/adminapicall';
import { isAuthenticated } from '../auth/helper';
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  button: {
    backgroundColor: red[800],
  },
}));
const MyCard = ({
  product,
  addtoCart=true,
  removefromCart=false,
  admin=false,
  setReload=f=>f,
  showcategory,
  reload = undefined
}) => {
  const [redirect, setRedirect] = useState(false);
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const {user,token} = isAuthenticated();
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  
  const name = product ? product.name : "deafult";
  const description = product ? product.description : "deafult";
  const price = product ? product.price : "deafult";
  const stock = product ? product.stock : "deafult";
  const sold = product ? product.sold : "deafult";
  const category = product ? product.category.name : "deafult";
  const qty = product ? parseInt(product.count) : 0;
  const [count, setCount] = useState(qty);
  const getRedirect=(redirect)=>{
    if(redirect){
      return <Redirect to="/cart" />
    }
  }
  const deleteproduct= productId=>{
    deleteProduct(productId, user._id,token).then(
        res=>{
            if(res.error){
                console.log("Error in deleting product",res.err);
            }
            else{
              setReload(!reload);
            }
        }
    )
}
  const handleCountChange=(event,newValue)=>{
    changeproductcount(product._id,newValue);
    setReload(!reload);
    setCount(newValue);
  }
  useEffect(() => {
    setCount(qty);
  }, [])
 
  const showAddToCart=(addtoCart,product)=>{
    return(
      addtoCart && (
        <Button
        variant="contained"
        color="primary"
        startIcon={<AddShoppingCartIcon />}
        onClick={
          () => {
            if(product.stock<count){
              alert("Out of stock : order count is exceeding Stock left");
            }
            else{
              product={...product, count};
              addproducttocart(product,()=>{
                setRedirect(true);
              })
            }
          } 
        } 
      >
        Add to cart
      </Button>
        
      )
    )
  }
  const showRemoveFromCart=(removefromCart,product)=>{
    return(
      removefromCart && (
        
        <Button
        variant="contained"
        className={classes.button}
        startIcon={<DeleteIcon />}
        onClick={() => {removeproductfromcart(product._id);
          setReload(!reload);}
        }
      >
        Remove from cart
      </Button>
    
      )
    )
  }
  const showAdminControls=(admin,product)=>{
return(admin && <Fragment>
  <Link href={`/admin/product/update/${product._id}`} color="inherit">
    <IconButton>
      <EditIcon/>
    </IconButton>
  </Link>
  <Link href={`/admin/products`} color="inherit">
  <IconButton onClick={()=>{deleteproduct(product._id);}}>
      <DeleteIcon/>
  </IconButton>
  </Link>
</Fragment>)
  }
    return (
      <Card style={{marginBottom:'18px'}} className={classes.root}>
      <CardMedia>
        <ImageHelper product={product}/>
      </CardMedia>
      <CardContent align="center" >
        <Typography align="left" color="textSecondary" gutterBottom variant="h5" component="h2">
            {name}
        </Typography>
        {
        !admin?(showcategory&&<Typography align="left" color="dark" gutterBottom variant="h6" component="h4">
        Category:{category}
      </Typography>):<Typography align="left" color="dark" gutterBottom variant="h6" component="h4">
          Sold:{sold}
        </Typography>
        }
        
        
       <Typography align="inherit" color="dark" gutterBottom  component="h4">Price: ₹ {price}<br />Stock: {stock}</Typography>
        <Typography align="left" id="discrete-slider" gutterBottom>
        Count:
      </Typography>
      
      <Slider
        defaultValue={count}
        valueLabelDisplay="auto"
        aria-labelledby="discrete-slider"
        onChange={handleCountChange}
        step={1}
        marks
        min={0}
        max={10}
      />
      </CardContent>
      <CardActions disableSpacing>  
        {showAddToCart(addtoCart,product)}
        {showRemoveFromCart(removefromCart,product)}
        {showAdminControls(admin,product)}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Description:</Typography>
          <Typography paragraph>{description}</Typography>
        </CardContent>
      </Collapse>
      {getRedirect(redirect)}
    </Card>);
  }

export default MyCard;
