import React, { useState } from 'react'

//*Routing
import { useNavigate } from 'react-router'

//*MUI COMPONENTS
import { Box } from '@mui/system'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { 
    Fade, CircularProgress, Collapse, 
    Alert, AlertTitle, Snackbar, 
    Tab, Typography 
} from '@mui/material'


import { LoginInputs } from './LoginInputs'

// * Auth context
import useAuth from '../../contextHooks/useAuthContext.js'


// * Images
import LoginImage from  '../../assets/images/login.jpeg'
import api  from        '../../axios.js'


export const Login = () => {

    const navigate = useNavigate()
    const { setUser } = useAuth()

    const [tabContext, setTabContext] = useState('0')
    const [loading, setLoading] = useState(false)
    const [openPassphrase, setOpenPassphrase] = useState(false)
    const [loginData, setLoginData] = useState({
        email:'',
        password:''
    })
    const [alert, setAlert] = useState({
        open:false,
        status:'info',
        message:'',
        slide:false,
        slideMessage:''
    })

    
    const handleCloseAlert = () => {
        setAlert({
            ...alert,
            open:false,
            slide:false
        })
    }

    const handleTabChange = (e, nv) => {
        setTabContext(nv)
    }


    const handleSignIn = (e) => {
        e.preventDefault()

        setLoading(true)

        //*TODO REFACTOR LOGIN
        //*DONE Send credentials to backend
        //*DONE Await response
        //*DONE Response sets logic for ----> redirect to admin or redirect to employee screen
        //*If admin show modal for passphrase input
        //*If passphrase succeed then redirect to admin
        //*If not, cancel and notify SUPERADMIN
            // TODO: Como se noficvia al superadmin
        api.post('/auth/login', loginData)
        .then(response => {
            console.log(response)

            if (response.data.isAdmin) {
                // * Load passphrase modal
                setOpenPassphrase                

            } else {
                // * It's employee
                if (response.data.data.user.role == 'employee'){
                    
                    const { token, user } = response.data

                    updateToken(token)
                    setUser(user)
                    navigate(`${user.uid}/${user.rol}`)
                    
                    return
                }
                // * Unrecognized role
                setAlert({
                    open:       true,
                    status:     "Error",
                    message:    "Unrecognized role - Access blocked"
                })
            } 
        })
        .catch((err) => {
            console.log(err)
            switch(err.response.status){
                case 400:
                    setAlert({
                        ...alert,
                        status:"error",
                        slide:true,
                        slideMessage:"The data you entered is invalid, please verify the format."
                    })
                    break;
                default:
                    break;
            }
        })
        .finally(() => {
            setLoading(false)
        })
    }

    const handleAdminSignIn = (e) => {
        e.preventDefault()

        setLoading(true)

        api.post('/auth/login/admin', loginData)
        .then(response => {
            console.log(response)

            if (response.data.data.user.role == 'employee'){
                    
                const { token, user } = response.data

                updateToken(token)
                setUser(user)
                navigate(`${user.uid}/${user.rol}`)
                
                return
            }
            // * Unrecognized role
            setAlert({
                open:       true,
                status:     "Error",
                message:    "Unrecognized role - Access blocked"
            })
        })
        .catch((err) => {
            console.log(err)
            switch(err.response.status){
                case 400:
                    setAlert({
                        ...alert,
                        status:"error",
                        slide:true,
                        slideMessage:"The data you entered is invalid, please verify the format."
                    })
                    break;
                default:
                    break;
            }
        })
        .finally(() => {
            setLoading(false)
        })
    }

    const handleLoginData = (e) => {
        setLoginData({
            ...loginData,
            [e.target.id]:e.target.value
        })
    }
    
  return (
        <div style={{width:"100%",height:"100vh", display:"flex", alignItems:"center", justifyContent:"center"}}>
            {
                alert.open
                ?   <Snackbar
                        open={alert.open}
                        onClose={handleCloseAlert}
                        TransitionComponent={Fade}
                        message={alert.message}
                        anchorOrigin={{"vertical":"bottom", "horizontal":"center"}}
                    >
                        <Alert onClose={handleCloseAlert}  severity={alert.status} sx={{width:"100%"}}>{alert.message}</Alert>
                    </Snackbar>
                :   null
            }
            <Box sx={{
                width:"50%", backgroundColor:"#0E0C8F", mixBlendMode:"color",
                alignItems:"center", justifyContent:"center",
                display:{ 
                    xs:"none", sm:"none", 
                    md:"none", lg:"flex"
                },
            }}>
                <img src={LoginImage} alt="login-image" style={{width:"100%", height:"auto"}}></img>
            </Box>
            <Box sx={{width:"50%", backgroundColor:"white"}}>
                <Box sx={{
                    height:"100%", width:"100%",
                    display:"flex", flexDirection:"column",
                    alignItems:"center", justifyContent:"center"
                }}>
                    <TabContext value={tabContext}>
                        <Box sx={{borderBottom:1, borderColor:"#5AB7D4"}}>
                            <TabList onChange={handleTabChange}>
                                <Tab value="0" label="Login"/>
                            </TabList>
                        </Box>
                        <TabPanel value="0">
                            <Box sx={{
                                display:"flex", flexDirection:"column", 
                                alignItems:"center", justifyContent:"center"
                            }}>
                                <Typography variant="h2" 
                                    sx={{fontSize:"4vh", fontWeight:"light", margin:"4vh"}}
                                >
                                    {'Blue Velvet'}
                                </Typography>
                                <Typography variant="h3" 
                                    sx={{fontSize:"4vh", fontWeight:"light", margin:"4vh"}}
                                >
                                    {'Welcome'}
                                </Typography>
                                <LoginInputs 
                                    handleSignIn={handleSignIn}
                                    handleAdminSignIn={handleAdminSignIn}
                                    handleLoginData={handleLoginData}
                                    loginData={loginData}
                                    loading={loading}
                                    openPassphrase={openPassphrase}
                                />
                                {
                                    loading
                                    ?   <CircularProgress/>
                                    :   null
                                }
                                 <Collapse in={alert.slide}>
                                    <Alert severity={alert.status} onClose={handleCloseAlert} open={alert.open}>
                                        <AlertTitle>{alert.status}</AlertTitle>
                                        {alert.slideMessage}
                                    </Alert>
                                </Collapse>
                            </Box>
                        </TabPanel>
                    </TabContext>
                </Box>
            </Box>
        </div>
  )
}
