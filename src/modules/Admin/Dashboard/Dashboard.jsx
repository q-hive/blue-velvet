import React from 'react'

//*MUI COMPONENTS
import { Box, Button, Container, Grid, Paper, Stack, Typography, useTheme, LinearProgress} from '@mui/material'

//*ROUTER
import { navigate } from '../../../utils/router'

//*Contexts
import useAuth from '../../../contextHooks/useAuthContext'

//*Routing
import { useNavigate } from "react-router-dom";
//Theme
import { BV_THEME } from '../../../theme/BV-theme';
import { DataGrid , GridRowsProp} from '@mui/x-data-grid';


export const Dashboard = () => {
    const {user} = useAuth()

    const theme = useTheme(BV_THEME)

    const fixedHeightPaper = {
        padding: BV_THEME.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
        height: 240
    }

    const rows = [
        { id: 1, col1: 'Eluis', col2: Math.random()},
        { id: 2, col1: 'Eluis2', col2: Math.random()},
        { id: 3, col1: 'Eluis3', col2: Math.random() },
      ];

    const navigate = useNavigate()

    const handleRedirect = (e) => {
        navigate(`/${user.uid}/admin/${e.target.id}`)
    }

    const containers = [{name:"Panama Container",capacity:356,used:50},{name:"Colombia Container",capacity:356,used:150}]
    
  return (
    <>
    <Box component="div" display="flex"  >

        <Container maxWidth="lg" sx={{paddingTop:4,paddingBottom:4,marginX:{xs:4,md:"auto"},marginTop:{xs:4,md:3}}}>
            <Typography variant="h2" color="primary">Welcome, {user.name}</Typography>
            <Typography variant="h5" color="secondary">Here's your dashboard</Typography>


            <Grid container spacing={3} marginTop={3}>

                {/* Tasks */}
                <Grid item xs={12} md={4} lg={4}>
                    <Paper sx={fixedHeightPaper}>
                        <Typography variant="h6" color="secondary">Tasks</Typography>
                        <Box sx={{display:"flex",flexDirection:"column", }}>

                            
                        </Box> 
                    </Paper>
                </Grid>

                {/* Tasks */}
                <Grid item xs={12} md={4} lg={4}>
                    <Paper sx={fixedHeightPaper}>
                        <Typography variant="h6" color="secondary">Containers' capacity</Typography>
                        <Box sx={{display:"flex",flexDirection:"column", }}>

                            {containers.map((container,index) => { return(
                                    <Paper variant="outlined" sx={{alignItems:"center",justifyContent:"space-between",paddingY:"3px",paddingX:"2px",marginTop:"2vh",display:"flex", flexDirection:"row"}}>
                                        <Typography sx={{width:"98%"}}>
                                            {container.name}:<br/><b>Max: </b>{container.capacity}<b> Used: </b>{container.used}{" "}<LinearProgress sx={{height:"3vh"}} variant="determinate" value={(container.used * 100) / container.capacity} />
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

                {/* Not used yet */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{...fixedHeightPaper,height:400,
                        "& .header-sales-table":{
                            backgroundColor:BV_THEME.palette.primary.main,
                            color:"white"
                        }}}>
                        <Typography variant="h6" color="secondary">Employee Performance</Typography>
                        <DataGrid
                        columns={[{
                            field:"col1",
                            headerName:"Employee",
                            headerAlign:"center",
                            headerClassName:"header-sales-table",
                            minWidth:{xs:"25%",md:130},
                            flex:1
                        },{
                            field:"col2",
                            headerName:"Performance rate",
                            headerAlign:"center",
                            headerClassName:"header-sales-table",
                            minWidth:{xs:"25%",md:130},
                            flex:1
                        },]}
                        rows={rows}
                        sx={{marginY:"2vh",}}>
                        </DataGrid>
                        
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    </Box>
    
    
    

    
    </>
  )
}
