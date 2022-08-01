import React from 'react'

import PropTypes from 'prop-types';

//*MUI COMPONENTS
import { Box, Button, Link, useTheme, } from '@mui/material'
  //Appbar
import { AppBar, Toolbar, IconButton, Typography, Menu, Container, Tooltip, Avatar, MenuItem} from '@mui/material'

import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';

    //Side drawer
import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material'

import GroupsIcon from '@mui/icons-material/Groups';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';



//*ROUTER
import { navigate } from '../utils/router'

//*Contexts
import useAuth from '../contextHooks/useAuthContext'

//*Routing
import { useNavigate } from "react-router-dom";
//Theme
import { BV_THEME } from '../theme/BV-theme';
import zIndex from '@mui/material/styles/zIndex';

const drawerWidth = 280;

const BV_Drawer = (props) => {
    const {user} = useAuth()

    const theme = useTheme(BV_THEME)

    const navigate = useNavigate()

    const handleRedirect = (e) => {
      navigate(`/${user.uid}/admin/${e.target.id}`)
  }

    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
  
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };
    // FRAGMENT , Drawer Component children
    const drawer = (
        <>
          <Toolbar sx={{backgroundColor: "#0E0C8F",}}>
            <Typography variant="h6"  component="div" color="grey.A100" justifyContent="center" display="block" sx={{marginTop:"55%"}}>
                Administrator Options
            </Typography>
          </Toolbar>
          
          <Divider />
            <>
              <Box sx={{display:"flex", flexDirection:"column", width:"auto", height:"auto", alignItems:"left", justifyContent:"left"}}>
                  <Button sx={theme.button.sidebar} id="employees" startIcon={<GroupsIcon color="primary"/>} onClick={handleRedirect} >
                      Employees
                  </Button>
                  
                  <Button sx={theme.button.sidebar} id="production" startIcon={<WorkspacesIcon color="primary"/>} onClick={handleRedirect} >
                      Production
                  </Button>
                      
                  <Button sx={theme.button.sidebar} id="sales" startIcon={<RequestPageIcon color="primary"/>} onClick={handleRedirect} >
                      Sales
                  </Button>
                      
                  <Button sx={theme.button.sidebar} id="Client" startIcon={<SupportAgentIcon color="primary"/>} onClick={handleRedirect} >
                      Client
                  </Button>
                </Box>
            </>
          <Divider />
        </>
      );

      const container = window !== undefined ? () => window().document.body : undefined;


    return (
      
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 },  }}
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
    )}


    export default BV_Drawer;