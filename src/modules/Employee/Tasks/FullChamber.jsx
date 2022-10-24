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
    const contextValidation = () => {
        return (employeeIsWorking) && (WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.current]].achieved !== undefined)
    }
    const step = WorkContext.current || 0

    
    //*render states
    const [canSeeNextTask,setCanSeeNexttask] = useState({value:contextValidation(),counter:step})
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
        console.log(":Carrousel changing")
        if(index < canSeeNextTask.counter){
            WorkContext.currentRender = index
            WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.current]].stopped = Date.now()
            setCanSeeNexttask({...canSeeNextTask,value:true})
            return
        }
        
        const nextTask = Object.keys(WorkContext.cicle)[index]
        
        if(WorkContext.cicle[nextTask].started === undefined){
            console.log("Started time in " + Object.keys(WorkContext.cicle)[index] + " is undefined")
            setWorkContext({...WorkContext, cicle: {
                ...WorkContext.cicle,
                [Object.keys(WorkContext.cicle)[index]]:{
                    ...WorkContext.cicle[Object.keys(WorkContext.cicle)[index]],
                    started: Date.now()
                }
            }})
        }
        WorkContext.current = index
        WorkContext.currentRender = index
        setCanSeeNexttask({...canSeeNextTask,value:false})
    }

    const carouselButtonSX = {
            position: 'absolute',
            zIndex: 2,
            top:{xs:"80%", md:'calc(95% - 15px)'}
    }

    const arrowNext = (onClickHandler) =>{
        const handleClick = () => {
            const currentTask = WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext?.currentRender ?? WorkContext.current]]
            if(currentTask !== undefined && currentTask?.achieved !== undefined){
                onClickHandler()
                return
            }
            
            setSnack({...snack, open:true, status:"warning", message:"You havent finished the task." })
        }
        
        
        return (
            <Button 
            disabled={!canSeeNextTask.value} 
            variant="contained" 
            onClick={handleClick} 
            title={"next task"} 
            sx={()=>({...carouselButtonSX,right:"5%"})}
            >
                Next Task
            </Button>
        )
    
    }
    
    
    const arrowPrev = (onClickHandler, hasPrev, label) => {
        const handleClick = () => {
            onClickHandler()
        }
        
        if(!hasPrev){
            return null
        }
        
        return (
            <Button 
            variant="contained" 
            onClick={handleClick} 
            title={"previous task"} 
            sx={()=>({...carouselButtonSX,left:{xs:"5%", md:"5%"}})}
            >
                Prev Task
            </Button>
        )
    }
    

    const updateEmployeePerformance = (expected, real) => {
        //*EMPLOYEE PERFORMANCE = container capacity (real/expected)
        //* if (real/expected) > 1 negative
    }

    const handleBreaks = () => {
        console.log(TrackWorkModel)
        console.log(WorkContext)
        // TrackWorkModel.breaks.push(este break)
        setDialog({
            ...dialog,
            open:true,
            title:"You are on a break ",
            message:"Rest. Breathe. Your time is still being tracked",
            actions: [
                {
                    label:"Continue Working",
                    execute: () => setDialog({...dialog,open:false})
                },
            ]
        })
    }


    useEffect(() => {
        return () => {
            console.log("Full chamber unmount, set local storage context")
            setWorkContext((wrkctx) => {
                return (
                    {
                        ...wrkctx, 
                        cicle: {
                            ...wrkctx.cicle,
                            [Object.keys(wrkctx.cicle)[wrkctx.current]]:{
                                ...wrkctx.cicle[Object.keys(wrkctx.cicle)[wrkctx.current]],
                                stopped: Date.now()
                            }
                        },
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
        showStatus={true}
        renderArrowNext={arrowNext}
        renderArrowPrev={arrowPrev}
        renderIndicator={false}
        selectedItem={employeeIsWorking ? WorkContext.current : canSeeNextTask.counter}
        onChange={carouselChange}
    >
        {Object.keys(tasksCicleObj.cicle).map((status,index)=>{ 
            return( 
                <Fade in={true} timeout={2000} unmountOnExit>
                    <Box key={index} height="80vh" component={"div"}>
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