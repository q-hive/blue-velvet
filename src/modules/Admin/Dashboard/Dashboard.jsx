import React from 'react'

//*MUI COMPONENTS
import { Box, Button, Container, Stack, useTheme } from '@mui/material'

//*ROUTER
import { navigate } from '../../../utils/router'

//*Contexts
import useAuth from '../../../contextHooks/useAuthContext'

//*Routing
import { useNavigate } from "react-router-dom";
//Theme
import { BV_THEME } from '../../../theme/BV-theme';


export const Dashboard = () => {
    const {user} = useAuth()

    const theme = useTheme(BV_THEME)

    const navigate = useNavigate()

    const handleRedirect = (e) => {
        navigate(`/${user.uid}/admin/${e.target.id}`)
    }
    
  return (
    <>
    
    
    <Box width="100%">
        <Box sx={{display:"flex", flexDirection:"column", height:"100vh", alignItems:"center", justifyContent:"center"}}>
            <Button sx={theme.button.dashboard} id="employees" onClick={handleRedirect} variant='contained'>
                Employees
            </Button>
            <Button sx={theme.button.dashboard} id="production" onClick={handleRedirect} variant='contained'>
                Production
            </Button>
            <Button sx={theme.button.dashboard} id="sales" onClick={handleRedirect} variant='contained'>
                Sales
            </Button>
            <Button sx={theme.button.dashboard} id="Client" onClick={handleRedirect} variant='contained'>
                Client
            </Button>
        </Box>
    </Box>

    
    </>
  )
}
