import React, { useState } from 'react'

//*Routing
import { useNavigate } from 'react-router'

//*MUI COMPONENTS
import { Box } from '@mui/system'
import { Button, TextField, Fade, CircularProgress, Collapse, Alert, AlertTitle, Snackbar, Tab, Typography } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'

//*Auth context
import useAuth from '../contextHooks/useAuthContext.js'

//*Icons
import LoginIcon from '@mui/icons-material/Login';

//*Iamges
import LoginImage from '../assets/images/login.jpeg'
import api from '../axios.js'


export const Login = () => {
    const [alert, setAlert] = useState({
        open:false,
        status:'info',
        message:'',
        slide:false,
        slideMessage:''
    })

    const [tabContext, setTabContext] = useState('0')

    const [loginData, setLoginData] = useState({
        email:'',
        password:''
    })

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    
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


    const {setUser} = useAuth()
    const handleSignIn = (e) => {
        e.preventDefault()

        setLoading(true)

        //*TODO REFACTOR LOGIN
        //*DONE Send credentials to backend
        //*DONE Await response
        //*DONE Response sets logic for ----> redirect to admin or redirect to employee screen
        //*If admin show compontent for passphrase input
        //*If passphrase succeed then redirect to admin
        //*If not, cancel and notify SUPERADMIN

        // api.post('/auth/login', loginData)
        // .then(response => {
        //     setLoading(false)
        //     console.log(response)
        //     if(response.data.data.user.rol){
        //         setUser(response.data.data.user)
        //         //*TODO NAVIGATE TO USER ADMINI PASSPHRASE IF ADMIN
        //         navigate(`${response.data.data.user.uid}/${response.data.data.user.rol}`)
        //         return
        //     }
        //     setAlert({
        //         open:true,
        //         status:"error",
        //         message:"alejate alv"
        //     })
            
            
        // })
        // .catch((err) => {
        //     console.log(err)
        //     console.log(err.response)
        //     setLoading(false)
        //     switch(err.response.status){
        //         case 400:
        //             setAlert({
        //                 ...alert,
        //                 status:"error",
        //                 open:true,
        //                 slideMessage:"The data you entered is invalid, please verify the format."
        //             })
        //             break;
        //         default:
        //             break;
        //     }
        // })
        
        setUser("falseUser")
//      //*TODO NAVIGATE TO USER ADMINI PASSPHRASE IF ADMIN
        navigate(`thisIsTestUID/admin`)
        
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
                ?
                <Snackbar
                open={alert.open}
                onClose={handleCloseAlert}
                TransitionComponent={Fade}
                message={alert.message}
                anchorOrigin={{"vertical":"bottom", "horizontal":"center"}}
                
                >
                    <Alert onClose={handleCloseAlert}  severity={alert.status} sx={{width:"100%"}}>{alert.message}</Alert>
                </Snackbar>
                :
                null
            }
            <Box sx={{width:"50%", backgroundColor:"#0E0C8F", mixBlendMode:"color",display:{xs:"none", sm:"none", md:"none", lg:"flex"}, alignItems:"center", justifyContent:"center"}}>
                <img  src={LoginImage} alt="login-image" style={{width:"100%", height:"auto"}}></img>
            </Box>
            <Box sx={{width:"50%", backgroundColor:"white"}}>
                <Box sx={{height:"100%", width:"100%",display:"flex", flexDirection:"column",alignItems:"center", justifyContent:"center"}}>
                    <TabContext value={tabContext}>
                        <Box sx={{borderBottom:1, borderColor:"#5AB7D4"}}>
                            <TabList onChange={handleTabChange}>
                                <Tab value="0" label="Login"/>
                            </TabList>
                        </Box>
                        <TabPanel value="0">
                            <Box sx={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                                <Typography variant="h2" sx={{fontSize:"4vh", fontWeight:"light", margin:"4vh"}}>{'Blue Velvet'}</Typography>
                                <Typography variant="h3" sx={{fontSize:"4vh", fontWeight:"light", margin:"4vh"}}>{'Welcome'}</Typography>
                                <div>
                                    <Box component="form" sx={
                                        {
                                            display:"flex",
                                            flexDirection:"column"
                                        }
                                    }

                                    onSubmit={handleSignIn}
                                    >
                                        <TextField 
                                            variant="outlined" 
                                            name="user"
                                            id="email" 
                                            helperText="correo electrónico"
                                            autoComplete='on'
                                            disabled={loading}
                                            onChange={handleLoginData}
                                        />
                                        <TextField 
                                            variant="outlined" 
                                            name="pass"
                                            type="password" 
                                            id="password"
                                            helperText="Contraseña"
                                            autoComplete='off'
                                            disabled={loading}
                                            onChange={handleLoginData}
                                        />
                                        <Button variant='contained' color='primary' endIcon={<LoginIcon/>} type="submit">{loading ? "Loading..." : "Login"}</Button>
                                    </Box>
                                </div>
                                {
                                    loading
                                    ?
                                    <CircularProgress/>
                                    :
                                    null
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
