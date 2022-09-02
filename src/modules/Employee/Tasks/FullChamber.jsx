import React, { useState } from 'react'

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

    const getTaskType=(status) =>{
        switch(status){
            case "uncompleted": return("seeding");
            case "growing": return(null);
            case "ready to harvest": return("harvesting");
            default: console.log("no tasks monica")
         }
    }

    const carouselButtonSX = {
            position: 'absolute',
            zIndex: 2,
            top:{xs:"80%", md:'calc(70% - 15px)'}
        }

    const arrowNext = (onClickHandler, hasNext, label) =>
    hasNext && (
        <Button variant="contained" onClick={onClickHandler} title={"next task"} 
                sx={()=>({...carouselButtonSX,right:"25%"})}>
            {">"}
        </Button>
    )
    const arrowPrev = (onClickHandler, hasPrev, label) =>
    hasPrev && (
        <Button variant="contained" onClick={onClickHandler} title={"previous task"} 
                sx={()=>({...carouselButtonSX,left:{xs:"25%", md:"25%"} })}>
            {"<"}
        </Button>
    )

    
     

    const order1={
        id:"test",
        products:[
            {
                name:"cebolla",
                packages:[
                    {size:"m",number:3,grams:3*75},
                    {size:"l",number:2,grams:2*100}
                ],
                productionData:{seeds:"75",harvest:"300",trays:1.5}
            },
            {
                name:"radiesi",
                packages:[
                    {size:"s",number:2,grams:2*50},
                    {size:"l",number:1,grams:100}
                ],
                productionData:{seeds:"50",harvest:"600",trays:2.3}
            }
        ],
        status:"uncompleted"
        
    }
    const order2={
        id:"test2",
        products:[
            {
                name:"lechuga",
                packages:[
                    {size:"m",number:3,grams:3*75},
                    {size:"l",number:2,grams:2*100}
                ],
                productionData:{seeds:"75",harvest:"300",trays:"1.5"}
            },
            {
                name:"maní",
                packages:[
                    {size:"s",number:2,grams:2*50},
                    {size:"l",number:1,grams:100}
                ],
                productionData:{seeds:"50",harvest:"600",trays:"2.3"}
            }
        ],
        status:"ready to harvest"
        
    }
    const ordersList=orders
    
    const ordersList2=[order1,order2]
    console.log(ordersList)
    
  return (
    <Carousel 
        emulatetouch={true} 
        showThumbs={false} 
        showArrows={true}
        showStatus={false}
        renderArrowNext={arrowNext}
        renderArrowPrev={arrowPrev} 
    >
        {ordersList2.map((order,index)=>{ 
            return(
                <Box height="80vh" component={"div"}>
                    <TaskTest type={getTaskType(order.status)} order={order}/>
                </Box>
            )
        })}
    </Carousel>




  )}