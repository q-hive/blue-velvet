import React, { useState } from 'react'

//*MUI Components
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Container, Stack, Typography } from '@mui/material'

//*UTILS
import { salesColumns } from '../../../utils/TableStates'
import { Add } from '@mui/icons-material'
//THEME
import {BV_THEME} from '../../../theme/BV-theme'

//*Netword and routing
import { useNavigate } from 'react-router-dom'






export const SalesIndex = () => {
    //*DATA STATES
    const [orders, setOrders] = useState([])

    //*Netword and router
    const navigate = useNavigate()
    
    const handleNewOrder = () => {
        console.log("Redirect user")
        navigate('new')
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
                    Sales management
                </Typography>

                <Box sx={{width:"100%", height:"100%"}}>
                
                
                <Box sx={{display:"flex", justifyContent:"space-between"}} >
                        <Button variant='contained' color='primary' startIcon={<Add/>} onClick={handleNewOrder} sx={{minWidth:"20%"}}>
                            New order
                        </Button>
                    </Box>
                    
                    <DataGrid
                        columns={salesColumns}
                        rows={orders}
                        sx={{marginY:"2vh",}}
                    />
                </Box>

            </Box>
        </Container>  
    </Box>



    </>
  )
}
