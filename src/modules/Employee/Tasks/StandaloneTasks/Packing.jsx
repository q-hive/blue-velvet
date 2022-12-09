import React, { useState, useEffect } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Container, Fade, Grid, LinearProgress, Typography, Paper,Grow, AccordionDetails,Divider, Accordion, AccordionSummary } from '@mui/material'

//*UTILS
import { getData } from '../../../Admin/Sales/SalesIndex'
import { getCustomerData, getPackingProducts } from '../../../../CoreComponents/requests'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import useAuth from '../../../../contextHooks/useAuthContext'


//THEME
import { BV_THEME } from '../../../../theme/BV-theme'
import { TaskContainer } from '../WorkingTasks/TaskContainer';

const taskCard_sx = {
    display:"flex",
    width:"100%", 
    justifyContent:"center",
    marginTop:"5vh", 
    flexDirection:"column",
    alignItems:"center"
}



let clientList=[{
    name:"fulanito1",

}]

export const PackingComponent = (props) => {
    const [loading,setLoading] = useState(true)
    const [packingProducts, setPackingProducts] = useState(null)
    const {user, credential} = useAuth()
    const [dialog,setDialog] = useState()

  /*  
    let unformattedDate = new Date()

    const getFormatedDate = (date) => {

        let day = date.getDate()
        
        /*
        Using the "options" argument of date Prototype to get the month's name
        
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
        
        customers.map((customer,_id)=>{
            console.log("cusm",customer)
            customer.orders.map((order,id)=>{
                allOrders.push(order)
            })
        
        })
    }

    //OrderFailure()

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
*/


      useEffect(()=>{
        getPackingProducts({
            user:user,
            credential:credential,
            setProdData:setPackingProducts,
            //date:mandada de otro lado
        })
    },[])

    console.log("packs to pack? ", packingProducts)

        return (<>
            <Fade in={true} timeout={1000} unmountOnExit>
            <Box sx={taskCard_sx}>
                <Typography variant="h2" color="secondary.dark">Packing</Typography>
                
                    {/* GRID CONTAINER */}
                    <Container maxWidth="xl" sx={{paddingTop:2,paddingBottom:2,marginX:{xs:4,md:"auto"},marginTop:{xs:4,md:3},
                                        "& .header-sales-table":{
                                            backgroundColor:BV_THEME.palette.primary.main,
                                            color:"white"
                                        }}}>
                        <Grid container maxWidth={"xl"} spacing={4} marginTop={0}>
                
                
                            {/* Order Mockup */}
                            <Grid item xs={12} md={12} lg={12}>

                            {
                            TaskContainer({ 
                                type: "packing" || null,
                                products: packingProducts || []
                            })}
                            </Grid>

                            
                            
                        </Grid>
                    </Container>

            </Box>
            </Fade>

        </>);


}