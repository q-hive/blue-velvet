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
    //* STEPPER
    const [activeStep, setActiveStep] = useState(0)
    
    //*DATA STATES
    const [strains, setStrains] = useState([])
    const [mix, setMix] = useState({
        products:[],
        name:"",
        label:null,
        cost:0
    })

    //*RENDER STATES
    const [inputValue, setInputValue] = useState({
        strain:"",
        amount:"",
        label:"",
        cost:""
    })
    const [showFinal, setShowFinal] = useState(false)
    const [canAdd, setCanAdd] = useState(true)
    const ref = useRef(null)
    

   //*USER FEEDBACK STATES 
    const [dialog, setDialog] = useState({
        open:false,
        title:"",
        message:"",
        actions:[]
    })

    const [error, setError] = useState({
        strain:{
            failed:false,
            message:""
        },
        amount:{
            failed:false,
            message:""
        },
        name:{
            failed:false,
            message:""
        },
        label:{
            failed:false,
            message:""
        },
    })

    const {user, credential} = useAuth()
    const navigate = useNavigate()
    
    const handleInputChange = (e,v,r) => {
        let id
        if(e.target.id.includes('-')){
            id = e.target.id.split('-')[0]
        } else {
            id = e.target.id
        }

        if(error[id].failed){
            setError({
                ...error,
                [id]:{
                    failed:false,
                    message:""
                }
            })
        }
        setInputValue({
            ...inputValue,
            [id]:v
        })
    }

    const mapErrors = (object) => {
        const valuesMapped = Object.entries(object).map((entry, idx) => {
            if(activeStep === 0) {
                if(entry[0] === "strain" && (entry[1] === "" || entry[1] === null || entry[1] === undefined)){
                    return {
                        [entry[0]]:{
                            failed:true,
                            message:"Please select a strain"
                        }
                    }
                }
                if(entry[0] === "amount" && (entry[1] === "" || entry[1] === null || entry[1] === undefined || entry[1] === 0)){
                    return {
                        [entry[0]]:{
                            failed:true,
                            message:"Please set an amount."
                        }
                    }
                }

                return {
                    [entry[0]]:{
                        failed:false,
                        message:""
                    }

                }
            }
        })

        let mappedErrors
        valuesMapped.forEach(err => {
            mappedErrors = {
                ...mappedErrors,
                ...err
            }
        })

        return {mappedErrors}
    }
    
    const handleAddToMixComb = () => {
        const {mappedErrors} = mapErrors(inputValue)
        setError({
            ...error,
            ...mappedErrors
        })


        setMix({
            ...mix,
            products:[
                ...mix.products,
                {
                    product:inputValue.strain,
                    amount:inputValue.amount
                }
            ]
        })
        
        // setMix((mix) => {
        //     if(mix.products.length === 0){
        //         return {[mix.products]:[...mix.products, {product:inputValue.strain, amount:inputValue.amount}]}
        //     }
            
        //     mix.products.map((prod) => {
        //         return {...prod, product:inputValue.strain, amount:inputValue.amount}
        //     })
        // })
        return
    }
    const handleChangeFinalData = (e) => {
        setMix({
            ...mix,
            [e.target.id]:e.target.value            
        })
    }

    const handleChangeLabel = (e) => {
        console.log(e.target.files)
        setMix({
            ...mix,
            label:e.target.files
        })
    }

    const handleSetMix = () => {
        if(mix.products.length < 2){
            setDialog({
                ...dialog,
                open:true,
                title:"Invalid mix length",
                message:"Please add another combination of strain and amount, in order to complete 100%",
                actions: [
                    {
                        label:"Ok"
                    }
                ]
            })
            return
        }
        handleNext()
        
        //*OK THE MIX HAVE THE RIGHT LENGTH, THE TOTAL OF AMOUNT IS 100% ? 
        
    }
    
    const handleSendMixData = () => {
        console.log(mix)
        const model = {
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
        })
    }

    useEffect(() => {
        api.api.get(`${api.apiVersion}/products/`, {
            headers:{
                authorization:credential._tokenResponse.idToken,
                user:user
            }
        })
        .then((response) => {
            setStrains(response.data.data)
        })
        .catch(err => {
            console.log(err)
            setDialog({
                ...dialog,
                open:true,
                title:"Error obtaining products",
                message:"Please try reloading the page",
                actions:[
                    {
                        label:"Retry",
                        execute:() => {
                            window.location.reload()
                        }
                    },
                    {
                        label:"Cancel",
                        execute:() => {
                            navigate(`${user.uid}/${user.role}`)
                        }
                    }
                ]
            })
        }) 
    },[])

    useEffect(() => {
        if(mix.products.length >1){
            console.log(mix.products)
            //*The limit sum of amounts should be 100%
            const total = mix.products.reduce((prev, curr) => {
                let prevObj
                if(typeof prev === "object"){
                    prevObj = Number(prev.amount)
                } else {
                    prevObj = Number(prev)
                }
                return Number(curr.amount) + prevObj
            })
            console.log(total)
            if(total >= 100){
                //*Disable button
                setCanAdd(false)
            }
        }
    }, [mix])


    
    //*********** STEPPER

    const handleNext = () => {
        /*setShowFinal(true)
        const {mappedErrors} = mapErrors(inputValue)
        console.log(mappedErrors)
        console.log(Object.values(mappedErrors).some((obj) => obj.failed))
        if(Object.values(mappedErrors).some((obj) => obj.failed)){
            return setError({
                    ...error,
                    ...mappedErrors
            })
        }*/

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        
    };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    
    const handleReset = () => {
        setActiveStep(0);
    };
    const isLastStep = (index) => {
        return index == DUMMY_Task.steps.length - 1

    };

    

    const getStepContent = (step,index) => {
        return ( 
            <>
            <Typography sx={{display:{xs:"none", sm:"flex"}}}>{step.description}</Typography>
            <Box sx={{ mb: 2 }}>
                <div>
                    <Button
                        variant="contained"
                        onClick={isLastStep(index) ? handleSendMixData : handleNext}
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
                        onClick={isLastStep(index) ? handleSendMixData : handleNext}
                        sx={()=>({...BV_THEME.button.standard})}
                        
                    >
                        {isLastStep(index) ? 'Finish Task' : 'Continue'}
                    </Button>
                    
                    
                
            </Box>
        )

    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const DUMMY_Task = {
        assigned:true,
        currentStep:0,
        completed:false,
        orders:["test"],
        details:{title:"Task 1", description: "Task 1 Description",steps:"",tools:"",admin:"El gf"},
        product:[
            {
                name:"",
                image:"",
                desc:"",
                status:"",
                seed:"",
                provider:"",
                price:{amount:1,packageSize:25},
                mix:{isMix:true,
                products:{strain:"",amount:.5}},
                parameters:{day:3,night:4,seedingRate:1.35,harvestRate:5}
            },
            {
                name:"",
                image:"",
                desc:"",
                status:"",
                seed:"",
                provider:"",
                price:{amount:1,packageSize:25},
                mix:{isMix:true,
                products:{strain:"",amount:.5}},
                parameters:{day:3,night:4,seedingRate:1.35,harvestRate:5}
            },
        ],
        steps:[
            {step:0,assigned:"estempleado",status:"To-do",estimated:0},
            {step:1,assigned:"estempleado",status:"To-do",estimated:2},
            {step:2,assigned:"estempleado",status:"To-do",estimated:5},
            {step:3,assigned:"estempleado",status:"To-do",estimated:5}
        ],
        type:"harvesting",

    }
    const DUMMY_Task2 = {
        assigned:true,
        currentStep:0,
        completed:false,
        orders:["test"],
        details:{title:"Task 1", description: "Task 1 Description",steps:"",tools:"",admin:"El gf"},
        product:[
            {
                name:"",
                image:"",
                desc:"",
                status:"",
                seed:"",
                provider:"",
                price:{amount:1,packageSize:25},
                mix:{isMix:true,
                products:{strain:"",amount:.5}},
                parameters:{day:3,night:4,seedingRate:1.35,harvestRate:5}
            },
            {
                name:"",
                image:"",
                desc:"",
                status:"",
                seed:"",
                provider:"",
                price:{amount:1,packageSize:25},
                mix:{isMix:true,
                products:{strain:"",amount:.5}},
                parameters:{day:3,night:4,seedingRate:1.35,harvestRate:5}
            },
        ],
        steps:[
            {step:0,assigned:"estempleado",status:"To-do",estimated:0},
            {step:1,assigned:"estempleado",status:"To-do",estimated:2},
            {step:2,assigned:"estempleado",status:"To-do",estimated:5},
            {step:3,assigned:"estempleado",status:"To-do",estimated:5}
        ],
        type:"seeding",

    }
    const DUMMY_Order = {
        id:"GENERADA-80085",
        organization:"ourClients",
        customer:"theirClient",
        type:"idk",
        packages:3,
        price:5,
        end:"30/08/22",      
        tasks:[DUMMY_Task,DUMMY_Task2],       
        products: [{
                _id:    "",
                status: "",
                trays:  .5,
                seedId: "lasemilla",
                batch:  "huh"
            }],
        status:"incomplete"

    }

  return (
    <div style={{}}>
        <UserDialog
        dialog={dialog}
        setDialog={setDialog}
        open={dialog.open}
        title={dialog.title} 
        content={dialog.message}
        actions={dialog.actions}
        />
        
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
                        {DUMMY_Task.steps.map((step, index) => (
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
                    {activeStep === DUMMY_Task.steps.length && (
                        <Paper square elevation={0} sx={{ p: 3 }}>
                            <Typography>All steps completed - you&apos;re finished</Typography>
                            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                                Reset
                            </Button>
                        </Paper>
                        
                    )}
                </Box>
                                    
                <Box sx={{ width:{xs:"90%",sm:"65%"}, display:"flex", flexDirection:"column", padding:"5%", alignItems:"center" }}>
                           
                    {<StepDisplay type={DUMMY_Task.type} index={activeStep} task={DUMMY_Task}/>}
                </Box>
                        

                    
                        
            </Box>
        </Box>
                        
    </div>
    



  )
}
