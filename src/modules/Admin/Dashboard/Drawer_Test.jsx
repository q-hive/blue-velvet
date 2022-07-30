import React from 'react'

import PropTypes from 'prop-types';

//*MUI COMPONENTS
import { Box, Button, useTheme, } from '@mui/material'
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
import { navigate } from '../../../utils/router'

//*Contexts
import useAuth from '../../../contextHooks/useAuthContext'

//*Routing
import { useNavigate } from "react-router-dom";
//Theme
import { BV_THEME } from '../../../theme/BV-theme';
import zIndex from '@mui/material/styles/zIndex';

const drawerWidth = 240;

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

    const handleButtonId = (index) => {
        const employees = "employees"
        return(<>{index === 0 ? employees : <>{index === 1 ? "production": <>{index === 2 ? "sales": <>{index === 3 ? "customer": null  }</>  }</>  }</> }</>
        )
    }

    const DrawerComp = () => (
        <>
          <Toolbar sx={{backgroundColor: "#0E0C8F",}}>
            <Typography variant="h6"  component="div" color="grey.A100" justifyContent="center" display="block" sx={{marginTop:"55%"}}>
                  Administrator Options
              </Typography>
          </Toolbar>
          <Divider />
          <List>
            {['Employees', 'Production', 'Sales', 'Customer'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton id={text.toLowerCase()} onClick={handleRedirect} sx={{zIndex:BV_THEME.zIndex.List + 1}}>
                  <ListItemIcon >
                    {index === 0 ? <GroupsIcon /> : 
                      <>{index === 1 ? <WorkspacesIcon /> : 
                        <>{index === 2 ? <RequestPageIcon /> : 
                          <>{index === 3 ? <SupportAgentIcon /> : <MailIcon />} 
                          </>} 
                        </>} 
                      </>}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          </>
      );

      const container = window !== undefined ? () => window().document.body : undefined;


    return (
        <Box display={"flex"} sx={{ display: 'inline-block'}}>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 },  }}
        aria-label="mailbox folders"
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
          <DrawerComp/>
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <DrawerComp/>
        </Drawer>
      </Box>
      </Box>
    )}


    export default BV_Drawer;