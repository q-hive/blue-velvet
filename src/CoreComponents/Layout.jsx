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
import ApartmentIcon from '@mui/icons-material/Apartment';
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
import { Language } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import useAppContext from '../contextHooks/appContext';


const BV_Layout = (props) => {
    const {user,credential ,logout} = useAuth()
    const {setApplicationLanguage} = useAppContext()
    const {t, i18n} = useTranslation(['default', 'layout'])
    
    const theme = useTheme(BV_THEME)
    const navigate = useNavigate()

    const handleRedirect = (e) => {
      console.log(user.role)
      navigate(`/${user.uid}/${user.role}/${e.target.id}`)
      if(mobileOpen)setMobileOpen(false)
    }

    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [containerData, setContainerData] = useState({"city":"", "id":""})
  
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };

    //User Menu
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [anchorElLang, setAnchorElLang] = React.useState(null);
    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };

    const handleOpenUserLanguageMenu = (e) => {
      setAnchorElLang(e.currentTarget)
    }
    const handleCloseUserMenuLanguage = () => {
      setAnchorElLang(null)
    }

    //SuperAdmin Options Drawer buttons content (label and Icon)
    const superAdminOptions = [
      {
        label:'Dashboard',
        transKey:'dashboard_sidebar_label',
        icon:<DashboardIcon color="primary"/>,
      }, 
      {
        label:'Organizations',
        transKey:'Organizations',
        // HACK: Change line above to -> 'superadmin_organizations_management_sidebar_label'
        icon:<ApartmentIcon color="primary"/>,
      }, 
    ];
    //Admin Options Drawer buttons content (label and Icon)
    const adminOptions = [
      {
        label:'Dashboard',
        transKey:'dashboard_sidebar_label',
        icon:<DashboardIcon color="primary"/>,
      }, 
      {
        label:'Employees',
        transKey:'admin_employees_management_sidebar_label',
        icon:<GroupsIcon color="primary"/>,
      }, 
      {
        label:'Production',
        transKey:'admin_production_management_sidebar_label',
        icon:<WorkspacesIcon color="primary"/>,
      }, 
      {
        label:'Sales',
        transKey:'admin_sales_management_sidebar_label',
        icon:<RequestPageIcon color="primary"/>,
      }, 
      {
        label:'Client',
        transKey:'admin_customer_management_sidebar_label',
        icon:<SupportAgentIcon color="primary"/>,
      }
    ];

    // Options Drawer for Employees 
    const employeeOptions = [
      {
        label:'Dashboard',
        transKey:'employee_dashboard_sidebar_label',
        icon:<DashboardIcon color="primary"/>,
      }, 
      {
        label:'Production',
        transKey:'employee_production_sidebar_label',
        icon:<WorkspacesIcon color="primary"/>,
      }, 
    ];

    const languages = [
      {
        "lng":"en",
        "label":"English"
      },
      {
        "lng":"zh",
        "label":"Chinese"
      },
      {
        "lng":"de",
        "label":"German"
      },
      {
        "lng":"fr",
        "label":"French"
      },
      {
        "lng":"it",
        "label":"Italian"
      },
    ]

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
          
    const handleChangeLanguage = (language) => {
      setApplicationLanguage(language)
    }
    
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
                    //margin:{xs:6,md:2},
                  }}
            >
              <Typography 
                  variant="h5"  
                  component="div" 
                  color="grey.A100" 
                  display="block" 
              >
                  {
                    user.role === "employee"
                      ?  `${t('drawer_title_employee',{ns:'layout'})}`
                      : (
                        user.role === "admin"
                          ? `${t('drawer_title_admin',{ns:'layout'})}`
                          : `${t('SuperAdmin Options',{ns:'layout'})}`
                          // HACK: Change line above for this --> : `${t('drawer_title_admin',{ns:'layout'})}`
                        ) 
                  }
              </Typography>
            </Box>
          </Toolbar>
          
          <Divider />

          <Box sx={{display:"flex", flexDirection:"column", width:"auto", height:"auto", alignItems:"left", justifyContent:"left", p:2}}>
            {/* IF Employee */}
            {user.role === "employee" ? 
                employeeOptions.map((option) => (
                  <Button key={option.label} sx={theme.button.sidebar} id={option.label.toLocaleLowerCase()} startIcon={option.icon} onClick={handleRedirect} >
                    {t(`${option.transKey}`,{ns:'layout'})}
                  </Button>
                ))
                : 

                /*ElSE ? admin*/

                (
                  user.role === "admin"
                    ? adminOptions.map((option) => (
                        <Button key={option.label} sx={theme.button.sidebar} id={option.label.toLocaleLowerCase()} startIcon={option.icon} onClick={handleRedirect} >
                          {t(`${option.transKey}`,{ns:'layout'})}
                        </Button>
                      ))
                    : superAdminOptions.map((option) => (
                        <Button key={option.label} sx={theme.button.sidebar} id={option.label.toLocaleLowerCase()} startIcon={option.icon} onClick={handleRedirect} >
                          {t(`${option.transKey}`,{ns:'layout'})}
                        </Button>
                      )) 
                )
              
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
                            maxHeight: { xs: 45,sm:60, md: 80 },
                          }}
                          alt="GreenBox by Blue Velvet"
                          src={Logo}
                        />
                      </Box>

                      
                        <Box paddingLeft={"20px"} flexDirection={"column"} sx={{display:"flex",paddingLeft:1}}>
                          <Box sx={{display:{xs:"none",sm:"flex"},paddingLeft:1}} justifyContent={"center"}>
                            <Clock color="secondary.dark"/>
                          </Box> 
                        <Typography color="secondary.dark" fontSize={{xs:"1.5vh",md:"2vh"}} variant="h6" flexGrow={0}>{t('layout_cont_container_location')} {containerData.city}</Typography>  

                        </Box>
                      
                      {/*<IconButton
                        size="large" edge={false}
                      >
                        <NotificationsIcon />
                        </IconButton>*/}

                      <Box sx={{flexGrow:0}}>

                        <IconButton
                          size="large" 
                          edge={false}
                          onClick={handleOpenUserLanguageMenu}
                          
                        >
                          <Language />
                        </IconButton>
                        <Menu
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          anchorEl={anchorElLang}
                          open={Boolean(anchorElLang)}
                          onClose={handleCloseUserMenuLanguage}
                          keepMounted
                        >
                          {
                            languages.map((lng, idx) =>(
                              <MenuItem key={idx} onClick={() => handleChangeLanguage(lng.lng)}>
                                <Typography textAlign="center">{lng.label}</Typography>
                              </MenuItem>  
                            ))
                          }
                        </Menu>

                      </Box>


                    

                      {/*AVATAR BUTTON AND MENU*/ }
                      <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                          <IconButton edge={false} onClick={handleOpenUserMenu} sx={{ p: 0 , m: 2}}>
                            <Avatar alt={user.name} src="/static/images/avatar/2.jpg" sx={{ width: {xs:26,sm:28,md:35}, height: {xs:26,sm:28,md:35} }}/>
                          </IconButton>
                        </Tooltip>
                        <Menu
                          sx={{ mt: '50px' }}
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
                          {user.role === "employee" ? 
                          
                          userSettings.map((setting, idx) => (
                            <MenuItem key={idx} onClick={setting.action}>
                              <Typography textAlign="center">{setting.label}</Typography>
                            </MenuItem>
                          ))
                        :
                        <MenuItem onClick={userSettings[1].action}>
                              <Typography textAlign="center">{userSettings[1].label}</Typography>
                        </MenuItem>
                        }
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
                  keepMounted: false, // Better open performance on mobile.
                }}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: {xs:'80%',sm:"50%"} },
                  
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