import React, { useState } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Fade, Typography } from '@mui/material'

//*UTILS

//THEME
import { BV_THEME } from '../../../../theme/BV-theme'

const taskCard_sx = {
    display:"flex",
    width:"100%", 
    justifyContent:"center",
    marginTop:"5vh", 
    flexDirection:"column",
    alignItems:"center"
}



export const MatCutContent = (props) => {

    if(props.index===0) 
        return (<>
            <Box sx={taskCard_sx}>
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                Cut the needed amount of mats for the week  
                </Typography>

                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                Expected Trays: 
                </Typography>
            </Box>

        </>);


}