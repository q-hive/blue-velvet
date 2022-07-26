import React, { useState } from 'react'
//*MUI components
import { Button, TextField, useTheme, Fab, Typography, Stepper, Step, StepLabel, StepContent, Paper, Tooltip, IconButton} from '@mui/material'
import CameraIcon from '@mui/icons-material/AddPhotoAlternate';
import { Box } from '@mui/system'

//*THEME
import { UserDialog } from '../../../../CoreComponents/UserFeedback/Dialog.jsx'
import { BV_THEME } from '../../../../theme/BV-theme.js'

//*Network and API
import api from '../../../../axios.js'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import useAuth from '../../../../contextHooks/useAuthContext.js';

export const SimpleProductForm = ({editing, product}) => {
    //*UTILS
    const theme = useTheme(BV_THEME)
    const navigate = useNavigate()
    const {user} = useAuth()

    

    //*DATA STATES
    const [productData, setProductData] = useState({
        name:editing ? product.name : "",
        label:editing ? product.img : "",
        price:editing ? product.price : null,
        seedId:editing ? product.seedId : "",
        provider:editing ? product.provider : "",
        day:editing ? product.parameters.day : null,
        night:editing ? product.parameters.night : null,
        seeding:editing ? product.parameters.seedingRate : null,
        harvest:editing ? product.parameters.harvestRate : null,
        status:editing ? product.status : ""
    })
    
    //*Render states
    const [stepBtnLabel, setStepBtnLabel] = useState("Accept")
    const [showTimes, setShowTimes] = useState(false)
    const [dialog, setDialog] = useState({
        open:false,
        title:"",
        message:"",
        actions:[]
    })
    //*TODO REFACTOR ERROR STATES IN ORDER TO BE MORE EFFICIENT WITH MEMORY
    const [error, setError] = useState({
        name:{
            failed:false,
            message:""
        },
        label:{
            failed:false,
            message:""
        },
        price:{
            failed:false,
            message:""
        },
        seedId:{
            failed:false,
            message:""
        },
        provider:{
            failed:false,
            message:""
        },
        day:{
            failed:false,
            message:""
        },
        night:{
            failed:false,
            message:""
        },
        seeding:{
            failed:false,
            message:""
        },
        harvest:{
            failed:false,
            message:""
        },
        status:{
            failed:false,
            message:""
        },
    })
    
    const handleChangeProductData = (e) => {
        if(error[e.target.id].failed){
            setError({
                ...error,
                [e.target.id]:{
                    failed:false,
                    message:""
                }
            })
        }
        
        setProductData({
            ...productData,
            [e.target.id]:e.target.value
        })
    }

    const handleChangeLabel = (e) => {
        setProductData({
            ...productData,
            label:e.target.files[0]
        })
    }
    
    const handleComplete = () => {
        const errors = []
        Object.entries(productData).forEach((val) => {
            if((val[1] === "" || val[1] === (null || undefined)) && val[0] !== "label"){
                if((val[0] === "day" || val[0] === "night" || val[0] === "status") && !showTimes) {
                    console.log("Parameters should not be inserted into array because the component is not displayed")
                    return
                }
                
                errors.push(val)
            }
        })

        if(errors.length > 0 ){
            let errorMapped
            errors.forEach((err) => {
                console.log(err)
                errorMapped = {
                    ...errorMapped,
                    [err[0]]:{
                        failed:true,
                        message:"Please correct or fill this value."
                    }
                }
            })
            setError({
                ...error,
                ...errorMapped
            })
            return
        }
        
        if(errors.length === 0 && !showTimes) {
            setShowTimes(!showTimes)
            setStepBtnLabel("Save product")
        }

        if(errors.length === 0 && showTimes){
            console.log("Time to save the product")
            console.log(productData)
            const mappedProduct = {
                name:productData.name,
                label:productData.label,
                price:Number(productData.price),
                seedId:productData.seedId,
                provider:productData.provider,
                status:productData.status,
                parameters: {
                    day:Number(productData.day),
                    night:Number(productData.night),
                    seedingRate:Number(productData.seeding),
                    harvestRate:Number(productData.harvest)
                }
            }
            if(editing) {
                api.api.patch(`${api.apiVersion}/products/?id=${product._id}`, {value:mappedProduct})
                .then((response) => {
                    setDialog({
                        ...dialog,
                        open:true,
                        title:"Product updated succesfully",
                        message:"What do you want to do?",
                        actions:[
                            {
                                label:"Try another",
                                execute: () => {
                                    navigate(`/${user.uid}/${user.role}/production`)
                                }
                            },
                            {
                                label:"Finish",
                                execute: () => {
                                    navigate(`/${user.uid}/${user.role}/dashboard`)
                                }
                            },
                        ]   
                    })
                })
                .catch(err => {
                    setDialog({
                        ...dialog,
                        open:true,
                        title:"Error updating product status",
                        message:"What do you want to do?",
                        actions:[
                            {
                                label:"Try again",
                                execute: () => {
                                    window.location.reload()
                                }
                            },
                            {
                                label:"Cancel",
                                execute: () => {
                                    navigate(`/${user.uid}/${user.role}/production`)
                                }
                            },
                        ]   
                    })
                })
                
                return
            }

            //*Request if is creating product
            api.api.post(`${api.apiVersion}/products/`, mappedProduct)
            .then(response => {
                setDialog({
                    ...dialog,
                    open:true,
                    title:"Product created succesfully",
                    message:"What do you want to do?",
                    actions:[
                        {
                            label:"Create another",
                            execute: () => {
                                window.location.reload()
                            }
                        },
                        {
                            label:"Exit",
                            execute: () => {
                                navigate(`/${user.uid}/${user.role}/production`)
                            }
                        },
                    ]
                })       
            })
            .catch(err => {
                setDialog({
                    ...dialog,
                    open:true,
                    title:"Error adding product",
                    message:"What do you want to do?",
                    actions:[
                        {
                            label:"Try again",
                            execute: () => {
                                window.location.reload()
                            }
                        },
                        {
                            label:"Cancel",
                            execute: () => {
                                navigate(`/${user.uid}/${user.role}/production`)
                            }
                        },
                    ]   
                })
            })
        }
    }
    ////STEPPER

    const steps = [
        {
          label: 'Product Data',
          description: `Please set Name and Label`,
        },
        {
          label: 'Parameters',
          description:
            'Please set seeding rate, harvest rate, the cycle you want to use and the price to charge per category.',
        },
        {
          label: 'Provider',
          description: `Please set the ID of the product, the name of the product as the provider manages it and the provider's E-Mail`,
        },
      ];
      
      {
        const [activeStep, setActiveStep] = useState(0);
      
        const handleNext = () => {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        };
      
        const handleBack = () => {
          setActiveStep((prevActiveStep) => prevActiveStep - 1);
        };
      
        const handleReset = () => {
          setActiveStep(0);
        };
        /////

    

  return (
    <div style={{paddingLeft:"10vw", paddingRight:"10vw"}}>
        <Box sx={
            {
                display:"flex",
                width:"100%", 
                justifyContent:"center",
                marginTop:"5vh", 
                flexDirection:"column",
                alignItems:"center"
            }
        }>
            {
                !showTimes && (
                    <>
                        <TextField defaultValue={editing ? product.name : undefined} helperText={error.name.message} error={error.name.failed} id="name" onChange={handleChangeProductData} label="Product name" sx={theme.input.mobile.fullSize.desktop.thirdSize}/>
                        <TextField defaultValue={editing ? product.parameters.seedingRate : undefined} helperText={error.seeding.message} error={error.seeding.failed} id="seeding" type="number" onChange={handleChangeProductData} label="Seeding" sx={theme.input.mobile.fullSize.desktop.thirdSize}/>
                        <TextField defaultValue={editing ? product.parameters.harvestRate : undefined} helperText={error.harvest.message} error={error.harvest.failed} id="harvest" type="number" onChange={handleChangeProductData} label="Harvest" sx={theme.input.mobile.fullSize.desktop.thirdSize}/>
                        <TextField defaultValue={editing ? product.price : undefined} helperText={error.price.message} error={error.price.failed} id="price" onChange={handleChangeProductData} label="Price" sx={theme.input.mobile.fullSize.desktop.thirdSize}/>
                        <TextField defaultValue={editing ? product.provider : undefined} helperText={error.provider.message} error={error.provider.failed} id="provider" onChange={handleChangeProductData} label="Email / route" sx={theme.input.mobile.fullSize.desktop.thirdSize}/>
                        <TextField defaultValue={editing ? product.seedId : undefined} helperText={error.seedId.message} error={error.seedId.failed} id="seedId" onChange={handleChangeProductData} label="SeedID" sx={theme.input.mobile.fullSize.desktop.thirdSize}/>
                        <Fab color="primary" component="label" id="label" aria-label="add" sx={{marginY:"4%"}} size="large">
                            <input  type="file" accept="image/*" onChange={handleChangeLabel} hidden />
                            <CameraIcon />
                        </Fab>
                    </>    
                )
            }
            {
                showTimes && ( 
                    <>
                    
                        
                <Box sx={{ width: "60%", display:"flex", flexDirection:"row" }}>
                    <Box sx={{ width: "35%" }}>
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {steps.map((step, index) => (
                            <Step key={step.label}>
                                <StepLabel 
                                    optional={
                                        index === steps.length - 1 ? (
                                        <Typography variant="caption">Last step</Typography>
                                        ) : null
                                    }
                                    sx={{fontSizeAdjust:"20px"}}
                                >
                                    {step.label}
                                </StepLabel>
                                <StepContent>
                                <Typography>{step.description}</Typography>
                                <Box sx={{ mb: 2 }}>
                                    <div>
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
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
    <Box sx={{ width: "65%", display:"flex", flexDirection:"column", padding:"5%", alignItems:"center" }}>
        {
        activeStep === 0 ? (
            <TextField defaultValue={editing ? product.name : undefined} helperText={error.name.message} error={error.name.failed} id="name" onChange={handleChangeProductData} label="Product name" sx={theme.input.mobile.fullSize.desktop.fullSize}/>
        
            ) : null
        }
        {
        activeStep === 1 ? (
            <>
            <TextField defaultValue={editing ? product.parameters.seedingRate : undefined} helperText={error.seeding.message} error={error.seeding.failed} id="seeding" type="number" onChange={handleChangeProductData} label="Seeding" sx={theme.input.mobile.fullSize.desktop.fullSize}/>
            <TextField defaultValue={editing ? product.parameters.harvestRate : undefined} helperText={error.harvest.message} error={error.harvest.failed} id="harvest" type="number" onChange={handleChangeProductData} label="Harvest" sx={theme.input.mobile.fullSize.desktop.fullSize}/>
            <TextField defaultValue={editing ? product.price : undefined} helperText={error.price.message} error={error.price.failed} id="price" onChange={handleChangeProductData} label="Price" sx={theme.input.mobile.fullSize.desktop.fullSize}/>
            </>
            ) : null
        }
        {
        activeStep === 2 ? (
            <>
            <TextField defaultValue={editing ? product.seedId : undefined} helperText={error.seedId.message} error={error.seedId.failed} id="seedId" onChange={handleChangeProductData} label="SeedID" sx={theme.input.mobile.fullSize.desktop.fullSize}/>
            <TextField defaultValue={editing ? product.provider : undefined} helperText={error.provider.message} error={error.provider.failed} id="provider" onChange={handleChangeProductData} label="Email / route" sx={theme.input.mobile.fullSize.desktop.fullSize}/>
            </>
            ) : null
        }

    </Box>
    
    </Box></>)}
    <Button variant="contained" size="large" onClick={handleComplete}>{stepBtnLabel}</Button>
        </Box>



        
        

        <UserDialog
        dialog={dialog}
        setDialog={setDialog}
        open={dialog.open}
        title={dialog.title}
        content={dialog.message} 
        actions={dialog.actions}
        />
        
    </div>
  )
}}
