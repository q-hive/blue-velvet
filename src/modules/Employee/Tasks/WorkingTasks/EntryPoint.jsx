import { Add } from '@mui/icons-material'
import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useAuth from '../../../../contextHooks/useAuthContext'

//*Netword and routing
import { useNavigate } from 'react-router-dom'
import { TaskTest } from './TaskTest'
import { BV_THEME } from '../../../../theme/BV-theme'
import api from '../../../../axios.js'

export const EntryPoint = () => {

    //*Auth context
    const {user, credential} = useAuth()
    const navigate = useNavigate()
    
    //*DATA STATES
    const [orders, setOrders] = useState([])

    const handleViewTask = (type) => {
            if(type==="harvesting"){
              navigate('taskTest?harvesting')
            }
            if(type==="seeding"){
                navigate('taskTest?seeding')
              }  
    }

    const fixedHeightPaper = {
        padding: BV_THEME.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
        height: 240}

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
        setOrders(response.data)
    })
    .catch(err => {
        console.log(err)
    })
}, [])

  return (
    <Box component="div" display="flex"  >


        <Container maxWidth="lg" sx={{paddingTop:4,paddingBottom:4}}>
            <Typography variant="h2" color="primary">Welcome, Juan!</Typography>
            <Typography variant="h5" color="secondary">Here's your work</Typography>

            <Grid container spacing={3} marginTop={3}>

                {/*Orders */}
                <Grid item xs={12} md={4} lg={3}>
                    <Paper sx={fixedHeightPaper}>
                        <Typography variant="h6" color="secondary">Assigned Orders</Typography>
                        <Paper sx={{padding:1,margin:1}} variant="outlined">
                            <Typography><b color="primary">Order:</b> {DUMMY_Order.id}</Typography>
                        </Paper>
                    </Paper>
                </Grid>


                {/* Tasks */}
                <Grid item xs={12} md={4} lg={3}>
                    <Paper sx={fixedHeightPaper}>
                        <Typography variant="h6" color="secondary">Order's Tasks</Typography>
                        {DUMMY_Order.tasks.map((task, index) => {
                            return (
                                <Paper key={index} variant="outlined" sx={{padding:1,margin:1,}}>
                                    <Box sx={{display:"flex",justifyContent:"space-evenly",alignContent:"space-evenly"}}>
                                        {task.details.title}{" "}
                                        {task.type}
                                        <Button variant="contained" sx={{alignSelf:"right"}} onClick={()=>handleViewTask(task.type)} color="primary" >
                                            View
                                        </Button>
                                    </Box>
                                </Paper>
                            
                            )
                        })}
                    </Paper>
                </Grid>

                {/* Not used yet */}
                <Grid item xs={12}>
                    <Paper sx={fixedHeightPaper}>
                        <Button variant='contained' color='primary' startIcon={<Add/>} onClick={() => navigate('taskTest')} sx={{minWidth:"20%"}}>
                            Dynatask
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
            <Box pt={4}>
                test
            </Box>
        </Container>
    </Box>
  )
}
