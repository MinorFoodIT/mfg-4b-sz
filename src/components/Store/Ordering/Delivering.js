import React, { useEffect } from 'react';
import { Button } from '@material-ui/core'
import Chip from '@material-ui/core/Chip';

import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import axios from './../../../api/axiosClient';
import {useStateValue} from './../../../global/state'


const useStyles = makeStyles(theme => ({
    clicked: {
        disabled: true,
    },
    button: {
        margin: theme.spacing(0.5),
        whiteSpace: 'nowrap'
    },
    chip: {
        margin: theme.spacing(0.5),
        backgroundColor: '#e3c768',
        color: 'white'
    },
    close: {
        padding: theme.spacing(0.5),
    },
}));

const Delivery = (props) => {
    const classes = useStyles();
    const columnMetaData = [
        {
            title: 'Id',
            field: 'databaseId',
            hidden: true
        },
        {
            title: 'Status',
            field: 'status',
            cellStyle: {
                textAlign: 'center',
                padding: '1px 1px 1px 1px',
            },
            render: props => (
                <div>
                    <Chip label="Ready To Pickup" className={classes.chip}  />
                </div>
            ),
        },
        {
            title: 'Order ID',
            field: 'orderName',
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
    //Local state
    const [state, setState] = React.useState({
        columns: columnMetaData,
        data: []
    });
    const [isLoading,setIsLoading] = React.useState(false);  //Data isloading when button has beenclicked

    //On click button action
    async function deliveringHandle(id ,orderId ,rowData) {
        let put_url = '/api/v1/store/order/1112delivery/'+id+'/pickedup';
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
                    type: 'REMOVE_READY_PICKUP',
                    data: id
                });
                dispatch({
                    type: 'MOVE_TO_DELIVERED',
                    data: rowData
                });
            }
            setIsLoading(false);

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
                data={dataState.delivering}
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
                                         Delivering
                                     </Button>
                                 </div>
                             );
                         },
                         tooltip: 'Delivering',
                         onClick: (event,rowData) => {
                             setIsLoading(true);
                             deliveringHandle(rowData.databaseId,rowData.orderName);
                         }
                    })
                    */
                    {
                        icon: 'save',
                        tooltip: 'Delivering',
                        onClick: (event, rowData) => {
                            setIsLoading(true);
                            deliveringHandle(rowData.databaseId,rowData.orderName,rowData);
                        }
                    }
                ]}
                components={{
                    Action: props => (
                        <Button
                            onClick={(event) => props.action.onClick(event, props.data)}
                            color="primary"
                            variant="contained"
                            className={classes.button}
                            size="small"
                        >
                            Delivering
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

                }}

            />
    );
};

export default Delivery;