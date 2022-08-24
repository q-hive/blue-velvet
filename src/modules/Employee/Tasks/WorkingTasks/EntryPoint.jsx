import { Add } from '@mui/icons-material'
import { Box, Button, Container, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'

//*Netword and routing
import { useNavigate } from 'react-router-dom'

export const EntryPoint = () => {
    const navigate = useNavigate()

    const [productionLines, setProductionLines] = useState([])

    
    useEffect(() => {
        //*get production lines from org container.
    },[])
  return (
    <Box component="div" minHeight="100vh" display="flex"  >
            <Container maxWidth="md" >
                <Box display="flex" flexDirection="column" py={8} width="100%" height="100%" alignItems="center" >
                    <Paper sx={{width: {xs:"80%", md:450}, height: 450, m:3}}>
                        Tasks from orders: id, id, id, id
                    </Paper>


                    {/* TASKS FROM PRODUCTION LINES 
                    {tasks.map((task, idx) => {
                        
                    })
                    }*/}

                    <Button variant='contained' color='primary' startIcon={<Add/>} onClick={navigate("./taskTest")} sx={{minWidth:"20%"}}>
                        Dynatask
                    </Button>
                </Box>
            </Container>
       </Box>
  )
}
