import { Add } from '@mui/icons-material'
import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useAuth from '../../../../contextHooks/useAuthContext'

//*Netword and routing
import { useNavigate } from 'react-router-dom'
import { TaskTest } from './TaskTest'
import { BV_THEME } from '../../../../theme/BV-theme'
import api from '../../../../axios.js'
import { intlFormat } from 'date-fns'

export const EntryPoint = () => {

    //*Auth context
    const {user, credential} = useAuth()
    const navigate = useNavigate()
    
    //*DATA STATES
    const [orders, setOrders] = useState([])


    //*Render states
    const [orderSelected, setOrderSelected] = useState([])

    const handleViewTask = (type) => {
            navigate('taskTest',
                        {state: {
                            type: "seeding",
                            order: orderSelected
                        }}
                    )
    }

    const handleStartWork = () => {
        navigate('./../tasks/work',
        {state: {
            orders: orders
        }}
    )
    }

    
    const status = "uncompleted"

    const handleShowTasks = (id) => {
        if(orders.length !== 0) {
            const found = orders.find(order => order._id === id)
            setOrderSelected([...orderSelected, found])
        }
    }

    const fixedHeightPaper = {
        padding: BV_THEME.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
        height: 240
    }
    
     let productTasks 
    
     const setOrderTasks = (status) =>{
        
        switch(status){
            case "seeding": productTasks = [{name:"Task 1", type:"seeding"}];
            break;
            case "growing": productTasks = [];
            break;
            case "harvestReady": productTasks = [{name:"Task 2", type:"harvesting"}];
            break;
            case "harvested" : productTasks = [{name:"Task 3", type:"packing"}];
            break;
            case "ready" : productTasks = [{name:"Task 4", type:"delivery"}];
            break;
            case "delivered" : productTasks = [];
            break;
            default: console.log("no tasks monica")
         }

     }

    

    const containerTasks = [ 
        {name:"Cut mats", type:"maintenance"},
        {name:"Waste and Control", type:"maintenance"},
        {name:"Labelling", type:"maintenance"},
        {name:"Cleaning", type:"maintenance"},
    ]

    const DUMMY_Task = {
        assigned:true,
        currentStep:0,
        completed:false,
        orders:["GENERADA-80085"],
        details:{title:"TASK 1", description: "Task 1 Description",steps:"",tools:"",admin:"El gf"},
        product:[
            {
                name:"",
                image:"",
                desc:"",
                status:"",
                seed:"",
                provider:"",
                price:{amount:1,packageSize:25},
                mix:{isMix:true,
                products:{strain:"",amount:.5}},
                parameters:{day:3,night:4,seedingRate:1.35,harvestRate:5}
            },
            {
                name:"",
                image:"",
                desc:"",
                status:"",
                seed:"",
                provider:"",
                price:{amount:1,packageSize:25},
                mix:{isMix:true,
                products:{strain:"",amount:.5}},
                parameters:{day:3,night:4,seedingRate:1.35,harvestRate:5}
            },
        ],
        steps:[
            {step:0,assigned:"estempleado",status:"To-do",estimated:0},
            {step:1,assigned:"estempleado",status:"To-do",estimated:2},
            {step:2,assigned:"estempleado",status:"To-do",estimated:5},
            {step:3,assigned:"estempleado",status:"To-do",estimated:5}
        ],
        type:"harvesting",

    }
    const DUMMY_Task2 = {
        assigned:true,
        currentStep:0,
        completed:false,
        orders:["GENERADA-80085"],
        details:{title:"TASK 2", description: "Task 2 Description",steps:"",tools:"",admin:"El gf"},
        product:[
            {
                name:"PRODUCT 1",
                image:"",
                desc:"",
                status:"",
                seed:"",
                provider:"",
                price:{amount:1,packageSize:25},
                mix:{isMix:true,
                products:{strain:"",amount:.5}},
                parameters:{day:3,night:4,seedingRate:1.35,harvestRate:5}
            },
            {
                name:"",
                image:"",
                desc:"",
                status:"",
                seed:"",
                provider:"",
                price:{amount:1,packageSize:25},
                mix:{isMix:true,
                products:{strain:"",amount:.5}},
                parameters:{day:3,night:4,seedingRate:1.35,harvestRate:5}
            },
        ],
        steps:[
            {step:0,assigned:"estempleado",status:"To-do",estimated:0},
            {step:1,assigned:"estempleado",status:"To-do",estimated:2},
            {step:2,assigned:"estempleado",status:"To-do",estimated:5},
            {step:3,assigned:"estempleado",status:"To-do",estimated:5}
        ],
        type:"seeding",

    }
    const DUMMY_Order = {
        id:"GENERADA-80085",
        organization:"ourClients",
        customer:"theirClient",
        type:"idk",
        packages:3,
        price:5,
        end:"30/08/22",      
        tasks:[DUMMY_Task,DUMMY_Task2],       
        products: [{
                _id:    "",
                status: "",
                trays:  .5,
                seedId: "lasemilla",
                batch:  "huh"
            }],
        status:"incomplete"

    }


    useEffect(() => {
        const getOrders = async ()=> {
            const ordersData = await api.api.get(`${api.apiVersion}/orders/`,{
                headers:{
                    "authorization":    credential._tokenResponse.idToken,
                    "user":             user
                }
            })

            return ordersData.data
        }

        getOrders()
        .then((response) => {
            const indexes = []

            const iterableResponse = response.data


            const mappedResponse = iterableResponse.map((order, idx) => {
                if(order.status === "delivered"){
                    return
                }
                
                return {...order}
            })


            setOrders(() => mappedResponse)
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

  return (
    <Box component="div" display="flex"  >

        <Container maxWidth="lg" sx={{paddingTop:4,paddingBottom:4,marginX:{xs:4,md:"auto"},marginTop:{xs:4,md:3}}}>
            <Typography variant="h2" color="primary">Welcome, {user.name}</Typography>
            <Typography variant="h5" color="secondary">Here's your work</Typography>

            <Box pt={4}>
                <Typography variant="h6" >Pending Orders: {orders.length}</Typography>
                <Button variant="contained" size="large" onClick={handleStartWork}>Start</Button>
            </Box>

            <Grid container spacing={3} marginTop={3}>

                {/*Orders 
                <Grid item xs={12} md={4} lg={4}>
                    <Paper sx={fixedHeightPaper}>
                        <Typography variant="h6" color="secondary">Assigned Orders</Typography>
                        {orders.map((order, index) => {
                            return (
                                <Paper sx={{padding:1,margin:1}} variant="outlined">
                                    <Typography>
                                        <b>Order {index + 1}:</b> {order._id}<br/>
                                        <i>Status: {order.status}</i>
                                    </Typography>
                                    <Button onClick={() => handleShowTasks(order._id)}>
                                        View tasks
                                    </Button>
                                </Paper>
                            )
                        })}
                    </Paper>
                </Grid>
                */}


                {/* Tasks */}
                <Grid item xs={12} md={4} lg={4}>
                    <Paper sx={fixedHeightPaper}>
                        <Typography variant="h6" color="secondary">Tasks</Typography>
                        
                            <>
                                {orders.map((order, index) => {
                                    {setOrderTasks(order.status)}
                                    if(productTasks.length > 0){
                                        return (
                                            <>{order.products.map((product, index) => {
                                                return (
                                                    <Paper key={index} display="flex" flexdirection="column" variant="outlined" sx={{padding:1,margin:1,}}>
                                                        <Box sx={{display:"flex",flexDirection:"column",justifyContent:"space-evenly",alignContent:"space-evenly"}}>
                                                            <Typography >
                                                                <b>Product: {product.name}</b>
                                                            </Typography>
                                                            <Box key={index} sx={{display:"flex",flexDirection:"column", }}>

                                                                {productTasks.map((task,index) => { return(
                                                                        <Paper variant="outlined" sx={{alignItems:"center",justifyContent:"space-between",paddingY:"3px",paddingX:"2px",marginTop:"2vh",display:"flex", flexDirection:"row"}}>
                                                                            <Typography>
                                                                                <b>{task.name}</b>{" "}
                                                                                <i>{task.type}</i>
                                                                            </Typography>
                                                                            {/*<Button variant="contained" sx={{width:"34%"}} onClick={()=>handleViewTask(task.type)} color="primary" >
                                                                                View
                                                                            </Button>*/}
                                                                        </Paper>
                                                                        
                                                                    )
                                                                })}
                                                            </Box> 
                                                            
                                                        </Box>
                                                    </Paper>
                                        
                                                )
                                            })}</>  
                                        )
                                    }
                                })} 
                            </>
                           
                        
                    </Paper>
                </Grid>

                {/* Not used yet */}
                <Grid item xs={12} md={4}>
                    <Paper sx={fixedHeightPaper}>
                        <Typography variant="h6" color="secondary">Container's Tasks</Typography>
                        {containerTasks.map((task,index) => { 
                            return(
                                <Paper variant="outlined" sx={{alignItems:"center",justifyContent:"space-between",paddingY:"3px",paddingX:"2px",marginTop:"2vh",display:"flex", flexDirection:"row"}}>
                                    <Typography><b>{task.name}</b>{" "}
                                    <i>{task.type}</i></Typography>
                                    <Button variant="contained" sx={{width:"34%"}} onClick={()=>handleViewTask(task.type,product,order.productionData)} color="primary" >
                                        View
                                    </Button>
                                </Paper>                             
                            )
                        })}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    </Box>
  )
}
