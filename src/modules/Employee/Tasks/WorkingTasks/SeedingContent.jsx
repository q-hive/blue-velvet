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
    
    const totalTrays = Math.ceil(sumAllTrays())

    console.log("products SeedingContent", products)

    function sumAllTrays() {
        let i;
        let trays = 0;

        for (i = 0; i < products.length; i++) {
          if(products[i].productionData != undefined)
            trays += products[i].productionData.trays
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
                        Seeding-tools<br/><b>{totalTrays}</b> {totalTrays>1 ? "Trays": "Tray"} <br/> 
                        <b>{totalTrays}</b> pre-cut {totalTrays>1 ? "Hemp-Mats": "Hemp-Mat"} <br/>
                    </Typography>
                    {finalArray.map((product,index)=>{return(
                        <Typography key={index} variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                            <b>{parseFloat(product.seeds).toFixed(2)}</b> grs of <b>{product.name}</b> Seeds <br/>
                        </Typography>
                    )})}
                    
                    
                </Box>

            </>
        );

    if(props.index===1) 
        return (
            <>
                <Box sx={taskCard_sx}>
                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                    Place the {totalTrays} Trays on the Seeding-Table, and fill each of them with a pre-cut Hemp-Mat
                    </Typography>
                </Box>

            </>
        );

    if(props.index===2) 
        return (
            <>
                <Box sx={taskCard_sx}>
                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                    Staple them under the Table.
                    </Typography>
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
                    <b>Max seeds per tray:</b><br/>
                </Typography>

                {
                    
                    uniqueByName(finalArray).map((product,index)=>{
                        return( 
                            <Typography key={product+index+"2"} variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                                <b>{product.name}</b> :  <b>{getSeeds(product)}</b> grs of seeds <br/>
                            </Typography>
                        )
                    })
                }

                <br/>
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