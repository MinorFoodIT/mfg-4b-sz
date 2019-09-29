import React, { useState ,useContext} from 'react';
import {useStateValue} from '../../../global/state'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
//import classes from './Layout.css'

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import  MainListItems  from './ListItems';
import Button from '@material-ui/core/Button';
import { Link ,withRouter} from 'react-router-dom';

//import Badge from '@material-ui/core/Badge';
//import NotificationsIcon from '@material-ui/icons/Notifications';
//import Container from '@material-ui/core/Container';
//import Grid from '@material-ui/core/Grid';
//import Paper from '@material-ui/core/Paper';

const drawerWidth = 240;
//Inline styles
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
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

//Funtional Component
const Layout_ = (props) => {
  const classes = useStyles();
  //Hook
  const [open, setOpen] = useState(true);
  const [{ appState ,dataState }, dispatch] = useStateValue();

  //Handler
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleSignOut = () => {
    console.log('sign out ,remove session storage');
    sessionStorage.removeItem("sessionstate");
    props.history.push('/');
    window.location.reload();
  }

  const handleChange = (event, newValue) => {
    //setValue(newValue);
  }

  const a11yProps = (index) => {
    return {
      id: `nav-tab-${index}`,
      'aria-controls': `nav-tabpanel-${index}`,
    };
  }

  //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <div className={classes.root}>
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            <Tabs
                variant="fullWidth"
                value="false"
                onChange={handleChange}
                aria-label="nav tabs example"
            >
              <LinkTab label="Page One" href="/drafts" {...a11yProps(0)} />
              <LinkTab label="Page Two" href="/trash" {...a11yProps(1)} />
              <LinkTab label="Page Three" href="/spam" {...a11yProps(2)} />
            </Tabs>
          </Typography>
          {appState.username}
          <Button color="secondary"  onClick={handleSignOut} > {/* component={AdapterLink} to="/"  */}
           Sign out
          </Button>
          {/* <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>*/}
        </Toolbar>
      </AppBar>

      /*
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List><MainListItems /></List>
        {
        //<Divider />
        //<List>{secondaryListItems}</List>
        }
      </Drawer>
      */
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {props.children}
      </main>
    </div>
  );
}

export default withRouter(Layout_);

/*
function Clock() {
  const [time, setTime] = React.useState(0);
  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setTime(prevTime => prevTime + 1); // <-- Change this line!
    }, 1000);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div>Seconds: {time}</div>
  );
}
* */