import React, { useState } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Fade, Typography } from '@mui/material'

//*UTILS

//THEME
import { BV_THEME } from '../../../../theme/BV-theme'
import { DeliveryComponent } from '../StandaloneTasks/Delivery'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../../contextHooks/useAuthContext'
import { LoadingButton } from '@mui/lab'


const taskCard_sx = {
    display:"flex",
    width:"100%", 
    justifyContent:"center",
    marginTop:"5vh", 
    flexDirection:"column",
    alignItems:"center"
}

export const DeliveryContent = (props) => {
    const navigate = useNavigate()
    const {user} = useAuth()

    const handleReRouteEmployeeTodeliVery = () => {
        navigate('./../delivery')
    }
    
    if(props.index===0) 
        return (<>
            <Box sx={taskCard_sx}>
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                Put the list of destinations into Google Maps route planner and drive there. <br/><br/>
                Let the customers sign the delivery sheets and bring them back to confirm the process has been completed.  
                </Typography>

                <LoadingButton 
                    variant="contained" 
                    size="large" 
                    onClick={() => handleReRouteEmployeeTodeliVery()} 
                    >
                        Go to deliveries
                    </LoadingButton>
                {/* <DeliveryComponent/> */}
            </Box>

        </>);


}