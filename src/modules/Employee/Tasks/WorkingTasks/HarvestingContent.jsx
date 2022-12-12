import React, { useState } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Fade, Typography } from '@mui/material'

import workingTablePosition from '../../../../assets/images/production/working table position.png'
import trayAt45Angle from '../../../../assets/images/production/tray at 45 angle.png'
import greensOnDryRack from '../../../../assets/images/production/greens on dryrack.png'


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

const estimated = 60*2;

export const HarvestingContent = (props) => {
    let products = props.products

    if(props.index===0 && products.length === 0)
        return (
            <>
                <Typography variant="h4" align='center' color="secondary">
                    Gather what you need: <br /><br/>
                </Typography>
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                    <b>Nothing needed, at the moment there isn't ready to harvest greens registered.</b>
                </Typography>
            </>
        );
    if(props.index===0)
        return (
            <>
                <Typography variant="h4" align='center' color="secondary">
                    Gather what you need: <br /><br/>
                </Typography>
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                    Harvesting table, working table, harvesting knife, dryracks, waste container
                </Typography>
            </>
        );

    if(props.index===1) 
        return (
            <>
                <Box sx={taskCard_sx}>
                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        Position the working table between production shelves.
                    </Typography>

                    <img src={workingTablePosition}/>
                </Box>
            </>
        );

    if(props.index===2) 
        return (
            <>
                {
                    products.length > 0
                    ?
                    <>
                        <Box sx={taskCard_sx}>
                            <Typography variant="h4" align='center' color={BV_THEME.textColor.lightGray}>
                                Harvest the single strains:
                            </Typography>
                            {
                                products.length > 0 && (
                                    <>
                                        {
                                            products.map(product => {
                                                return (
                                                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                                                        Take {`${product.trays} ${product.trays.length > 1 ? 'trays' : ' tray'}`} with <b>{product.ProductName}</b> grown Green from the Production-Shelves and 
                                                        stand it at a 45° Angle against the Sides. <br/> <br/>
                                                    </Typography>
                                                    )
                                                }
                                            )
                                        }

                                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                                        Cut with the <b>Harvesting-Knife </b> 
                                        from low to high.
                                    </Typography>
                                        <img src={trayAt45Angle}/>
                                    </>

                                )
                            }
                        </Box>
            
                        <Box sx={taskCard_sx}>
                            <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        <br/><br/> <i><b>Beware that the Greens stay dry!</b></i> <br/><br/> It is not
                            advised to use them once they've fallen on water.
                            </Typography>
                        </Box>
                    
                        <Box sx={taskCard_sx}>
                            <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                            Place the cut Greens on the Dryrack on the other side on the Harvesting-Table
                            and spread them even and mixed.
                            </Typography>
                            <img src={greensOnDryRack}/>
                        </Box>
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

    if(props.index===3) 
        return (
            <>
                <Box sx={taskCard_sx}>
                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                    Bring the loaded Dryracks with <br></br>
                    
                    {
                        products.length === 0 && (
                            <Typography variant="h4" align='center' color={BV_THEME.textColor.lightGray}>
                                NO PRODUCTS
                            </Typography>
                        )
                    }
                    
                    {
                        products.length > 0 && (
                            products.map((product, index) => {
                                return (
                                    <>
                                        <Typography variant="h4" align='center' color={BV_THEME.textColor.lightGray}>
                                            <b>{index !== products.length-1 ? product.harvest + ' grs of ' +  product.ProductName+',' : ' and ' + product.harvest + ' grs of ' +  product.ProductName} </b>
                                        </Typography>
                                    </>    
                                )
                            })    
                        )                
                    } 
                    
                    and bring {products.length > 0 ? ' them ' : ' it '} to the Drystation and check the ones drying for 
                    readyness or further mixing.

                    <br></br>

                    If you have problems with dry station please call or email tech support.

                    <a>techsupport@greengrow.swiss</a>
                    </Typography>
                </Box>

            </>
        )
    if(props.index===4) 
        return (
            <>
                <Box sx={taskCard_sx}>
                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        Put the ready dry racks on the packing table.
                    </Typography>
                </Box>

            </>
        )
}