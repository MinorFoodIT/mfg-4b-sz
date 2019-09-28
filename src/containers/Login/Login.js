import React, { useState } from 'react'
import {useStateValue} from './../../global/state'
import { Typography, Paper, Avatar, Button ,FormControl, Input, InputLabel} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import withStyles from '@material-ui/core/styles/withStyles'
import { withRouter } from 'react-router-dom'
import axios from './../../api/axiosClient';


const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block',
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    avatar: {
        margin: theme.spacing(),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(),
	},
    submit: {
        marginTop: theme.spacing(3),
    },
})


const Login = (props) => {
    const { classes } = props
    // I'm produce state using useState.
	// The second parameter that will keep the first parameter value will change the value.
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

    const [{ appState ,dataState }, dispatch] = useStateValue();

	//When the form is submitted it will run
	function onSubmit(e){
		e.preventDefault()//blocks the postback event of the page
        console.group('Form Login');
        console.log('email: '+email)
        console.log('password: '+password)

        axios.post('/api/v1/login',{username: email,password: password} )
        .then((response)=>{

            if(response.data){
                var results = response.data;
                console.group('API_login');
                console.log('API return :');
                if (results.length > 0) {
                    //console.log(results.length);
                    results.map(row => {
                        dispatch({
                            type: 'LOGIN_SUCCESS',
                            data: {
                                username: email,
                                role: row.role,
                                site: row.site,
                                sitegroup: row.sitegroup
                            }
                        });
                        return props.history.push('/ordering');
                        
                    });
                }
                console.groupEnd();
            }
        }).catch((error)=>{
            console.log('API error ,could not sign in' + error)
        })
        console.groupEnd();
        
    }
    
    return (
        <main className={classes.main}>
        <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
               </Typography>
            <form className={classes.form} onSubmit={onSubmit}>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="email">Username</InputLabel>
                    {/* When the e-mail field is changed, setEmail will run and assign the e-mail to the value in the input. */}
                    <Input id="email" name="email" autoComplete="off" autoFocus value={email} onChange={e => setEmail(e.target.value)}  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    {/* When the password field is changed, setPAssword will run and assign the password to the value in the input. */}
                    <Input name="password" type="password" id="password" autoComplete="off" value={password} onChange={e => setPassword(e.target.value)}/>
                </FormControl>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}>
                    Sign in
                </Button>
                {/*
                  <Button
                    type="submit"
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    component={Link}
                    to="/register"
                    className={classes.submit}>
                    Register
                  </Button>              
                */}
            </form>
        </Paper>
    </main>
    );
}

export default withRouter(withStyles(styles)(Login));