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
        const employeesPerformance = await api.api.get(`${api.apiVersion}/employees/analytics/performance`, {
            headers:{
                "authorization":    credential._tokenResponse.idToken,
                "user":             user
            }
        })

        console.log(employeesPerformance)
        return employeesPerformance.data.data.employees
    }

    const mapEmployeesData = (employees) => {
        let array = []
        if(Array.isArray(employees)){
            array = employees.map((data) => {
                return {name:data.name, level:data.performance.level, _id:data._id}
            })

            return array
        }

        throw "Function for mapping employees data is not receiving an array"
    }
    
    useEffect(() => {
        const getData = async () => {
            try {
                const containers2 = await getContainers()
                const employeesData = await getEmployees()

                const mappedEmployees = mapEmployeesData(employeesData)
                return {containers2, mappedEmployees}
            } catch(err) {
                console.log(err)
                throw "There was an error trying to get data for dashboard"
            }
        }

        getData()
        .then((response)=>{
            setContainers(response.containers2)
            setEmployeesPerformanceRows(response.mappedEmployees)
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
                                                <b>Max: </b>{container.capacity}<b> Used: </b>{container.available}{" "}<LinearProgress sx={{height:"3vh"}} variant="determinate" value={(container.used * 100) / container.capacity} />
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
                            <Typography variant="h6" color="secondary.dark">Employee level</Typography>
                            <DataGrid
                            columns={adminDashboardEmployees}
                            rows={employeesPerformanceRows}
                            getRowId={(row) => {
                                return row._id
                            }}
                            sx={{marginY:"2vh",}}>
                            </DataGrid>
                            
                        </Paper>
                    </Grid>
                </Grow>
            </Grid>
        </Container>
    </Box>
    </Fade>
    
    
    

    
    </>
  )
}
