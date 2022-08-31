import React, { useState } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Container, Stack, Typography } from '@mui/material'

//*UTILS
import { Add } from '@mui/icons-material'
//THEME
import {BV_THEME} from '../../../theme/BV-theme'

//*Netword and routing
import { useNavigate } from 'react-router-dom'






export const ClientIndex = () => {
    //*DATA STATES

    //*Netword and router
    const navigate = useNavigate()
    
    const handleNewOrder = () => {
        console.log("Redirect user")
        navigate('new')
    } 
    const handleNewCustomer = () => {
        console.log("Redirect user")
        navigate('NewCustomer')
    }  
    
  return (
    <>


    <Box width="100%" height="100%">
        <Container sx={{padding:"2%"}}>
            <Box sx={{
                        width:"100%", 
                        height:"80vh",
                        "& .header-sales-table":{
                            backgroundColor:BV_THEME.palette.primary.main,
                            color:"white"
                        }
                    }}
            >
                
                <Typography variant="h4" textAlign={"center"} margin={BV_THEME.margin.mainHeader}>
                    Client management
                </Typography>

                <Box sx={{width:"100%", height:"100%"}}>
                
                
                <Box sx={{display:"flex", justifyContent:"space-between"}} >
                        <Button variant='contained' color='primary' startIcon={<Add/>} onClick={handleNewCustomer} sx={{minWidth:"20%"}}>
                            New Customer
                        </Button>
                    
                        <Button variant='contained' color='primary' startIcon={<Add/>} onClick={handleNewOrder} sx={{minWidth:"20%"}}>
                            Example Button
                        </Button>
                    </Box>
                    
                    
                </Box>

            </Box>
        </Container>  
    </Box>



    </>
  )
}
