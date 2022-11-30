import React, { useEffect, useState } from 'react'

//*MUI Components
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Container, Fade, Grid, Grow, LinearProgress, Paper, Stack, Typography } from '@mui/material'

//*UTILS
import { deliveredSalesColumns, recentSalesColumns, salesColumns } from '../../../utils/TableStates'
import { Add } from '@mui/icons-material'
//THEME
import {BV_THEME} from '../../../theme/BV-theme'

//*Netword and routing
import { useNavigate } from 'react-router-dom'
import api from '../../../axios.js'
import useAuth from '../../../contextHooks/useAuthContext'

import { getCustomerData } from '../../../CoreComponents/requests'




export const SalesIndex = () => {
    const {user, credential} = useAuth()
    
    //*DATA STATES
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalIncome, setTotalIncome] = useState(0)

    //*Netword and router
    const navigate = useNavigate()
    
    const handleNewOrder = () => {
        console.log("Redirect user")
        navigate('new')
    }
    
    const fixedHeightPaper = {
        padding: BV_THEME.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
        height: 480
    }
    
    
    useEffect(() => {
        getCustomerData({
            setOrders:setOrders,
            setTotalIncome:setTotalIncome,
            user:user,
            credential:credential,
            setLoading:setLoading
        })
        console.log("data STATES",orders,totalIncome)

        
    }, [])
  return (
    <>

    <Fade in={true} timeout={1000} unmountOnExit>
    <Box width="100%" height="auto" >
        <Container sx={{padding:"2%"}}>
            <Box sx={{
                        width:"100%", 
                        "& .header-sales-table":{
                            backgroundColor:BV_THEME.palette.primary.main,
                            color:"white"
                        }
                    }}
            >
                
                <Typography variant="h4" color="secondary" textAlign={"center"} margin={BV_THEME.margin.mainHeader}>
                    Sales management
                </Typography>

                <Box sx={{width:"100%", height:"100%"}}>
                
                
                    <Box sx={{display:"flex", justifyContent:"space-between"}} >
                        <Button variant='contained' color='primary' startIcon={<Add/>} onClick={handleNewOrder} sx={{minWidth:"20%"}}>
                            New order
                        </Button>
                        <Typography>
                            Orders' Total Income : ${totalIncome.toFixed(2)}
                        </Typography>
                    </Box>
                    {/*
                        loading
                        ?   
                        <LinearProgress color="primary" sx={{marginY:"2vh"}}/>
                        :   
                        <DataGrid
                            columns={salesColumns}
                            rows={orders}
                            sx={{marginY:"2vh",}}
                        />
                    */}
                </Box>




            </Box>
        </Container>


        
        {/* GRID CONTAINER */}
        <Container maxWidth="xl" sx={{paddingTop:1,paddingBottom:4,marginX:{xs:4,md:"auto"},marginTop:{xs:4,md:1},
                                        "& .header-sales-table":{
                                            backgroundColor:BV_THEME.palette.primary.main,
                                            color:"white"
                                        }}}>
        <Grid container maxWidth={"xl"} spacing={3}>
            
            
            {/* Recent */}
            <Grow in={true} timeout={2000} unmountOnExit>
            <Grid item xs={12} md={6} lg={4}>
                <Paper elevation={4} sx={fixedHeightPaper}>
                    <Typography variant="h6" color="secondary">
                        Recent
                    </Typography>

                    {
                        loading
                        ?   
                        <LinearProgress color="primary" sx={{marginY:"2vh"}}/>
                        :   
                        <DataGrid
                            columns={recentSalesColumns}
                            rows={orders}
                            sx={{marginY:"2vh",}}
                        />
                    }      
                </Paper>
            </Grid>
            </Grow>

            {/* Delivered */}
            <Grow in={true} timeout={2000} unmountOnExit>
            <Grid item xs={12} md={6} lg={4}>
                <Paper elevation={4} sx={fixedHeightPaper}>
                    <Typography variant="h6" color="secondary">Delivered</Typography>

                    {
                        loading
                        ?   
                        <LinearProgress color="primary" sx={{marginY:"2vh"}}/>
                        :   
                        <DataGrid
                            columns={deliveredSalesColumns}
                            rows={orders}
                            sx={{marginY:"2vh",}}
                        />
                    }        
                </Paper>
            </Grid>
            </Grow>

            {/* Cancelled */}
            <Grow in={true} timeout={2000} unmountOnExit>
            <Grid item xs={12} md={6} lg={4}>
                <Paper elevation={4} sx={fixedHeightPaper}>
                    <Typography variant="h6" color="secondary">Cancelled</Typography>
                    {
                        loading
                        ?   
                        <LinearProgress color="primary" sx={{marginY:"2vh"}}/>
                        :   
                        <DataGrid
                            columns={deliveredSalesColumns}
                            rows={orders}
                            sx={{marginY:"2vh",}}
                        />
                    }      
                </Paper>
            </Grid>
            </Grow>

            <Grow in={true} timeout={2000} unmountOnExit>
            <Grid item xs={12} md={12} lg={12}>
                <Paper elevation={4} sx={fixedHeightPaper}>
                    <Typography variant="h6" color="secondary">All orders</Typography>
                     {
                        loading
                        ?   
                        <LinearProgress color="primary" sx={{marginY:"2vh"}}/>
                        :   
                        <DataGrid
                            columns={salesColumns}
                            rows={orders}
                            sx={{marginY:"2vh",}}
                        />
                    }       
                </Paper>
            </Grid>
            </Grow>





        </Grid>
        </Container>


    </Box>
    </Fade>



    </>
  )
}


