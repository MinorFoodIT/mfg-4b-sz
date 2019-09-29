import React, { useState ,useContext} from 'react';
import {useStateValue} from '../../global/state'
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import HomeIcon from '@material-ui/icons/Home';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Button from '@material-ui/core/Button';
import { Link ,withRouter} from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import SummaryTransaction from '../../components/Report/SummaryTransaction'

const drawerWidth = 240;
//Inline styles
const useStyles = makeStyles(theme => ({
  root: {
    //display: 'flex',
    //Layout.jsbackgroundColor: theme.palette.background.paper,
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
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
}));

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
const LayoutManager = (props) => {
  const classes = useStyles();
  //Hook
  const [open, setOpen] = useState(true);
  const [{ appState ,dataState }, dispatch] = useStateValue();

  const [value,setValue] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
  }

  const handleClose = (event, reason) => {
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
  const handleSignOut = () => {
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
          <Tab label="Report by Transaction" />
          <Tab label="Report weekly & monthly" />
        </Tabs>
      </AppBar>
      <main className={classes.content}>
        <SwipeableViews axis={'x'} index={value} onChangeIndex={handleChangeIndex}>
          <TabContainer dir={'ltr'}><SummaryTransaction></SummaryTransaction></TabContainer>
          <TabContainer dir={'ltr'}>Page2</TabContainer>
        </SwipeableViews>
      </main>
    </div>
  );
}

export default withRouter(LayoutManager);