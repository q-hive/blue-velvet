import React, { useState } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Checkbox, Fade, FormControl, FormControlLabel, FormGroup, Typography } from '@mui/material'

//*UTILS

//THEME
import { BV_THEME } from '../../../../theme/BV-theme'
import { CheckBox } from '@mui/icons-material'

const taskCard_sx = {
    display:"flex",
    width:"100%", 
    justifyContent:"center",
    marginTop:"5vh", 
    flexDirection:"column",
    alignItems:"center"
}

export const CleaningContent = (props) => {

    if(props.index===0) 
        return (<>
            <Box sx={taskCard_sx}>
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                Check and clean each of the following:<br/><br/>
                </Typography>

                <FormControl component="fieldset">
                    <Box display={"flex"} width="100%" flexDirection="row" justifyContent={"space-evenly"}textAlign={"center"}>
                    <FormGroup aria-label="position" column>
                        <FormControlLabel
                            value="tables"
                            control={<Checkbox />}
                            label="Tables"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="sinks"
                            control={<Checkbox />}
                            label="Sinks"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="scales"
                            control={<Checkbox />}
                            label="Scales"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="knives"
                            control={<Checkbox />}
                            label="Knives"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="buckets"
                            control={<Checkbox />}
                            label="Buckets"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="fridge"
                            control={<Checkbox />}
                            label="Fridge"
                            labelPlacement="end"
                        />
                    </FormGroup>
                    <Box width="33%"></Box>
                    <FormGroup aria-label="position" column>
                        <FormControlLabel
                            value="seedStorage"
                            control={<Checkbox />}
                            label="Seed Storage"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="floor"
                            control={<Checkbox />}
                            label="Floor"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="waterOutlet"
                            control={<Checkbox />}
                            label="Underground Water Outlet"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="dryStation"
                            control={<Checkbox />}
                            label="Dry Station"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="airIntake"
                            control={<Checkbox />}
                            label="Air Intake"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="waste"
                            control={<Checkbox />}
                            label="Manage Waste"
                            labelPlacement="end"
                        />
                    </FormGroup>
                    </Box>
                </FormControl>
            </Box>

        </>);


}