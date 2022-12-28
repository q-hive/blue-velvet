import React, { useState } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Fade, IconButton, Typography } from '@mui/material'

import workingTablePosition from '../../../../assets/images/production/working table position.png'
import trayAt45Angle from '../../../../assets/images/production/tray at 45 angle.png'
import greensOnDryRack from '../../../../assets/images/production/greens on dryrack.png'


//*UTILS

//THEME
import { BV_THEME } from '../../../../theme/BV-theme'
import { UserDialog } from '../../../../CoreComponents/UserFeedback/Dialog'
import { Info } from '@mui/icons-material'

const taskCard_sx = {
    display:"flex",
    width:"100%", 
    justifyContent:"center",
    marginTop:"5vh", 
    flexDirection:"column",
    alignItems:"center"
}

const estimated = 60*2;

export const HarvestingContent = (props) => {
    const [dialog, setDialog] = useState({
        open:false,
        title:"",
        content:"",
        children:null,
        actions:[{label:"Close", execute:()=> setDialog({...dialog, open:false})}]
    })
    
    let products = props.products
    
    let reducedTrays = 0  
    if(products){
        const mappedTrays = products.map((prod) => prod.trays)

        reducedTrays = Math.ceil(mappedTrays.reduce((prev, curr) => prev + curr, 0))
        console.log(reducedTrays)
    }
    
    const handleHelpDialog = () => {
        const Content = () => {
            return (
                
                <>
                <Box sx={taskCard_sx}>
                            <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        <br/><br/> <i><b>Beware that the Greens stay dry!</b></i> <br/><br/> It is not
                            advised to use them once they've fallen on water.
                            </Typography>
                        </Box>
                    
                        {/* <Box sx={taskCard_sx}>
                            <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                            Place the cut Greens on the Dryrack on the other side on the Harvesting-Table
                            and spread them even and mixed.
                            </Typography>
                            <img src={greensOnDryRack}/>
                        </Box> */}
                
                </>
                
            )
        }
        
        setDialog({
            ...dialog,
            open:true,
            title:"Additonal information about Soaking task",
            content:"",
            children:<Content/>
        })
    }
    
    //*Show when there are no products received
    // if(props.index===0 && products.length === 0)
    //     return (
    //         <>
    //             <Typography variant="h4" align='center' color="secondary">
    //                 Gather what you need: <br /><br/>
    //             </Typography>
                
    //             <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
    //                 <b>Nothing needed, at the moment there isn't ready to harvest greens registered.</b>
    //             </Typography>
    //         </>
    //     );
    // if(props.index===0)
    //     return (
    //         <>
    //             <Typography variant="h4" align='center' color="secondary">
    //                 Gather what you need: <br /><br/>
    //             </Typography>
    //             <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
    //                 Harvesting table, working table, harvesting knife, {reducedTrays > 1 ? reducedTrays +  ' dryracks' : reducedTrays  + ' dryrack'} , waste container
    //             </Typography>
    //         </>
    //     );

    if(props.index===0) 
        return (
            <>
                {/* <Box sx={taskCard_sx}>
                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        Position the working table between production shelves.
                    </Typography>

                    <img src={workingTablePosition}/>
                </Box> */}
                {
                        products.length > 0
                        ?
                        <>
                            <Box sx={taskCard_sx}>
                                {/* <Typography variant="h4" align='center' color={BV_THEME.textColor.lightGray}>
                                    Harvest the single strains:
                                </Typography> */}
                                {
                                    products.length > 0 && (
                                        <>
                                            {
                                                products.map(product => {
                                                    return (
                                                        <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                                                            <b> {product.ProductName} </b> 
                                                            <br></br>
                                                                {
                                                                    product.isMixModel
                                                                    ?
                                                                    <>
                                                                        {
                                                                            product.modelsToHarvestMix.map((mixStrain) => {
                                                                                return (
                                                                                    <>
                                                                                        Mix strain: {mixStrain.ProductName}
                                                                                        <br></br>
                                                                                        trays:   {Math.ceil(mixStrain.trays)}
                                                                                        <br></br>
                                                                                        dryracks:{Math.ceil(mixStrain.dryracks)}
                                                                                        <br></br>
                                                                                    </>    
                                                                                )
                                                                            })
                                                                        }
                                                                    </>
                                                                    :
                                                                    <>
                                                                        trays: {Math.ceil(product.trays)} 

                                                                        <br></br>

                                                                        dryracks: {Math.ceil(product.dryracks)} 

                                                                        <br></br>
                                                                    </>

                                                                }
                                                            
                                                            
                                                        </Typography>
                                                        )
                                                    }
                                                )
                                            }

                                        {/* <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                                            Cut with the <b>Harvesting-Knife </b> 
                                            from low to high.
                                        </Typography>
                                            <img src={trayAt45Angle}/> */}
                                        </>

                                    )
                                    
                                }
                            </Box>
                            {/*                 
                            <IconButton onClick={handleHelpDialog}>
                                <Info/>
                            </IconButton> */}

                            <UserDialog dialog={dialog} setDialog={setDialog} open={dialog.open} title={dialog.title} content={dialog.content} actions={dialog.actions} children={dialog.children} />
                        </>
                        :
                        <Box sx={taskCard_sx}>
                            <Typography variant="h4" align='center' color={BV_THEME.textColor.lightGray}>
                                No products to harvest
                            </Typography>
                        </Box>
                    }

            </>
        );

    // if(props.index===2) 
    //     return (
    //         <>
    //             <Box sx={taskCard_sx}>
    //                 <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
    //                 Bring the loaded Dryracks with <br></br>
                    
    //                 {
    //                     products.length === 0 && (
    //                         <Typography variant="h4" align='center' color={BV_THEME.textColor.lightGray}>
    //                             NO PRODUCTS
    //                         </Typography>
    //                     )
    //                 }
                    
    //                 {
    //                     products.length > 0 && (
    //                         products.map((product, index) => {
    //                             return (
    //                                 <>
    //                                     <Typography variant="h4" align='center' color={BV_THEME.textColor.lightGray}>
    //                                         <b>{index !== products.length-1 ? product.harvest + ' grs of ' +  product.ProductName+',' : ' and ' + product.harvest + ' grs of ' +  product.ProductName} </b>
    //                                     </Typography>
    //                                 </>    
    //                             )
    //                         })    
    //                     )                
    //                 } 
                    
    //                 and bring {products.length > 0 ? ' them ' : ' it '} to the Drystation and check the ones drying for 
    //                 readyness or further mixing.

    //                 <br></br>

    //                 If you have problems with dry station please call or email tech support.

    //                 <a>techsupport@greengrow.swiss</a>
    //                 </Typography>
    //             </Box>

    //         </>
    //     )
    // if(props.index===4) 
    //     return (
    //         <>
    //             <Box sx={taskCard_sx}>
    //                 <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
    //                     Put the ready dry racks on the packing table.
    //                 </Typography>
    //             </Box>

    //         </>
    //     )
}