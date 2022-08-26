import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Divider, Typography, useTheme } from '@mui/material'
import React from 'react'
import { BV_THEME } from '../../../../theme/BV-theme';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const MaintenanceTask = () => {
      
    const theme = useTheme(BV_THEME);
    
    return (
        <>

    {/*Task 5 BEGINS*/}
    <Box component="div" minHeight="100vh" id="packing_task">
        
        <Container maxWidth="md">
            <Box py={8} width="100%" height="100%" alignItems="center">
    
                <Box width="auto" height="60%" textAlign='center' p={5} sx={{border:"2px solid #e3e3e3", borderRadius:"4px", marginTop:"5%"}} justifyContent="center">
                    <Box sx={{display:"flex", flexDirection:"column", width:"auto", height:"auto", p:2}}> 
                        <Container maxWidth="md">
                                
                            <Typography variant="h3" m={3}>Setting Up</Typography>
                
                            
                            {/*Waste And Control*/}
                            <Accordion sx={{margin:"2%"}}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography>Waste And Control</Typography>
                                </AccordionSummary>

                                <AccordionDetails>
                                                <>
                                                <Box textAlign="left" sx={{}}>
                                                <Typography >
                                                Check the unharvested fully grown trays and write down the 
                                                amounts of trays that were produced too much. Normal is 5-10% overhead. 
                                                </Typography>
                                                <Divider sx={{paddingY:"1%"}} /> 
                                                
                                                </Box>
                                                </>
                                </AccordionDetails>
                            </Accordion>

                            {/*Precut*/}

                            <Accordion sx={{margin:"2%"}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Typography>Pre-Cut</Typography>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                                    <>
                                                    <Box textAlign="left" sx={{}}>
                                                    <Typography >
                                                    the Sunflowers and Peas in the amounts needed for next day, dry them and store cool around 6-9° C. 
                                                    <br /><br /><b>Check</b> if there is enough products ready for the next day. 

                                                    </Typography>
                                                    <Divider sx={{paddingY:"1%"}} /> 
                                                    
                                                    </Box>
                                                    </>
                                    </AccordionDetails>
                            </Accordion>

                            {/*Labelling*/}

                            <Accordion sx={{margin:"2%"}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Typography>Labelling</Typography>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                                    <>
                                                    <Box textAlign="left" sx={{}}>
                                                    <Typography >
                                                    Label the packages for the next day or once a week. 
                                                    </Typography>
                                                    <Divider sx={{paddingY:"1%"}} /> 
                                                    
                                                    </Box>
                                                    </>
                                    </AccordionDetails>
                            </Accordion>

                            {/*Cutting mats*/}

                            <Accordion sx={{margin:"2%"}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Typography>Cutting mats</Typography>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                                    <>
                                                    <Box textAlign="left" sx={{}}>
                                                    <Typography >
                                                    Cut the amount of Hemp-Mats needed per week once a week and store them in dry Boxes. 
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
    {/*Task 5 ENDS*/}


            
        </>
    )
}
