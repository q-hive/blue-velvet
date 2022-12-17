import React, { useEffect, useState } from 'react'

//*MUI COMPONENTS
import { Box, Button, Container, Grid, Paper, Stack, Typography, useTheme, LinearProgress, Grow, Fade} from '@mui/material'

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
import { transformTo } from '../../../utils/times';

export const Dashboard = () => {
    const {user,credential} = useAuth()

    const [containers, setContainers] = useState([])
    const [employeesPerformanceRows,  setEmployeesPerformanceRows] = useState([])

    const theme = useTheme(BV_THEME)

    const fixedHeightPaper = {
        padding: BV_THEME.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
        height: 240
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

    const fakeContainers = [{name:"Panama Container",capacity:356,used:50},{name:"Colombia Container",capacity:356,used:150}]

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
    
    function displayTaskCards (){
        return(
            <>
                <Typography variant="body2">
                    <i>
                        <b>Times are displayed in minutes</b>
                    </i>
                </Typography>
                {
                    employeesPerformanceRows.map((employee, index) => {
                        return Object.keys(employee.workDay).length>0 && (
                            <>
                                {
                                    Object.keys(employee.workDay).map((task, idx) => {
                                        return (
                                            <Paper key={idx} display="flex" flexdirection="column" variant="outlined" sx={{padding:1,margin:1,}}>
                                                <Box sx={{display:"flex",flexDirection:"column",justifyContent:"space-evenly",alignContent:"space-evenly"}}>
                                                    <Typography >
                                                        <b>Task: {getKey(task)}</b>
                                                    </Typography>
                                                    <Typography >
                                                        <i>Expected Time: {transformTo("ms","minutes",employee.workDay[task].expectedTime)} </i>
                                                    </Typography>
                                                    <Typography >
                                                        <i>Achieved Time: {employee.workDay[task].achievedTime !== 0 ? transformTo("ms","minutes",employee.workDay[task].achievedTime) : "Not finished"} </i>
                                                    </Typography>
                                                    <Typography >
                                                        <i>Employee: {employee.name} </i>
                                                    </Typography>
                                                </Box>  
                                            </Paper>
                                        )
                                    })

                                }
                            </>
                        ) 
                        
                    })
                }
            </>
            
        )    
    }
    
    useEffect(() => {
        const getData = async () => {
            try {
                const containers2 = await getContainers()
                const employeesData = await getEmployees()

                // const mappedEmployees = mapEmployeesData(employeesData)
                return {containers2, employeesData}
            } catch(err) {
                console.log(err)
                throw "There was an error trying to get data for dashboard"
            }
        }

        getData()
        .then((response)=>{
            setContainers(response.containers2)
            setEmployeesPerformanceRows(response.employeesData)
        })
        .catch((err) =>{
            console.log(err)
        })
        
    }, [])

    
  return (
    <>
    <Fade in={true} timeout={1000} unmountOnExit>
    <Box component="div" display="flex"  >

        <Container maxWidth="lg" sx={{paddingTop:4,paddingBottom:4,marginX:{xs:4,md:"auto"},marginTop:{xs:4,md:3}}}>
            <Typography variant="h2" color="primary">Welcome, Admin</Typography>
            <Typography variant="h5" color="secondary.dark">Here's your dashboard</Typography>


            <Grid container spacing={3} marginTop={3}>

                {/* Tasks */}
                <Grow in={true} timeout={2000} unmountOnExit>
                    <Grid item xs={12} md={4} lg={4}>
                        <Paper elevation={4} sx={fixedHeightPaper}>
                            <Typography variant="h6" color="secondary.dark">Tasks</Typography>
                            <Box sx={{display:"flex",flexDirection:"column", }}>
                                {/*Delivery Task Only acrive when there are orders on ready to deliver status*/
                                true?
                                    <Paper variant="outlined" sx={{alignItems:"center",justifyContent:"space-between",paddingY:"1.5vh",paddingX:"1.5vh",marginTop:"1vh",display:"flex", flexDirection:"row"}}>
                                        <Typography><b>Packing</b></Typography>
                                        <Button variant="contained" sx={{width:"34%"}} onClick={()=>navigate(`/${user.uid}/employee/tasks/delivery`)} color="primary" >
                                            View
                                        </Button>
                                    </Paper>  
                                :
                                    null
                                }

                                {/*Delivery Task Only acrive when there are orders on ready to deliver status*/
                                true?
                                    <Paper variant="outlined" sx={{alignItems:"center",justifyContent:"space-between",paddingY:"1.5vh",paddingX:"1.5vh",marginTop:"1vh",display:"flex", flexDirection:"row"}}>
                                        <Typography><b>Delivery</b></Typography>
                                        <Button variant="contained" sx={{width:"34%"}} onClick={()=>navigate(`/${user.uid}/employee/tasks/delivery`)} color="primary" >
                                            View
                                        </Button>
                                    </Paper>  
                                :
                                    null
                                }

                                
                            </Box> 
                        </Paper>
                    </Grid>
                </Grow>

                {/* Capacity */}
                
                <Grow in={true} timeout={2000} unmountOnExit>
                    <Grid item xs={12} md={4} lg={4}>
                        <Paper elevation={4} sx={fixedHeightPaper}>
                            <Typography variant="h6" color="secondary.dark">Containers' capacity</Typography>
                            <Box sx={{display:"flex",flexDirection:"column", }}>

                                {containers.map((container,index) => { return(
                                        <Paper key={index} variant="outlined" sx={{alignItems:"center",justifyContent:"space-between",paddingY:"1vh",paddingX:".5vh",marginTop:"2vh",display:"flex", flexDirection:"column"}}>
                                            <Typography variant="h6" color="primary.dark" sx={{width:"98%",}}>
                                                {container.name}:<br/>
                                                </Typography>
                                            <Typography sx={{width:"98%"}}>
                                                <b>Max: </b>{container.capacity}<b> Available: </b>{container.available}{" "}<LinearProgress sx={{height:"3vh"}} variant="determinate" value={(container.used * 100) / container.capacity} />
                                            </Typography>
                                            {/*<Button variant="contained" sx={{width:"34%"}} onClick={()=>handleViewTask(task.type)} color="primary" >
                                                View
                                            </Button>*/}
                                        </Paper>
                                                                            
                                    )
                                })}
                            </Box> 
                                
                            
                            
                        </Paper>
                    </Grid>
                </Grow>

                {/* Employee Performance */}
                <Grow in={true} timeout={2000} unmountOnExit>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={4} sx={{...fixedHeightPaper,height:400,
                            "& .header-sales-table":{
                                backgroundColor:BV_THEME.palette.primary.main,
                                color:"white"
                            }}}>
                            <Typography variant="h6" color="secondary.dark">Employees tasks</Typography>
                            <Button onClick={handleCleanEmployeesTasks}>Clean data for today</Button>
                            {displayTaskCards()}
                            
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
