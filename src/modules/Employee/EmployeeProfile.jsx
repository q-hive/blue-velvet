import React, {useEffect} from 'react'
import { Avatar, Box, Button, CircularProgress, Container, Fade, Paper, Stack, Typography, useTheme, Grid, Grow } from '@mui/material'
import useAuth from '../../contextHooks/useAuthContext';
import { BV_THEME } from '../../theme/BV-theme';
import api from '../../axios.js'


export const Profile = () => {
     
    const level = 2
    const employeePic = "https://cdn-icons-png.flaticon.com/512/544/544514.png"
    const chart = "https://landing.moqups.com/img/content/charts-graphs/column-charts/grouped-column-chart-for-channel-acquisition/grouped-column-chart-for-channel-acquisition-800.png"
    const {user, credential} = useAuth()
    const levelPercentage = (level/7) * 100


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
       <Box component="div" minHeight="100vh" display="flex"  >
            <Fade in={true} timeout={1000} unmountOnExit>
                <Container maxWidth="lg" >
                    <Grid container spacing={3} marginTop={3}>
                    
                        {/* Profile Picture */}
                        <Grow in={true} timeout={1000} style={{ transformOrigin: '0 0 0' }} unmountOnExit>
                        <Grid item xs={4} md={3} lg={3}>
                            <Avatar
                                alt="employee pic"
                                src={user.image}
                                sx={{boxShadow:BV_THEME.shadows[9], 
                                width: {xs:"95%",sm:"85%", md:"80%",lg:"75%"}, 
                                height: {xs:"auto"}, 
                                alignSelf: 'center', mb:2}}
                                        
                            />
                        </Grid>
                        </Grow>

                        {/* User Info */}
                        <Grow in={true} timeout={1500} style={{ transformOrigin: '0 0 0' }} unmountOnExit>
                        <Grid item xs={8} md={9} lg={9}>
                            
                            
                            {/* User Name obtained from useAuth */}
                            <Typography variant={"h3"} color="primary.dark" sx={{fontSize:{xs:"2.5em",sm:"2.7em",md:"3em",lg:"3.5em"}}}>{user.name+" "+user.lname}</Typography>

                            <Stack direction="row" spacing={{xs:8 ,md:2}} marginTop={1} textAlign="center" alignItems="center">
                                <Typography variant="h6" component="div" color="secondary.light">
                                        Level : 
                                </Typography>
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgress variant="determinate" color="primary" size="3em" value={levelPercentage} />
                                    <Box
                                            sx={{
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            position: 'absolute',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            }}
                                    >
                                            <Typography variant="h6" component="div" color="secondary.light">
                                            {level}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Stack>    
                        </Grid>
                        </Grow>

                        {/* Chart 1 */}
                        <Grow in={true} timeout={4000} style={{ transformOrigin: '0 0 0' }} unmountOnExit>
                        <Grid item xs={12} md={12} lg={6}>
                            <Paper elevation={4} sx={{width: {xs:"95%",}, height: 450, m:3}}>
                                <Typography color="gray">Illustrative chart</Typography>
                                <Box component="img" src={chart} sx={{minWidth:"95%", maxHeight:"90%"}}></Box>
                            </Paper>
                        </Grid>
                        </Grow>


                        {/* Chart 2 */}
                        <Grow in={true} timeout={5000} style={{ transformOrigin: '0 0 0' }} unmountOnExit>
                        <Grid item xs={12} md={12} lg={6}>
                            <Paper elevation={4} sx={{width: {xs:"95%",}, height: 450, m:3}}>
                                <Typography color="gray">Illustrative chart</Typography>
                                <Box component="img" src={chart} sx={{minWidth:"95%", maxHeight:"95%"}}></Box>
                            </Paper>
                        </Grid>
                        </Grow>
                        
                    </Grid>
                </Container>
            </Fade>
       </Box>
    )
}
