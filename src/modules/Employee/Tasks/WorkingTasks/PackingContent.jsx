import React, { useEffect, useState } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Fade, Typography } from '@mui/material'

//*UTILS

//THEME
import { BV_THEME } from '../../../../theme/BV-theme'
import { getPackingProducts } from '../../../../CoreComponents/requests'

const taskCard_sx = {
    display:"flex",
    width:"100%", 
    justifyContent:"center",
    marginTop:"5vh", 
    flexDirection:"column",
    alignItems:"center"
}


export const PackingContent = (props) => {
    let products = props.products
    let packs = props.packs
    let totalPacks = {"products":{"packages":{"small":0, "medium":0 ,"large":0}}}
    const getPackagesInGrams = (packagesObject) => {
        let small =     25 * packagesObject["small"]
        let medium =    80 * packagesObject["medium"]
        let large =     1000 * packagesObject["large"]
        let total = small + medium + large
        
        return {
            "small":    small,
            "medium":   medium,
            "large":    large,
            "total":    total
        }
    }
    
    if(packs?.length > 0) {
        totalPacks = props.packs.reduce((current, past) => {
            if(current && past){
                let currentSmall = current[Object.keys(current)[0]].packages.small
                let pastSmall = past[Object.keys(past)[0]].packages.small
    
                let currentMedium = current[Object.keys(current)[0]].packages.medium
                let pastMedium = past[Object.keys(past)[0]].packages.medium
    
                let currentLarge = current[Object.keys(current)[0]].packages.large
                let pastLarge = past[Object.keys(past)[0]].packages.large
                
                return {
                    "products": {
                        "packages":{
                            "small": currentSmall + pastSmall,
                            "medium": currentMedium + pastMedium,
                            "large": currentLarge + pastLarge,
                        }
                    }
                    
                }
            }
            
        },{"products":{"packages":{"small":0, "medium":0 ,"large":0}}})
    }

    // if(props.index===0)
    //     return (<>
    //         <Box sx={taskCard_sx}>
    //             <Typography variant="h4" align='center' color="secondary">
    //                 Gather what you need: <br /><br/>
    //             </Typography> 
                

    //             <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
    //                  The following dry-Products: 
    //                  <br></br>
    //                  {
    //                     packs.length > 0 &&(
    //                         packs.map((obj,index)=>{
    //                             let productName = Object.keys(obj)[0]

    //                             return(
    //                                 <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
    //                                     {getPackagesInGrams(obj[productName].packages).total} grs of {productName}
    //                                 </Typography>
    //                             )
    //                         })
    //                     ) 
    //                 }
    //                  <br/> 
    //                  Scale <br/> 
    //                  <b>{totalPacks.products.packages.small}</b> pre-labeled small Packages <br/> 
    //                  <b>{totalPacks.products.packages.medium}</b> pre-labeled medium Packages <br/> 
    //                  Boxes for packed Products <br/>
    //                  Date-Stamp 
    //             </Typography>
    //         </Box>

    //     </>);

    // if(props.index===1) 
    //     return (<>
    //         <Box sx={taskCard_sx}>
    //             <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
    //                 Place the empty <b>Package</b> on the <b>Scale</b> and tare it to 0. <br/><br/>
                    
                    
    //                 <i>This process should be repeated for every size of packages, when small packages packing finished, repeat the process</i>  

    //                 <br></br>
    //                 <i>This process should be repeated once in a while to ensure the scale's calibration</i>  
    //             </Typography>
    //         </Box>

    //     </>);

    if(props.index===0) 
        return (<>
            <Box sx={taskCard_sx}>
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                    {/* Take a handful of product softly in your hand and let it fall into the package until it's reached the correct amount and close it.
                    <br/><br/> */}
                    {/* <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        Amount of products in grams: <br></br>
                        {
                            products.length > 0 && (
                                products.map((product) => {
                                    return (
                                        <>
                                            <b>{product.ProductName}: {product.harvest} grs</b> <br></br>    
                                        </>
                                    )
                                })
                            ) 
                        
                        }
                    </Typography>

                    <br></br> */}
                    
                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        Total packages: <br></br>
                        {
                            packs && packs.length > 0 ? (
                                packs.map((pack) => {
                                    return (
                                        <>
                                            <b>
                                            {Object.keys(pack)[0]}: 
                                            </b> 
                                            <br></br>
                                            {pack[Object.keys(pack)[0]].packages.large} pack X 1kg<br></br>
                                            {pack[Object.keys(pack)[0]].packages.medium} pack X 80g <br></br>
                                            {pack[Object.keys(pack)[0]].packages.small} pack X 25g<br></br>
                                            
                                            <br></br>    
                                        </>
                                    )
                                })
                            )  
                            :
                            <>
                                Small: {0} <br></br>
                                Medium: {0} <br></br>
                            </>

                        }
                    </Typography>
                    <b><i>Make sure there are no greens on the side of the container when closing</i></b>
                </Typography>
            </Box>

        </>);

    // if(props.index===3) 
    //     return (<>
    //         <Box sx={taskCard_sx}>
    //             <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
    //                 Place the packages in the <i>Boxes</i> for delivery or cooling.
    //                 <br/><br/>
    //                 Once you've finished packing the containers, check the delivery sheet to see if it's 
    //                 correct and put the Harvest-Dates on.
    //             </Typography>
    //         </Box>

    //     </>)

}