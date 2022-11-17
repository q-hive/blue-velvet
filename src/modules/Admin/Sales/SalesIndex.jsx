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
        const getData = () => {
            api.api.get(`${api.apiVersion}/orders/`, {
                headers: {
                    authorization:  credential._tokenResponse.idToken,
                    user:           user
                }
            
            },setLoading(true))
            .then(response => {
                const getCustomer = response.data.data.map(async (order, idx) => {
                    const customer = await api.api.get(`${api.apiVersion}/customers/${order.customer}`, {
                        headers: {
                            authorization:  credential._tokenResponse.idToken,
                            user:           user
                        }
                    })
                    
                    return {...order, fullCustomer:customer.data.data}
                })
                
                Promise.all(getCustomer)
                .then((newResponse) => {
                    newResponse.forEach((order, idx) => {
                        const dayOfOrder = new Date(order.date).getDay()
                        switch(dayOfOrder){
                            case 2:
                                newResponse[idx].date1 = order.date 
                                newResponse[idx].date2 = null 
                                
                            break;
                            case 5:
                                newResponse[idx].date2 = order.date
                                newResponse[idx].date1 = null
                            break;
                            default:
                                break;
                        }
                    })
                    
                    setTotalIncome(sumPrices())
                    
                    function sumPrices() { 
                        let arr =[]
                        newResponse.map((order) => {
                            arr.push(order.price)
                        })
                        let sum =arr.reduce((a, b) => a + b, 0)
                        return(sum)
                    
                    }
                    const mappedRow = newResponse.map((order) => {
                        console.log(order)
                        
                        return {
                            "customer": order.fullCustomer.name,
                            "date1":    order.date1,
                            "date2":    order.date2,
                            "type":     "No type",
                            "income":   order.price,
                            "status":   "unpaid",
                            "id":       order._id
                        }
                    })
                    setOrders((o) => {
                        return (
                            mappedRow    
                        )
                    })
                    setLoading(false)
                })
                .catch((err) => {
                    console.log("Error executing request for customers name")
                    console.log(err)
                })
            })
            .catch(err => {
                console.log("Error getting orders")
            })
        }

        getData()
        
    }, [])
  return (
    <>

    <Fade in={true} timeout={1000} unmountOnExit>
    <Box width="100%" height="auto" >
        <Container sx={{padding:"2%"}}>
            <Box sx={{
                        width:"100%", 
                        height:"auto",
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
                
                
                    <Box sx={{display:"flex", justifyContent:"space-between",marginBottom:"3vh"}} >
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
        <Container maxWidth="xl" sx={{paddingTop:4,paddingBottom:4,marginX:{xs:4,md:"auto"},marginTop:{xs:4,md:3},
                                        "& .header-sales-table":{
                                            backgroundColor:BV_THEME.palette.primary.main,
                                            color:"white"
                                        }}}>
        <Grid container maxWidth={"xl"} spacing={3} marginTop={3}>
            
            
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
