import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Divider, Typography, useTheme } from '@mui/material'
import React from 'react'
import { BV_THEME } from '../../theme/BV-theme';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const ContainerEmployeeComponent = () => {
     //Drawer Task array (TESTING PURPOSES)
     const employeeTasks = [
        {
          label:'Task 1',
        }, 
        {
          label:'Task 2',
        }, 
        {
          label:'Task 3',
        }, 
        {
          label:'Task 4',
        }
      ];

      const staticTasks = [
        {
            label:"",
            steps:[{label:"",description:"",},],
        },
      ];

      
    
      
    const theme = useTheme(BV_THEME);
    return (
        <>
        {/*Employee Tasks BEGINS*/}
        <Box component="div" minHeight="100vh" id="harvesting_task">
        
            <Container maxWidth="md">
                <Box py={8} width="100%" height="100%" alignItems="center">

                    {/*Task 1 BEGINS*/}
                    <Box width="100%" height="100%" textAlign='center' p={5} sx={{border:"2px solid #e3e3e3", borderRadius:"4px", marginTop:"5%"}} justifyContent="center">
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

    <Divider />

    {/*Task 2 BEGINS*/}
        
    <Box component="div" minHeight="100vh" id="packing_task">
        
        <Container maxWidth="md">
            <Box py={8} width="100%" height="100%" alignItems="center">
                <Box width="100%" id="packing" height="60%" textAlign='center' p={5} sx={{border:"2px solid #e3e3e3", borderRadius:"4px", marginTop:"5%"}} justifyContent="center">
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

    {/*Task 3 BEGINS*/}
    <Box component="div" minHeight="100vh" id="packing_task">
        
        <Container maxWidth="md">
            <Box width="100%" height="60%" textAlign='center' p={5} sx={{border:"2px solid #e3e3e3", borderRadius:"4px", marginTop:"5%"}} justifyContent="center">
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
        </Container>
    </Box>
    {/*Task 3 ENDS*/}


    {/*Task 4 BEGINS*/}
    <Box component="div" minHeight="100vh" id="packing_task">
        
        <Container maxWidth="md">
            <Box width="100%" height="60%" textAlign='center' p={5} sx={{border:"2px solid #e3e3e3", borderRadius:"4px", marginTop:"5%"}} justifyContent="center">
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
        </Container>
    </Box>
    {/*Task 4 ENDS*/}

    {/*Task 5 BEGINS*/}
    <Box component="div" minHeight="100vh" id="packing_task">
        
        <Container maxWidth="md">
    
            <Box width="100%" height="60%" textAlign='center' p={5} sx={{border:"2px solid #e3e3e3", borderRadius:"4px", marginTop:"5%"}} justifyContent="center">
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
        </Container>
    </Box>
    {/*Task 5 ENDS*/}


            
        </>
    )
}
