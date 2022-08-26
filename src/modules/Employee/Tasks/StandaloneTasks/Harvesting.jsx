import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Divider, Typography, useTheme } from '@mui/material'
import React from 'react'
import { BV_THEME } from '../../../../theme/BV-theme';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const HarvestingTask = () => {
      
    const theme = useTheme(BV_THEME);
    
    return (
        <>
        <Box component="div" minHeight="100vh" id="harvesting_task">
        
            <Container maxWidth="md">
                <Box py={8} width="100%" height="100%" alignItems="center">

                    {/*Task 1 BEGINS*/}
                    <Box width="auto" height="100%" textAlign='center' p={5} sx={{border:"2px solid #e3e3e3", borderRadius:"4px", marginTop:"5%"}} justifyContent="center">
                        <Box sx={{display:"flex", flexDirection:"column", width:"auto", height:"auto", p:2}}> 
                            <Container maxWidth="md">
                                <Typography variant="h3" m={3}>Harvesting</Typography>
                                
                                <Typography align="left" variant="h6" p={2}><b>What you need:</b> Harvesting-Table, Working-Table, Harvesting-Knife, Dryracks, Waste-Container </Typography>


                                {/*Single Strain*/}

                                <Accordion sx={{margin:"2%"}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Typography>Harvesting Single Strain</Typography>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                                <>
                                                <Box textAlign="left" sx={{}}>
                                                <Typography >
                                                    1.- Take the Tray with the grown Greens from the Production-Shelfes, 
                                                    stand it at a 45° Angle against the Sides. Cut with the Harvesting-Knife 
                                                    from low to high. Beware that the Greens stay dry, once they have fallen 
                                                    on the Table in the Water, it is not advisory to use them any more. 
                                                </Typography>
                                                <Divider sx={{paddingY:"1%"}} /> 
                                                <Typography >
                                                    2.- Place the cut Greens on the Dryrack on the other side on the Harvesting-Table
                                                    and spread them even and mixed.
                                                </Typography>
                                                <Divider sx={{paddingY:"1%"}}/> 
                                                <Typography >
                                                    3.- Bring the loaded Dryrack to the Drystation and check the drying ones for 
                                                    readyness or further mixing.
                                                </Typography>
                                                <Divider sx={{paddingY:"1%"}}/> 
                                                </Box>
                                                </>
                                    </AccordionDetails>
                                </Accordion>

                                {/*Power Mix*/}

                                <Accordion sx={{margin:"2%"}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Typography>Harvesting Power Mix</Typography>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                                    <>
                                                    <Box textAlign="left" sx={{}}>
                                                    <Typography >
                                                        Harvest one Daikon onto the Dryrack, add a Tray of Radies and half a Tray of Rocket. 
                                                        To harvest the Rocket, take it out of the Tray and place it on the underside. 
                                                        Mix them softly with open fingers and spread them even and mixed, bring it to the 
                                                        Dry-Station and check the drying Racks. 
                                                    </Typography>
                                                    <Divider sx={{paddingY:"1%"}} /> 
                                                    
                                                    </Box>
                                                    </>
                                    </AccordionDetails>
                                </Accordion>

                                {/*Protein Mix*/}

                                <Accordion sx={{margin:"2%"}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Typography>Harvesting Protein Mix</Typography>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                                    <>
                                                    <Box textAlign="left" sx={{}}>
                                                    <Typography >
                                                    Harvest one Tray Radies and dry it, Mix with equal amounts 
                                                    of the Pre-Cut and Dryed Sunflowers and Peas.  
                                                    </Typography>
                                                    <Divider sx={{paddingY:"1%"}} /> 
                                                    
                                                    </Box>
                                                    </>
                                    </AccordionDetails>
                                </Accordion>

                            </Container>
                        </Box>
                    </Box>

                </Box>

            </Container>
        </Box>
    {/*Task 1 ENDS*/}

            
        </>
    )
}
