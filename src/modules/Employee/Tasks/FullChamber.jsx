import React, { useEffect, useState } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Alert, Box, Button, Fab, Fade, Snackbar } from '@mui/material'

//*Netword and routing
import { useLocation, useNavigate } from 'react-router-dom'

import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { TaskContainer } from './WorkingTasks/TaskContainer'

import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import { Timer } from '../../../CoreComponents/Timer.jsx'
import useAuth from '../../../contextHooks/useAuthContext'

import useWorkingContext from '../../../contextHooks/useEmployeeContext'
import { tasksCicleObj } from '../../../utils/models';
import { UserDialog } from '../../../CoreComponents/UserFeedback/Dialog';

//*UNUSED
// import api from '../../../axios.js'
// import { Add } from '@mui/icons-material'
//THEME
// import {BV_THEME} from '../../../theme/BV-theme'
// import { Clock } from '../../../CoreComponents/Clock'

export const FullChamber = () => {
    //*Network and router
    const navigate = useNavigate()
    const {state}= useLocation();

    //*DATA STATES
    const {orders} = state

    //*CONTEXTS
    const {user, credential} = useAuth()
    const {TrackWorkModel, WorkContext, setWorkContext, employeeIsWorking} = useWorkingContext()

    
    //*render states
    const [canSeeNextTask,setCanSeeNexttask] = useState({value:false,counter:0})
    const [snack, setSnack] = useState({
        open:false,
        state:"",
        message:""
    });
    const [dialog, setDialog] = useState({
        open:       false,
        title:      "",
        message:    "",
        actions:    []
    })

    const cycleKeys = Object.keys(WorkContext.cicle)
    console.log("cicle arr",cycleKeys)


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setSnack({
            ...snack,
            open:false
        });
    };

    
    const ordersList = orders

    function getAllProducts(){
        const productList = []
        ordersList.map((order, id)=>{
            order.products.map((product,idx)=>{
                productList.push(
                    {...product,
                        status:order.status,
                        productionData:order.productionData[order.productionData.findIndex(x => x.product === product.name)]})
            })
            
        })
        return productList;
    }

    const allProducts = getAllProducts()


    {/* Products to send as props to TaskTest */}
    function getProductsByType(type){
        
        const filteredProductList = []

        allProducts.map((product, id)=>{
            if(product.status===type)
                filteredProductList.push(product)
        })
            return filteredProductList;

    }

    {/* The keys of this object will allow us to generate a tasks by status */}
    const carouselChange = (index,element) => {
        if(index < canSeeNextTask.counter){
            WorkContext.currentRender = index
            WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.current]].stopped = Date.now()
            setCanSeeNexttask({...canSeeNextTask,value:true})
            return
        }
        if(WorkContext.cicle[cycleKeys[index]].started === undefined){
            console.log("Started time in " + cycleKeys[index] + " is undefined")
            // WorkContext.cicle[Object.keys(WorkContext.cicle)[index]].started = Date.now()
            
            setWorkContext({...WorkContext, cicle: {
                ...WorkContext.cicle,
                [Object.keys(WorkContext.cicle)[index]]:{
                    ...WorkContext.cicle[cycleKeys[index]],
                    started: Date.now()
                }
            }})
        }
        
        
        setCanSeeNexttask({...canSeeNextTask,value:false})
    }

    const carouselButtonSX = {
            position: 'absolute',
            zIndex: 2,
            top:{xs:"3%", md:'calc(95% - 15px)'}
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
        <Button 
        variant="contained" 
        onClick={onClickHandler} 
        title={"previous task"} 
        sx={()=>({...carouselButtonSX,left:{xs:"5%", md:"5%"}})}
        >
            Prev Task
        </Button>
    )

    const updateEmployeePerformance = (expected, real) => {
        //*EMPLOYEE PERFORMANCE = container capacity (real/expected)
        //* if (real/expected) > 1 negative
    }

    const handleBreaks = () => {
        console.log("TWM",TrackWorkModel)
        console.log("workcontxt",WorkContext)
        // TrackWorkModel.breaks.push(este break)
        let started= new Date()
        setDialog({
            ...dialog,
            open:true,
            title:"You are on a break ",
            message:"Rest. Breathe. Your time is still being tracked",
            actions: [
                {
                    label:"Continue Working",
                    execute: () => {
                        let finished = new Date()
                        let elapsed = finished - started
                        let thisBreak = {task:cycleKeys[WorkContext.current],started:started,finished:finished,elapsed:elapsed}
                        WorkContext.cicle[cycleKeys[WorkContext.current]].breaks.push(thisBreak)
                        TrackWorkModel.breaks.push(thisBreak)
                        console.log("current task breaks", WorkContext.cicle[cycleKeys[WorkContext.current]].breaks)
                        console.log("trackwork model breaks ", TrackWorkModel.breaks)
                        setDialog({...dialog,open:false})}
                },
            ]
        })
    }


    useEffect(() => {
        return () => {
            setWorkContext(() => {
                return (
                    {
                        ...WorkContext, 
                        cicle: {
                            ...WorkContext.cicle,
                            [cycleKeys[WorkContext.current]]:{
                                ...WorkContext.cicle[cycleKeys[WorkContext.current]],
                                stopped: Date.now()
                            }
                        }
                    }
                )
            }
            )
        }
    }, [])

  return (
    <>

    <Carousel
        emulatetouch={true}
        swipeable={false} 
        showThumbs={false} 
        showArrows={true}
        showStatus={false}
        renderArrowNext={arrowNext}
        renderArrowPrev={arrowPrev}
        renderIndicator={false}
        selectedItem={employeeIsWorking ? WorkContext.current : canSeeNextTask.counter}
        onChange={carouselChange}
    >
        {cycleKeys.map((status,index)=>{
            console.log("ciclo mapeado", status) 
            return( 
                <Fade in={true} timeout={2000} unmountOnExit>
                    <Box key={index} height="80vh" component={"div"} sx={{overflow:"auto"}}>
                            {
                            TaskContainer({ 
                                type: status || null, 
                                counter:canSeeNextTask.counter, 
                                setFinished:setCanSeeNexttask,
                                setSnack:setSnack,
                                snack:snack,
                                updatePerformance: updateEmployeePerformance,
                                products: getProductsByType(status)
                            })}
                    </Box>
                </Fade> 
            )
        })}

        
    </Carousel>

    <UserDialog dialog={dialog} setDialog={setDialog} open={dialog.open} title={dialog.title} content={dialog.message} actions={dialog.actions}>
    <Timer contxt="global" from="global"/></UserDialog>

    <Timer contxt="global" from="global"/>
    
    <Snackbar  anchorOrigin={{vertical: "bottom",horizontal: "center" }} open={snack.open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snack.status} sx={{ width: '100%' }}>
            {snack.message}
        </Alert>
    </Snackbar>

    
    <Fab 
        color="primary" 
        size="medium"
        aria-label="take a break"
        onClick={handleBreaks}
        sx={{position:"absolute",bottom: 30,
        right: {xs:30,md:"40%"},}}
    >
        <LocalCafeIcon />
    </Fab>
    </>
  )}

  //TODO Move component 
  export function filterByKey(obj, prop) {
    {/* 
        Returns an object with objects' desired prop as key, 
        letting you have a "status as Key" object or a "name as key" object 
        to name a few 
    */}
    if(obj != undefined){
    return obj.reduce(function (acc, item) {
  
      let key = item[prop]
  
      if (!acc[key] ) { 
        acc[key] = []
      }
      if(item["mix"]==true && item["products"]!=undefined){
        let mixProds = filterByKey(item.products,"item")

        
      }else if(!item.productionData){
        acc[key].push({name:item.name,harvest:item.harvest,seeds:item.seeds,trays:item.trays,})
        
      }else
        acc[key].push({...item.productionData,name:item.name})

      return acc
  
    }, {})}
  
  }