import React from 'react'

//*MUI Components
import { Box, Button } from '@mui/material'

//*Routing
import { useNavigate } from 'react-router-dom'

//*Environment
import { isDev } from '../../utils/TestUtils'

//*Contexts
import useAuth from '../../contextHooks/useAuthContext'

export const SecurityPhraseComponent = () => {
    const navigate = useNavigate()
    
    const {user} = useAuth()
    const handlePassPhrase = () => {
        if(isDev) {
            navigate(`/${user.uid}/admin/dashboard`)        
        }
    }
    
    
    return (
        <Box sx={
            {
                display:"flex", 
                flexDirection:"column", 
                width:"100vw", 
                height:"100vh",
                alignItems:"center",
                justifyContent:"center"
            }
        }>
            Vista del ADMINISTRADOR
            PONER LA PASSPHRASE
            
            <Button variant='contained' onClick={handlePassPhrase}>
                Validate Passphrase
            </Button>
        </Box>
    )
}