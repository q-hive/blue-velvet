import React, { useEffect, useState } from 'react'
//*Contexts
import useAuth from '../../../contextHooks/useAuthContext'
//*MUI Components
// import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Container, LinearProgress, Stack, Typography } from '@mui/material'

//*UTILS
import { Add } from '@mui/icons-material'
//THEME
import {BV_THEME} from '../../../theme/BV-theme'

//*Netword and routing
import { useNavigate } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid'
import { CustomerColumns } from '../../../utils/TableStates'
import api from '../../../axios.js'





export const ClientIndex = () => {
    //*CONTEXTS
    const {user, credential} = useAuth()
    const [loading, setLoading] = useState(false)
    
    //*DATA STATES
    const [rows, setRows] = useState([])
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

    useEffect(() => {
        const getCustomers = async () => {
            const response = await api.api.get(`${api.apiVersion}/customers/`, {
                headers: {
                    authorization:  credential._tokenResponse.idToken,
                    user:           user
                }
            })

            return response.data.data
        }
        setLoading(true)
        getCustomers()
        .then((data) => {
            setRows(data)
            setLoading(false)
        })
        .catch(err => {
            console.log(err)
        })
    },[])
    
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
                
                <Typography variant="h4" color="secondary" textAlign={"center"} margin={BV_THEME.margin.mainHeader}>
                    Client Management
                </Typography>

            <Box sx={{width:"100%", height:"100%"}}>
                
                <Box sx={{display:"flex", justifyContent:"space-between", marginBottom:"3vh"}} >
                    <Button variant='contained' color='primary' startIcon={<Add/>} onClick={handleNewCustomer} sx={{minWidth:"20%"}}>
                        New Customer
                    </Button>
                </Box>

                {
                    loading
                    ?   
                    <LinearProgress color="primary" sx={{marginY:"2vh"}}/>
                    : 
                    <DataGrid
                    columns={CustomerColumns}
                    rows={rows}
                    sx={{width:"100%", height:"80%"}}
                    getRowId={(row) => {
                        return row._id
                    }}
                    />
                }
                </Box>


            </Box>
        </Container>  
    </Box>



    </>
  )
}
