import React from 'react';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    imageIcon: {
        height: '100%'
    },
    iconRoot: {
        textAlign: 'center'
    }
});

const CookingIcon = (props) => {
    const classes = useStyles();

    return (
    <Icon classes={{root: classes.iconRoot}}>
        <img className={classes.imageIcon} src="cooking.svg"/>
    </Icon>
    );

}


export default CookingIcon;