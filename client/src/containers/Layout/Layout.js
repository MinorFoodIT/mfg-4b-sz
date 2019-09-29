import React, { useState } from 'react';
import {useStateValue} from '../../global/state'
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
//import classes from './Layout.css'

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import HomeIcon from '@material-ui/icons/Home';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import cookingSvg from '../../components/UI/Icon/cooking.svg'
import cancelSvg from '../../components/UI/Icon/cancel.svg'
import scooterSvg from '../../components/UI/Icon/scooter.svg'

import {withRouter} from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import All from '../../components/Store/Ordering/All'
import Cooking from '../../components/Store/Ordering/Cooking'
import Delivering from '../../components/Store/Ordering/Delivering'
import Cancel from '../../components/Store/Ordering/Cancel'

const drawerWidth = 240;

//Inline styles
const useStyles = makeStyles(theme => ({
  root: {
    //display: 'flex',
    //Layout.jsbackgroundColor: theme.palette.background.paper,
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    position: 'relative',
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
    display: 'flex',
    //justifyContent: 'center',
    flexWrap: 'wrap',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  svg: {
    maxWidth: '25px'
  },
  chip: {
    margin: theme.spacing(1),
  },
}));

/*
const LinkTab = (props) => {
  return (
      <Tab
          component="a"
          onClick={event => {
            event.preventDefault();
          }}
          {...props}
      />
  );
}
*/

const TabContainer = ({ children, dir}) => {
  return (
      <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
        {children}
      </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};



//Funtional Component
const Layout = (props) => {
  const classes = useStyles();
  //Hook
  //const [open, setOpen] = useState(true);
  const [{ appState ,dataState }, dispatch] = useStateValue();

  const [value,setValue] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  //const [msg,setMsg] = React.useState('');
  //const [open, setOpen] = React.useState(false);
  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    dispatch({
      type: 'SNACKBAR',
      data: {
        open: false,
        msg: ''
      }
    });

  }
  //Handler
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
  }
  const handleSignOut = () => {
    handleMenuClose();
    console.log('sign out ,remove session storage');
    sessionStorage.removeItem("sessionstate");
    props.history.push('/');
    window.location.reload();
  }
  const handleChange = (event, newValue) => {
    console.log('handleChange');
    setValue(newValue);

  }
  const handleChangeIndex = index => {
    console.log('handleChangeIndex');
    setValue(index);
  };


  //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar className={classes.toolbar}>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            <Chip
                icon={<FaceIcon />}
                label={appState.username}
                //clickable
                className={classes.chip}
                color="secondary"
            />
            <Chip
                icon={<HomeIcon />}
                label={"Store : "+appState.store}
                //clickable
                className={classes.chip}
                color="secondary"
            />
          </Typography>
          <div>
            <Button color="primary"   aria-controls="simple-menu" aria-haspopup="true" variant="contained" onClick={handleClick} > {/* component={AdapterLink} to="/"  */}
              Menu
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
              <MenuItem onClick={handleMenuClose}></MenuItem>
              <MenuItem onClick={handleSignOut}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <AppBar position="static" color="default">
        <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
          <Tab label="All" />
          <Tab icon={<img src={cookingSvg} className={classes.svg}/>} label="Cooking" />
          <Tab icon={<img src={scooterSvg} className={classes.svg}/>} label="Delivering" />
          <Tab icon={<img src={cancelSvg} className={classes.svg}/>} label="Cancel" />
        </Tabs>
      </AppBar>
      <main className={classes.content}>
        <SwipeableViews axis={'x'} index={value} onChangeIndex={handleChangeIndex}>
          <TabContainer dir={'ltr'}><All/></TabContainer>
          <TabContainer dir={'ltr'}><Cooking></Cooking></TabContainer>
          <TabContainer dir={'ltr'}><Delivering></Delivering></TabContainer>
          <TabContainer dir={'ltr'}><Cancel></Cancel></TabContainer>
        </SwipeableViews>
        <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={dataState.snackbar.open}
            autoHideDuration={4000}
            onClose={handleClose}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{dataState.snackbar.msg}</span>}
            action={[
              <IconButton
                  key="close"
                  aria-label="close"
                  color="inherit"
                  className={classes.close}
                  onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>,
            ]}
        />
      </main>
    </div>
  );
}

export default withRouter(Layout);