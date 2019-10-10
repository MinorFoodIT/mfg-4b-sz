import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import axios from '../../api/axiosClient';
import {useStateValue} from '../../global/state'
import SearchPanel from "./SearchPanel";


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


const SummaryTransaction = (props) => {
    const classes = useStyles();
    const columnMetaData = [
        {
            title: 'Store ID',
            field: 'store ID',
        },
        {
            title: 'Store Name',
            field: 'siteName',
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
                textAlign: 'center',
            }
        },
        { title: 'Cooking Time' ,
            field: 'cookingFinishTime',
            type: 'datetime',
            cellStyle: {
                padding: '1px 1px 1px 1px',
                textAlign: 'center',
            }
        },
        { title: 'Pickup Time' ,
            field: 'pickupFinishTime',
            type: 'datetime',
            cellStyle: {
                padding: '1px 1px 1px 1px',
            }
        },
        { title: 'Cooking time (mins)',
            field: 'cookingTime',
            type: 'numeric',
            cellStyle: {
                padding: '1px 1px 1px 1px',
                textAlign: 'center',
            }
        },
        { title: 'Pickuped time (mins)',
            field: 'pickupTime',
            type: 'numeric',
            cellStyle: {
                padding: '1px 1px 1px 1px',
                textAlign: 'center',
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
    const [rows, setRows] = React.useState([]);

    const [isLoading,setIsLoading] = React.useState(false);  //Data isloading when button has beenclicked
    const [isLoaded,setIsLoaded] = React.useState(false);
    const [sites, setSites] = React.useState([]);
    const dataSites = useMemo( async () => {
        let get_url = '/api/v1/sites'
        const result = await axios.get(get_url)
        //console.group('GET ' + get_url);
        //console.log(result.data);
        //console.groupEnd();
        setSites(result.data);
        return result.data;
    },[]);

    useEffect(() => {
        setIsLoaded(true);
    },[])

    const searchReport = useCallback( async(site,selectedStartDate,selectedEndDate) => {
        if(site === '' ){
            alert('Please select site.');
        }
        let get_url = '/api/v1/report_transaction/'+selectedStartDate+'/'+selectedEndDate+'/'+site;
        const result = await axios.get(get_url);
        console.group('API :');
        console.log(result.data);
        if(result.data ==='undefined' || result.data.length < 1){
            alert('No data returned to display.');
        }
        setRows(result.data!=='undefined'?result.data:[]);
        console.groupEnd();

    },[]);

    return (
            <MaterialTable
                title={isLoaded?<SearchPanel listbox={sites} searchReport={searchReport}></SearchPanel> :<SearchPanel listbox={[]} searchReport={searchReport} ></SearchPanel>}
                isLoading={isLoading}
                columns={state.columns}
                data={[...rows]}
                filtering='true'
                options={{
                    padding: 'dense',
                    pageSize: 10,
                    search: false,
                    showTitle: true,

                }}

            />
    );
};

export default SummaryTransaction;