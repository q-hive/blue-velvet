import React from 'react'

//*MUI COMPONENTS
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Grid, Stack, useTheme, } from '@mui/material'
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
import NearbyErrorIcon from '@mui/icons-material/NearbyError';
import TollIcon from '@mui/icons-material/Toll';
import GrassIcon from '@mui/icons-material/Grass';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';

//*ROUTER
import { navigate } from '../utils/router'

//*Contexts
import useAuth from '../contextHooks/useAuthContext'

//*Routing
import { useNavigate } from "react-router-dom";

//Theme
import { BV_THEME } from '../theme/BV-theme';


const BV_Layout = (props) => {
    const {user, logout} = useAuth()
    console.log(user)
    const theme = useTheme(BV_THEME)

    const navigate = useNavigate()

    const handleRedirect = (e) => {
      navigate(`/${user.uid}/admin/${e.target.id}`)
  }

  const handleShowTask = (e) => {
    //Should redirect to a page section, but router doesn't support it. Looking for Alternatives
    navigate(`/${user.uid}/employee/tasks/${e.target.id}`)
}
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
  
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

    const handleFinishTask = () => {

      console.log("task finished");
    };
    
    
    const handleSeeAllTasks = () => {
        navigate(`/${user.uid}/employee/tasks`)
    };

    //TASKS icons
    const importantTask = <NearbyErrorIcon large color="primary" />;
    const normalTask = <TollIcon large color="primary" />;

    //Admin Options Drawer buttons content (label and Icon)
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

    // Options Drawer for Employees 
    const employeeOptions = [
      {
        label:'Home',
        icon:<GroupsIcon color="primary"/>,
      }, 
      {
        label:'Production',
        icon:<WorkspacesIcon color="primary"/>,
      }, 
    ];
    
    
    //Drawer Task array (TESTING PURPOSES)
    const employeeTasks = [
                    {
                      label:'Harvesting',
                      icon:<AgricultureIcon large color="primary" />,
                    }, 
                    {
                      label:'Packing',
                      icon:<InventoryIcon large color="primary" />,
                    }, 
                    {
                      label:'Delivery',
                      icon:<LocalShippingIcon large color="primary" />,
                    }, 
                    {
                      label:'Growing',
                      icon:<GrassIcon large color="primary" />,
                    }
                  ];

    //Settings to show when user avatar is clicked
    const userSettings = [
                    {
                      label:  'Profile',
                      action: () => console.log("Unavailable") 
                    },
                    {
                      label:  'Account',
                      action: () => console.log("Unavailable") 
                    },
                    {
                      label:  'Dashboard',
                      action: () => console.log("Unavailable") 
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
          <Toolbar alignItems="center" sx={{backgroundColor: "#0E0C8F", p:2}}>
            <Typography 
                variant="h6"  
                component="div" 
                color="grey.A100" 
                justifyContent="center" 
                display="block" 
                sx={{margin:"7%",}}
            >
                {user.role === "employee" ?  "Employee Options" : "Administrator Options" }
            </Typography>

          </Toolbar>
          
          <Divider />

          <Box sx={{display:"flex", flexDirection:"column", width:"auto", height:"auto", alignItems:"left", justifyContent:"left", p:2}}>
            {/* IF admin */}
            {user.role === "employee" ? 
                employeeOptions.map((option) => (
                  <Button sx={theme.button.sidebar} id={option.label.toLocaleLowerCase()} startIcon={option.icon} onClick={handleRedirect} >
                    {option.label}
                  </Button>
                ))
                : 

                /*ElSE Employee? */

                  adminOptions.map((option) => (
                    <Button sx={theme.button.sidebar} id={option.label.toLocaleLowerCase()} startIcon={option.icon} onClick={handleRedirect} >
                      {option.label}
                    </Button>
                  ))
              
            }
              
              
            
          </Box> 
            
          <Divider />
        </>
      );


      // FRAGMENT , children of Drawer Component if Employee
      const tasks = (
        <>
          <Toolbar alignItems="center" sx={{backgroundColor: "#0958bf", p:1}}>
            <Typography 
                variant="h6"  
                component="div" 
                color="grey.A100" 
                justifyContent="center" 
                display="block" 
                sx={{marginLeft:"7%",margin:"3%"}}
            >
                Pending Tasks
            </Typography>

          </Toolbar>
          
          <Divider />

          <Box display="flex" sx={{display:"flex", flexDirection:"column", width:"auto", height:"auto", p:2}}>
            {employeeTasks.length != 0 ?
            
            employeeTasks.map((option) => (
                
              <FormGroup sx={{}}>
                <Box display="flex" flexDirection="row">
                  <Button sx={theme.button.sidebar} id={option.label.toLocaleLowerCase()} startIcon={option.icon} onClick={handleShowTask} >
                    {option.label}
                  </Button>
                  <Button variant="outlined" sx={theme.button.task_done} onClick={handleFinishTask}>Done</Button>
                </Box>
              </FormGroup>
          ))
        
            
            : 
            
            <Typography>You currently don't have any pending tasks</Typography>}

            <Button onClick={handleSeeAllTasks}>See all Tasks</Button>
            
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
                      
                      
                      <Typography variant="h6"  component="a" href="#" color="primary" sx={{flexGrow: 1, textDecoration: "none",}}>
                        Blue Velvet
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
                            <Avatar alt="test admin" src="/static/images/avatar/2.jpg" />
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
                          edge="false"
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
                {/* IF Employee */}
                {user.role === "admin" ? "" : {...tasks}}
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
                {/* IF Employee */}
                {user.role === "admin" ? "" : {...tasks}}
              </Drawer>
            </Grid>

            {/*CHILDREN GRID ITEM (PRIVATE ROUTES)*/}
            <Grid item xs={true} wrap>
              <Toolbar />
              {props.children}
            </Grid>
          </Grid>
        </>
    )}


    export default BV_Layout;