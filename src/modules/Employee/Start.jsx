import { Avatar, Box, Button, Container, Paper, Stack, Typography, useTheme } from '@mui/material'
import React from 'react'
import { BV_THEME } from '../../theme/BV-theme';

export const ContainerEmployeeComponent = () => {
     
    const ratio = .89
    const orders = 25
    const employeePic = "https://i.imgflip.com/58g25p.jpg"


    const theme = useTheme(BV_THEME);
    return (
        <>
       <Box component="div" minHeight="100vh" display="flex"  >
            <Container maxWidth="md" >
                <Box display="flex" flexDirection="column" py={8} width="100%" height="100%" alignItems="center" >
                    <Avatar
                        alt="employee pic"
                        src={employeePic}
                        sx={{ width: {xs:"25vh", md:220}, height: {xs:"25vh",md:220}, alignSelf: 'center', mb:2}}
                        
                    />
                    <Stack direction="row" spacing={{xs:8 ,md:30}} textAlign="center">
                        <Typography variant="h6">Allocation ratio : {ratio}</Typography>
                        <Typography variant="h6">Completed Orders : {orders}</Typography>
                    </Stack>

                    <Paper sx={{width: {xs:"80%", md:450}, height: 450, m:3}}>
                        Insert Chart Here.
                    </Paper>

                    <Button variant="contained" sx={theme.button.standard}>
                        Start Work
                    </Button>


                </Box>
            </Container>
       </Box>

            
        </>
    )
}
