import React, { useState } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Container, Stack, Typography } from '@mui/material'

//*UTILS
import { Add } from '@mui/icons-material'
//THEME
import {BV_THEME} from '../../../theme/BV-theme'

//*Netword and routing
import { useNavigate } from 'react-router-dom'

import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { TaskTest } from './WorkingTasks/TaskTest'






export const FullChamber = () => {
    //*DATA STATES


    //*Netword and router
    const navigate = useNavigate()

    let productTasks

    const setOrderTasks = (status) =>{
        
        switch(status){
            case "uncompleted": productTasks = [{name:"Task 1", type:"seeding"}];
            break;
            case "growing": productTasks = [];
            break;
            case "ready to harvest": productTasks = [{name:"Task 2", type:"harvesting"}];
            break;
            case "harvested" : productTasks = [{name:"Task 3", type:"packing"}];
            break;
            case "packed" : productTasks = [{name:"Task 4", type:"delivery"}];
            break;
            case "done" : productTasks = [];
            break;
            default: console.log("no tasks monica")
         }

     }

    const getTaskType=(status) =>{
        switch(status){
            case "uncompleted": return("seeding");
            case "growing": return(null);
            case "ready to harvest": return("harvesting");
            default: console.log("no tasks monica")
         }
    }

    
     

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
    const ordersList=[order1,order2]
    
  return (
    <Carousel showThumbs={false} showArrows={true} >
        {ordersList.map((order,index)=>{ 
            return(
                <Box height="80vh" component={"div"}>
                    <TaskTest type={getTaskType(order.status)} order={order}/>
                </Box>
            )
        })}
    </Carousel>




  )}