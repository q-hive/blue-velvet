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


export const Dashboard = () => {
    const {user,credential} = useAuth()

    const [containers, setContainers] = useState([])

    const theme = useTheme(BV_THEME)

    const fixedHeightPaper = {
        padding: BV_THEME.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
        height: 240
    }
    const organizationID = "633b2e0cd069d81c46a18032"

    const rows = [
        { id: 1, col1: 'Eluis', col2: Math.random()},
        { id: 2, col1: 'Eluis2', col2: Math.random()},
        { id: 3, col1: 'Eluis3', col2: Math.random() },
      ];

    const navigate = useNavigate()

    const handleRedirect = (e) => {
        navigate(`/${user.uid}/admin/${e.target.id}`)
    }

    const fakeContainers = [{name:"Panama Container",capacity:356,used:50},{name:"Colombia Container",capacity:356,used:150}]

    const getContainers = async ()=> {
        const containersData = await api.api.get(`${api.apiVersion}/organizations?_id=${organizationID}`,{
            headers:{
                "authorization":    credential._tokenResponse.idToken,
                "user":             user
            }
        })

        return containersData.data.data[0].containers
    }

    useEffect(() => {
        const getData = async () => {
            try {
                const containers2 = await getContainers()
                console.log("containers 2",containers2)
                return containers2
            } catch(err) {
                console.log(err)
            }
        }

        getData()
        .then((response)=>{
            setContainers(response)
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
                            <Typography variant="h6" color="secondary.dark">Employee Performance</Typography>
                            <DataGrid
                            columns={[{
                                field:"col1",
                                headerName:"Employee",
                                headerAlign:"center",
                                align:"center",
                                headerClassName:"header-sales-table",
                                minWidth:{xs:"25%",md:130},
                                flex:1
                            },{
                                field:"col2",
                                headerName:"Performance rate",
                                headerAlign:"center",
                                align:"center",
                                headerClassName:"header-sales-table",
                                minWidth:{xs:"25%",md:130},
                                flex:1
                            },]}
                            rows={rows}
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
