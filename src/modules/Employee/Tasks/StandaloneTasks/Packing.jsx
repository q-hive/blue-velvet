import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Divider, Typography, useTheme } from '@mui/material'
import React from 'react'
import { BV_THEME } from '../../../../theme/BV-theme';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const PackingTask = () => {
      
    const theme = useTheme(BV_THEME);
    
    return (
        <>
    {/*Task 2 BEGINS*/}
        
    <Box component="div" minHeight="100vh" id="packing_task">
        
        <Container maxWidth="md">
            <Box py={8} width="100%" height="100%" alignItems="center">
                <Box width="auto" id="packing" height="60%" textAlign='center' p={5} sx={{border:"2px solid #e3e3e3", borderRadius:"4px", marginTop:"5%"}} justifyContent="center">
                    <Box sx={{display:"flex", flexDirection:"column", width:"auto", height:"auto", p:2}}> 
                        <Container maxWidth="md">
                            <Typography variant="h3" m={3}>Packing</Typography>
                            
                            <Typography align="left" variant="h6" p={2}>
                                <b>What you need: </b> 
                                 Dry-Products, Scale, pre-labeled Packages, Box for packed Products, Date-Stamp. 
                            </Typography>

                            <Typography align="left" variant="h6" p={2}>
                                1.- Place the empty Package on the Scale and tare it to 0. Repeat this process once in a while. 
                                <br />2.- Take one Hand ful of Product softly in your Hand and let it fall into the Package, 
                                correct the amount, remove Greens from the closing sides and close the packages. 
                                <br />3.- Place them in the Boxes for delivery or cooling. 
                                <br />4.- When all packets are done, 
                                check with the delivery sheet if correct and put the Harvest-Dates on.
                            </Typography>
                        </Container>
                    </Box>
                </Box>
            </Box>
        </Container>
    </Box>
    {/*Task 2 ENDS*/}
        </>
    )
}
