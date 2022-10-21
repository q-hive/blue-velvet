import React, { useEffect, useState } from 'react'

import { Alert, Box, Button, Container, Grid, Paper, Snackbar, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { DataGrid } from '@mui/x-data-grid'

import useAuth from '../../contextHooks/useAuthContext'
import { filterByKey } from './Tasks/FullChamber'

import useWorkingContext from '../../contextHooks/useEmployeeContext'
import { BV_THEME } from '../../theme/BV-theme'

//*Netword and routing
import { useNavigate } from 'react-router-dom'
import api from '../../axios.js'

//*UNUSED
// import { Add } from '@mui/icons-material'
// import { Timer } from '../../CoreComponents/Timer'
// import { TaskContainer } from './Tasks/WorkingTasks/TaskContainer'
// import { intlFormat } from 'date-fns'

export const EntryPoint = () => {

    //*Data declarations
    const fixedHeightPaper = {
        padding: BV_THEME.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
        height: 240
    }
    const containerTasks = [ 
        {name:"Cut mats", type:"mats"},
        {name:"Cleaning", type:"cleaning"},
    ]
    const completedTasksRows = [
        { id: 1, col1: 'Seeding', col2: Math.random()},
        { id: 2, col1: 'Harvesting', col2: Math.random()},
        { id: 3, col1: 'Seeding', col2: Math.random() },
    ];
    
    //*contexts
    const {user, credential} = useAuth()
    const {TrackWorkModel, WorkContext ,setWorkContext, employeeIsWorking, setEmployeeIsWorking} = useWorkingContext() 
    const navigate = useNavigate()
    
    //*DATA STATES
    const [orders, setOrders] = useState([])
    const [estimatedTime, setEstimatedTime] = useState(0)


    //*Render states
    const [loading, setLoading] = useState({
        startWorkBtn:false
    })

    //*Snackbar
    const defaultSeverity = "warning" //default value to avoid warning.
    const [snackState, setSnackState] = useState({open:false,label:"",severity:defaultSeverity});

    //*Time
    const [isOnTime, setIsOnTime] = useState(true)

    const checkTime = () => {
        const today = new Date()
        
        if(today.getDay() == 2 || today.getDay() == 5){
            if(today.getHours() >= 4 && today.getHours() < 9){
                setIsOnTime(true);
            }
        }
    };

    /**
     * @description checks if a request can be sent to the API based on 
     * context of TrackWorkModel.statrted time stamp if today has been already updated, then days canot be updated
     */
    const daysCanBeUpdated = () => {
        return !(TrackWorkModel.started !== undefined)
    }

    const updateWorkDays = async () => {
        if(daysCanBeUpdated()) {
            setLoading({
                ...loading,
                startWorkBtn: true
            })
            setSnackState({open:true, label:"Initializing workday", severity:"warning"})
    
            //*Update workdays of employee
            TrackWorkModel.started = Date.now()
            //*SET THE TRACKMODEL IN LOCALSTORAGE
            window.localStorage.setItem("TrackWorkModel", JSON.stringify(TrackWorkModel))
            const request = await api.api.patch(`${api.apiVersion}/work/performance/${user._id}`,{performance:[{query:"add",workdays:1}]}, {
                headers: {
                    authorization:credential._tokenResponse.idToken,
                    user:user
                }
            })  
            return request
        }
        
        console.log('Cannot update days')
        return 0
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

    const getOrders = async ()=> {
        const ordersData = await api.api.get(`${api.apiVersion}/orders/uncompleted?production=true`,{
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
                        time:prevharvestTime + currharvestTime
                    }, 
                    seeding: {
                        time:prevseedTime + currseedTime
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
    const getWorkData = async ()=> {
        const apiResponse = await api.api.get(`${api.apiVersion}/work/production/634061756424d08c50e58841?container=633b2e0cd069d81c46a18033`,{
            headers:{
                "authorization":    credential._tokenResponse.idToken,
                "user":             user
            }
        })
        return apiResponse.data.data
    }

    const handleWorkButton = (finish = false) => {
        
        if(finish) {
            TrackWorkModel.finished = Date.now()
            window.localStorage.setItem("isWorking", "false")
            setEmployeeIsWorking(JSON.parse(localStorage.getItem("isWorking")))
            //*Delete from localStorage since journal has been ended.
            window.localStorage.removeItem("TrackWorkModel")
            
            setSnackState({open:true,label:"Your work has been ended today",severity:"warning"})
            return
        }
        
        if(employeeIsWorking){
            setSnackState({open:true, label:"You already started working today, continue where you left", severity:"success"})
            setLoading({...loading, startWorkBtn:true})
            getWorkData()
            .then((workData) => {
                window.localStorage.setItem("isWorking", "true")
                console.log(WorkContext)
                setTimeout(() => {
                    setLoading({...loading, startWorkBtn:false})
                    setSnackState({open:false})
                    navigate('./../tasks/work',
                        {state: {
                            orders: orders,
                            workData: workData,
                            time: estimatedTime
                        }}
                    )
                }, 1500)
            })
            .catch(err => {
                setSnackState({open:true, label:"There was an error getting your work data.", severity:"error"})
            })
            
            return
        }
        
        if(isOnTime && orders.length != 0){
            updateWorkDays()
            getWorkData()
            .then((workData) => {
                // setWorkContext({...WorkContext,})
                // setWorkContext({...WorkContext, cicle: {
                //     ...WorkContext.cicle,
                //     []:{
                //         ...WorkContext.cicle[Object.keys(WorkContext.cicle)[0]],
                //         started: Date.now()
                //     }
                // }})

                WorkContext.cicle[Object.keys(WorkContext.cicle)[0]].started = Date.now()
                setSnackState({open:false})
                window.localStorage.setItem("isWorking", "true")
                window.localStorage.setItem("workData", JSON.stringify(workData))
                window.localStorage.setItem("WorkContext", JSON.stringify(WorkContext))
                navigate('./../tasks/work',
                    {state: {
                    orders: orders,
                    workData: workData,
                    time: estimatedTime
                    }}
                )
            })
            .catch(err => {
                console.log(err)
                setSnackState({open:true, label:"There was an error. Try again.", severity:"error"})
            })
        }

        if(!isOnTime) {
            setSnackState({open:true,label:"You can't start working right now",severity:"error"})
        }

        if(!orders.length != 0){
            setSnackState({open:true,label:"There is no work to do!",severity:"success"})
        }
    }
    
    const getKey = (status) => {
        const dflt = "seeding"
        
        const statusObj = {
            "seeding": "seeding",
            "harvestReady": "harvest"
        }

        return statusObj[`${status?? dflt}`]
    }

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

    function capitalize(word) {
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
    }

    useEffect(() => {
        const getData = async () => {
            try {
                const orders = await getOrders()
                const time = await getTimeEstimate()
                return {orders, time}
            } catch(err) {
                setSnackState({open: true, label:"There was an error fetching the data, please reload the page.", severity:"error"})
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
                {/* <Typography variant="h6" >Pending Orders: {orders.length}</Typography> */}
                <Box display="flex" sx={{justifyContent:"space-between"}}>
                    <LoadingButton 
                    variant="contained" 
                    size="large" 
                    onClick={() => handleWorkButton(false)} 
                    loading={loading.startWorkBtn} 
                    >
                        {employeeIsWorking ? "Continue work...":"Start Workday"}
                    </LoadingButton>

                    {
                        employeeIsWorking 
                        ? 
                        <LoadingButton 
                        variant="contained" 
                        size="large" 
                        onClick={() => handleWorkButton(true)} 
                        loading={loading.startWorkBtn} 
                        >
                            Finish workday
                        </LoadingButton>
                        :
                        null
                    }
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
                                    <Paper key={index} display="flex" flexdirection="column" variant="outlined" sx={{padding:1,margin:1,}}>
                                        <Box sx={{display:"flex",flexDirection:"column",justifyContent:"space-evenly",alignContent:"space-evenly"}}>
                                            <Typography >
                                                <b>Task: {capitalize(getKey(status))}</b>
                                            </Typography>
                                            <Typography >
                                                <i>Expected Time: {estimatedTime?.times[getKey(status)].time.toFixed(2)}</i>
                                            </Typography>
                                        </Box>
                                    </Paper>
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
