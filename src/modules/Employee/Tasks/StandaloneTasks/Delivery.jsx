import { Box, Button, Container, Typography, useTheme } from '@mui/material'
import React from 'react'
import { BV_THEME } from '../../../../theme/BV-theme';

export const DeliveryTask = () => {
      
    const theme = useTheme(BV_THEME);
    
    return (
        <>

    {/*Task 3 BEGINS*/}
    <Box component="div" minHeight="100vh" id="packing_task">
        
        <Container maxWidth="md">
            <Box py={8} width="100%" height="100%" alignItems="center">
                <Box width="auto" height="60%" textAlign='center' p={5} sx={{border:"2px solid #e3e3e3", borderRadius:"4px", marginTop:"5%"}} justifyContent="center">
                    <Box sx={{display:"flex", flexDirection:"column", width:"auto", height:"auto", p:2}}> 
                        <Container maxWidth="md">
                            <Typography variant="h3" m={3}>Delivery</Typography>
                                
                            <Typography align="left" variant="h6" p={2}>
                                Put the list of Restaurants into goole maps rout planer and drive there. 
                                Let sign the Deliverysheets and bring them back for confirmation of the finished 
                                process for the algorithm.
                            </Typography>

                            <Button variant="contained" sx={theme.button.standard}>
                                Finish Task
                            </Button>
                        </Container>
                    </Box>
                </Box>
            </Box>
        </Container>
    </Box>
    {/*Task 3 ENDS*/}


            
        </>
    )
}
