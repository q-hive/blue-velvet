import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Divider, Typography, useTheme } from '@mui/material'
import React from 'react'
import { BV_THEME } from '../../../../theme/BV-theme';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const GrowingTask = () => {
      
    const theme = useTheme(BV_THEME);
    
    return (
    <>

    {/*Task 4 BEGINS*/}
    <Box component="div" minHeight="100vh" id="packing_task">
        
        <Container maxWidth="md">
            <Box py={8} width="100%" height="100%" alignItems="center">
                <Box width="auto" height="60%" textAlign='center' p={5} sx={{border:"2px solid #e3e3e3", borderRadius:"4px", marginTop:"5%"}} justifyContent="center">
                    <Box sx={{display:"flex", flexDirection:"column", width:"auto", height:"auto", p:2}}> 
                        <Container maxWidth="md">
                            <Typography variant="h3" m={3}>Growing</Typography>
                                
                            <Typography align="left" variant="h6" p={2}><b>What you need:</b> Trays, pre-cut Hemp-Mat, Seeds, Seeding-tools</Typography>



                            {/*Seeding*/}

                            <Accordion sx={{margin:"2%"}}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography>Seeding</Typography>
                                </AccordionSummary>

                                <AccordionDetails>
                                                <>
                                                <Box textAlign="left" sx={{}}>
                                                <Typography >
                                                Place the amount of Trays needed on the Seeding-Table, and fill each of them with a pre-cut Hemp-Mat. 
                                                Staple them under the Table. 
                                                Take the amount needed per Strain of these Trays on the Table and spread them out in bulks. 
                                                Spread the Seeds equal on the mats and softly spray them with the triangle-spray. 
                                                Staple them slightly turned and bring them to the germination-shelves.  
                                                </Typography>
                                                <Divider sx={{paddingY:"1%"}} /> 
                                                
                                                </Box>
                                                </>
                                </AccordionDetails>
                            </Accordion>

                            {/*Putting to the light*/}

                            <Accordion sx={{margin:"2%"}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Typography>Putting to the light</Typography>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                                    <>
                                                    <Box textAlign="left" sx={{}}>
                                                    <Typography >
                                                    Place the germinated Trays from the dark to the light-shelves. 
                                                    Highest germination level goes to the highest light level and vise versa.
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
    {/*Task 4 ENDS*/}

    

            
        </>
    )
}
