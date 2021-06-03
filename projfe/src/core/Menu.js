import React, { Fragment } from 'react';
import clsx from 'clsx';
import {fade, makeStyles, useTheme } from '@material-ui/core/styles';
import {Drawer,CssBaseline,AppBar,Toolbar,List,Typography,Divider,IconButton,ListItem,ListItemIcon,ListItemText, Menu, MenuItem, Badge, InputBase, Link, Button, Chip, Avatar} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import MoreIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import { isAuthenticated, signout } from '../auth/helper';
import { Redirect } from 'react-router-dom';
import { deepOrange } from '@material-ui/core/colors';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  grow: {
    flexGrow: 1,
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const AppMenu=(props)=> {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
 const {user}=isAuthenticated();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  
  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  function ListItemLink(props) {
    return <ListItem button  component="a" {...props} />;
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };


  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    isAuthenticated()&&
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
       <Link href={`/profile/${user._id}`}><MenuItem onClick={handleMenuClose}>Profile</MenuItem> </Link>
      <Link href="/">
      <MenuItem onClick={()=>{
        signout(()=>{})
      }}>SignOut</MenuItem></Link>
    </Menu>
  );
  // props.handleSearch=(event)=>{
  //   console.log(event)
  //   return event.target.value;
  // }
const dashboard=(
  ((isAuthenticated() && isAuthenticated().user.role===1)?(
    <List align="center">
    <Divider />

      <ListItemLink href="/admin/create/category">
        <ListItemIcon><AddIcon /></ListItemIcon>
        <ListItemText primary="Add Category" />
      </ListItemLink>
     
      <ListItemLink href="/admin/create/product">
        <ListItemIcon><AddIcon /></ListItemIcon>
        <ListItemText primary="Add product" />
      </ListItemLink>
      <ListItemLink alignItems="center" href="/admin/products">
        <ListItemText primary="Manage Products" />
      </ListItemLink>
      <ListItemLink alignItems="center" href="/admin/orders">
        <ListItemText primary="Manage Orders" />
      </ListItemLink>
    </List>
  ):(
    ""
  )))
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu=
    (isAuthenticated())?(
      <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar className={classes.orange}>{isAuthenticated().user.name.charAt(0)}{isAuthenticated().user.lastname ? isAuthenticated().user.lastname.charAt(0): ""}</Avatar>
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
   )
    :(
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      
      <List component="nav" aria-label="secondary mailbox folders">
      <ListItemLink href="/signup">
          <ListItemText primary="Sign Up" />
        </ListItemLink>
        <Divider />
        <ListItemLink href="/signin">
          <ListItemText primary="Sign In" />
        </ListItemLink>
      </List>
    </Menu>)
  
const AuthCheck=()=>{
  if(isAuthenticated()){
    return( 
    <IconButton
      edge="end"
      aria-label="account of current user"
      aria-haspopup="true"
      onClick={handleProfileMenuOpen}
      color="inherit"
    >
      <Avatar className={classes.orange}>{isAuthenticated().user.name.charAt(0)}{isAuthenticated().user.lastname ? isAuthenticated().user.lastname.charAt(0): ""}</Avatar>
    </IconButton>
    )
  }
  else{
    return (
      <Fragment>
        <Chip
        className={classes.search}
        size="large"
        label="Sign Up"
        component="a"
        href="/signup"
        color="primary"
        clickable
        m={2}
      />
      <Chip
      className={classes.search}
      size="large"
      label="SignIn"
      component="a"
      href="/signin"
      color="primary"
      clickable
      m={2}
    />
        
      </Fragment>
    )
  }
}

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            My Store
          </Typography>
        
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              onChange={(event)=>props.handleSearch(event)}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {AuthCheck()}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
     {renderMobileMenu}
      {renderMenu}
     
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItemLink href="/">
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemLink>
        
        <ListItemLink href="/cart">
            <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
            <ListItemText primary="Cart" />
          </ListItemLink>
          <ListItemLink alignItems="center"	href="/category">
        <ListItemText primary="Categories" />
      </ListItemLink>
        </List>
        
        {dashboard}
        {isAuthenticated()?(
        <List align="center">
          <Divider />
      <ListItemLink href="/user/orders">
        <ListItemText primary="My Orders" />
      </ListItemLink>
    </List>):("")}
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
      
        
      </main>
    </div>
  );
}
export default  AppMenu