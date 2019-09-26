import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import RestaurantIcon from '@material-ui/icons/Restaurant';
import MotorcycleIcon from '@material-ui/icons/Motorcycle';
import BarChartIcon from '@material-ui/icons/BarChart';
import { Link } from 'react-router-dom';

//import SvgIcon from '@material-ui/core/SvgIcon';
//import ListSubheader from '@material-ui/core/ListSubheader';
//import PeopleIcon from '@material-ui/icons/People';
//import LayersIcon from '@material-ui/icons/Layers';
//import AssignmentIcon from '@material-ui/icons/Assignment';
//import { ,withRouter,NavLink} from 'react-router-dom';

const MainListItems = React.forwardRef((props, ref) =>  {

  const AdapterLink = React.forwardRef((props, ref) => {
    return(<Link innerRef={ref} {...props} />)
  })

  return (
  <div {...props} ref={ref} >
    <ListItem button component={AdapterLink} to="/ordering">
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="ออเดอร์ใหม่" />
    </ListItem>
    <ListItem button component={AdapterLink} to="/order_ready">
      <ListItemIcon>
        <RestaurantIcon />
      </ListItemIcon>
      <ListItemText primary="อาหารเสร็จแล้ว" />
    </ListItem>
    <ListItem button component={AdapterLink} to="/driver_ready">
      <ListItemIcon>
        <MotorcycleIcon />
      </ListItemIcon>
      <ListItemText primary="คนส่งมาถึงแล้ว" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="สรุปข้อมูล" />
    </ListItem>
  </div>
  );
});

export default MainListItems;

/*
export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);
*/