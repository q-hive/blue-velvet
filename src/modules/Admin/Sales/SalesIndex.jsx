import React, { useState } from 'react'

//*MUI Components
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button } from '@mui/material'

//*UTILS
import { salesColumns } from '../../../utils/TableStates'
import { Add } from '@mui/icons-material'

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
    <Box sx={{width:"100%", height:"100%"}}>
        <Box sx={{display:"flex", width:"100%", justifyContent:"flex-end"}}>
            <Button variant='contained' color='primary' startIcon={<Add/>} onClick={handleNewOrder}>
                New order
            </Button>
        </Box>
        
        <DataGrid
            columns={salesColumns}
            rows={orders}
        />
    </Box>
    </>
  )
}
