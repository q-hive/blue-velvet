import React from 'react'
import { Box } from '@mui/system'
import { Button, TextField } from '@mui/material'

//*Icons
import LoginIcon from '@mui/icons-material/Login';


export const Login = () => {
  return (
    <Box sx={{display:"flex", width:"100vw", height:"100vw"}}>
        <Box sx={{height:"100%", width:"50%"}}>
            LOGO
        </Box>

        <Box sx={{height:"100%", width:"50%"}}>
            
            <TextField/>
            <TextField/>
            
            <Button endIcon={<LoginIcon/>}>Login</Button>          
        </Box>
    </Box>
    
  )
}
