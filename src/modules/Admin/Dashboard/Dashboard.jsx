import React, { useEffect, useState } from 'react'

//*MUI COMPONENTS
import { Box, Button, Container, Grid, Paper, Stack, Typography, useTheme, LinearProgress, Grow, Fade, Tooltip} from '@mui/material'

//*ROUTER
import { navigate } from '../../../utils/router'

//*Contexts
import useAuth from '../../../contextHooks/useAuthContext'

//*Routing
import { useNavigate } from "react-router-dom";
import api from "../../../axios"
//Theme
import { BV_THEME } from '../../../theme/BV-theme';
import { DataGrid , GridRowsProp} from '@mui/x-data-grid';
import { adminDashboardEmployees } from '../../../utils/TableStates';
import {tasksCicleObj} from '../../../utils/models.js'
import { getKey } from '../../../utils/getDisplayKeyByStatus';
import { finishWorkDayInDb } from '../../../CoreComponents/requests';
import { addZero, transformTo } from '../../../utils/times';
import { DailyTasksCard } from '../../../CoreComponents/TasksPresentation/DailyTasksCard';
import { useTranslation } from 'react-i18next';
import { capitalize } from '../../../utils/capitalize';

import ImgProgressBar from "../../../CoreComponents/ImageProgressBar/ImgProgressBar"
import containerImg from "../../../assets/images/production/container-blue.png"

export const Dashboard = () => {
    const {user,credential} = useAuth()
    const {t,i18} = useTranslation(['default', 'daily_tasks_cards','admin', 'tasks', 'buttons'])
    
    const [containers, setContainers] = useState([])
    const [employeesPerformanceRows,  setEmployeesPerformanceRows] = useState([])
    const [employeesHistoryTasks, setEmployeesHistoryTasks] = useState([])
    const [time, setTime] = useState({
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

    const theme = useTheme(BV_THEME)

    const fixedHeightPaper = {
        padding: BV_THEME.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
        height: 300
    }
    const rows = [
        { id: 1, name: 'Eluis', level: Math.random()},
        { id: 2, name: 'Eluis2', level: Math.random()},
        { id: 3, name: 'Eluis3', level: Math.random() },
      ];

    const navigate = useNavigate()

    const handleRedirect = (e) => {
        navigate(`/${user.uid}/admin/${e.target.id}`)
    }


    const getContainers = async ()=> {
        const userOrg = user.organization || JSON.parse(window.localStorage.getItem("usermeta"))?.organization
        
        const containersData = await api.api.get(`${api.apiVersion}/organizations?_id=${userOrg}`,{
            headers:{
                "authorization":    credential._tokenResponse.idToken,
                "user":             user
            }
        })

        return containersData.data.data[0].containers
    }

    const getEmployees = async () => {
        const employeesPerformance = await api.api.get(`${api.apiVersion}/employees/analytics/workday`, {
            headers:{
                "authorization":    credential._tokenResponse.idToken,
                "user":             user
            }
        })

        return employeesPerformance.data.data
    }
    const getTasksHistory = async () => {
        const initialDate = new Date()
        const finalDate = new Date(new Date().setDate(initialDate.getDate()+1))
        
        const startDate = `${initialDate.getFullYear()}-${addZero(initialDate.getMonth()+1)}-${addZero(initialDate.getDate())}`
        const endDate = `${finalDate.getFullYear()}-${addZero(finalDate.getMonth()+1)}-${addZero(finalDate.getDate())}`
        
        const history = await api.api.get(`${api.apiVersion}/tasks/history/?date=${startDate}&endDate=${endDate}`, {
            headers:{
                "authorization":    credential._tokenResponse.idToken,
                "user":             user
            }
        })

        return history.data.data
    }

    const mapEmployeesData = (employees) => {
        let array = []
        if(Array.isArray(employees)){
            array = employees.map((data) => {
            })

            return array
        }

        throw "Function for mapping employees data is not receiving an array"
    }

    const handleCleanEmployeesTasks = async () => {
        const deleteWorkDayForAll = employeesPerformanceRows.map(async employee => {
            await finishWorkDayInDb({user:user,employee:employee._id, credential:credential})
        })

        try {
            await Promise.all(deleteWorkDayForAll)

            setEmployeesPerformanceRows([])
            
            
        } catch (err) {
            console.log("Error deleting workday in employee")
        }
        
    }
    
    function displayTaskCards (displayType){
        
        function buildDailyTrackRows() {
            let performance = []
            
            employeesPerformanceRows.forEach((employee, index) => {
                if(employee.workDay && Object.keys(employee.workDay).length>0){
                    Object.keys(employee.workDay).map((task, idx) => {
                        let time = employee.workDay[task].achievedTime !== 0 ? transformTo("ms","minutes",employee.workDay[task].achievedTime) : `${t('not_finished_times', {ns:'tasks'})}`
                        performance.push({
                            col1:   employee.name,
                            col2:t('task_word',{ns:'tasks', task:getKey(task)}),
                            col3:t('expected_time_admn_dashboard',{ns:'tasks', times:transformTo("ms","minutes",employee.workDay[task].expectedTime)}),
                            col4:t('achieved_time_admn_dashboard',{ns:'tasks', time}),
                            id:idx
                        })
                    })  
                }
            })

            return performance
        }

        function buildHistoryRows() {
            let history = []
            employeesHistoryTasks.forEach((task, index) => {
                history.push({
                    col1:   task.executedBy,
                    col2:   getKey(task.taskType),
                    col3:   transformTo("ms","minutes",task.expectedTime),
                    col4:   transformTo("ms","minutes",task.achievedTime),
                    id:     task._id
                })
            })

            return history
        }
        
            
        if(displayType === "dailyTrack"){
            return buildDailyTrackRows()
        }

        if(displayType === "history"){
            return buildHistoryRows()
        }
        // return(
        //     <>
        //         <Typography variant="body2">
        //             <i>
        //                 <b>{t('times_display_specification', {ns:'daily_tasks_cards'})}</b>
        //             </i>
        //         </Typography>
        //         {
        //             employeesPerformanceRows.map((employee, index) => {
        //                 return (employee.workDay) && Object.keys(employee.workDay).length>0 && (
        //                     <>
        //                         {
        //                             Object.keys(employee.workDay).map((task, idx) => {
        //                                 let time = employee.workDay[task].achievedTime !== 0 ? transformTo("ms","minutes",employee.workDay[task].achievedTime) : `${t('not_finished_times', {ns:'tasks'})}`
                                        
        //                                 return (
        //                                     <Paper key={idx} display="flex" flexdirection="column" variant="outlined" sx={{padding:1,margin:1,}}>
        //                                         <Box sx={{display:"flex",flexDirection:"column",justifyContent:"space-evenly",alignContent:"space-evenly"}}>
        //                                             <Typography >
        //                                                 <b>{t('task_word',{ns:'tasks', task:getKey(task)})}</b>
        //                                             </Typography>
        //                                             <Typography >
        //                                                 <i>{t('expected_time_admn_dashboard',{ns:'tasks', times:transformTo("ms","minutes",employee.workDay[task].expectedTime)})} </i>
        //                                             </Typography>
        //                                             <Typography >
        //                                                 <i>{t('achieved_time_admn_dashboard',{ns:'tasks', time})}</i>
        //                                             </Typography>
        //                                             <Typography >
        //                                                 <i>{t('employee_name_admn_dashboard_times',{ns:'tasks', employee})} </i>
        //                                             </Typography>
        //                                         </Box>  
        //                                     </Paper>
        //                                 )
        //                             })

        //                         }
        //                     </>
        //                 ) 
                        
        //             })
        //         }
        //     </>
            
        // )    
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
                    time:30*60*60*1000
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

            // arr.push(result.times["cleaning"].minutes)
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
    
    useEffect(() => {
        const getData = async () => {
            try {
                const containers2 = await getContainers()
                const employeesData = await getEmployees()
                const tasksHistory = await getTasksHistory()
                const time = await getTimeEstimate()
                // const mappedEmployees = mapEmployeesData(employeesData)
                return {containers2, employeesData, tasksHistory, time}
            } catch(err) {
                console.log(err)
                throw "There was an error trying to get data for dashboard"
            }
        }

        getData()
        .then((response)=>{
            setContainers(response.containers2)
            setEmployeesPerformanceRows(response.employeesData)
            setEmployeesHistoryTasks(response.tasksHistory)
            setTime(response.time)
        })
        .catch((err) =>{
            console.log(err)
        })
        
        
    }, [])

    
  return (
    <>
    <Fade in={true} timeout={1000} unmountOnExit>
    <Box component="div" display="flex"  >

        <Container maxWidth="lg" sx={{paddingTop:4,paddingBottom:4,marginX:{xs:2,md:"auto"},marginTop:{xs:4,md:3}}}>
            <Typography variant="h2" color="primary">{t('welcome_admin')}</Typography>
            <Typography variant="h5" color="secondary.dark">{t('welcome_message')}</Typography>


            <Grid container spacing={5} marginTop={3}>

                {/* Tasks */}
                    <Grid item xs={12} sm={6} lg={6}>
                    {/* </Grid>
                        <Grid item xs={12} sm={6} lg={4}> */}
                        <Tooltip title={t('card_admin_tooltip',{ns:'daily_tasks_cards'})}>
                                <DailyTasksCard cycle={tasksCicleObj.cicle} time={time} adminRender={user.role}/>
                            {/* <Grid item xs={12} sm={6} lg={6}>
                            </Grid> */}
                        </Tooltip>
                        <Paper variant="outlined" sx={{alignItems:"center",justifyContent:"space-between",paddingY:"1.5vh",paddingX:"1.5vh",marginTop:"1vh",display:"flex", flexDirection:"row"}}>
                            <Typography><b>{capitalize(t('packing_dlytask_title',{ns:'tasks'}))}</b></Typography>
                            <Button variant="contained" sx={{width:"34%"}} onClick={()=>navigate(`/${user.uid}/employee/tasks/delivery`)} color="primary" >
                                {t('button_view_word',{ns:'buttons'})}
                            </Button>
                        </Paper>  
                        <Paper variant="outlined" sx={{alignItems:"center",justifyContent:"space-between",paddingY:"1.5vh",paddingX:"1.5vh",marginTop:"1vh",display:"flex", flexDirection:"row"}}>
                            <Typography><b>{capitalize(t('ready_status_dlytask_title',{ns:'tasks'}))}</b></Typography>
                            <Button variant="contained" sx={{width:"34%"}} onClick={()=>navigate(`/${user.uid}/employee/tasks/delivery`)} color="primary" >
                                {t('button_view_word',{ns:'buttons'})}
                            </Button>
                        </Paper>  
                    </Grid>
                
                    
                    
                {/* <Grow in={true} timeout={2000} unmountOnExit>
                    
                   
                </Grow> */}

                {/* Capacity */}
                
                <Grow in={true} timeout={2000} unmountOnExit>
                    <Grid item xs={12} sm={6} lg={6}>
                        <Paper elevation={4} sx={fixedHeightPaper}>
                            <Typography variant="h6" color="secondary.dark">{t('container_capacity_card',{ns:'admin'})}</Typography>
                            <Box sx={{display:"flex",flexDirection:"column", }}>

                                {containers.map((container,index) => { return(
                                        <Paper key={index} variant="outlined" sx={{alignItems:"center",justifyContent:"space-between",paddingY:"1vh",paddingX:".5vh",marginTop:"2vh",display:"flex", flexDirection:"column"}}>
                                            <Typography variant="h6" color="primary.dark" sx={{width:"98%",}}>
                                                {container.name}:<br/>
                                                </Typography>
                                            <Typography sx={{width:"98%"}}>
                                                <b>{t('used_trays_container_capacity_card',{ns:'admin'})}</b>{container.capacity - container.available}
                                                {/* <LinearProgress sx={{height:"3vh"}} variant="determinate" value={((container.capacity - container.available)/container.capacity)*100} /> */}
                                            </Typography>
                                            <Box sx={{display:"flex"}}>
                                                <ImgProgressBar 
                                                    percentage={((container.capacity - container.available)/container.capacity)} 
                                                    imageUrl={containerImg}
                                                />
                                            </Box>
                                            {/*<Button variant="contained" sx={{width:"34%"}} onClick={()=>handleViewTask(task.type)} color="primary" >
                                                View
                                            </Button>*/}
                                        </Paper>
                                                                            
                                    )
                                })}
                            </Box> 
                                
                            
                            
                        </Paper>
                        {/* Employee Performance */}
                        <Paper elevation={4} sx={{...fixedHeightPaper,height:400,marginTop:3,
                            "& .header-sales-table":{
                                backgroundColor:BV_THEME.palette.primary.main,
                                color:"white"
                            }}}>
                            {/* <Typography variant="h6" color="secondary.dark">{t('employee_tasks_cards_title',{ns:'admin'})}</Typography> */}
                            <Typography variant="h6" color="secondary.dark">Right now your employees are working on:</Typography>
                            {/* <Tooltip title="This will delete the WORKING DAY of the employee from the system. This is recommended to be clicked at the end of the day. The history tracking is not affected">
                                <Button variant="contained" backgroundColor={BV_THEME.palette.warning.dark} onClick={handleCleanEmployeesTasks}>{t('clear_data_employees_times',{ns:'admin'})}</Button>
                            </Tooltip> */}
                            <DataGrid
                            columns={[
                                {
                                    field:"col1",
                                    headerName:"Employee",
                                    headerAlign:"center",
                                    align:"center",
                                    headerClassName:"header-sales-table",
                                    minWidth:{xs:"25%",md:130},
                                    flex:1
                                },
                                {
                                    field:"col2",
                                    headerName:"Task",
                                    headerAlign:"center",
                                    align:"center",
                                    headerClassName:"header-sales-table",
                                    minWidth:{xs:"25%",md:130},
                                    flex:1
                                },
                                {
                                    field:"col3",
                                    headerName:"Expected Time",
                                    headerAlign:"center",
                                    align:"center",
                                    headerClassName:"header-sales-table",
                                    minWidth:{xs:"25%",md:130},
                                    flex:1
                                },
                                {
                                    field:"col4",
                                    headerName:"Achieved time",
                                    headerAlign:"center",
                                    align:"center",
                                    headerClassName:"header-sales-table",
                                    minWidth:{xs:"25%",md:130},
                                    flex:1
                                },
                            ]}
                            rows={displayTaskCards("dailyTrack")}
                            sx={{marginY:"2vh",}}>
                            </DataGrid>
                        </Paper>
                        <Paper elevation={4} sx={{...fixedHeightPaper,height:400,marginTop:3,
                            "& .header-sales-table":{
                                backgroundColor:BV_THEME.palette.primary.main,
                                color:"white"
                        }}}>

                            <Typography variant="h6" color="secondary.dark">Today your employees finished:</Typography>
                            {/* <Tooltip title="This will delete the WORKING DAY of the employee from the system. This is recommended to be clicked at the end of the day. The history tracking is not affected">
                                <Button variant="contained" backgroundColor={BV_THEME.palette.warning.dark} onClick={handleCleanEmployeesTasks}>{t('clear_data_employees_times',{ns:'admin'})}</Button>
                            </Tooltip> */}
                            <DataGrid
                            columns={[
                                {
                                    field:"col1",
                                    headerName:"Employee",
                                    headerAlign:"center",
                                    align:"center",
                                    headerClassName:"header-sales-table",
                                    minWidth:{xs:"25%",md:130},
                                    flex:1
                                },
                                {
                                    field:"col2",
                                    headerName:"Task",
                                    headerAlign:"center",
                                    align:"center",
                                    headerClassName:"header-sales-table",
                                    minWidth:{xs:"25%",md:130},
                                    flex:1
                                },
                                {
                                    field:"col3",
                                    headerName:"Expected Time",
                                    headerAlign:"center",
                                    align:"center",
                                    headerClassName:"header-sales-table",
                                    minWidth:{xs:"25%",md:130},
                                    flex:1
                                },
                                {
                                    field:"col4",
                                    headerName:"Achieved time",
                                    headerAlign:"center",
                                    align:"center",
                                    headerClassName:"header-sales-table",
                                    minWidth:{xs:"25%",md:130},
                                    flex:1
                                },
                            ]}
                            rows={displayTaskCards("history")}
                            sx={{marginY:"2vh",}}>
                            </DataGrid> 
                        </Paper>

                    </Grid>
                </Grow>

            {/*Grid Container End */}    
            </Grid>
        </Container>
    </Box>
    </Fade>
    
    
    

    
    </>
  )
}
