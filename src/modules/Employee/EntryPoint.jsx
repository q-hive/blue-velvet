import { Add } from '@mui/icons-material'
import { Alert, Box, Button, Container, Grid, Paper, Snackbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useAuth from '../../contextHooks/useAuthContext'

//*Netword and routing
import { useNavigate } from 'react-router-dom'
import { TaskTest } from './Tasks/WorkingTasks/TaskTest'
import { BV_THEME } from '../../theme/BV-theme'
import api from '../../axios.js'
import { intlFormat } from 'date-fns'
import { DataGrid } from '@mui/x-data-grid'
import { Timer } from '../../CoreComponents/Timer'

export const EntryPoint = () => {

    //*Auth context
    const {user, credential} = useAuth()
    const navigate = useNavigate()
    
    //*DATA STATES
    const [orders, setOrders] = useState([])


    //*Render states
    const [orderSelected, setOrderSelected] = useState([])

    //Snackbar
    const [snackState, setSnackState] = useState({open:false,label:"",severity:""});

    //Time
    const [isOnTime, setIsOnTime] = useState(true)

    const getTime = () => {
        var today = new Date()
     
        if(today.getHours() >= 4 && today.getHours() < 9){
            setIsOnTime(true);
            console.log("testDate",today.getHours())
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setSnackState({...snackState,open:false});
    };

    const handleViewTask = (type) => {
            navigate('taskTest',
                        {state: {
                            type: "seeding",
                            order: orderSelected
                        }}
                    )
    }

    const handleStartWork = () => {
        // Change to 'true' to test Full Chamber
        isOnTime 
        ? 
            {
                ...orders.length != 0 ?
                    navigate('./../tasks/work',
                        {state: {
                        orders: orders
                        }}
                    )
                :
                setSnackState({open:true,label:"There are no orders!",severity:"success"})
            }
        :
        setSnackState({open:true,label:"You can't start working right now",severity:"error"})
         
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
            case "growing": productTasks = [{name:"Status:", type:"growing"}];
                break;
            case "harvestReady": productTasks = [{name:"Task 2", type:"harvesting"}];
                break;
            case "harvested" : productTasks = [{name:"Task 3", type:"packing"}];
                break;
            case "ready" : productTasks = [{name:"Task 4", type:"delivery"}];
                break;
            case "delivered" : productTasks = [];
                break;
            case "unpaid" : productTasks = [];
                break;
            case "uncompleted" : productTasks = [];
                break;
            case "pending" : productTasks = [];
                break;
            default:  productTasks = [];
         }

     }

    

    const containerTasks = [ 
        {name:"Cut mats", type:"maintenance"},
        {name:"Waste and Control", type:"maintenance"},
        {name:"Labelling", type:"maintenance"},
        {name:"Cleaning", type:"maintenance"},
    ]

    const completedTasks = [ 
        {name:"Seeding", time:"5:04"},
        {name:"Harvesting", time:"6:04"},
        {name:"Seeding", time:"5:04"},
        {name:"Harvesting", time:"6:04"},
    ]

    const completedTasksRows = [
        { id: 1, col1: 'Seeding', col2: Math.random()},
        { id: 2, col1: 'Harvesting', col2: Math.random()},
        { id: 3, col1: 'Seeding', col2: Math.random() },
      ];


    useEffect(() => {
        const getOrders = async ()=> {
            const ordersData = await api.api.get(`${api.apiVersion}/orders/uncompleted`,{
                headers:{
                    "authorization":    credential._tokenResponse.idToken,
                    "user":             user
                }
            })

            return ordersData.data
        }

        getOrders()
        .then((response) => {
            let indexes =[]
            console.log(response.data)
            response.data.forEach((order, idx) => {
                order.status === "delivered"?
                    indexes.push(idx) :""
                
                console.log(indexes)
            })

        for (var i = indexes.length -1; i >= 0; i--)
            response.data.splice(indexes[i],1);


            console.log("fuera",indexes)
            setOrders(response.data)
            console.log(response.data)
        })
        .catch(err => {
            console.log(err)
        })
        getTime()
    }, [])

  return (<>
    <Box component="div" display="flex"  >

        <Container maxWidth="lg" sx={{paddingTop:4,paddingBottom:4,marginX:{xs:4,md:"auto"},marginTop:{xs:4,md:3}}}>
            <Typography variant="h2" color="primary">Welcome, {user.name}</Typography>
            <Typography variant="h5" color="secondary">Here's your work</Typography><br/>
            <Typography variant="h6" color="secondary">You'll need aproximately TIME to finish your Tasks</Typography>
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

                {/* Container's tasks */}
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

                {/*Completed tasks */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{...fixedHeightPaper,height:400,
                        "& .header-sales-table":{
                            backgroundColor:BV_THEME.palette.primary.main,
                            color:"white"
                        }}}>
                        <Typography variant="h6" color="secondary">Your Completed Tasks</Typography>
                        <DataGrid
                            columns={[
                                {
                                    field:"col1",
                                    headerName:"Type",
                                    headerAlign:"center",
                                    align:"center",
                                    headerClassName:"header-sales-table",
                                    minWidth:{xs:"25%",md:130},
                                    flex:1
                                },
                                {
                                    field:"col2",
                                    headerName:"Completion Time",
                                    headerAlign:"center",
                                    align:"center",
                                    headerClassName:"header-sales-table",
                                    minWidth:{xs:"25%",md:130},
                                    flex:1
                                },
                                {
                                    field:"id",
                                    headerName:"id",
                                    headerAlign:"center",
                                    align:"center",
                                    headerClassName:"header-sales-table",
                                    minWidth:{xs:"25%",md:130},
                                    flex:1
                                },
                            ]}
                            rows={completedTasksRows}
                            sx={{marginY:"2vh",}}>
                        </DataGrid>
                        
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    </Box>
    <Snackbar  anchorOrigin={{vertical: "top",horizontal: "center" }} open={snackState.open} autoHideDuration={1500} onClose={handleClose} sx={{marginTop:"8vh"}}>
        <Alert onClose={handleClose} severity={snackState.severity} sx={{ width: '100%' }}>
            {snackState.label}
        </Alert>
    </Snackbar>
    </>
  )
}
