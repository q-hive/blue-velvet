import { Card, CardActionArea, CardContent, Typography, useTheme } from '@mui/material'
import React from 'react'
import { BV_THEME } from '../../../theme/BV-theme';

import { Link } from 'react-router-dom';

//ICONS
import TollIcon from '@mui/icons-material/Toll';
import GrassIcon from '@mui/icons-material/Grass';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import { optionGroupUnstyledClasses } from '@mui/base';
import { Box, Container, Stack } from '@mui/system';


export const TasksCardsComponent = () => {
      
    const theme = useTheme(BV_THEME);

    const tasksList = [
        {
          label:'Harvesting',
          icon:<AgricultureIcon fontSize="large" color="primary" />,
        }, 
        {
          label:'Packing',
          icon:<InventoryIcon fontSize="large" color="primary" />,
        }, 
        {
          label:'Delivery',
          icon:<LocalShippingIcon fontSize="large" color="primary" />,
        }, 
        {
          label:'Growing',
          icon:<GrassIcon fontSize="large" color="primary" />,
        }, 
        {
          label:'Setting Up',
          icon:<TollIcon fontSize="large" color="primary" />,
        }
      ];
    
    return (
        <>

        <Box component="div" minHeight="100vh">
        
            <Container maxWidth="lg">
                <Box py={8} width="100%" height="100%" textAlign="center">
                <Typography variant="h2" m={3}>Employee's Tasks</Typography>

                    {/*Bordered Box  BEGINS*/}
                    <Box width="auto" height="100%" textAlign='center' p={5} sx={{border:"2px solid #e3e3e3", borderRadius:"4px", marginTop:"5%"}} justifyContent="center">
                        <Box sx={{display:"flex", flexDirection:"column", width:"auto", height:"auto", p:2}}> 
                            <Container maxWidth="lg">
                                

                                <Stack direction={{xs:"column",md:'row'}} spacing={2} justifyContent="space-evenly">
                                    {/* CARD BUTTON CREATION BASED ON TASK LIST */ }
                                    {tasksList.map((option) => (
                                        <Card key={option.label} sx={{maxWidth:{xs:"100%",md:"20%"}, alignContent:"center"}}>
                                            <CardActionArea component={Link} to={"./"+option.label.replace(/\s+/g, '').toLocaleLowerCase()}>
                                                <CardContent  sx={{p:2, textAlign:"center"}}>
                                                    {option.icon}
                                                    <Typography variant="h5">{option.label}</Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    ))}
                                </Stack>
                            
                            
                            </Container>
                        </Box>
                    </Box>
                </Box>
            </Container>  
        </Box>

        
        </>
    )
}
