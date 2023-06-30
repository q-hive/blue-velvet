import { Box, Button, Stack, Typography } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'
import BV_Layout from './Layout'
import { CircularProgress} from '@mui/material'
import useAuth from '../contextHooks/useAuthContext'
import { auth } from '../firebaseInit.js'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from "../assets/images/png-Logos/GreenBox-Logo.png"


export const PrivateRoutes = (props) => {
    const {user, setUser, loading} = useAuth()
    const navigate = useNavigate()
    if(!user) {
        return (
            <>
              {
                !auth.currentUser && !loading && (
                  <Box sx={{margin:"3vh", padding:"3vh", textAlign:"center", justifyContent:"center"}}>
                    <Box component="img" src={Logo} sx={{
                            maxHeight: { xs: 65, md: 100 }, 
                            margin:"3em"
                    }}/>
                      <Typography variant="h5">NO EXISTE USUARIO, no deberias estar aqui</Typography>
                    
                      <Button variant="contained" color="primary" onClick={()=>navigate("/")} sx={{marginTop:"3vh"}}>
                        Ingresar
                      </Button> 
                  </Box> 
                )
              }

              {
              
                loading && (
                  <div style={{width:"100vw", height:"100vh", display:"flex", alignItems:"center", justifyContent:"center"}}>
                    <CircularProgress/>  
                  </div>
                )
              }


            </>
        )
    }

  return (
    <>
      <BV_Layout>
        {props.children}
      </BV_Layout>
    </>
  )
}
