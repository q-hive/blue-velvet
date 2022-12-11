
import React, { useState, useEffect } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Container, Fade, Grid, LinearProgress, Typography, Paper,Grow, AccordionDetails,Divider, Accordion, AccordionSummary } from '@mui/material'

//*UTILS
import { getData } from '../../../Admin/Sales/SalesIndex'
import { getCustomerData, getDeliveries } from '../../../../CoreComponents/requests'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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



let clientList=[{
    customerName:"fulanito1",

}]

export const DeliveryComponent = (props) => {
    const [loading,setLoading] = useState(true)
    const [customers, setCustomers] = useState([])
    const [customers2, setCustomers2] = useState([])
    const [totalIncome, setTotalIncome] = useState(0)
    const {user, credential} = useAuth()
    const [dialog,setDialog] = useState()


    

    const DeliveryCard = ( props ) =>{
        /*
        This component must be calles inside a Grid Container, as it returns a Grid Item
        TODO, pass down all the possible props ? extend Grid ?
        */
        /*let clientInfo = props.client

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


        console.log("clients id m8", clientsArrays)

        const res = customers.filter(function(o) {
            return clientsArrays.some(function(o2) {
                return o._id === o2.client;
            })
        });
        */

        const showProdPackages = (products) =>{
            return (
                products.map((prodDescription,id)=>{

                return (
                    <>
                        <Box sx={{display:"flex" ,justifyContent:"space-evenly"}}>
                            <Typography sx={{minWidth:"30%"}}>{prodDescription.ProductName}</Typography>
                            <Typography>25g:</Typography>
                            <Typography>{prodDescription.packages.small ? prodDescription.packages.small : 0}</Typography>
                            <Typography>80g:</Typography>
                            <Typography>{prodDescription.packages.medium ? prodDescription.packages.medium : 0}</Typography>
                        </Box>
                        
                        <Divider /> 
                    </>

                )
                
            })
            )
        }

        const showOrders = (orders) =>{
            return(

                orders.map((order,id)=>{
                    return(
                    /*<Box sx={{ display:"flex",justifyContent: "space-between",marginTop:"1vh"}}>
                    <Typography>{order._id} </Typography>
                    <Button sx={{display:"flex"}} variant="contained" size="small">
                        View
                    </Button>
                    </Box>*/
        
                    <Box display="flex" sx={{flexDirection:"row"}} p={1}>
                        <Accordion sx={{width:{xs:"100%",md:"50%",lg:"100%",xl:"100%"}}}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Id: {order._id}</Typography>
                            </AccordionSummary>
        
                            <AccordionDetails>
                                            <>
                                            <Typography align="left">Packages :  </Typography>
        
                                            {showProdPackages(order.products)}
        
        
                                            </>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                    
                    )
                })

            )
        }


        

        console.log("customers 2 ",customers2)
        return(
        customers2.map((client,id)=>{
            return(
            
                <Grid item xs={12} lg={6}>
                    <Paper elevation={4}  sx={{padding:{xs:"3vh",md:"5vh"}}}>

                    <Box sx={{display:"flex",justifyContent: "space-between",marginBottom:"3vh"}}>
                        <Typography variant={"h5"}>Address:</Typography>
                        <Typography sx={{maxWidth:"50%"}}>{client.customerAdreess}</Typography>
                    </Box>
                    <Box sx={{display:"flex",justifyContent: "space-between",marginBottom:"3vh"}}>
                        <Typography variant={"h5"}>Customer: </Typography>
                        <Typography sx={{maxWidth:"50%"}}>{client.customerName}</Typography>
                    </Box>
                    
                    <Typography variant={"h6"}>Orders:</Typography>
                        
                    
                    <Box sx={{display:"flex", maxHeight:"200px", overflow:"auto", flexDirection:"column"}}>

                        {showOrders(client.orders)}
                            
                    </Box>

                    </Paper>
                </Grid>
                )
        })
        )
    
        
    }

    
    let unformattedDate = new Date()

    const getFormatedDate = (date) => {

        let day = date.getDate()
        
        /*
        Using the "options" argument of date Prototype to get the month's customerName
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
            console.log("cusm",customer)
            customer.orders.map((order,id)=>{
                allOrders.push(order)
            })
        
        })
    }

    OrderFailure()

    const datesAsKeys_obj = allOrders.reduce((dates, order) => {
        console.log("khomo",dates,order)
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
      
      console.log("group arrays2",datesArray);



    useEffect(() => {
        getCustomerData({
            setCustomers:setCustomers,
            setLoading:setLoading,
            dialog:dialog,
            setDialog:setDialog,
            user:user,
            credential:credential,
            
        }).then(
        console.log("data STATES",customers,totalIncome)
        )

        console.log("data STATES",customers,totalIncome)
        
    }, [])


    useEffect(()=>{
        getDeliveries({
            user:user,
            credential:credential,
            setProdData:setCustomers2,
        })
    },[])

    console.log("usable customers? ", customers)

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
                            
                                
                                {false ?
                                
                                datesArray.sort().map((date,id)=>{
                                
                                    console.log("date perro",date)
                                    return(
                                        <Grow in={true} timeout={2000} unmountOnExit>
                                    <Grid item xs={12} md={12} lg={12}>
                                    <Paper elevation={0} sx={{
                                        padding: BV_THEME.spacing(2),
                                        display: "flex",
                                        overflow: "auto",
                                        flexDirection: "column",
                                        height: 540
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
                                    })
                                    :

                                    <Grow in={true} timeout={2000} unmountOnExit>
                                    <Grid item xs={12} md={12} lg={12}>
                                    <Paper elevation={0} sx={{
                                        padding: BV_THEME.spacing(2),
                                        display: "flex",
                                        overflow: "auto",
                                        flexDirection: "column",
                                        height: 540
                                    }}>
                                        <Typography variant="h6" color="secondary">
                                            Date: All time orders (even cancelled and delivered)  - TEST ONLY {//new Date().toString().split('T')[0]
                                            }
                                        </Typography>
                                        
                                        <Grid container maxWidth={"xl"} spacing={4} marginTop={1}>
                                        {
                                            loading
                                            ?   
                                            <LinearProgress color="primary" sx={{marginY:"2vh"}}/>
                                            :
                                            <DeliveryCard />
                                            
                                            
                                        }    
                                        </Grid>
                                    </Paper>
                                    
                                </Grid>
                                    </Grow>
                                    }

                            
                            
                        </Grid>
                    </Container>

            </Box>
            </Fade>

        </>);


}