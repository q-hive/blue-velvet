import React, { useEffect, useState, useRef } from 'react'

import { AppBar, Box, Button, Container, Typography } from '@mui/material'
import useInterval from './useInterval'

export const ErrorPage = ({error, resetErrorBoundary}) => {
  return (


    <Box>
        
        
        <Container sx={{marginTop:"15vh"}}>
            
            <Typography variant="h1" color={"secondary.dark"} >
                Oops! Something went wrong
            </Typography>
            <Typography variant="h4" color={"red"}>
                Error: {error.message}
            </Typography>
            <Button variant="contained" onClick={resetErrorBoundary}>
                Recargar
            </Button>

        </Container>




    </Box>
  )
}
