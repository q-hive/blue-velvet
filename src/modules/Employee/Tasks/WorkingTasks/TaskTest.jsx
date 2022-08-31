import React, { useState, useEffect, useRef } from 'react'

//*COMPONENTS FROM MUI
import { 
    Autocomplete, Box, Button, 
    TextField, Typography, useTheme, 
    Fab,
    Stepper, Step, StepLabel, StepContent, Paper, 
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import CameraIcon from '@mui/icons-material/AddPhotoAlternate';

//*THEME
import { BV_THEME } from '../../../../theme/BV-theme'
import { UserDialog } from '../../../../CoreComponents/UserFeedback/Dialog'
//*NETWORK AND API
import api from '../../../../axios'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../../contextHooks/useAuthContext'


///tasks steps test
import { StepDisplay } from './StepDisplay';

//*Auth
const amounts = ["25","30","40","50","60","70","80","90"]

export const TaskTest = () => {
    const theme = useTheme(BV_THEME);

    const taskType = window.location.search
    console.log(taskType)

    let steps
    if(taskType === "?harvesting"){steps=[{step:0,assigned:"estempleado",status:"To-do",estimated:0},
    {step:1,assigned:"estempleado",status:"To-do",estimated:2},
    {step:2,assigned:"estempleado",status:"To-do",estimated:5},
    {step:3,assigned:"estempleado",status:"To-do",estimated:5}]}

    if(taskType === "?seeding"){steps=[{step:0,assigned:"estempleado",status:"To-do",estimated:0},
    {step:1,assigned:"estempleado",status:"To-do",estimated:2},
    {step:2,assigned:"estempleado",status:"To-do",estimated:5},
    {step:3,assigned:"estempleado",status:"To-do",estimated:5},
    {step:4,assigned:"estempleado",status:"To-do",estimated:5}]}


    //* STEPPER
    const [activeStep, setActiveStep] = useState(0)

    const DUMMY_Task = {}

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
        console.log("Finish")
        {/*const model = {
            name:   mix.name,
            price:   Number(mix.price), // * Cost per tray,
            mix: {
                isMix:true,
                name:mix.name,
                products:mix.products
            },
            status:"stopped"
        }
        const hasLabel = mix.label !== null
        let label
        if(hasLabel){
            label = new FormData()

            label.append(
                "label",
                mix.label[0],
                mix.label[0].name
            )

            model.label = label
        }
        
        api.api.post(`${api.apiVersion}/products/`, model, {
            headers:{
                authorization:credential._tokenResponse.idToken,
                user:user
            }
        })
        .then(response => {
            setDialog({
                open:true,
                title:"Mix created succesfuly",
                message:"The mix was added to the DB, what you would like to do?",
                actions:[
                    {
                        label:"Create another",
                        btn_color:"primary",
                        execute: () => {
                            navigate(`/${user.uid}/${user.role}/production`)
                        }
                        
                    },
                    {
                        label:"End",
                        btn_color:"secondary",
                        execute:() => {
                            navigate(`/${user.uid}/${user.role}/dashboard`)
                        }
                    }
                ]
            })
        })
        .catch(err => {
            console.log(err.response)
            setDialog({
                open:true,
                title:"Error adding new product",
                message:"There was an error sending the data, please try again",
                actions:[
                    {
                        label:"Try again",
                        execute: () => {
                            window.location.reload()
                        }
                    },
                    {
                        label:"Cancel",
                        execute:() => {
                            navigate('/')
                        }
                    }
                ]
            })
        })}  */}
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
                                    
                <Box sx={{ width:{xs:"90%",sm:"65%"}, display:"flex", flexDirection:"column", padding:"5%", alignItems:"center" }}>
                    {<StepDisplay type={taskType} index={activeStep} /*task={DUMMY_Task}*//>}
                </Box>
                        

                    
                        
            </Box>
        </Box>
                        
    </div>
    



  )
}