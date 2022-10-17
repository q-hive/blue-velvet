import React, { useState } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Fade, Stack, Typography } from '@mui/material'

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

const estimated = 60*2.2;

export const SeedingContent = (props) => {

    const products = props.products

    const productsObj = props.productsObj

    const finalArray = getFinalArray()


    {/* Adds all the relevant information of same name products */}
    function getFinalArray(){
        const array = []
        const llaves = Object.keys(productsObj)

        for(let i=0; i<llaves.length; i++){
            array.push({
                    name:llaves[i].toString(),
                    harvest:productsObj[llaves[i]].harvest,
                    seeds:productsObj[llaves[i]].seeds,
                    trays:productsObj[llaves[i]].trays
                })
        }
        return array
    }
    
    const totalTrays = sumAllTrays()

    console.log("products SeedingContent", products)

    function sumAllTrays() {
        let i;
        let trays = 0;

        for (i = 0; i < finalArray.length; i++) {
          if(finalArray[i].trays != undefined)
            trays += Math.ceil(finalArray[i].trays)
        }
        
        return trays;
      }

      function uniqueByName(items) {
        const set = new Set();
        return items.filter((item) => {
          const isDuplicate = set.has(item.name);
          set.add(item.name);
          return !isDuplicate;
        });
      }
    
    
    if(props.index===0)
        return (
            <>
                <Box sx={taskCard_sx}>
                    <Typography variant="h4" align='center' color="secondary">
                        Gather what you need: <br /><br/>
                    </Typography>
                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        <b>{totalTrays}</b> {totalTrays>1 ? "Trays": "Tray"} <br/> 
                    </Typography>
                    {finalArray.map((product,index)=>{return(
                        <Typography key={index} variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                            <b>{parseFloat(product.seeds).toFixed(2)}</b> grs of <b>{product.name}</b> Seeds <br/>
                        </Typography>
                    )})}

                    <Box sx={taskCard_sx}>
                        <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        Place the {totalTrays} Trays on the Seeding-Table, and fill each of them with a pre-cut Hemp-Mat
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

    if(props.index===1){
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
                    
                    uniqueByName(finalArray).map((product,index)=>{
                        return( 
                            <Typography key={product+index+"2"} variant="h5" align='justify' color={BV_THEME.textColor.lightGray} >
                                <b>{product.name}</b> <br/>{Math.ceil(product.trays)} trays. Max seeds per tray:  <b>{getSeeds(product)}</b> g <br/><br/>
                            </Typography>
                        )
                    })
                }

                <br/>
                </Stack>
            </Box>

        </>
        )
    } 

    if(props.index===2) 
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