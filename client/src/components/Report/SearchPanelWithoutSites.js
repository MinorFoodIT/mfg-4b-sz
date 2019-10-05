import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import axios from "../../api/axiosClient";
import {useStateValue} from "../../global/state";
import {formatDate} from "../../global";


const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(2),
        //marginLeft: theme.spacing(1),
        //marginRight: theme.spacing(1),
        minWidth: 80,
    },
    clicked: {
        disabled: true,
    },
    button: {
        margin: theme.spacing(3),
        whiteSpace: 'nowrap',
        backgroundColor: '#73c5be',
        color: 'white'
    },
    close: {
        padding: theme.spacing(0.5),
    },
}));
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const SearchPanelWithoutSites = (props) => {
    const classes = useStyles();
    const [{ dataState }, dispatch] = useStateValue();
    const [selectedStartDate, setSelectedStartDate] = React.useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = React.useState(new Date());


    useEffect(() => {

    },[])
    const handleStartDateChange = date => {
        setSelectedStartDate(date);
    };

    const handleEndDateChange = date => {
        setSelectedEndDate(date);
    };

    const handleSeach = () => {
        console.log(formatDate(selectedStartDate)); //toISOString()
        console.log(formatDate(selectedEndDate));

        props.searchReport('',formatDate(selectedStartDate),formatDate(selectedEndDate));
    }

    return <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="flex-start" spacing={1}>
            <Grid key="0" item>
                <KeyboardDatePicker
                    margin="normal"
                    id="startdate-picker-dialog"
                    label="Start Date"
                    format="dd/MM/yyyy"
                    value={selectedStartDate}
                    onChange={handleStartDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </Grid>
            <Grid key="1" item>
                <KeyboardDatePicker
                    margin="normal"
                    id="startdate-picker-dialog"
                    label="End Date"
                    format="dd/MM/yyyy"
                    value={selectedEndDate}
                    onChange={handleEndDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </Grid>
            <Grid key="2" item>
                <Button variant="contained" color="secondary" className={classes.button} onClick={handleSeach}>
                    Search
                </Button>
            </Grid>
        </Grid>
    </MuiPickersUtilsProvider>;
}


export default SearchPanelWithoutSites;