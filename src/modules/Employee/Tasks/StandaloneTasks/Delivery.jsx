
import React, { useState, useEffect } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Container, Fade, Grid, LinearProgress, Typography, Paper,Grow } from '@mui/material'

//*UTILS
import { getData } from '../../../Admin/Sales/SalesIndex'
import { getCustomerData } from '../../../../CoreComponents/requests'

import useAuth from '../../../../contextHooks/useAuthContext'


//THEME
import { BV_THEME } from '../../../../theme/BV-theme'

const taskCard_sx = {
    display:"flex",
    width:"100%", 
    justifyContent:"center",
    marginTop:"5vh", 
    flexDirection:"column",
    alignItems:"center"
}


export const DeliveryComponent = (props) => {
    const [loading,setLoading] = useState(true)
    const [customers, setCustomers] = useState([])
    const [totalIncome, setTotalIncome] = useState(0)
    const {user, credential} = useAuth()
    const [dialog,setDialog] = useState()


    const DeliveryCard = ( props ) =>{
        /*
        This component must be calles inside a Grid Container, as it returns a Grid Item
        TODO, pass down all the possible props ? extend Grid ?
        */
        let clientInfo = props.client

        let clientus = props.orders.reduce((clientes,order)=>{
            const cust_id = order.customer
            if (!clientes[cust_id]) {
            clientes[cust_id] = [];
            }
            clientes[cust_id].push(order);
            return clientes;
        },{})

        const clientsArrays = Object.keys(clientus).map((client) => {
            return {
              client,
              orders: clientus[client]
            };
          });



        const res = customers.filter(function(o) {
            return clientsArrays.some(function(o2) {
                return o._id === o2.client;
            })
        });

        
        return(
        res.map((client,id)=>{
            return(
            
                <Grid item xs={6}>
                    <Box>
                        <Typography>Address {client.address.street} {client.address.stNumber}</Typography>
                        <Typography>Customer: {client.name}</Typography>
                        <Typography>Orders: {client.orders.map((order,id)=>{return(<>{order._id} <br/></>)})}</Typography>
                    </Box>
                </Grid>
                )
        })
        )
    
        
    }

    
    let unformattedDate = new Date()

    const getFormatedDate = (date) => {

        let day = date.getDate()
        
        /*
        Using the "options" argument of date Prototype to get the month's name
        */
        let month= new Intl.DateTimeFormat('en-US', {month:"long"}).format(date)

        let formattedDate = month + " " + day
        return formattedDate

    }

    
    let allOrders = []

    function OrderFailure  () {
        /* 
        This is not a failure.
        it's an alternative to order request,
        as we dont truly need all of the 
        orders values

        I may add an endpoint filter, as i think I should
        */
        customers.map((customer,_id)=>{
            customer.orders.map((order,id)=>{
                allOrders.push(order)
            })
        
        })
    }

    OrderFailure()

    const datesAsKeys_obj = allOrders.reduce((dates, order) => {
        const date = order.end.split('T')[0];
        if (!dates[date]) {
          dates[date] = [];
        }
        dates[date].push(order);
        return dates;
      }, {});
      
      // Edit: to add it in the array format instead
      const datesArray = Object.keys(datesAsKeys_obj).map((date) => {
        return {
          date,
          orders: datesAsKeys_obj[date]
        };
      });
      



    useEffect(() => {
        getCustomerData({
            setCustomers:setCustomers,
            setLoading:setLoading,
            dialog:dialog,
            setDialog:setDialog,
            user:user,
            credential:credential,
            
        }).then(
        )

        
    }, [])


        return (<>
            <Fade in={true} timeout={1000} unmountOnExit>
            <Box sx={taskCard_sx}>
                <Typography variant="h2" color="secondary.dark">Deliveries</Typography>
                
                    {/* GRID CONTAINER */}
                    <Container maxWidth="xl" sx={{paddingTop:2,paddingBottom:2,marginX:{xs:4,md:"auto"},marginTop:{xs:4,md:3},
                                        "& .header-sales-table":{
                                            backgroundColor:BV_THEME.palette.primary.main,
                                            color:"white"
                                        }}}>
                        <Grid container maxWidth={"xl"} spacing={4} marginTop={0}>
                
                
                            {/* Order Mockup */}
                            
                                
                                {datesArray.map((date,id)=>{
                                    return(
                                        <Grow in={true} timeout={2000} unmountOnExit>
                                    <Grid item xs={12} md={12} lg={12}>
                                    <Paper elevation={4} sx={{
                                        padding: BV_THEME.spacing(2),
                                        display: "flex",
                                        overflow: "auto",
                                        flexDirection: "column",
                                        height: 350
                                    }}>
                                        <Typography variant="h6" color="secondary">
                                            Date: {date.date}
                                        </Typography>
                                        
                                        <Grid container maxWidth={"xl"} spacing={4} marginTop={1}>
                                        {
                                            loading
                                            ?   
                                            <LinearProgress color="primary" sx={{marginY:"2vh"}}/>
                                            :
                                            <DeliveryCard orders={date.orders} date={date.date}/>
                                            
                                            
                                        }    
                                        </Grid>
                                    </Paper>
                                    
                                </Grid>
                                </Grow>)
                                    })}

                            
                            
                        </Grid>
                    </Container>

            </Box>
            </Fade>

        </>);


}