import React, { useEffect, useMemo, useState } from 'react'

import { Alert, Box, Button, Container, Grid, Paper, Snackbar, Typography, Fade, Grow } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { DataGrid } from '@mui/x-data-grid'

import useAuth from '../../contextHooks/useAuthContext'
import { filterByKey } from './Tasks/FullChamber'

import useWorkingContext from '../../contextHooks/useEmployeeContext'
import { BV_THEME } from '../../theme/BV-theme'

//*Netword and routing
import { useNavigate } from 'react-router-dom'
import api from '../../axios.js'
import { formatTime } from '../../CoreComponents/Timer'
import { finishWorkDayInDb, getContainerData, getWorkdayProdData, updateEmployeeWorkDay } from '../../CoreComponents/requests'
import { getKey } from '../../utils/getDisplayKeyByStatus'
import { transformTo } from '../../utils/times'
import { getColorByPercentage } from '../../utils/getColorByPercentage'
import { capitalize } from '../../utils/capitalize'
import { DailyTaskRef, DailyTasksCard } from '../../CoreComponents/TasksPresentation/DailyTasksCard'

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
        {name:"Mise en place", type:"mats"},
        {name:"Maintenance", type:"maintenance"},
    ]
    
    //*contexts
    const {user, credential} = useAuth()
    const {TrackWorkModel, setTrackWorkModel,WorkContext ,setWorkContext, employeeIsWorking, setEmployeeIsWorking, isOnTime, setIsOnTime} = useWorkingContext() 
    const navigate = useNavigate()
    
    //*DATA STATES
    const [orders, setOrders] = useState([])
    const [estimatedTime, setEstimatedTime] = useState({
        times: {
            preSoaking: {
                time:0
            }, 
            harvestReady: {
                time:0
            }, 
            packing: {
                time:0
            },
            ready: {
                time:0
            },
            seeding: {
                time:0
            },
            cleaning: {
                time:30*60*60*1000
            },
            growing: {
                time:0
            },
        },
        total:0
    })
    const [activeStatusesArray,setActiveStatusesArray] = useState([])


    //*Render states
    const [loading, setLoading] = useState({
        startWorkBtn:false
    })
    const [maintenanceColor,setMaintenanceColor]=useState("primary")

    //*Snackbar
    const defaultSeverity = "warning" //default value to avoid warning.
    const [snackState, setSnackState] = useState({open:false,label:"",severity:defaultSeverity});

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

            const request = await api.api.patch(`${api.apiVersion}/work/performance/${user._id}`,{performance:[{query:"add",workdays:1}]}, {
                headers: {
                    authorization:credential._tokenResponse.idToken,
                    user:user
                }
            })  
            return request
        }
        
       
        return 0
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setSnackState({...snackState,open:false});
    };

    const handleViewTask = (type) => {
            navigate('taskTest',
                        {state: {
                            type,
                            
                        }}
                    )
    }

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
        const request = await api.api.get(`${api.apiVersion}/work/time/${user._id}?containerId=${user.assignedContainer}`, {
            headers: {
                authorization:  credential._tokenResponse.idToken,
                user:           user
            }
        })
        
        let result = {
            times: {
                preSoaking: {
                    time:0
                }, 
                harvestReady: {
                    time:0
                }, 
                packing: {
                    time:0
                },
                ready: {
                    time:0
                },
                seeding: {
                    time:0
                },
                cleaning: {
                    time:30*60*1000
                },
                growing: {
                    time:0
                },
            },
            total:0
        }
        
        const sumTimes = () => {
            let arr = []
            request.data.data.forEach((item,id)=>{
                let status = Object.keys(item)[0]
                arr.push(item[status].minutes)
            })

            arr.push(result.times["cleaning"].time)
            return arr.reduce((a, b) => a + b, 0)
        } 

        let totalTime = sumTimes()

        if (request.data.data){
            result = {
                times: {
                    preSoaking: {
                        time:request.data.data[0].preSoaking.minutes
                    }, 
                    // soaking1: {
                    //     time:request.data.data[1].soaking1.minutes
                    // }, 
                    // soaking1: {
                    //     time:request.data.data[2].soaking2.minutes
                    // }, 
                    harvestReady: {
                        time:request.data.data[1].harvestReady.minutes
                    }, 
                    packing: {
                        time:request.data.data[2].packing.minutes
                    },
                    ready: {
                        time:request.data.data[3].ready.minutes
                    },
                    seeding: {
                        time:request.data.data[4].seeding.minutes
                    }, 
                    cleaning: {
                        time:30*60*1000
                    }, 
                    growing: {
                        time:request.data.data[5].growing.minutes
                    },
                }, 
                total:totalTime
            }
        }
        /*
            const reduced = request.data.data.reduce((prev, curr) => {
                const prevseedTime = prev.times.seeding.time
                const prevharvestTime = prev.times.harvest.time

                const currseedTime = curr.times.seeding.time
                const currharvestTime = curr.times.harvest.time

                const prevTotal = prevseedTime + prevharvestTime
                
                const currTotal = currseedTime + currharvestTime

                return {
                    times: {
                        preSoaking: {
                            time:prevharvestTime + currharvestTime
                        }, 
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
                    preSoaking: {
                        time:0
                    }, 
                    harvest: {
                        time:0
                    }, 
                    seeding: {
                        time:0
                    }
                },
                total:0
            })
        */ 
        
        return result
    }
    const getWorkData = async ()=> {
        if(window.localStorage.getItem("workData")){
            return {
                workData: JSON.parse(window.localStorage.getItem("workData")),
                packs: JSON.parse(window.localStorage.getItem("packs")),
                deliverys: JSON.parse(window.localStorage.getItem("deliverys")),
            }
        }
        
        const production = await api.api.get(`${api.apiVersion}/production/workday?containerId=${user.assignedContainer}`,{
            headers:{
                "authorization":    credential._tokenResponse.idToken,
                "user":             user
            }
        })
        const packs = await api.api.get(`${api.apiVersion}/delivery/packs/orders`,{
            headers:{
                "authorization":    credential._tokenResponse.idToken,
                "user":             user
            }
        })


        const deliverys = await api.api.get(`${api.apiVersion}/delivery/routes/orders`,{
            headers:{
                "authorization":    credential._tokenResponse.idToken,
                "user":             user
            }
        })

        return {workData:production.data.data, packs:packs.data.data, deliverys: deliverys.data.data}
    }

    const setWorkingContext = (workDataModel, packs, deliverys) => {
        //*Employee started working identification
        if(!employeeIsWorking){
            setEmployeeIsWorking(true)

            setTrackWorkModel({
                ...TrackWorkModel,
                started:Date.now(),
                expected:estimatedTime
            }) 
            
            //*Production data
            window.localStorage.setItem("workData", JSON.stringify(workDataModel))
            window.localStorage.setItem("packs", JSON.stringify(workDataModel))
            window.localStorage.setItem("deliverys", JSON.stringify(workDataModel))
            

            Object.keys(WorkContext.cicle).forEach((value,index) => {
                
                if(!activeStatusesArray.includes(value)){
                    // delete WorkContext.cicle[value]
                    setWorkContext({...WorkContext})
                }else{
                    WorkContext.cicle[value].production = workDataModel.production
                }
            })


            WorkContext.cicle[Object.keys(WorkContext.cicle)[0]].started = Date.now()
            window.localStorage.setItem("WorkContext", JSON.stringify(WorkContext))
        }

        else {
            setWorkContext({...WorkContext,current:getFinishedTasks().length})
        }
        
    }

    function getActiveProductsStatuses (workDataModel) {
        let statusesInProds = []
        console.log("wdm",workDataModel)
            
            Object.keys(workDataModel).map((prod,id)=>{
                if(!statusesInProds.includes(prod.ProductionStatus))
                    statusesInProds.push(prod.ProductionStatus)
            })

            console.log("statuses in prods arr", statusesInProds)
            return statusesInProds
    }

    function prepareProductionStatusesForRender (workData) {
        let psTrue = workData.preSoaking?.length>0
        let sTrue = workData.seeding?.length>0
        let hrTrue = workData.harvestReady?.length>0

        
        let testingKeys = Object.keys(workData) 
        //*Delete growing from cycle (not useful display in cycle)
        const growingStatusIndex = testingKeys.indexOf("growing")
        testingKeys.splice(growingStatusIndex, 1)
        
        testingKeys.push("cleaning")

        return testingKeys;
    }

    const getFinishedTasks = () => {
        let finishedTasksArr =[]
        for(let i = 0; i < Object.keys(WorkContext.cicle).length ; i++){
            WorkContext.cicle[Object.keys(WorkContext.cicle)[i]].finished != undefined 
            ? 
                finishedTasksArr.push(
                    {
                        task:Object.keys(WorkContext.cicle)[i],
                        achieved:WorkContext.cicle[Object.keys(WorkContext.cicle)[i]].achieved,
                        workingOrders:WorkContext.cicle[Object.keys(WorkContext.cicle)[i]].workingOrders
                    }
                )
            :
                null

        }

        return finishedTasksArr
    }

    const handleWorkButton = (finish = false) => {
        
        if(finish) {
            TrackWorkModel.finished = Date.now()
            // TrackWorkModel.tasks = getFinishedTasks()
            // TrackWorkModel.breaks = getAllBreaks()
            window.localStorage.setItem("isWorking", "false")
            setEmployeeIsWorking(JSON.parse(localStorage.getItem("isWorking")))
            //*Delete from localStorage since journal has been ended.
            // window.localStorage.removeItem("TrackWorkModel")

            // finishWorkDayInDb({user, credential})
            // .then(() => {
            //     setSnackState({open:true,label:"Your work has been ended today",severity:"warning"})
            // })
            // .catch(err => {
            //     setSnackState({open:true,label:"Something went wrong, please try again",severity:"error"})
            // })
            
            return
        }
        
        if(employeeIsWorking){
            setSnackState({open:true, label:"You already started working today, continue where you left", severity:"success"})
            setLoading({...loading, startWorkBtn:true})
            getWorkData()
            .then(({workData, packs, deliverys}) => {
                let allOrders = []
                Object.keys(workData).forEach((key) => {
                    workData[key].forEach((modelInTask) => {
                        modelInTask.relatedOrders.forEach((orderId) => allOrders.push(orderId))
                    })
                })

                allOrders = Array.from(new Set(allOrders))

                setOrders(allOrders)
                
                setTimeout(() => {
                    setLoading({...loading, startWorkBtn:false})
                    let statusesArr = prepareProductionStatusesForRender(workData);

                    setSnackState({open:false})
                    navigate('./../tasks/work',
                        {state: {
                            orders: allOrders,
                            workData: workData,
                            packs: packs,
                            deliverys: deliverys,
                            cycleKeys:statusesArr,
                            time: estimatedTime
                        }},
                    )
                    setWorkingContext()
                }, 1500)
            })
            .catch(err => {
                setSnackState({open:true, label:"There was an error getting your work data.", severity:"error"})
            })
            
            return
        }
        
        if(!employeeIsWorking){
            
            getWorkData()
            .then(({workData, packs, deliverys}) => {
                let statusesArr = prepareProductionStatusesForRender(workData);  //getActiveProductsStatuses(workData)
                
                if(statusesArr.length === 0){
                    setSnackState({open:true,label:"There's nothing for you to do right now",severity:"success"})
                }
                
                let allOrders = []
                Object.keys(workData).forEach((key) => {
                    workData[key].forEach((modelInTask) => {
                        modelInTask.relatedOrders.forEach((orderId) => allOrders.push(orderId))
                    })
                })

                updateEmployeeWorkDay({user, credential, workData})
                .then((updated) => {
                    allOrders = Array.from(new Set(allOrders))
    
                    setOrders(allOrders)
                    
                    setSnackState({open:false})
                    //*Working context
                    setWorkingContext(workData)
                    
                    navigate('./../tasks/work',
                        {state: {
                        orders: allOrders,
                        workData: workData,
                        packs: packs,
                        cycleKeys:statusesArr,
                        time: estimatedTime
                        }}
                    )
                })
                .catch(err => {
                    setLoading({...loading, startWorkBtn:true})
                    setSnackState({open:true, label:"There was an error. Reload the page.", severity:"error"})    
                })
                

            })
            .catch(err => {
                console.log(err)
                setLoading({...loading, startWorkBtn:true})
                setSnackState({open:true, label:"There was an error. Try again.", severity:"error"})
            })

        }
                    
        

        // if(!isOnTime) {
        //     setSnackState({open:true,label:"You can't start working right now",severity:"error"})
        // }

        // if(!orders.length != 0){
        //     setSnackState({open:true,label:"There is no work to do!",severity:"success"})
        // }
    }

    function getCompletedTasksRows(){
        
        let completedTasksRows =[];


        if(TrackWorkModel.tasks.length > 0) 
            TrackWorkModel.tasks.map((task,index)=>{

                completedTasksRows.push({
                    id: index+1, 
                    col1: task.name, 
                    col2: formatTime(task.achieved)
                })
            })

        return completedTasksRows
    }


    useEffect(() => {
        const getData = async () => {
            try {
                // const orders = await getOrders()
                const time = await getTimeEstimate()
                return {time}
            } catch(err) {
                setSnackState({open: true, label:"There was an error fetching the data, please reload the page.", severity:"error"})
                console.log(err)
            }
        }
        
        getData()
        .then(({time}) => {
            console.log(time)
            setEstimatedTime(time)
        })
        .catch((err) => {
            console.log(err)
        })
        
        
    }, [])

  return (<>
    <Fade in={true} timeout={1000} unmountOnExit>
    <Box component="div" display="flex"  >

        <Container maxWidth="lg" sx={{paddingTop:4,paddingBottom:4,marginX:{xs:4,md:"auto"},marginTop:{xs:4,md:3}}}>
            <Typography variant="h2" color="primary">Welcome, {user.name}</Typography>
            <Typography variant="h5" color="secondary">Here's your work</Typography><br/>
            <Typography variant="h6" color="secondary">{`You'll need aproximately ${estimatedTime.total != undefined ? transformTo("ms","minutes",estimatedTime.total)  : null} minutes to finish your Tasks`}</Typography>
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


                {/* Daily tasks */}
                <Grow in={true} timeout={2000} unmountOnExit>
                    <Grid item xs={12} md={4} lg={4}>
                        <DailyTasksCard time={estimatedTime} cycle={WorkContext.cicle} /> 
                    </Grid>
                </Grow>

                {/* Container's tasks */}
                <Grow in={true} timeout={2000} unmountOnExit>
                <Grid item xs={12} md={4}>
                    <Paper elevation={4} sx={fixedHeightPaper}>
                        <Typography variant="h6" color="secondary">Container's Tasks</Typography>
                        {containerTasks.map((task,index) => { 
                            return(
                                <Paper key={index} variant="outlined" sx={{alignItems:"center",justifyContent:"space-between",paddingY:"1.5vh",paddingX:"1.5vh",marginTop:"1vh",display:"flex", flexDirection:"row"}}>
                                    <Typography><b>{task.name}</b></Typography>
                                    <Button variant="contained" sx={{width:"34%",}} onClick={()=>handleViewTask(task.type)} color={getColorByPercentage(.8)} >
                                        View
                                    </Button>
                                </Paper>                             
                            )
                        })}
                    </Paper>
                </Grid>
                </Grow>

                {/*Completed tasks */}
                <Grow in={true} timeout={2000} unmountOnExit>
                <Grid item xs={12} md={4}>
                    <Paper elevation={4} sx={{...fixedHeightPaper,height:400,
                        "& .header-sales-table":{
                            backgroundColor:BV_THEME.palette.primary.main,
                            color:"white"
                        }}}>
                        <Typography variant="h6" color="secondary">Today's Completed Tasks</Typography>
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
                            rows={getCompletedTasksRows()}
                            sx={{marginY:"2vh",}}>
                        </DataGrid>
                        
                    </Paper>
                </Grid>
                </Grow>
            </Grid>
        </Container>
    </Box>
    </Fade>
    <Snackbar  anchorOrigin={{vertical: "top",horizontal: "center" }} open={snackState.open} autoHideDuration={1500} onClose={handleClose} sx={{marginTop:"8vh"}}>
        <Alert onClose={handleClose} severity={snackState.severity} sx={{ width: '100%' }}>
            {snackState.label}
        </Alert>
    </Snackbar>
    </>
  )
}
