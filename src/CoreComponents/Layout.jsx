import React, { useState } from 'react'

//*MUI COMPONENTS
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Grid, Stack, useTheme, } from '@mui/material'
//Appbar
import { AppBar, Toolbar, IconButton, Typography, Menu, Container, Tooltip, Avatar, MenuItem} from '@mui/material'



//Side drawer
import { Divider, Drawer, } from '@mui/material'

//Icons
import MenuIcon from '@mui/icons-material/Menu';
import GroupsIcon from '@mui/icons-material/Groups';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NearbyErrorIcon from '@mui/icons-material/NearbyError';
import TollIcon from '@mui/icons-material/Toll';
import GrassIcon from '@mui/icons-material/Grass';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
//images
import Logo from  "../assets/images/png-Logos/softwareLogo.png"

//*ROUTER
import { navigate } from '../utils/router'

//*Contexts
import useAuth from '../contextHooks/useAuthContext'

//*Routing
import { useNavigate } from "react-router-dom";

//Theme
import { BV_THEME } from '../theme/BV-theme';
import { useEffect } from 'react';
import { Clock } from './Clock';
import { Timer } from './Timer';
import { getContainerData } from './requests';


const BV_Layout = (props) => {
    const {user,credential ,logout} = useAuth()
    const theme = useTheme(BV_THEME)
    const navigate = useNavigate()

    const handleRedirect = (e) => {
      console.log(user.role)
      navigate(`/${user.uid}/${user.role}/${e.target.id}`)
    }

    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [containerData, setContainerData] = useState({"city":"", "id":""})
  
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };

    //User Menu
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };

    //Admin Options Drawer buttons content (label and Icon)
    const adminOptions = [
      {
        label:'Dashboard',
        icon:<DashboardIcon color="primary"/>,
      }, 
      {
        label:'Employees',
        icon:<GroupsIcon color="primary"/>,
      }, 
      {
        label:'Production',
        icon:<WorkspacesIcon color="primary"/>,
      }, 
      {
        label:'Sales',
        icon:<RequestPageIcon color="primary"/>,
      }, 
      {
        label:'Client',
        icon:<SupportAgentIcon color="primary"/>,
      }
    ];

    // Options Drawer for Employees 
    const employeeOptions = [
      {
        label:'Dashboard',
        icon:<DashboardIcon color="primary"/>,
      }, 
      {
        label:'Production',
        icon:<WorkspacesIcon color="primary"/>,
      }, 
    ];

    //Settings to show when user avatar is clicked
    const userSettings = [
      {
        label:  'Profile',
        action: () => navigate(`/${user.uid}/${user.role}/profile`) 
      },
      {
        label:  'Logout',
        action: () => logout() 
      },
    ];
          
    
    // FRAGMENT , children of Drawer Component 
    const drawer = (
        <>
          <Toolbar />
          <Toolbar sx={{backgroundColor: "#93cf0f",padding:6}}>
            
            <Box  alignitems="justify" 
                  sx={{
                    justifyContent:"center",
                    textAlign:"center",
                    width:"100%",
                    margin:2,
                  }}
            >
              <Typography 
                  variant="h5"  
                  component="div" 
                  color="grey.A100" 
                  display="block" 
              >
                  {user.role === "employee" ?  "Employee Options" : "Administrator Options" }
              </Typography>
            </Box>
          </Toolbar>
          
          <Divider />

          <Box sx={{display:"flex", flexDirection:"column", width:"auto", height:"auto", alignItems:"left", justifyContent:"left", p:2}}>
            {/* IF admin */}
            {user.role === "employee" ? 
                employeeOptions.map((option) => (
                  <Button key={option.label} sx={theme.button.sidebar} id={option.label.toLocaleLowerCase()} startIcon={option.icon} onClick={handleRedirect} >
                    {option.label}
                  </Button>
                ))
                : 

                /*ElSE Employee? */

                  adminOptions.map((option) => (
                    <Button key={option.label} sx={theme.button.sidebar} id={option.label.toLocaleLowerCase()} startIcon={option.icon} onClick={handleRedirect} >
                      {option.label}
                    </Button>
                  ))
              
            }
              
              
            
          </Box> 
            
          <Divider />
        </>
      );
    

    // FRAGMENT , cleaner look on layout
    const appBar = (
              <>
                <AppBar
                    position="fixed"
                    sx={{
                          width: { sm: "100%" },
                          ml: { sm: `0%` },
                          height:"auto",
                          backgroundColor:"#F9F9F9",
                          alignItems:"space-between",
                          zIndex:BV_THEME.zIndex.drawer + 1,
                        }}
                  >
                    <Toolbar sx={{alignItems:"space-between"}}>
                      
                      <Box component="a" sx={{flexGrow: 1 }}>
                        <Box
                          component="img"
                          sx={{
                            maxHeight: { xs: 65, md: 80 },
                          }}
                          alt="GreenBox by Blue Velvet"
                          src={Logo}
                        />
                      </Box>

                      
                      <Typography>
                        <Clock color="secondary.dark"/>
                        <Typography color="secondary.dark" variant="h6" flexGrow={0}>Container location: {containerData.city}</Typography>  
                      </Typography>
                      
                      <IconButton
                        size="large" edge={false}
                      >
                        <NotificationsIcon />
                      </IconButton>
                    

                      {/*AVATAR BUTTON AND MENU*/ }
                      <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                          <IconButton edge={false} onClick={handleOpenUserMenu} sx={{ p: 0 , m: 2}}>
                            <Avatar alt={user.name} src="/static/images/avatar/2.jpg" />
                          </IconButton>
                        </Tooltip>
                        <Menu
                          sx={{ mt: '60px' }}
                          id="menu-appbar"
                          anchorEl={anchorElUser}
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          keepMounted
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          open={Boolean(anchorElUser)}
                          onClose={handleCloseUserMenu}
                        >
                          {userSettings.map((setting, idx) => (
                            <MenuItem key={idx} onClick={setting.action}>
                              <Typography textAlign="center">{setting.label}</Typography>
                            </MenuItem>
                          ))}
                        </Menu>
                      </Box>
                      {/* END AVATAR BUTTON AND MENU*/ }

                      <IconButton
                          color="inherit"
                          aria-label="open drawer"
                          edge={false}
                          onClick={handleDrawerToggle}
                          sx={{ mr: 2, display: { md: 'none' } }}
                      >
                          <MenuIcon color="primary" />
                      </IconButton>
                    </Toolbar>
                    
                </AppBar>
              </>
    )

    const container = window !== undefined ? () => window().document.body : undefined;
                            
    React.useEffect(() => {
      getContainerData(user,credential,user.assignedContainer)
      .then((containerResponse) => {
        setContainerData((container) => {
          return {
            ...container,
            city:containerResponse[0].address.city
          }
        })
      })
      .catch((err) => {console.log("Error getting containers data")})
    },[])
    
    return (
        <>
          <Grid container spacing={1}>
            
            {/*APPBAR GRID ITEM*/}
            <Grid item xs={12} >
                {appBar}
            </Grid>

            {/*DRAWER GRID ITEM*/}
            <Grid item xs='auto'  md={3} lg={2}>
              <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '80%' },
                  
                }}
              >
                
                {drawer}
              </Drawer>

              <Drawer
                  variant="permanent"
                  sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: {md:'25%',lg:"16.6%"} },
                  }}
                  open
              >
                {drawer}
              </Drawer>
            </Grid>

            {/*CHILDREN GRID ITEM (PRIVATE ROUTES)*/}
            <Grid item xs={true} md={9} lg={10}>
              <Toolbar />
              {props.children}
            </Grid>
          </Grid>
        </>
    )}


    export default BV_Layout;