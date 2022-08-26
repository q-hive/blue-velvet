import React, { useState } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Fab, Typography } from '@mui/material'

//*UTILS

import AddIcon from '@mui/icons-material/Add';
//THEME
import { BV_THEME } from '../../../../theme/BV-theme'

import { HarvestingContent } from './HarvestingContent';
import { SeedingContent } from './SeedingContent';

export const StepDisplay = (props) => {
    console.log(props.index)
    let test = props.index;

    if(props.type==="?harvesting")
    return(<>
    <Typography variant="h3" color="primary">Harvesting</Typography>
    <HarvestingContent index={props.index}/> 
    </> )

    if(props.type==="?seeding")
    return(<>
    <Typography variant="h3" color="primary">Seeding</Typography>
    <SeedingContent index={props.index}/> 
    </> )
    
    
    
    
    console.log("llamada hecha")

}