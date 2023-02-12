import { Button, Paper, Step, StepContent, StepLabel, Stepper, Typography, useTheme } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CleaningContent } from '../../modules/Employee/Tasks/ContainerTasks/CleaningContent'
import { MaintenanceContent } from '../../modules/Employee/Tasks/ContainerTasks/MaintenanceContent'
import { MatCutContent } from '../../modules/Employee/Tasks/ContainerTasks/MatCutContent'
import { DeliveryContent } from '../../modules/Employee/Tasks/WorkingTasks/DeliveryContent'
import { HarvestingContent } from '../../modules/Employee/Tasks/WorkingTasks/HarvestingContent'
import { PackingContent } from '../../modules/Employee/Tasks/WorkingTasks/PackingContent'
import { PreSoakingContent } from '../../modules/Employee/Tasks/WorkingTasks/PreSoakingContent'
import { PreSoakingContent1 } from '../../modules/Employee/Tasks/WorkingTasks/PreSoakingContent1'
import { PreSoakingContent2 } from '../../modules/Employee/Tasks/WorkingTasks/PreSoakingContent2'
import { SeedingContent } from '../../modules/Employee/Tasks/WorkingTasks/SeedingContent'
import { BV_THEME } from '../../theme/BV-theme'
import { transformTo } from '../../utils/times'
import { Timer } from '../Timer'

export const TaskContainer = (props) => {
    //*Variables declarations
    let steps
    let contentTitle
    let content
    let expectedtTime
    
    let trays 
    let redplacedMixProducts
    let productsByNameObj
    
    
    // const theme = useTheme(BV_THEME);
    
    // const {user, credential} = useAuth()
    // const {WorkContext,setWorkContext,TrackWorkModel,setTrackWorkModel,employeeIsWorking, isOnTime} = useWorkingContext()
    const {state} = useLocation();
    // const navigate = useNavigate()
    

    const [isFinished,setIsFinished] = useState(false)
    //* STEPPER
    const [activeStep, setActiveStep] = useState(0)
    
    let type, order, products, packs
    
    if(props != null){
        type=props.type
        order=props.order
        products=props.products
        packs = props.packs
    }

    // const [isDisabled, setIsDisabled] = useState(state.workData[type].length<1)

    if(state != null){
        if(state.type != undefined){
            ({type} = state);
        }
    }

    switch (type){
        // case "unpaid":
        //     contentTitle = "Unpaid"
        //     expectedtTime = 0
        //     content = <Typography>The order is in UNPAID status, please wait until the Order is Ready</Typography>
        //     steps=[{step:"Unpaid"}]
        // break;

        // case "pending": 
        //     contentTitle = "Pending"
        //     expectedtTime = 0
        //     content = <Typography>The order is in PENDING status, please wait until the Order is Ready</Typography>
        //     steps=[{step:"Pending"}]
        // break;

        // case "uncompleted":
        //     contentTitle = "Unpaid"
        //     expectedtTime = 0
        //     content = <Typography>The order is in UNPAID status, please wait until the Order is Ready</Typography>
        //     steps=[{step:"Unpaid"}]
        //  break;

        case "preSoaking":
            contentTitle = "Soaking seeds"
            expectedtTime = transformTo("ms","minutes",state.time.times.preSoaking.time) 
            content = <PreSoakingContent products={products} productsObj={productsByNameObj} workData={state.workData["preSoaking"]} index={activeStep}/>
            steps=[
                {step:"Pre Soak"},
            ]
        break;

        case "soaking1":
            contentTitle = "Soaking stage - 1"
            expectedtTime = transformTo("ms","minutes",state.time.times.preSoaking.time) 
            
            content = <PreSoakingContent1 products={products} productsObj={productsByNameObj} workData={state.workData["preSoaking"]} index={activeStep}/>
            steps=[
                {step:"Water change 1"},
            ]
        break;

        case "soaking2":
            contentTitle = "Soaking stage - 2"
            expectedtTime = transformTo("ms","minutes",state.time.times.preSoaking.time) 
            content = <PreSoakingContent2 products={products} productsObj={productsByNameObj} workData={state.workData["preSoaking"]} index={activeStep}/>
            steps=[
                {step:"Water change 2"},
            ]
        break;

        case "seeding":
            expectedtTime = transformTo("ms","minutes",state.time.times.seeding.time) 
            content = <SeedingContent products={products} productsObj={productsByNameObj} workData={state.workData["seeding"]} index={activeStep}/>
            steps=[
                {step:"Waste and control"},
                {step:"Seeding"},
                // {step:"Seeding"},
                // {step:"Putting to the light"},
                // {step:"Spray Seeds"},
            ]
            contentTitle = steps[activeStep].step
        break;

        
        

        // case "growing":
        //     contentTitle = "Cycle finished"
        //     content = <Typography>Go to dashboard and finish your work</Typography>
        //     steps=[{step:"Growing"}]
        // break;

        case "harvestReady":
            contentTitle = "Harvesting"
            expectedtTime = transformTo("ms","minutes",state.time.times.harvestReady.time)
            content = <HarvestingContent products={products} index={activeStep}/>
            steps=[
                {step:"Recolection"},
                // {step:"Dry Rack"},
                // {step:"Dry Station"},
            ]
        break;

        case "packing":
            contentTitle = "Packing"
            expectedtTime = transformTo("ms","minutes",state.time.times.packing.time)
            content = <PackingContent index={activeStep} products={products} packs={packs}/>
            steps=[
                {step:"Packing Greens"},
                // {step:"Tools"},
                // {step:"Calibration"},
                // {step:"Boxing"},
            ]
        break;

        case "ready":
            contentTitle = "Delivery"
            expectedtTime = transformTo("ms","minutes",state.time.times.harvestReady.time)
            content = <DeliveryContent index={activeStep}/>
            steps=[{step:"Delivery"}]
        break;


        case "cleaning":
            contentTitle = "Cleaning"
            content = <CleaningContent index={activeStep}/>
            steps=[{step:"Cleaning"}]
        break;

        case "mats":
            contentTitle = "Cut Mats"
            content = <MatCutContent index={activeStep}/>
            steps=[{step:"Cut Mats"}]
        break;
        case "maintenance":
            contentTitle = "Maintenance"
            content = <MaintenanceContent index={activeStep}/>
            steps=[{step:"Maintenance"}]
        break;
        
        default: 
            contentTitle = "Error"
            content = <Typography>Error</Typography>
            steps=[{step:"error"}] 
        break;
        
    }



    const sumProdData = (arr, data) => {
        let result = 0;
        arr.forEach(product => {
            result += product[data]
            })
        return result;
    }

    if(products != null){
         trays = getTraysTotal(products)
         redplacedMixProducts = mixOpener(products)
         productsByNameObj = filterByKey(redplacedMixProducts,"name")
        setFinalProductionData()
    }
    
    function getTraysTotal(producti){
        let ttrays = 0
        producti.map((product, id) => {
            let prev = ttrays
            let curr

            { product.products != undefined && product.mix===true  ?
                curr = getTraysTotal(product.products)
                :
                product.productionData != undefined ? 
                    curr = product.productionData.trays 
                    : 
                    curr=product.trays
            }
            ttrays = prev + curr
        })
        return ttrays
    }


      
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
        if(item["mix"]==true && item["products"]!=undefined){
        let mixProds = filterByKey(item.products,"item")
        console.log("solo soy uno",mixProds)

        
        }else if(!item.productionData){
        acc[key].push({name:item.name,harvest:item.harvest,seeds:item.seeds,trays:item.trays,})
        
        }else
        acc[key].push({...item.productionData,name:item.name})

        return acc
    
    }, {})
    
    }

      

    function mixOpener(products) {
    let arreglo = []
    products.map((product,id)=>{
        if(product.mix){
            if(product.products){
            product.products.map((product2, id)=>{
                arreglo.push(product2)
            }
            )
        }}else 
            arreglo.push(product)
    })
        return arreglo
    }


        

    function setFinalProductionData(){
        for(const key in productsByNameObj){

            const h = sumProdData(productsByNameObj[key], 'harvest');
            const s = sumProdData(productsByNameObj[key], 'seeds');
            const t = sumProdData(productsByNameObj[key], 'trays');
            
            productsByNameObj[key]={harvest:h,seeds:s,trays:t}
        }
    }


    // let haventFinishedActualTask = WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.current]].achieved === undefined
    // if(!haventFinishedActualTask) {
    //     content = <div>Yo already finished the task.</div>
    // }

    //Finish Task
    // const handleCompleteTask = () => {
    //     let finished = Date.now()
    //     let achieved =  finished - WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.current]].started

    //     const updateProduction = async () => {
    //         let wd = JSON.parse(window.localStorage.getItem("workData"))

    //         //*When this model is sent also updates the performance of the employee on the allocationRatio key.
    //         const taskHistoryModel = {
    //             executedBy:     user._id,
    //             expectedTime:   TrackWorkModel.expected.times[Object.keys(WorkContext.cicle)[WorkContext.current]].time,
    //             achievedTime:   achieved,  
    //             orders:         state.orders.map((order) => order._id),
    //             taskType:       Object.keys(WorkContext.cicle)[WorkContext.current],
    //             workDay:        TrackWorkModel.workDay   
    //         }  

    //         let ids = []
    //         wd[Object.keys(WorkContext.cicle)[WorkContext.current]].forEach((model) => {
    //             if(model.modelsId){
    //                 model.modelsId.forEach((id) => ids.push(id))
    //             }
    //         })

    //         await api.api.patch(`${api.apiVersion}/work/taskHistory`, 
    //         {
    //             ...taskHistoryModel
    //         },
    //         {
    //             headers: {
    //                 authorization: credential._tokenResponse.idToken,
    //                 user: user
    //             }
    //         })


            
    //         await api.api.patch(`${api.apiVersion}/work/production/${user.assignedContainer}`,
    //         {
    //             productionModelsIds:ids,
    //         },
    //         {
    //             headers: {
    //                 authorization: credential._tokenResponse.idToken,
    //                 user: user
    //             }
    //         }
    //         )
    //     }
            
    //     if(type === "cleaning"){
    //         console.log("The production cannot be updated as the same way of a productin model based task")
    //         WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.current]].finished = finished
    //         WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.current+1]].started = finished+1
    //         WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.current]].achieved =  achieved
    //         TrackWorkModel.tasks.push(WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.current]])
    //         setTrackWorkModel({...TrackWorkModel, tasks:TrackWorkModel.tasks})

    //         WorkContext.current = WorkContext.current + 1
    //         setWorkContext({...WorkContext, current:WorkContext.current, currentRender:WorkContext.current})
    //         localStorage.setItem("WorkContext", JSON.stringify(WorkContext)) 
            
    //         props.setSnack({...props.snack, open:true, message:"Production updated succesfully", status:"success"})
    //         props.setFinished({value:true,counter:props.counter+1});
    //         navigate(`/${user.uid}/${user.role}/dashboard`)
    //         return
    //     }
        
    //     updateProduction()
    //     .then((result) => {

    //         // hooks
    //         WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.current]].finished = finished
    //         WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.current+1]].started = finished+1
    //         WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.current]].achieved =  achieved
    //         TrackWorkModel.tasks.push(WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.current]])
    //         setTrackWorkModel({...TrackWorkModel, tasks:TrackWorkModel.tasks})

    //         WorkContext.current = WorkContext.current + 1
    //         setWorkContext({...WorkContext, current:WorkContext.current, currentRender:WorkContext.current})
    //         localStorage.setItem("WorkContext", JSON.stringify(WorkContext)) 
            
    //         props.setSnack({...props.snack, open:true, message:"Production updated succesfully", status:"success"})
    //         props.setFinished({value:true,counter:props.counter+1});
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         props.setSnack({...props.snack, open:true, message:"Error updating production, please finish the task again.", status:"error"})
    //     })
    // }


    //*********** STEPPER Functionality
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleReset = () => {
        setActiveStep(0);
    };
    const isLastStep = (index) => {
        return index == steps.length - 1

    };
    
    // Stepper Navigation buttons
    const getStepContent = (step,index) => {
        return ( 
            <>
            <Typography sx={{display:{xs:"none", sm:"flex"}}}>{step.description}</Typography>
            <Box sx={{ mb: 2 }}>
                <div>
                    <Button
                        
                        variant="contained"
                        // onClick={isLastStep(index) ? handleCompleteTask : handleNext}
                        onClick={handleNext}
                        sx={()=>({...BV_THEME.button.standard,mt: 1, mr: 1,})}
                        // disabled={(!isOnTime && isLastStep(index)) || (isLastStep(index) && isFinished) && type === "growing"}
                        
                    >
                        {isLastStep(index) ? 'Finish Task' :'Continue'}
                    </Button>
                    
                    <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                    >
                        Back
                    </Button>
                </div>
            </Box>
            </>
        )
    }

    const getMobileStepperButtons = (index) => {
        return (
            <Box sx={{width:"100%", mb: 2 ,display:{xs:"flex",sm:"none"}, justifyContent: 'space-evenly' }}>
                
                <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={()=>({...BV_THEME.button.standard, color:"white_btn"})}
                        variant="outlined"
                    >
                        Back
                    </Button>


                    <Button
                        variant="contained"
                        // onClick={isLastStep(index) ? handleCompleteTask : handleNext}
                        onClick={handleNext}
                        sx={()=>({...BV_THEME.button.standard})}
                        // disabled={(!isOnTime && isLastStep(index)) || (isLastStep(index) && isFinished) }
                        
                    >
                        {isLastStep(index) ? 'Finish Task' : 'Continue'}
                    </Button>
                    
            </Box>
        )

    }

    // useEffect(() => {
    //     setActiveStep(() => {
    //         if(employeeIsWorking && haventFinishedActualTask){
    //             return 0
    //         }

    //         return steps.length - 1
    //     })
        
    //     // setIsFinished(() => {
    //     //     return (WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.current]].achieved !== undefined) || WorkContext.cicle[Object.keys(WorkContext.cicle)[props.counter]]?.achieved !== undefined
    //     // })

    // },[])
  return (
    <div style={{}}>
        
        <Box sx={{display:"flex", width:"100%", marginTop:"5vh",justifyContent:"center",justifyItems:"center", alignItems:"center", flexDirection:"column"}}>
        
            <Box sx={{ width: {xs:"100%",sm:"90%"}, display:"flex", flexDirection:{xs:"column",sm:"row"} }}>

                 
                 {/*MOBILE STEPPER (HORIZONTAL)*/}           
                <Box justifyContent={"space-evenly"} flexDirection="column" alignItems={"center"} sx={{ width: {xs:"100%",sm:"90%"}, display:{xs:"flex", sm:"none"}}}>
                    <Stepper activeStep={activeStep} >
                        {steps.map((step, index) => (
                            <Step key={index}>
                                <StepLabel sx={{fontSizeAdjust:"20px"}}>
                                    {step.label}
                                </StepLabel>
                                
                            </Step>
                        ))}
                    </Stepper>
                    {getMobileStepperButtons(activeStep)}
                </Box>

                
                
                
                {/* DESKTOP STEPPER (VERTICAL) */}
                <Box sx={{ width: "35%", display:{xs:"none", sm:"inline-block"}}}>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((step, index) => (
                            <Step key={step.step + 1}>
                                <StepLabel sx={{fontSizeAdjust:"20px"}}>
                                    {step.step}
                                </StepLabel>
                                <StepContent>
                                    {getStepContent(step,index)}
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length && (
                        <Paper square elevation={0} sx={{ p: 3 }}>
                            <Typography>All steps completed - you&apos;re finished</Typography>
                            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                                Reset
                            </Button>
                        </Paper>
                        
                    )}
                </Box>

                {/*Specific task instructions*/}
                <Box sx={{ width:{xs:"100%",sm:"65%"}, display:"flex", flexDirection:"column", padding:"5%", alignItems:"center" }}>          
                    {
                        type !== 'growing' && (
                            <>
                                <Typography variant="h3" color="primary">{contentTitle}</Typography>
                                <Typography>Expected time: {type === "preSoaking" ? expectedtTime + ` ${expectedtTime > 1 ? 'minutes' : 'minute'}` + ' for soaking seeds task plus ' + 6 + ' hours of soaking waiting time' : expectedtTime + ' Minutes'}</Typography>
                                {/* <Timer contxt="task"/> */}
                            </>
                        )
                    }
                    {content}
                    
                </Box>
                        

                    
                        
            </Box>
        </Box>
                        
    </div>
    



  )
}