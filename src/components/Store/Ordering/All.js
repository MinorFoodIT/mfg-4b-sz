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
        whiteSpace: 'nowrap',
        backgroundColor: '#110813',
        color: 'white'
    },
    chip_cooking: {
        margin: theme.spacing(0.5),
        backgroundColor: '#e31b2f',
        color: 'white'
    },
    chip_ready_pickup: {
        margin: theme.spacing(0.5),
        backgroundColor: '#e3c768',
        color: 'white'
    },
    chip_delivered: {
        margin: theme.spacing(0.5),
        backgroundColor: '#1b5e20',
        color: 'white'
    },
    chip_cancelled: {
        margin: theme.spacing(0.5),
        backgroundColor: '#110813',
        color: 'white'
    },
    close: {
        padding: theme.spacing(0.5),
    },
}));

const ALL = (props) => {
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
            render: rowData => {  //props => {
                if(rowData.status === 'Cooking' ){
                    return (
                        <div>
                            <Chip label="Cooking" className={classes.chip_cooking}/>
                        </div>
                    );
                }else if(rowData.status === 'Ready To Pickup') {
                    return (
                        <div>
                            <Chip label="Ready To Pickup" className={classes.chip_ready_pickup}/>
                        </div>
                    );
                }else if(rowData.status === 'Delivering') {
                    return (
                        <div>
                            <Chip label="Delivering" className={classes.chip_delivered}/>
                        </div>
                    );
                }else if(rowData.status == 'Cancelled'){
                    return (
                        <div>
                            <Chip label="Cancelled" className={classes.chip_cencelled}/>
                        </div>
                    );
                }
            },
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

    return (
            <MaterialTable
                title="Cooking"
                isLoading={isLoading}
                columns={state.columns}
                data={[...dataState.cooking].concat([...dataState.delivering]).concat([...dataState.delivered]).concat([...dataState.cancelled])}
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

export default ALL;