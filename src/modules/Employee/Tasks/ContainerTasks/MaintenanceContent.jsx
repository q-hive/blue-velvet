import React, { useState } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Checkbox, Fade, FormControl, FormControlLabel, FormGroup, IconButton, Tooltip, Typography } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help';

//*UTILS

//THEME
import { BV_THEME } from '../../../../theme/BV-theme'
import { CheckBox } from '@mui/icons-material'
import { Stack } from '@mui/system';

const taskCard_sx = {
    display:"flex",
    width:"100%", 
    justifyContent:"center",
    marginTop:"5vh", 
    flexDirection:"column",
    alignItems:"center"
}

const stuffToClean1 = [
                        {value:"tables",label:"Sharpen Knives"},
                        {value:"sinks",label:"Clean Air Intake"},
                        {value:"lights",label:" Clean Lights"},
                        {value:"scales",label:"Replace Scales' Batteries"},
                    ]

const stuffToClean2 = [
                        {value:"seedStorage",label:"Seed Storage"},
                        {value:"floor",label:"Floor"},
                        {value:"waterOutlet",label:"Water Outlet"},
                        {value:"dryStation",label:"Dry Station"},
                        {value:"airIntake",label:"Air Intake"},
                        // {value:"waste",label:"Manage Waste",
                        //         tooltip:
                        //         <Tooltip placement="right" title={
                        //                     <>
                        //                         <Typography color="inherit">Managing Waste</Typography>
                        //                         <em>{"Check the unharvested fully grown trays and write down the amount of trays that produced too much"}</em><br/>
                        //                         {"Normal Overhead is 5 to 10 %"}
                        //                     </>
                        //                 }>
                        //                     <IconButton>
                        //                         <HelpIcon />
                        //                     </IconButton>
                        //         </Tooltip>}
                    ]

export const MaintenanceContent = (props) => {

    if(props.index===0) 
        return (<>
            <Box sx={taskCard_sx}>
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                It's time for maintenance, please do the following Tasks:<br/><br/>
                </Typography>

                <FormControl component="fieldset" sx={{width:"100%"}}>
                    <Box display={"flex"} width="100%" flexDirection="row" justifyContent={"space-evenly"}textAlign={"center"}>
                        <FormGroup aria-label="position" >
                            {stuffToClean1.map((stuff,index)=>(
                                <FormControlLabel
                                    key={index}
                                    value={stuff.value}
                                    label={stuff.label}
                                    control={<Checkbox />}
                                    labelPlacement="end"
                                />
                            ))}
                        </FormGroup>
                        {/* <FormGroup aria-label="position" >
                            {stuffToClean2.map((stuff,index)=>{
                                return (
                                    stuff.tooltip == undefined ?
                                        <FormControlLabel
                                            key={index}
                                            value={stuff.value}
                                            label={stuff.label}
                                            control={<Checkbox />}
                                            labelPlacement="end"
                                        />
                                    : 
                                        <Stack direction={"row"}>
                                            <FormControlLabel
                                                key={index}
                                                value={stuff.value}
                                                label={stuff.label}
                                                control={<Checkbox />}
                                                labelPlacement="end"
                                            />
                                            {stuff.tooltip}
                                        </Stack> 
                                )
                            })} 
                        </FormGroup> */}
                    </Box>
                </FormControl>
            </Box>

        </>);


}