import React, { useEffect, useState } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Container, Stack, Typography } from '@mui/material'

//*UTILS
import { Add } from '@mui/icons-material'
//THEME
import {BV_THEME} from '../../../theme/BV-theme'

//*Netword and routing
import { useLocation, useNavigate } from 'react-router-dom'

import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { TaskTest } from './WorkingTasks/TaskTest'






export const FullChamber = () => {
    //*DATA STATES


    //*Netword and router
    const navigate = useNavigate()

    
    const {state}= useLocation();

    const {orders} = state

    const[canSeeNextTask,setCanSeeNexttask] = useState({value:false,counter:0})

    // const getTaskType=(status) => {
    //     switch(status){
    //         case "seeding": return("seeding");
    //         case "growing": return("growing");
    //         case "harvestReady": return("harvesting");
    //         case "harvested": return("packing");
    //         case "ready": return("delivery");
    //         case "delivered": return(null);
    //         default: console.log("no tasks monica")
    //      }
    // }

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

    
    const ordersList=orders

    // console.log(ordersList)

  return (
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
                    })}
                </Box>
            )
        })}
    </Carousel>
  )}