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



export const PackingContent = (props) => {
    const products = props.products
    
    if(props.index===0)
        return (<>
            <Box sx={taskCard_sx}>
                <Typography variant="h4" align='center' color="secondary">
                    Gather what you need: <br /><br/>
                </Typography> 
                

                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                     Dry-Products: 
                     {products.map((product,index)=>{return(
                        <b>{product.name}</b>)})}
                     <br/> 
                     Scale <br/> 
                     <b>{packages}</b> pre-labeled Packages <br/> 
                     Box for packed Products <br/>
                     Date-Stamp 
                </Typography>
            </Box>

        </>);

    if(props.index===1) 
        return (<>
            <Box sx={taskCard_sx}>
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                    Place the empty <b>Package</b> on the <b>Scale</b> and tare it to 0. <br/><br/>
                    <i>This process should be repeated once in a while to ensure the scale's calibration</i>  
                </Typography>
            </Box>

        </>);

    if(props.index===2) 
        return (<>
            <Box sx={taskCard_sx}>
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                    Take a handful of product softly in your hand and let it fall into the package until it's reached the correct amount and close it.
                    <br/><br/>
                    <b><i>Make sure there are no greens on the side of the container when closing</i></b>
                </Typography>
            </Box>

        </>);

    if(props.index===3) 
        return (<>
            <Box sx={taskCard_sx}>
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                    Place the packages in the <i>Boxes</i> for delivery or cooling.
                    <br/><br/>
                    Once you've finished packing the containers, check the delivery sheet to see if it's 
                    correct and put the Harvest-Dates on.
                </Typography>
            </Box>

        </>)

}