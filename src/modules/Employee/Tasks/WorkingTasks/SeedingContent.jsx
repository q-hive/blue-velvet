import React, { useEffect, useState } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Fade, Stack, TextField, Typography } from '@mui/material'

//*UTILS

//*NETWORK
import api from "../../../../axios"

//THEME
import { BV_THEME } from '../../../../theme/BV-theme'
import useAuth from '../../../../contextHooks/useAuthContext'
import useWorkingContext from '../../../../contextHooks/useEmployeeContext';

const taskCard_sx = {
    display:"flex",
    width:"100%", 
    justifyContent:"center",
    marginTop:"5vh", 
    flexDirection:"column",
    alignItems:"center"
}


export const SeedingContent = (props) => {

    const {user, credential} = useAuth()
    const [workProducts, setWorkProducts] = useState(props.workData/*.production.products*/)
    const {TrackWorkModel} = useWorkingContext()

    function sumAllTrays() {
        let i;
        let trays = 0;

        for (i = 0; i < workProducts.length; i++) {
          if(workProducts[i].trays != undefined)
            trays += Math.ceil(workProducts[i].trays)
        }
        
        return trays;
      }

    //   function uniqueByName(items) {
    //     const set = new Set();
    //     return items.filter((item) => {
    //       const isDuplicate = set.has(item.productData.name);
    //       set.add(item.productData.name);
    //       return !isDuplicate;
    //     });
    //   }

    
    
    const totalTrays = sumAllTrays()


    if(props.index===0)
        return (
            <>
                <Box sx={taskCard_sx}>
                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        Check the unharvested fully grown trays and write down the amounts of trays that were
                        produced too much. 
                    </Typography>

                    <br></br>
                    
                    {
                        workProducts.length > 0 && (
                            workProducts.map((Product) => {
                               return (
                                   <>
                                       <Typography variant='h5' align="center" color={BV_THEME.textColor.lightGray}>
                                           <b>
                                               {Product.ProductName}:
                                           </b>
                                       </Typography>
                                       <TextField label="Number of trays" type="number" />
                                       <br></br>
                                   </>
                               )
                           })
                        )
                    }

                    {
                        workProducts.length < 1 && (

                            <Typography>No products available to show waste control inputs.</Typography>
                            
                        )

                    }
                        
                </Box>

            </>
        );

    if(props.index===1)
        return (
            <>
                <Box sx={taskCard_sx}>
                    <Typography variant="h4" align='center' color="secondary">
                        Putting to the light
                    </Typography>
                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        Place the germinated Trays from the dark to the light-shelves. Highest germination level
                        goes at top light level and vice-versa.
                    </Typography>
                </Box>

            </>
        );

    if(props.index===2)
        return (
            <>
                <Box sx={taskCard_sx}>
                    <Typography variant="h4" align='center' color="primary">
                        Seeding <br /><br/>
                    </Typography>
                    <Typography variant="h4" align='center' color="secondary">
                        Gather what you need: <br /><br/>
                    </Typography>
                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        <b>{totalTrays}</b> {totalTrays>1 ? "Trays": "Tray"} <br/> 
                    </Typography>
                    {workProducts.map((product,index)=>{return(
                        !product.minutes ?
                        <Typography key={index} variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                            <b>{parseFloat(product.seeds).toFixed(2)}</b> grs of <b>{product.ProductName}</b> Seeds <br/>
                        </Typography>
                        :
                        null
                    )})}

                    <Box sx={taskCard_sx}>
                        <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        Place the <b>{totalTrays}</b> {totalTrays > 1 ? "Trays" : "Tray"} on the Seeding-Table, and fill each of them with a pre-cut Hemp-Mat
                        </Typography>
                    </Box>

                    <Box sx={taskCard_sx}>
                        <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        Staple them under the Table.
                        </Typography>
                    </Box>


                    
                    
                </Box>

            </>
        );

    if(props.index===3){
        const getSeeds = (product) => {
            if(product.productionData === undefined){
                return parseFloat(product.seeds/product.trays).toFixed(2)
            }
            return parseFloat(product.productionData.seeds/product.productionData.trays).toFixed(2)
        }
    
        return (
        <>
            <Box sx={taskCard_sx}>
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                    Spread the seeds equally on the mats and softly spray them with the <i><b>triangle-spray.</b></i> <br/><br/>
                </Typography>

                
                <Stack  sx={{display:"flex",justifyContent:"space-between"}}>
                {
                    
                    workProducts.map((product,index)=>{
                        return(
                            !product.minutes ?
                        
                        <Typography key={product+index+"2"} variant="h5" align='justify' color={BV_THEME.textColor.lightGray} >
                            <b>{product.name}</b> <br/>{Math.ceil(product.trays)} {product.trays > 1 ? "trays.":"tray."} Max seeds per tray:  <b>{getSeeds(product)}</b> g <br/><br/>
                        </Typography>
                        :
                        null
                            
                        )
                    })
                }

                <br/>
                </Stack>
            </Box>

        </>
        )
    } 

    if(props.index===4) 
    return (
        <>
            <Box sx={taskCard_sx}>
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                    Staple them slightly turned and bring them to the germination shelves.  
                </Typography>
            </Box>

        </>
    )

}