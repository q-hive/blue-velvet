import React, { useEffect, useState } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Alert, Box, Button, Container, Fab, Snackbar, Stack, Typography } from '@mui/material'

//*UTILS
import { Add } from '@mui/icons-material'
//THEME
import {BV_THEME} from '../../../theme/BV-theme'

//*Netword and routing
import { useLocation, useNavigate } from 'react-router-dom'

import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { TaskTest } from './WorkingTasks/TaskTest'

import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import { Timer } from '../../../CoreComponents/Timer.jsx'
import { Clock } from '../../../CoreComponents/Clock'





export const FullChamber = () => {
    //*DATA STATES


    //*Netword and router
    const navigate = useNavigate()

    
    const {state}= useLocation();

    const {orders} = state

    const[canSeeNextTask,setCanSeeNexttask] = useState({value:false,counter:0})

    //Snackbar
    const [open, setOpen] = useState(false);

        const handleClose = (event, reason) => {
            if (reason === 'clickaway') {
            return;
            }

            setOpen(false);
        };

    
    const ordersList=orders

    const carouselChange=(item,index)=>{
        {item<canSeeNextTask.counter ?
        setCanSeeNexttask({...canSeeNextTask,value:true}):setCanSeeNexttask({...canSeeNextTask,value:false})}
    }

    const carouselButtonSX = {
            position: 'absolute',
            zIndex: 2,
            top:{xs:"80%", md:'calc(95% - 15px)'}
        }

    const arrowNext = (onClickHandler, hasNext, label) =>
    hasNext && (
        <Button disabled={canSeeNextTask.value == false} variant="contained" onClick={onClickHandler} title={"next task"} 
                sx={()=>({...carouselButtonSX,right:"5%"})}>
            {"Next Task"}
        </Button>
    )
    
    const arrowPrev = (onClickHandler, hasPrev, label) =>
    hasPrev && (
        <Button variant="contained" onClick={onClickHandler} title={"previous task"} 
                sx={()=>({...carouselButtonSX,left:{xs:"5%", md:"5%"} })}>
            {"Prev Task"}
        </Button>
    )
  return (
    <>

    <Carousel
        emulatetouch={true} 
        showThumbs={false} 
        showArrows={true}
        showStatus={false}
        renderArrowNext={arrowNext}
        renderArrowPrev={arrowPrev}
        renderIndicator={false}
        selectedItem={canSeeNextTask.counter}
        onChange={carouselChange}
        >
        {ordersList.map((order,index)=>{ 
            return(
                <Box key={order.id} height="80vh" component={"div"}>
                    {TaskTest({ 
                        type: order.status || null, 
                        order:order,
                        counter:canSeeNextTask.counter, 
                        setFinished:setCanSeeNexttask,
                        setOpen:setOpen
                    })}
                </Box>
            )
        })}
    </Carousel>

    <Timer/>
    
    <Snackbar  anchorOrigin={{vertical: "bottom",horizontal: "center" }} open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Task finished!
        </Alert>
    </Snackbar>

    
    <Fab 
    color="primary" 
    size="medium"
    aria-label="take a break"
    sx={{position:"absolute",bottom: 30,
    right: {xs:30,md:"40%"},}}
    >
        <LocalCafeIcon />
    </Fab>
    </>
  )}