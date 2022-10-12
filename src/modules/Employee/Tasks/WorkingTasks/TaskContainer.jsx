import React, { useState, useEffect, useRef } from 'react'

//*COMPONENTS FROM MUI
import { 
     Box, Button, 
     Typography, useTheme,
    Stepper, Step, StepLabel, StepContent, Paper, 
} from '@mui/material'

//*THEME
import { BV_THEME } from '../../../../theme/BV-theme'
//*NETWORK AND API
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../../../../contextHooks/useAuthContext'

import api from '../../../../axios.js'


///tasks steps test
import { SeedingContent } from './SeedingContent.jsx';
import { HarvestingContent } from './HarvestingContent.jsx';
import { PackingContent } from './PackingContent.jsx';
import { DeliveryContent } from './DeliveryContent.jsx';
import { Timer } from '../../../../CoreComponents/Timer'
import { ArrowCircleRightOutlined } from '@mui/icons-material'
import { CleaningContent } from '../ContainerTasks/CleaningContent'
import { MatCutContent } from '../ContainerTasks/MatCutContent'

export const TaskContainer = (props) => {
    const theme = useTheme(BV_THEME);
    
    const {user, credential} = useAuth()
    
    const {state} = useLocation();

    const [isFinished,setIsFinished] = useState(false)
    
    //* STEPPER
    const [activeStep, setActiveStep] = useState(0)

    var type, order, products

    if(props != null){
        type=props.type
        order=props.order
        products=props.products
    }
    
    if(state.type != undefined){
        ({type} = state);
    }

    console.log("types",type,state.type)
    
    
    

    let steps
    let contentTitle
    let content
    let expectedtTime

    var trays 
    var redplacedMixProducts
    var productsByNameObj

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
            if(product.mix == true){
                product.products.map((product2, id)=>{
                    arreglo.push(product2)
                })
            }else 
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

        

      

        
    
    console.log("type",type)
    switch (type){
        
            case "unpaid": {
                contentTitle = "Unpaid"
                expectedtTime = 0
                content = <Typography>The order is in UNPAID status, please wait until the Order is Ready</Typography>
                steps=[{step:"Unpaid"}]
                } break;

            case "pending": {
                contentTitle = "Pending"
                expectedtTime = 0
                content = <Typography>The order is in PENDING status, please wait until the Order is Ready</Typography>
                steps=[{step:"Pending"}]
                } break;

            case "uncompleted": {
                contentTitle = "Unpaid"
                expectedtTime = 0
                content = <Typography>The order is in UNPAID status, please wait until the Order is Ready</Typography>
                steps=[{step:"Unpaid"}]
                } break;

            case "seeding": {
                contentTitle = "Seeding"
                expectedtTime = Number(Math.ceil(trays) * 2).toFixed(2)
                content = <SeedingContent products={products} productsObj={productsByNameObj} index={activeStep}/>
                steps=[
                    {step:"Tools"},
                    {step:"Setup trays"},
                    {step:"Staple trays"},
                    {step:"Spray Seeds"},
                    {step:"Shelf"},
                ]
                } break;
            

            case "growing": {
                contentTitle = "Growing"
                content = <Typography>The order is in growing status, please wait until the products are ready to harvest</Typography>
                steps=[{step:"Growing"}]
                } break;

            case "harvestReady":{
                contentTitle = "Harvesting"
                expectedtTime = Number(Math.ceil(trays) * 2).toFixed(2)
                content = <HarvestingContent products={products} index={activeStep}/>
                steps=[
                    {step:"Setup"},
                    {step:"Recolection"},
                    {step:"Dry Rack"},
                    {step:"Dry Station"},
                ]
            } break;

            case "harvested":{
                contentTitle = "Packing"
                // expectedtTime = Number(Math.ceil(trays) * 2).toFixed(2)
                {/*const totalPacks = order.products.map((product) => {
                    const total = product.packages.reduce((prev, curr) => {
                        return prev + curr.number
                    },0)

                    return total
                })

                expectedtTime = Number((0.5*totalPacks[0])).toFixed(2)
                */}
                expectedtTime = 3
                content = <PackingContent index={activeStep}/>
                steps=[
                    {step:"Tools"},
                    {step:"Calibration"},
                    {step:"Packing Greens"},
                    {step:"Boxing"},
                ]
            } break;

            case "ready":{
                contentTitle = "Delivery"
                content = <DeliveryContent index={activeStep}/>
                steps=[{step:"Delivery"}]
                } break;


            case "cleaning":{
                contentTitle = "Cleaning"
                content = <CleaningContent index={activeStep}/>
                steps=[{step:"Cleaning"}]
                } break;

            case "mats":{
                contentTitle = "Cut Mats"
                content = <MatCutContent index={activeStep}/>
                steps=[{step:"Cut Mats"}]
                } break;
            
            default: { 
                contentTitle = "Error"
                content = <Typography>Error</Typography>
                steps=[{step:"error"}] 
                } break;
            
    }
    
    //Finish Task
    const handleCompleteTask = () => {
        props.setFinished({value:true,counter:props.counter+1});
        setIsFinished(true)
        //*save (set context) task name with completion time and order id relation
        
        
        const updateTask = async () => {
            let path = {path:"status", value:undefined}
            let response
            switch(type){
                case "seeding":
                    //*  ->Growing
                    response = await api.api.patch(`${api.apiVersion}/orders/${order._id}`, {paths:[{...path, value:"growing"}]}, {
                        headers:{
                            authorization: credential._tokenResponse.idToken,
                            user:          user
                        }
                    })
                    return response
                case "harvesting":
                    //*  ->Harvested
                    response = await api.api.patch(`${api.apiVersion}/orders/${order._id}`, {paths:[{...path, value:"harvested"}]}, {
                        headers:{
                            authorization: credential._tokenResponse.idToken,
                            user:          user
                        }
                    })
                    return response
                case "packing":
                    //*  ->ready
                    response = await api.api.patch(`${api.apiVersion}/orders/${order._id}`, {paths:[{...path, value:"ready"}]}, {
                        headers:{
                            authorization: credential._tokenResponse.idToken,
                            user:          user
                        }
                    })
                    return response
                case "ready":
                    //*  ->delivered
                    response = await api.api.patch(`${api.apiVersion}/orders/${order._id}`, {paths:[{...path, value:"delivered"}]}, {
                        headers:{
                            authorization: credential._tokenResponse.idToken,
                            user:          user
                        }
                    })
                    return response
                default:
                    response = ""
                    return response
            }
        
        }

        updateTask()
        .then((response) => {
            console.log("response",response)
            props.setSnack({...props.snack, open:true, message:"Task updated succesfully", status:"success"})
        })
        .catch(err => {
            console.log("err",err)
        })

    }


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
                        onClick={isLastStep(index) ? handleCompleteTask : handleNext}
                        sx={()=>({...BV_THEME.button.standard,mt: 1, mr: 1,})}
                        disabled={isLastStep(index) && isFinished }
                        
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
                        onClick={isLastStep(index) ? handleCompleteTask : handleNext}
                        sx={()=>({...BV_THEME.button.standard})}
                        disabled={isLastStep(index) && isFinished }
                        
                    >
                        {isLastStep(index) ? 'Finish Task' : 'Continue'}
                    </Button>
                    
            </Box>
        )

    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////
    
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
                    <Typography variant="h3" color="primary">{contentTitle}</Typography>
                    <Typography>Expected time: {expectedtTime} Minutes</Typography>
                    <Timer contxt="task"/>
                    {content}
                    
                </Box>
                        

                    
                        
            </Box>
        </Box>
                        
    </div>
    



  )
}
