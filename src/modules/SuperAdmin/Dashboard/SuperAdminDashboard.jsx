import React from 'react'

//*MUI COMPONENTS
import { Box, Container, Typography, Fade } from '@mui/material'

//*Contexts
import useAuth from '../../../contextHooks/useAuthContext'

//*Routing
import { useTranslation } from 'react-i18next';

export const SuperAdminDashboard = () => {

  return (
    <>
      <Fade in={true} timeout={1000} unmountOnExit>
        <Box component="div" display="flex"  >

          <Container maxWidth="lg" sx={{ paddingTop: 4, paddingBottom: 4, marginX: { xs: 2, md: "auto" }, marginTop: { xs: 4, md: 3 } }}>
            <Typography variant="h2" color="primary">{'Welcome Super Admin'}</Typography>
            <Typography variant="h5" color="secondary.dark">{'Bienvenido'}</Typography>
          </Container>
        </Box>
      </Fade>
    </>
  )
}
