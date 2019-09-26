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

const SearchPanel = (props) => {
    const classes = useStyles();
    const [{ dataState }, dispatch] = useStateValue();
    const [selectedStartDate, setSelectedStartDate] = React.useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = React.useState(new Date());
/*
    const loadSites = useMemo( async () => {
        let get_url = '/api/v1/sites'
        console.group('GET ' + get_url);
        console.groupEnd();
        await axios.get(get_url)
            .then(async (response) => {
                //console.log(response.data);
                if (response.data) {
                    var results = response.data;
                    results = results.map(site => {
                        return {
                            siteNumber: site.siteNumber,
                            siteName: site.siteName
                        };
                    })
                    console.log(results);

                    //dispatch({
                    //    type: 'LOAD_SITES',
                    //    data: results
                    //});

                    console.group('ReturnAPI :' + get_url);
                    await setSites([...results]);
                    console.log(sites);
                    console.groupEnd();

                    //return results;
                }
                //console.log(sites);
            })
            .catch(
                (error) => {
                    console.group('API Error :');
                    console.log(error);
                    console.groupEnd();
                }
            )
    },[])
*/

/*

    useEffect(() => {
        const loadData = async () => {
            let get_url = '/api/v1/sites'
            console.group('GET ' + get_url);
            console.groupEnd();
            const result = await axios.get(get_url)
            return result;
        };

        const saveSites = async (result) => {
            await setSites(result.data);
            console.group('Data :');
            console.log(result.data);
            console.groupEnd();
        }
        saveSites(loadData());

        console.group('useEffect :');
        console.log(sites);
        console.groupEnd();
    },[])
*/

    useEffect(() => {

    },[])
    const handleStartDateChange = date => {
        setSelectedStartDate(date);
    };

    const handleEndDateChange = date => {
        setSelectedEndDate(date);
    };

    const [values, setValues] = React.useState({
        site: '',
        name: '',
    });
    const handleChange = event => {

        setValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSeach = () => {
        console.log(values)
        console.log(formatDate(selectedStartDate)); //toISOString()
        console.log(formatDate(selectedEndDate));

        props.searchReport(values.site,formatDate(selectedStartDate),formatDate(selectedEndDate));
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
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="store-helper">Store</InputLabel>
                    <Select
                        value={values.site}
                        onChange={handleChange}
                        inputProps={{
                            name: 'site',
                            id: 'store-helper',
                        }}
                    >
                        {
                            props.listbox.map(site =>
                            <MenuItem key={site.siteNumber} value={site.siteNumber}>{site.siteName}</MenuItem>
                            )
                        }

                    </Select>
                    {/*<FormHelperText>Store selection</FormHelperText>*/}
                </FormControl>
            </Grid>
            <Grid key="3" item>
                <Button variant="contained" color="secondary" className={classes.button} onClick={handleSeach}>
                    Search
                </Button>
            </Grid>
        </Grid>
    </MuiPickersUtilsProvider>;
}


export default SearchPanel;