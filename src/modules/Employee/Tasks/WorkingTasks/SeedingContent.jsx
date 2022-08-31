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

const trays = 3
const seeds = 35
const product = "Radiesi"

export const SeedingContent = (props) => {

    if(props.index===0)
        return (<>
            <Box sx={taskCard_sx}>
                <Typography variant="h4" align='center' color="secondary">
                Gather what you need: <br /><br/>
                </Typography>
                
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                <b>{trays}</b> Trays <br/> <b>{trays}</b> pre-cut Hemp-Mat <br/> <b>{seeds}</b>grs of <b>{product}</b> Seeds <br/> Seeding-tools
                </Typography>
            </Box>

        </>);

    if(props.index===1) 
        return (<>
            <Box sx={taskCard_sx}>
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                Place the {trays} Trays on the Seeding-Table, and fill each of them with a pre-cut Hemp-Mat
                </Typography>
            </Box>

        </>);

    if(props.index===2) 
        return (<>
            <Box sx={taskCard_sx}>
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                Staple them under the Table.
                </Typography>
            </Box>

        </>);

    if(props.index===3) 
        return (<>
            <Box sx={taskCard_sx}>
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                Take the {seeds} grs of {product} seeds and spread them out in bulks. 
                <br/><br/><i>Spread the seeds equally on the mats and softly spray them with the triangle-spray.</i>
                </Typography>
            </Box>

        </>)

    if(props.index===4) 
    return (<>
        <Box sx={taskCard_sx}>
            <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
            Staple them slightly turned and bring them to the germination-shelves.  
            </Typography>
        </Box>

    </>)

}