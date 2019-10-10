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
import SearchPanelWithoutSites from "./SearchPanelWithoutSites";


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


const SummaryMonthlyTransaction = (props) => {
    const classes = useStyles();
    const columnMetaData = [
        {
            title: 'Store Name',
            field: 'siteName',
        },
        { title: 'No. of delivery order' ,
            field: 'totalOrder',
            type: 'numeric',
            cellStyle: {
                padding: '1px 1px 1px 1px',
                textAlign: 'center',
            }
        },
        { title: 'Total Sales',
            field: 'totalSale',
            type: 'currency' ,
            currencySetting: {
                currencyCode: 'THB'
            }
        },
        { title: 'Average time to cook (mins)',
            field: 'avgCooking',
            type: 'numeric',
            cellStyle: {
                padding: '1px 1px 1px 1px',
                textAlign: 'center',
            }
        },
        { title: 'Average time to pickup (min)',
            field: 'avgPickup',
            type: 'numeric',
            cellStyle: {
                padding: '1px 1px 1px 1px',
                textAlign: 'center',
            }
        },
        { title: 'No. of order with cooking time > 15 mins',
            field: 'aboveCooking',
            type: 'numeric',
            cellStyle: {
                padding: '1px 1px 1px 1px',
                textAlign: 'center',
            }
        },
        { title: '% of order with cooking time > 15 mins',
            field: 'aboveCookingPercent',
            type: 'numeric',
            cellStyle: {
                padding: '1px 1px 1px 1px',
                textAlign: 'center',
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


    useEffect(() => {

    },[])

    const searchReport = useCallback( async(site,selectedStartDate,selectedEndDate) => {
        let get_url = '/api/v1/report_monthly_transaction/'+selectedStartDate+'/'+selectedEndDate;
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
                title={<SearchPanelWithoutSites  searchReport={searchReport} ></SearchPanelWithoutSites>}
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

export default SummaryMonthlyTransaction;