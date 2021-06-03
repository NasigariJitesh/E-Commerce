import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import zIndex from '@material-ui/core/styles/zIndex';
import { indigo } from '@material-ui/core/colors';


function Copyright() {
  return (
    <Typography variant="body2" gutterBottom={false} color="textPrimary">
      <Link color="inherit" href="https://nasigarijitesh.me/">
        Nasigari Jitesh 
      </Link>{' '}<Link color="inherit" href="#">
        Parvataneni Amulya 
      </Link>
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    zIndex:1000,
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor: indigo[100],
  },
}));

export default function StickyFooter() {
  const classes = useStyles();

  return (
    
    <footer className={classes.footer}>
        <Typography color="textPrimary" variant="body1">Developed By</Typography>
        <Copyright />
    
    </footer>
    
  );
}