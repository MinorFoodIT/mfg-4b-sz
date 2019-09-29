import React from 'react';
import { StateProvider, persistState } from './global/state'
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Layout from './containers/Layout/Layout'
import LayoutOfManager from './containers/Layout/LayoutOfManager'
import Login from './containers/Login/Login'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1b5e20', //134e32
    },
    secondary: {
      main: '#73c5be', //e31b2f
    },
  },
  status: {
    danger: 'orange',
  },
});

//const AppContext = React.createContext();

const App = (props) => {
  const initialState = {
    appState: {
      logon: false,
      role: '',
      username: '',
      store: '',
      sitegroup: '',
    },
    dataState: {
      interval: 60000,
      order_instore: [],
      cooking: [],
      delivering: [],
      delivered: [],
      cancelled: [],
      snackbar: {
        open: false,
        msg: ''
      },
      sites:[]
    },
    previousState: {}
  }

  const persistedState = sessionStorage.getItem("sessionstate")
    ? JSON.parse(sessionStorage.getItem("sessionstate"))
    : initialState;

  const reducer = (state, action) => {
    console.group('Reducer :');
    console.log('action : '+action.type);

    var saved = Object.assign({ ...state });
    switch (action.type) {
      case 'LOGIN_SUCCESS':
        saved.appState.logon = true;
        saved.appState.username = action.data.username;
        saved.appState.role = action.data.role;
        saved.appState.store = action.data.site;
        saved.appState.sitegroup = action.data.sitegroup;
        persistState(saved);
        console.groupEnd();
        return {
          ...saved,
          //theme: action.newTheme
        };
      case 'FRESH_ORDER_INSTORE_SUCCESS':
        var origin = action.data;
        saved.dataState.order_instore = origin; //data is list of rows []
        saved.dataState.cooking = [...origin].filter(order => {
                                                return (order.cookingFinishTime === null || order.cookingFinishTime === '')
                                                    && (order.pickupFinishTime === null || order.pickupFinishTime === '')
                                                    && (order.cancelTime === null || order.cancelTime === '')
                                              }).map(row => {
                                                var raw =  JSON.parse(row.json);
                                                return {
                                                  databaseId: row.id,
                                                  status: 'Cooking',
                                                  orderName: row.orderName,
                                                  orderTime: row.tranDate,
                                                  future: row.orderType === 0 ? '' : row.dueDate,
                                                  grossTotal: raw.SDM.GrossTotal
                                                }
                                              });
        console.group('Rendering cooking '+saved.dataState.cooking.length + ' record(s)');
        console.log(saved.dataState.cooking);
        console.groupEnd();
        saved.dataState.delivering = [...origin].filter(order => {
                                                return (order.cookingFinishTime !== null )
                                                    && (order.pickupFinishTime === null || order.pickupFinishTime === '')
                                                    && (order.cancelTime === null || order.cancelTime === '')
                                              }).map(row => {
                                                var raw =  JSON.parse(row.json);
                                                return {
                                                  databaseId: row.id,
                                                  status: 'Ready To Pickup',
                                                  orderName: row.orderName,
                                                  orderTime: row.tranDate,
                                                  future: row.orderType === 0 ? '' : row.dueDate,
                                                  grossTotal: raw.SDM.GrossTotal
                                                }
                                              });
        console.group('Rendering delivering '+saved.dataState.delivering.length + ' record(s)');
        console.log(saved.dataState.delivering);
        console.groupEnd();
        saved.dataState.delivered = [...origin].filter(order => {
                                                  return (order.cookingFinishTime !== null )
                                                      && (order.pickupFinishTime !== null )
                                                      && (order.cancelTime === null || order.cancelTime === '')
                                                }).map(row => {
                                                  var raw =  JSON.parse(row.json);
                                                  return {
                                                    databaseId: row.id,
                                                    status: 'Delivering',
                                                    orderName: row.orderName,
                                                    orderTime: row.tranDate,
                                                    future: row.orderType === 0 ? '' : row.dueDate,
                                                    grossTotal: raw.SDM.GrossTotal
                                                  }
                                                });
        console.group('Rendering delivered '+saved.dataState.delivered.length + ' record(s)');
        console.log(saved.dataState.delivered);
        console.groupEnd();
        saved.dataState.cancelled = [...origin].filter(order => {
                                                  return (order.cancelTime !== null )
                                                }).map(row => {
                                                  var raw =  JSON.parse(row.json);
                                                  return {
                                                    databaseId: row.id,
                                                    status: 'Cancelled',
                                                    orderName: row.orderName,
                                                    orderTime: row.tranDate,
                                                    future: row.orderType === 0 ? '' : row.dueDate,
                                                    grossTotal: raw.SDM.GrossTotal
                                                  }
                                                });
        console.group('Rendering cancelled '+saved.dataState.cancelled.length + ' record(s)');
        console.log(saved.dataState.cancelled);
        console.groupEnd();
        persistState(saved);
        console.groupEnd();
        return {
          ...saved,
        };
      case 'REMOVE_COOKING' :
        var copyState = [...saved.dataState.cooking];
        saved.dataState.cooking = copyState.filter(order =>{
          return order.databaseId !== action.data; //id
        })
        console.group('RowID['+action.data+'] was removed');
        console.groupEnd();
        console.group('Rendering cooking');
        console.log(saved.dataState.cooking);
        console.groupEnd();
        persistState(saved);
        console.groupEnd();
        return {
          ...saved,
        };
      case 'MOVE_TO_DELIVERING' :
        console.group('Row moved:');
        var moved = [{
          databaseId: action.data.databaseId,
          status: 'Ready To Pickup',
          orderName: action.data.orderName,
          orderTime: action.data.orderTime,
          future: action.data.future,
          grossTotal: action.data.grossTotal
        }];
        console.log(moved); //rowData
        console.groupEnd();
        saved.dataState.delivering = [...saved.dataState.delivering].concat(moved);
        console.group('Rendering delivering');
        console.log(saved.dataState.delivering);
        console.groupEnd();
        persistState(saved);
        console.groupEnd();
        return {
          ...saved,
        };
      case 'REMOVE_READY_PICKUP' :
        var copyState = [...saved.dataState.delivering];
        saved.dataState.delivering = copyState.filter(order =>{
          return order.databaseId !== action.data; //id
        })
        console.group('RowID['+action.data+'] was removed');
        console.groupEnd();
        console.group('Rendering delivering');
        console.log(saved.dataState.delivering);
        console.groupEnd();
        persistState(saved);
        console.groupEnd();
        return {
          ...saved,
        };
      case 'MOVE_TO_DELIVERED' :
        console.group('Row moved:');
        var moved = [{
          databaseId: action.data.databaseId,
          status: 'Delivering',
          orderName: action.data.orderName,
          orderTime: action.data.orderTime,
          future: action.data.future,
          grossTotal: action.data.grossTotal
        }];
        console.log(moved); //rowData
        console.groupEnd();
        saved.dataState.delivered = [...saved.dataState.delivered].concat(moved);
        console.group('Rendering delivered');
        console.log(saved.dataState.delivered);
        console.groupEnd();
        persistState(saved);
        console.groupEnd();
        return {
          ...saved,
        };
      case 'REMOVE_OLD_PLACE' :
        saved.dataState.cooking = [...saved.dataState.cooking].filter(order =>{
          return order.databaseId !== action.data; //id
        })
        saved.dataState.delivering = [...saved.dataState.delivering].filter(order =>{
          return order.databaseId !== action.data; //id
        })
        saved.dataState.delivered = [...saved.dataState.delivered].filter(order =>{
          return order.databaseId !== action.data; //id
        })
        console.group('RowID['+action.data+'] was removed');
        console.groupEnd();
        persistState(saved);
        console.groupEnd();
        return {
          ...saved,
        };
      case 'MOVE_TO_CANCEL' :
        console.group('Row moved:');
        var moved = [{
          databaseId: action.data.databaseId,
          status: 'Cancelled',
          orderName: action.data.orderName,
          orderTime: action.data.orderTime,
          future: action.data.future,
          grossTotal: action.data.grossTotal
        }];
        console.log(moved); //rowData
        console.groupEnd();
        saved.dataState.cancelled = [...saved.dataState.cancelled].concat(moved);
        console.group('Rendering cancelled');
        console.log(saved.dataState.cancelled);
        console.groupEnd();
        persistState(saved);
        console.groupEnd();
        return {
          ...saved,
        };
      case 'SNACKBAR':
        saved.dataState.snackbar = action.data;
        persistState(saved);
        console.groupEnd();
        return {
          ...saved,
        }
      case 'LOAD_SITES':
        saved.dataState.sites = action.data;
        persistState(saved);
        console.groupEnd();
        return {
          ...saved,
        }
      default:
        return state;
        console.groupEnd();
    }
  };

  const checkForAuth = (props,path) => {
    console.log('log on state : ' + persistedState.appState.logon);
    if (persistedState.appState.logon) {
      /*
      if(path === '/ordering'){
        return (
          <Layout>
            <Ordering></Ordering>
          </Layout>
        );
      }else if(path === '/order_ready'){
        return (
          <Layout>
            <OrderReady></OrderReady>
          </Layout>
        );
      }else if(path === '/driver_ready'){
        return (
          <Layout>
            <DriverReady></DriverReady>
          </Layout>
        );
      }else
      {
        return (
          <Layout>
            <Ordering></Ordering>
          </Layout>
        );
      }
      */
      console.group('Role :');
      console.log(persistedState.appState.role);
      console.groupEnd();

      if(persistedState.appState.role === 'user') {
        return (<Layout> {/* {props.children}*/}</Layout>);
      }else if(persistedState.appState.role === 'manager'){
        return (<LayoutOfManager></LayoutOfManager>);
      }
    }
    return (
      <Login>
        <div>login</div>
      </Login>
    );
  };

  const switchRoute = (props) => {
  
    return (
      <Switch>
        /*
        <Route exact path='/ordering'
          render={(props) => checkForAuth(props,'/ordering')} />
        <Route exact path='/order_ready'
          render={(props) => checkForAuth(props,'/order_ready')} />
        <Route exact path='/driver_ready'
          render={(props) => checkForAuth(props,'/driver_ready')} />
          */
        <Route render={(props) => checkForAuth(props,'/')} />
      </Switch>
    );
  };

  return (
    <StateProvider initialState={persistedState} reducer={reducer}>
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            {switchRoute(props)}
          </Router>
        </ThemeProvider>
      </React.Fragment>
    </StateProvider>
  );
}

export default App;
