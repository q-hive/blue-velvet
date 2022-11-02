import React, {useEffect, useState} from 'react'
import { Avatar, Box, Button, Container, Fade, Paper, Stack, Typography, useTheme } from '@mui/material'
import { BV_THEME } from '../../theme/BV-theme';
import api from '../../axios.js'
import useAuth from '../../contextHooks/useAuthContext';


export const Profile = () => {
    //*Context
    const {user, credential} = useAuth()
    
    
    //*states
    const [profileData, setProfileData] = useState({
        level:0,
    })
    const employeePic = "https://i.imgflip.com/58g25p.jpg"


    const theme = useTheme(BV_THEME);

    useEffect(() => {
        api.api.get(`${api.apiVersion}/employees/${user._id}`, {
            headers:{
                authorization:  credential._tokenResponse.idToken,
                user:           user
            }
        })
        .then((response) => {
            let responseMapped
            try {
                responseMapped =  response.data.data[0]
            } catch (err) {
                responseMapped = {
                    performance: {
                        level: 0
                    }
                }
            }
            setProfileData((pfd) => {
                return (
                    {...pfd, level:responseMapped.performance.level}
                )
            })
            
            
        })
        .catch((err) => {
            console.log('There was an error getting your data')
        })
    }, [])
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
                                <Typography variant="h6">Level : {profileData.level}</Typography>
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
