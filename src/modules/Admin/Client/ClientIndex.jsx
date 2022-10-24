import React, { useEffect, useState } from 'react'
//*Contexts
import useAuth from '../../../contextHooks/useAuthContext'
//*MUI Components
// import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Container, Fade, LinearProgress, Stack, Typography } from '@mui/material'

//*UTILS
import { Add } from '@mui/icons-material'
//THEME
import {BV_THEME} from '../../../theme/BV-theme'

//*Netword and routing
import { useNavigate } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid'
import { CustomerColumns } from '../../../utils/TableStates'
import api from '../../../axios.js'
import { UserDialog } from '../../../CoreComponents/UserFeedback/Dialog'





export const ClientIndex = () => {
    //*CONTEXTS
    const {user, credential} = useAuth()
    
    //*DATA STATES
    const [rows, setRows] = useState([])
    //*Netword and router
    const navigate = useNavigate()
    
    const [loading, setLoading] = useState(false)
    const [dialog, setDialog] = useState({
        open:       false,
        title:      "",
        message:    "",
        actions:    []
    })
    
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
            setLoading(false)
            setRows(data)
            if(data.length === 0 ){
                setDialog({
                    ...dialog,
                    open:true,
                    title:"You have no customers added",
                    message:"Please add at least one customer in order to manage them",
                    actions: [
                        {
                            label:"Add customer",
                            execute: () => navigate('NewCustomer')
                        },
                        {
                            label: "Cancel",
                            execute: () => navigate(`/${user.uid}/${user.role}/dashboard`)
                        }
                    ]
                })
            }
        })
        .catch(err => {
            console.log(err)
        })
    },[])
    
  return (
    <>
    
    <Fade in={true} timeout={1000} unmountOnExit>
        <Box width="100%" height="100%">
            <UserDialog dialog={dialog} setDialog={setDialog} open={dialog.open} title={dialog.title} content={dialog.message} actions={dialog.actions}/>
            
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
    </Fade>



    </>
  )
}
