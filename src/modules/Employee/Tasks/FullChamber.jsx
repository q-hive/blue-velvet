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

    function getAllProducts(){
        var productList = []
        ordersList.map((order, id)=>{
            order.products.map((product,idx)=>{
                productList.push({...product,status:order.status})
            })
            
        })
        return productList;
    }

    const allProducts = getAllProducts()


    {/* Products to send as props to TaskTest */}
    function getProductsByType(type){
        
        var filteredProductList = []

        allProducts.map((product, id)=>{
            if(product.status===type)
                filteredProductList.push(product)
        })
            return filteredProductList;

    }

    console.log("allproducts",allProducts)


    

    function filterByKey(obj, prop) {
        {/* 
            Returns an object with objects' desired prop as key, 
            letting you have a "status as Key" object or a "name as key" object 
            to name a few 
        */}
        return obj.reduce(function (acc, item) {
      
          let key = item[prop]
      
          if (!acc[key] ) { 
            acc[key] = []
          }
          if(item["mix"]==true){
            let mixProds = filterByKey(item.products,"item")

            
          }else if(!item.productionData){
            acc[key].push({name:item.name,harvest:item.harvest,seeds:item.seeds,trays:item.trays,})
            
          }else
            acc[key].push({...item.productionData,name:item.name})

          return acc
      
        }, {})
      
      }


      {/* The keys of this object will allow us to generate a tasks by status */}
      const allStatusesObj = filterByKey(allProducts,"status")
      console.log("all statuses",allStatusesObj)






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
        <Button disabled={false/*canSeeNextTask.value == false*/} variant="contained" onClick={onClickHandler} title={"next task"} 
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
        {Object.keys(allStatusesObj).map((status,index)=>{ 
            return(
                <Box key={index} height="80vh" component={"div"}>
                    {TaskTest({ 
                        type: status || null, 
                        counter:canSeeNextTask.counter, 
                        setFinished:setCanSeeNexttask,
                        setOpen:setOpen,
                        products:getProductsByType(status)})
                    }
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