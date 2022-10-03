import { Add } from '@mui/icons-material'
import { Box, Button, Container, LinearProgress, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BV_THEME } from '../../../theme/BV-theme'
import { EmployeeColumns } from '../../../utils/TableStates'
import api from '../../../axios.js'
import useAuth from '../../../contextHooks/useAuthContext'

export const EmployeeIndex = () => {
    const {user, credential} = useAuth()
    
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const handleNewEmployee = () => {
        navigate('new')
    }

    useEffect(() => {
        setLoading(() => {
            return true
        })
        api.api.get(`${api.apiVersion}/employees/`, {
            headers:{
                authorization:credential._tokenResponse.idToken,
                user: user
            }
        })
        .then((res) => {
            setRows(res.data.data)
            setLoading(() => {
                return false
            })
        })
        .catch((err) => {
            console.log(err)
        })
    },[])
    
  return (
    <>
    <Box width="100%" height="100%">
        <Container sx={{padding:"2%"}}>
            <Box sx={{
                    width:"100%", 
                    height:"80vh",
                    "& .header-sales-table":{
                        backgroundColor:BV_THEME.palette.primary.main,
                        color:"white"
                    }
                }}
            >
                
                <Typography variant="h4" textAlign={"center"} margin={BV_THEME.margin.mainHeader}>
                    Employee management
                </Typography>

                <Box sx={{width:"100%", height:"100%"}}>
                    <Box sx={{display:"flex", justifyContent:"space-between",marginBottom:"3vh"}} >
                        <Button variant='contained' color='primary' startIcon={<Add/>} onClick={handleNewEmployee} sx={{minWidth:"20%"}}>
                            New Employee
                        </Button>
                    </Box>
                    {
                        loading
                        ?   
                        <LinearProgress color="primary" sx={{marginY:"2vh"}}/>
                        :   
                        <>
                            <DataGrid
                            columns={EmployeeColumns}
                            rows={rows}
                            sx={{width:"100%", height:"80%"}}
                            getRowId={(row) => {
                                return row._id
                            }}
                            />
                        </>
                    }
                </Box>
            </Box>
        </Container>  
    </Box>
    </>
  )
}
