import React from 'react'

//*MUI COMPONENTS
import { Box, Button } from '@mui/material'

//*ROUTER
import { navigate } from '../../../utils/router'

//*Contexts
import useAuth from '../../../contextHooks/useAuthContext'

//*Routing
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const {user} = useAuth()

    const navigate = useNavigate()

    const handleRedirect = (e) => {
        navigate(`/${user.uid}/admin/${e.target.id}`)
    }
    
  return (
    <Box sx={{display:"flex", flexDirection:"column", width:"100vw", height:"100vh", alignItems:"center", justifyContent:"center"}}>
        <Button sx={{marginY:"15px"}} id="employees" onClick={handleRedirect} variant='contained'>
            Employees
        </Button>
        <Button sx={{marginY:"15px"}} id="production" onClick={handleRedirect} variant='contained'>
            Production
        </Button>
        <Button sx={{marginY:"15px"}} id="sales" onClick={handleRedirect} variant='contained'>
            Sales
        </Button>
        <Button sx={{marginY:"15px"}} id="customer" onClick={handleRedirect} variant='contained'>
            Customer
        </Button>
    </Box>
  )
}
