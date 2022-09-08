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

export const TaskTest = (props) => {
    const theme = useTheme(BV_THEME);
    
    const {user, credential} = useAuth()
    
    const {state}= useLocation();

    const [isFinished,setIsFinished] = useState(false)
    
    //* STEPPER
    const [activeStep, setActiveStep] = useState(0)

    let type, order

    if(state != null){
        ({type, order} = state);
    }
    if(props != null){
        type=props.type
        order=props.order
    }

    let steps
    let contentTitle
    let content

    switch (type){
        case "seeding": {
                contentTitle = "Seeding"
                content = <SeedingContent products={order.products} index={activeStep}/>
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
            }
            break;

        case "harvestReady":{
                contentTitle = "Harvesting"
                content = <HarvestingContent index={activeStep}/>
                steps=[
                    {step:"Setup"},
                    {step:"Recolection"},
                    {step:"Dry Rack"},
                    {step:"Dry Station"},
                ]
            } break;

        case "harvested":{
                contentTitle = "Packing"
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
            
    }
    
    //Finish Task
    const handleCompleteTask = () => {
        props.setFinished({value:true,counter:props.counter+1});
        setIsFinished(true)

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
            console.log(response)
        })
        .catch(err => {
            console.log(err)
        })

        props.setOpen(true)
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
                            <Step key={step.label}>
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
                    {content}
                </Box>
                        

                    
                        
            </Box>
        </Box>
                        
    </div>
    



  )
}
