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


///tasks steps test
import { SeedingContent } from './SeedingContent';
import { HarvestingContent } from './HarvestingContent';
import { PackingContent } from './PackingContent';
import { DeliveryContent } from './DeliveryContent';

export const TaskTest = (props) => {
    const theme = useTheme(BV_THEME);

    const {state}= useLocation();

    let type, order

    if(state != null){
        ({type, order} = state);
    }
    

    if(props != null){
        type=props.type
        order=props.order
    }

    
    let done = false
    const isDone = () => {
        return( done===true ? true : false)
    }

    if(props.done === "done" ){
        return isDone()

    }

    console.log(type)
    console.log(order)

    /*
    const taskType = window.location.search
    console.log(taskType)
    */

    //* STEPPER
    const [activeStep, setActiveStep] = useState(0)

    let steps
    let contentTitle
    let content

    switch (type){
        case "seeding": {
                contentTitle = "Seeding"
                content = <SeedingContent products={order.products} index={activeStep}/>
                steps=[{step:0},{step:1},{step:2},{step:3},{step:4},]
            } break;
            
        case "harvesting": 
                {
                contentTitle = "Harvesting"
                content = <HarvestingContent index={activeStep}/>
                steps=[{step:0},{step:1},{step:2},{step:3},]
            } break;

        case "packing": 
                {
                contentTitle = "Packing"
                content = <PackingContent index={activeStep}/>
                steps=[{step:0},{step:1},{step:2},{step:3},]
            } break;

        case "delivery": 
                    {
                contentTitle = "Delivery"
                content = <DeliveryContent index={activeStep}/>
                steps=[{step:0}]
            } break;
            
    }

    //*RENDER STATES
   
    const [showFinal, setShowFinal] = useState(false)
    const ref = useRef(null)
    

   //*USER FEEDBACK STATES 
    const [dialog, setDialog] = useState({
        open:false,
        title:"",
        message:"",
        actions:[]
    })

    const {user, credential} = useAuth()
    const navigate = useNavigate()
    
    
    const handleCompleteTask = () => {
        done=true
        console.log("Finish")
        
    }

    


    //*********** STEPPER

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
                        
                    >
                        {isLastStep(index) ? 'Finish Task' : 'Continue'}
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
                                    {"Step " + (step.step+1)}
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
                                    
                <Box sx={{ width:{xs:"100%",sm:"65%"}, display:"flex", flexDirection:"column", padding:"5%", alignItems:"center" }}>          
                    <Typography variant="h3" color="primary">{contentTitle}</Typography>
                    {content}
                </Box>
                        

                    
                        
            </Box>
        </Box>
                        
    </div>
    



  )
}
