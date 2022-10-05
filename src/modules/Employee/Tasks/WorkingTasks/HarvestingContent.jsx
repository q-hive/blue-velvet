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

const estimated = 60*2;

export const HarvestingContent = (props) => {

    if(props.index===0)
        return (
            <>
                <Box sx={taskCard_sx}>
                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                    Take the Tray with the grown Greens from the Production-Shelves and 
                    stand it at a 45° Angle against the Sides.
                    </Typography>
                </Box>

            </>
        );

    if(props.index===1) 
        return (
            <>
                <Box sx={taskCard_sx}>
                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                    Cut with the <b>Harvesting-Knife </b> 
                    from low to high.<br/><br/> <i><b>Beware that the Greens stay dry!</b></i> <br/><br/> It is not
                    advised to use them once they've fallen on water.
                    </Typography>
                </Box>

            </>
        );

    if(props.index===2) 
        return (
            <>
                <Box sx={taskCard_sx}>
                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                    Place the cut Greens on the Dryrack on the other side on the Harvesting-Table
                    and spread them even and mixed.
                    </Typography>
                </Box>

            </>
        );

    if(props.index===3) 
        return (
            <>
                <Box sx={taskCard_sx}>
                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                    Bring the loaded Dryrack to the Drystation and check the ones drying for 
                    readyness or further mixing.
                    </Typography>
                </Box>

            </>
        )
}