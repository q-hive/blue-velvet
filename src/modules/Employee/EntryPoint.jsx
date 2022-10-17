import { Add } from '@mui/icons-material'
import { Alert, Box, Button, Container, Grid, Paper, Snackbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useAuth from '../../contextHooks/useAuthContext'
import { filterByKey } from './Tasks/FullChamber'

//*Netword and routing
import { useNavigate } from 'react-router-dom'
import { TaskContainer } from './Tasks/WorkingTasks/TaskContainer'
import { BV_THEME } from '../../theme/BV-theme'
import api from '../../axios.js'
import { intlFormat } from 'date-fns'
import { DataGrid } from '@mui/x-data-grid'
import { Timer } from '../../CoreComponents/Timer'
import { LoadingButton } from '@mui/lab'

export const EntryPoint = () => {

    //*Auth context
    const {user, credential} = useAuth()
    const navigate = useNavigate()
    
    //*DATA STATES
    const [orders, setOrders] = useState([])
    const [estimatedTime, setEstimatedTime] = useState(0)


    //*Render states
    const [orderSelected, setOrderSelected] = useState([])
    const [loading, setLoading] = useState({
        startWorkBtn:false
    })

    //Snackbar
    const [snackState, setSnackState] = useState({open:false,label:"",severity:""});

    //Time
    const [isOnTime, setIsOnTime] = useState(true)

    const checkTime = () => {
        var today = new Date()
        
        if(today.getDay() == 2 || today.getDay() == 5){
            if(today.getHours() >= 4 && today.getHours() < 9){
                setIsOnTime(true);
                console.log("testDate",today.getDay(),today.getHours())
            }
        }


    };

    const updateWorkDays = async () => {
        setLoading({
            ...loading,
            startWorkBtn: true
        })
        //*Update workdays of employee
        const request = await api.api.patch(`${api.apiVersion}/work/performance/${user._id}`,{performance:[{query:"add",workdays:1}]}, {
            headers: {
                authorization:credential._tokenResponse.idToken,
                user:user
            }
        })

        return request
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setSnackState({...snackState,open:false});
    };

    const handleViewTask = (typee) => {
            navigate('taskTest',
                        {state: {
                            type: typee
                        }}
                    )
    }

    const handleStartWork = () => {
        // Change to 'true' to test Full Chamber
        isOnTime 
        ? 
            {
                ...orders.length != 0 
                ?
                    updateWorkDays()
                    //context setIsWorking 
                    .then(() => {
                        navigate('./../tasks/work',
                            {state: {
                            orders: orders
                            }}
                        )
                    })
                    .catch(err => {
                        setSnackState({open:true, label:"There was an error updating your data.", severity:"error"})
                    })
                    
                :
                setSnackState({open:true,label:"There are no orders!",severity:"success"})
            }
        :
        setSnackState({open:true,label:"You can't start working right now",severity:"error"})
         
    }

    // Filter Tasks
    function getAllProducts(){
        var productList = []
        orders.map((order, id)=>{
            order.products.map((product,idx)=>{
                productList.push({...product,status:order.status})
            })
            
        })
        return productList;
    }

    const allProducts = getAllProducts()
    const allStatusesObj = filterByKey(allProducts,"status")

    console.log("allstatusesobj",allStatusesObj)

    function mixOpener(products) {
        let arreglo = []
        products.map((product,id)=>{
            if(product.mix == true && product.products != undefined){
                product.products.map((product2, id)=>{
                    arreglo.push(product2)
                })
            }else 
                arreglo.push(product)
        })
         return arreglo
      }
    //

    // Get trays to calculte time
    function getTraysTotal(producti,status){
        let ttrays = 0

        producti.map((product, id) => {
            let prev = ttrays
            let curr
            if(status != undefined && product.status === status){
                { product.mix != undefined && product.mix===true  ?
                    curr = getTraysTotal(product.products)
                    :
                    product.productionData != undefined ? 
                        curr = product.productionData.trays 
                        : 
                        curr=product.trays
                }
                ttrays = prev + curr
            }else if(status === undefined){
                console.log(product.products)
                { product.products != undefined && product.mix===true  ?
                    
                    curr = getTraysTotal(product.products)
                    :
                    product.productionData != undefined ? 
                        curr = product.productionData.trays 
                        : 
                        curr=product.trays
                }
                ttrays = prev + curr
            }
        })
            
    
        return ttrays
    }

    function getExpectedTime(arr){
        let trays = getTraysTotal(allProducts,arr)

        switch (arr) {
            case "seeding":
                return Number(Math.ceil(trays) * 2).toFixed(2)
            case "all":
                let seedingTrays=getTraysTotal(allProducts,"seeding")
                let harvestTrays=getTraysTotal(allProducts,"harvestReady")
                return Number((Math.ceil(seedingTrays) * 2+(Math.ceil(harvestTrays) * 3 )) ).toFixed(2)
        
            default:
                break;
        }
    }
    //

    function capitalize(word) {
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
      }
      
    const trays = getTraysTotal(allProducts)

    console.log("orders", orders)
    console.log("unfiltered trays", trays)

    
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
        {name:"Cut mats", type:"mats"},
        {name:"Cleaning", type:"cleaning"},
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
    const getOrders = async ()=> {
        const ordersData = await api.api.get(`${api.apiVersion}/orders/uncompleted`,{
            headers:{
                "authorization":    credential._tokenResponse.idToken,
                "user":             user
            }
        })

        return ordersData.data
    }
    const getTimeEstimate = async () => {
        const request = await api.api.get(`${api.apiVersion}/work/time/${user._id}`, {
            headers: {
                authorization:  credential._tokenResponse.idToken,
                user:           user
            }
        })
        

        const reduced = request.data.data.reduce((prev, curr) => {
            const prevseedTime = prev.times.seeding.time
            const prevharvestTime = prev.times.harvest.time

            const currseedTime = curr.times.seeding.time
            const currharvestTime = curr.times.harvest.time

            const prevTotal = prevseedTime + prevharvestTime
            
            const currTotal = currseedTime + currharvestTime

            return {
                times: {
                    harvest: {
                        time:prevseedTime + currseedTime
                    }, 
                    seeding: {
                        time:prevharvestTime + currharvestTime
                    }
                }, 
                total:prevTotal + currTotal
            }
        }, 
        {
            times: {
                harvest: {
                    time:0
                }, 
                seeding: {
                    time:0
                }
            },
            total:0
        }) 
        
        return reduced
    }

    useEffect(() => {
        const getData = async () => {
            try {
                const orders = await getOrders()
                console.log(orders)
                const time = await getTimeEstimate()
                return {orders, time}
            } catch(err) {
                console.log(err)
            }
        }
        
        // getTimeEstimate()
        checkTime()
        getData()
        .then(({orders, time}) => {
            let indexes =[]
            orders.data.forEach((order, idx) => {
                order.status === "delivered"
                ?
                indexes.push(idx) 
                :
                null
            })
    
            for (var i = indexes.length -1; i >= 0; i--){
                orders.data.splice(indexes[i],1);
            }
            setOrders(orders.data)
            setEstimatedTime(time)
            console.log("estimated time",estimatedTime.times)
        })
        .catch((err) => {
            console.log(err)
        })
        
        
    }, [])

  return (<>
    <Box component="div" display="flex"  >

        <Container maxWidth="lg" sx={{paddingTop:4,paddingBottom:4,marginX:{xs:4,md:"auto"},marginTop:{xs:4,md:3}}}>
            <Typography variant="h2" color="primary">Welcome, {user.name}</Typography>
            <Typography variant="h5" color="secondary">Here's your work</Typography><br/>
            <Typography variant="h6" color="secondary">{`You'll need aproximately ${estimatedTime.total != undefined ? estimatedTime.total.toFixed(2) : null} minutes to finish your Tasks`}</Typography>
            <Box pt={4}>
                <Typography variant="h6" >Pending Orders: {orders.length}</Typography>
                <Box display="flex" sx={{justifyContent:"space-between"}}>
                    <LoadingButton variant="contained" size="large" onClick={handleStartWork} loading={loading.startWorkBtn} >Start Workday</LoadingButton>
                    <LoadingButton variant="contained" size="large" >End Workday</LoadingButton>
                </Box>
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
                            {Object.keys(allStatusesObj).map((status,index)=>{ 
                                return(
                                    <>
                                    <Paper key={index} display="flex" flexdirection="column" variant="outlined" sx={{padding:1,margin:1,}}>
                                        <Box sx={{display:"flex",flexDirection:"column",justifyContent:"space-evenly",alignContent:"space-evenly"}}>
                                            <Typography >
                                                <b>Task: {capitalize(status)}</b>
                                            </Typography>
                                            <Typography >
                                                <i>Expected Time: {estimatedTime.times[status].time.toFixed(2)}</i>
                                            </Typography>
                                        </Box>
                                    </Paper>

                                    {/*TESTING ONLY*/}
                                    <Paper key={index} display="flex" flexdirection="column" variant="outlined" sx={{padding:1,margin:1,}}>
                                    <Box sx={{display:"flex",flexDirection:"column",justifyContent:"space-evenly",alignContent:"space-evenly"}}>
                                        <Typography >
                                            <b>Task: Harvesting</b>
                                        </Typography>
                                        <Typography >
                                            <i>Expected Time: {estimatedTime.times["harvest"].time.toFixed(2)}</i>
                                        </Typography>
                                    </Box>
                                    </Paper>
                                    {/*END TESTING ONLY*/}
                                    </>
                                )
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
                                <Paper key={index} variant="outlined" sx={{alignItems:"center",justifyContent:"space-between",paddingY:"3px",paddingX:"2px",marginTop:"2vh",display:"flex", flexDirection:"row"}}>
                                    <Typography><b>{task.name}</b></Typography>
                                    <Button variant="contained" sx={{width:"34%"}} onClick={()=>handleViewTask(task.type)} color="primary" >
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
