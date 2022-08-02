import React from 'react'

//*MUI COMPONENTS
import { Box, Button, Grid, Stack, useTheme, } from '@mui/material'
//Appbar
import { AppBar, Toolbar, IconButton, Typography, Menu, Container, Tooltip, Avatar, MenuItem} from '@mui/material'



//Side drawer
import { Divider, Drawer, } from '@mui/material'

//Icons
import MenuIcon from '@mui/icons-material/Menu';
import GroupsIcon from '@mui/icons-material/Groups';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';

//*ROUTER
import { navigate } from '../utils/router'

//*Contexts
import useAuth from '../contextHooks/useAuthContext'

//*Routing
import { useNavigate } from "react-router-dom";

//Theme
import { BV_THEME } from '../theme/BV-theme';


const BV_Layout = (props) => {
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

    
const adminOptions = [
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


  
    // FRAGMENT , children of Drawer Component 
    const drawer = (
        <>
          <Toolbar sx={{backgroundColor: "#0E0C8F",}}>
            
            <Typography 
                variant="h6"  
                component="div" 
                color="grey.A100" 
                justifyContent="center" 
                display="block" 
                sx={{marginTop:"50%"}}
            >
                Administrator Options
            </Typography>

          </Toolbar>
          
          <Divider />

          <Box sx={{display:"flex", flexDirection:"column", width:"auto", height:"auto", alignItems:"left", justifyContent:"left"}}>
            {adminOptions.map((option) => (
                <Button sx={theme.button.sidebar} id={option.label.toLocaleLowerCase()} startIcon={option.icon} onClick={handleRedirect} >
                  {option.label}
                </Button>
              ))
            }
          </Box> 
            
          <Divider />
        </>
      );

    const container = window !== undefined ? () => window().document.body : undefined;


    return (
        <>
          <Grid container spacing={1} wrap="wrap">
            <Grid item xs={12} >
              
              {/*APPBAR BEGINS*/}
                <Box sx={{ display: 'flex' }}>
                      
                  <AppBar
                    position="sticky"
                    sx={{
                          width: { sm: "100%" },
                          ml: { sm: `0%` },
                          zIndex:"3000",
                          height:"5%",
                          backgroundColor:"#F9F9F9",
                          alignItems:"space-between"
                        }}
                  >
                    <Toolbar sx={{alignItems:"space-between"}}>
                      
                      
                      <Typography variant="h6"  component="div" color="primary" sx={{flexGrow: 1}}>
                        Blue Velvet
                      </Typography>
                      
                      <IconButton
                        size="large" edge="end"
                      >
                        <NotificationsIcon />
                      </IconButton>

                      <IconButton
                        size="large" edge="end"
                      >
                        <AccountCircle />
                      </IconButton>

                      <IconButton
                          color="inherit"
                          aria-label="open drawer"
                          edge="end"
                          onClick={handleDrawerToggle}
                          sx={{ mr: 2, display: { md: 'none' } }}
                      >
                          <MenuIcon color="primary" />
                      </IconButton>
                    </Toolbar>
                    
                   </AppBar>
                      
                </Box>
              {/*APPBAR ENDS*/}
            </Grid>


            <Grid item xs='auto'  md={3} lg={2} wrap="wrap">
            
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
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 'auto' },
                  
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


            <Grid item xs={true} wrap="wrap">
              {props.children}
            </Grid>
          </Grid>
        
        </>
    )}


    export default BV_Layout;