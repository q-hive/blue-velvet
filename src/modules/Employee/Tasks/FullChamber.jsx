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
import { BV_THEME } from '../../../theme/BV-theme';
import { getWorkdayProdData } from '../../../CoreComponents/requests';
import cy from 'date-fns/esm/locale/cy/index.js';

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
    const {orders,workData,cycleKeys} = state

    //*CONTEXTS
    const {user, credential} = useAuth()
    const {TrackWorkModel, setTrackWorkModel, WorkContext, setWorkContext, employeeIsWorking} = useWorkingContext()

    
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
    const [workdayProdData, setWorkdayProdData] = useState({})
    
    //const [cycleKeys,setCycleKeys] = useState(["preSoaking"])

   
    




    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setSnack({
            ...snack,
            open:false
        });
    };

    const getCycleKeys = () => {
        let arrcycl = []
        
        Object.keys(workdayProdData).map((activeKey,id)=>{
            workdayProdData[activeKey].length > 0 ?
            Object.keys(WorkContext.cicle).map((structureKey,id)=>{
                if(structureKey==activeKey && !arrcycl.includes(structureKey))
                    arrcycl.push(structureKey)

            })
            :
            null

        })
        console.log("arrcycl innit",arrcycl)
        return arrcycl
    }

    

/*    let psTrue = workdayProdData.preSoaking?.length>0
    let sTrue = workdayProdData.seeding?.length>0
    let hrTrue = workdayProdData.harvestReady?.length>0
    */


    /*psTrue?cycleKeys.push("preSoaking"):null
    sTrue?cycleKeys.push("seeding"):null
    hrTrue?cycleKeys.push("harvestReady"):null
    */






    
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

    const allProducts = workData


    {/* Products to send as props to TaskTest */}
    function getProductsByType(type){
        
        const filteredProductList = []

        allProducts.map((product, id)=>{
            if(product.status===type)
                filteredProductList.push(product)
        })
            return filteredProductList;

    }

    const carouselChange = (index,element) => {
        setWorkContext({...WorkContext, currentRender:index})
        
        if(index < 0){}

        setCanSeeNexttask((cnSee) => {
            if(index < canSeeNextTask.counter){
                return {
                    ...cnSee,value:true
                }    
            }

            return {...cnSee}
        })

        if(index < canSeeNextTask.counter){
            return
        }

        setWorkContext((wrkContext) => {
                if(WorkContext.cicle[cycleKeys[index]].started === undefined && index == WorkContext.current){
                    return {
                        ...wrkContext, cicle: {
                            ...WorkContext.cicle,
                            [Object.keys(WorkContext.cicle)[index]]:{
                                ...WorkContext.cicle[cycleKeys[index]],
                                started: Date.now()
                            }
                        }
                    }
                    
                }

                return {...wrkContext}
                
            }
        )
        
        
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
                        setWorkContext({...WorkContext})
                        TrackWorkModel.breaks.push(thisBreak)
                        setTrackWorkModel({...TrackWorkModel})
                        console.log("current task breaks", WorkContext.cicle[cycleKeys[WorkContext.current]].breaks)
                        console.log("trackwork model breaks ", TrackWorkModel.breaks)
                        setDialog({...dialog,open:false})}
                },
            ]
        })
    }

    /*useEffect(()=>{
        let psTrue = workData.preSoaking?.length>0
        let sTrue = workData.seeding?.length>0
        let hrTrue = workData.harvestReady?.length>0

        console.log("aber hdsptm",psTrue,sTrue,hrTrue)
    

    let testingKeys =[] 

    psTrue?testingKeys.push("preSoaking"):null
    sTrue?testingKeys.push("seeding"):null
    hrTrue?testingKeys.push("harvestReady"):null

    setCycleKeys(testingKeys)
    


    },[workdayProdData])*/

    useEffect(() => {
            setWorkContext(() => {
                return {
                    ...WorkContext, 
                    cicle: {
                        ...WorkContext.cicle,
                        [cycleKeys[WorkContext.current]]:{
                            ...WorkContext.cicle[cycleKeys[WorkContext.current]],
                            stopped: Date.now()
                        }
                    }
                }
            })
    }, [WorkContext.current])

    useEffect(()=>{
        getWorkdayProdData({
            user:user,
            credential:credential,
            setProdData:setWorkdayProdData,

            
        })
        
    },[])

    
    

    console.log("lalala2",workdayProdData)

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
        selectedItem={employeeIsWorking ? WorkContext.current : 0}
        onChange={carouselChange}
        transitionTime={1000}
    >
        {cycleKeys?.map((status,index)=>{
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
                                stepInList:index,
                                updatePerformance: updateEmployeePerformance,
                                setWorkContext: setWorkContext,
                                products: workdayProdData[status]
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