import React, { useEffect, useState, useRef } from 'react'

import { AppBar, Box, Button, Container, Typography } from '@mui/material'
import useInterval from './useInterval'

export const ErrorPage = ({error, resetErrorBoundary}) => {
  return (


    <Box>
        
        
        <Container sx={{marginTop:"15vh"}}>
            
            <Typography variant="h1" color={"secondary.dark"} >
                Oops!<br/> Something went wrong 
            </Typography>
            <br/> 
            <Typography variant="h4" color={"red"}>
                Error: {error.message}
            </Typography>
            <br/> 
            <Button variant="contained" onClick={resetErrorBoundary}>
                Reload
            </Button>

        </Container>




    </Box>
  )
}
