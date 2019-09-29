import React, {useCallback, useEffect} from 'react';
import { Button } from '@material-ui/core'
import Chip from '@material-ui/core/Chip';

import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import axios from '../../../api/axiosClient';
import {useStateValue} from '../../../global/state'


const useStyles = makeStyles(theme => ({
    clicked: {
        disabled: true,
    },
    button: {
        margin: theme.spacing(0.5),
        whiteSpace: 'nowrap',
        backgroundColor: '#e3c768',
        color: 'white'
    },
    chip: {
        margin: theme.spacing(0.5),
        backgroundColor: '#e31b2f',
        color: 'white'
    },
    close: {
        padding: theme.spacing(0.5),
    },
}));

const Cooking = (props) => {
    const classes = useStyles();
    const columnMetaData = [
        /*
        {
            title: 'Action',
            field: 'action',
            render: props => (
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={(e,rowData) => {
                            console.log('cooking button clicked');
                            console.log(e);
                            console.log(rowData);
                        }} //props.onChange(e.target.value)
                    >
                        Ready to pickup
                    </Button>
                </div>
            ),

            cellStyle: {
                padding: '3px 1px 3px 1px',
            }
        },
        */
        {
            title: 'Id',
            field: 'databaseId',
            hidden: true
        },
        {
            title: 'Status',
            field: 'status',
            cellStyle: {
                //backgroundColor: '#e31b2f',
                //color: 'white'
                textAlign: 'center',
                padding: '1px 1px 1px 1px',
            },
            render: props => (
                <div>
                    <Chip label="Cooking" className={classes.chip}  />
                </div>
            ),
        },
        {
            title: 'Order ID',
            field: 'orderName',
            //lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },

        },
        { title: 'Order Time' ,
            field: 'orderTime',
            type: 'datetime',
            cellStyle: {
                padding: '1px 1px 1px 1px',
            }
        },
        { title: 'Remark',
            field: 'future',
            cellStyle: {
                padding: '1px 1px 1px 1px',
            }
        },
        { title: 'Gross Total',
            field: 'grossTotal',
            type: 'currency' ,
            currencySetting: {
                currencyCode: 'THB'
            }

        },
    ];

    //Global state
    const [{ appState ,dataState }, dispatch] = useStateValue();

    //Local state     //const [intervalId,setIntervalId] = React.useState();
    //Hook use Local state
    const [state, setState] = React.useState({
        columns: columnMetaData,
        data: [
            //{ status: 'cooking', future: '2019-07-17 13:30:15' , orderTime: '2019-07-17 13:00:15',storeName: 'Lab Avani', orderName: 'TPC ref 12345', grossTotal: "323.25", refID: "12345" },
        ],
    });
    const [isLoading,setIsLoading] = React.useState(false);  //Data isloading when button has beenclicked


    const freshOrdersInStore = React.useCallback(async() => {
        var cuurentCooking =  [...dataState.order_instore].filter(order => {
            return (order.cookingFinishTime === null || order.cookingFinishTime === '')
                && (order.pickupFinishTime === null || order.pickupFinishTime === '')
        });
        var queryAPI = [];

        let get_url = '/api/v1/store/orders/1112delivery/'+appState.sitegroup+'/'+appState.store
        console.group('GET '+get_url);
        await axios.get(get_url)
            .then((response)=>{
                if(response.data){
                    var results = response.data;
                    console.group('API return :');
                    console.log(results);
                    console.groupEnd();

                    if (results.length > 0 ) {
                        dispatch({
                            type: 'FRESH_ORDER_INSTORE_SUCCESS',
                            data: results
                        });

                        queryAPI = [...results].filter(order => {
                            return (order.cookingFinishTime === null || order.cookingFinishTime === '')
                                && (order.pickupFinishTime === null || order.pickupFinishTime === '')
                                && (order.cancelTime === null || order.cancelTime === '')
                        });;
                    }
                    console.group('GlobalStateObject');
                    console.log(appState);
                    console.log(dataState);
                    console.groupEnd();
                }
            })
            .then(() => {
                //Show snackbar if have new orders
                if(queryAPI.length > cuurentCooking.length){
                    let diff = queryAPI.length - cuurentCooking.length;
                    dispatch({
                        type: 'SNACKBAR',
                        data: {
                            open: true,
                            msg: 'You have new '+diff+' order(s)'
                        }
                    });
                }
            })
            .then( () =>{
                //Map data appstate to cooking line
                /*
                var orders = dataState.order_instore.length > 0 ? [...dataState.order_instore] : [];
                var cookingOrders = orders.filter(order => {
                    return (order.cookingFinishTime === null || order.cookingFinishTime === '')
                        && (order.pickupFinishTime === null || order.pickupFinishTime === '')
                });
                //console.log(cookingOrders);

                const cookingRows = cookingOrders.map(row => {
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

                console.group('Rendering meterial-table '+cookingRows.length + ' record(s)');
                console.log(cookingRows);
                console.groupEnd();

                setState({
                    columns: columnMetaData,
                    data: [...cookingRows]
                });
                */

            })
            .catch((error)=>{
                console.group('API Error :');
                console.log(error);
                console.groupEnd();
            })
        console.groupEnd();
    },[])

    //loading data every interval
    useEffect(() => {
        //Use callback //async function freshOrdersInStore() {}

        freshOrdersInStore();
        let id = setInterval(function () {
            freshOrdersInStore();
        },dataState.interval)
        //setIntervalId(id);

        return function cleanup() {
            clearInterval(id);
        };

    },[]);

    //On click button action
    async function readyToPickupHandle(id ,orderId, rowData) {
        let put_url = '/api/v1/store/order/1112delivery/'+id+'/cooking';
        console.group('PUT '+put_url);
        await axios.put(put_url,{
            orderName: orderId
        }).then((response) => {
            var results = response.data;
            console.group('API return :');
            console.log(results);
            console.groupEnd();

            if (results.id > 0 ) {
                dispatch({
                    type: 'REMOVE_COOKING',
                    data: id
                });
                dispatch({
                    type: 'MOVE_TO_DELIVERING',
                    data: rowData
                });
            }
            setIsLoading(false);

            /*
            //Removing rowId
            var copyState = [...state.data];
            var removed = copyState.filter(order =>{
                return order.databaseId !== id;
            })
            console.group('RowID['+id+' was removed');
            console.groupEnd();

            setState({
                columns: columnMetaData,
                data: removed
            });
            */


        }).catch((error)=>{
            console.group('API Error :');
            console.log(error);
            console.groupEnd();
        })
        console.groupEnd();
    }

    return (
            <MaterialTable
                title="Cooking"
                isLoading={isLoading}
                columns={state.columns}
                data={dataState.cooking}
                actions={[
                    /*
                    rowData => ({
                         icon: () => {
                             return (
                                 <div>
                                     <Button
                                         variant="contained"
                                         color="primary"
                                         className={classes.button}
                                     >
                                         Ready to pickup
                                     </Button>
                                 </div>
                             );
                         },
                         tooltip: 'Ready to Pickup',
                         onClick: (event,rowData) => {
                             setIsLoading(true);
                             readyToPickupHandle(rowData.databaseId,rowData.orderName,rowData);
                         }
                    })
                    */
                    {
                        icon: 'save',
                        tooltip: 'Ready to Pickup',
                        onClick: (event, rowData) => {
                            setIsLoading(true);
                            readyToPickupHandle(rowData.databaseId,rowData.orderName,rowData);
                        }
                    }
                ]}
                components={{
                    Action: props => (
                        <Button
                            onClick={(event) => props.action.onClick(event, props.data)}
                            color="primary"
                            variant="contained"
                            //style={{textTransform: 'none'}}
                            className={classes.button}
                            size="small"
                        >
                            Ready to pickup
                        </Button>
                    ),
                }}
                actionsColumnIndex="1"
                filtering='true'
                options={{
                    padding: 'dense',
                    pageSize: 10,
                    search: false,
                    showTitle: false,
                    /*
                    rowStyle: rowData => {
                                            return {};                //if(rowData.status === "") {
                                            //    return {backgroundColor: 'red'};
                                            //}
                                         }
                     */
                }}

            />
    );
};

export default Cooking;

/*
//Map rows of freshing database to data table list to display
useMemo(() => {
},[appState.order_instore]);
*/
/*
useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    //[componentWillMount ,componentDidMount ,componentDidUpdate]
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

    //[componentWillUnmount()]
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  .MuiTableCell-sizeSmall {
        padding: 1px 1px 1px 1px;
    }
  */