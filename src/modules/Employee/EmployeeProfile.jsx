import { Avatar, Box, Button, Container, Fade, Paper, Stack, Typography, useTheme } from '@mui/material'
import React from 'react'
import { BV_THEME } from '../../theme/BV-theme';

export const Profile = () => {
     
    const level = -5
    const employeePic = "https://i.imgflip.com/58g25p.jpg"


    const theme = useTheme(BV_THEME);
    return (
        <>
       <Box component="div" minHeight="100vh" display="flex"  >
            <Fade in={true} timeout={1000} unmountOnExit>
                    <Container maxWidth="md" >
                        <Box display="flex" flexDirection="column" py={8} width="100%" height="100%" alignItems="center" >
                            <Avatar
                                alt="employee pic"
                                src={employeePic}
                                sx={{ width: {xs:"25vh", md:220}, height: {xs:"25vh",md:220}, alignSelf: 'center', mb:2}}
                                
                            />
                            <Stack direction="row" spacing={{xs:8 ,md:30}} textAlign="center">
                                <Typography variant="h6">Level : {level}</Typography>
                            </Stack>

                            <Paper sx={{width: {xs:"80%", md:450}, height: 450, m:3}}>
                                Insert Chart Here.
                            </Paper>


                        </Box>
                    </Container>
            </Fade>
       </Box>

            
        </>
    )
}
