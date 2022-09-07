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

    const products=props.products

    const totalTrays =Math.ceil(sumAllTrays())

    function sumAllTrays() {
        var i;
        var ttrays = 0;
        for (i = 0; i < products.length; i++) {
          ttrays += Math.ceil(products[i].productionData.trays)
        }
        return ttrays;
      }
    
    
    if(props.index===0)
        return (<>
            <Box sx={taskCard_sx}>
                <Typography variant="h4" align='center' color="secondary">
                    Gather what you need: <br /><br/>
                </Typography>
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                    Seeding-tools<br/><b>{totalTrays}</b> {totalTrays>1 ? "Trays": "Tray"} <br/> 
                    <b>{totalTrays}</b> pre-cut {totalTrays>1 ? "Hemp-Mats": "Hemp-Mat"} <br/>
                </Typography>
                {products.map((product,index)=>{return(
                    <Typography key={product.id} variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        <b>{parseFloat(product.productionData.seeds).toFixed(2)}</b> grs of <b>{product.name}</b> Seeds <br/>
                    </Typography>
                )})}
                
            </Box>

        </>);

    if(props.index===1) 
        return (<>
            <Box sx={taskCard_sx}>
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                Place the {totalTrays} Trays on the Seeding-Table, and fill each of them with a pre-cut Hemp-Mat
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
                Spread the seeds equally on the mats and softly spray them with the <i><b>triangle-spray.</b></i> <br/><br/>
                <b>Max seeds per tray:</b><br/></Typography>
                {products.map((product,index)=>{console.log("amen",product); return(
                    <Typography key={product.id+"2"} variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        <b>{product.name}</b> :  <b>{parseFloat(product.productionData.seeds/product.productionData.trays).toFixed(2)}</b> grs of seeds <br/>
                    </Typography>
                )})}

                
                <br/>
                
            </Box>

        </>)

    if(props.index===4) 
    return (<>
        <Box sx={taskCard_sx}>
            <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
            Staple them slightly turned and bring them to the germination shelves.  
            </Typography>
        </Box>

    </>)

}