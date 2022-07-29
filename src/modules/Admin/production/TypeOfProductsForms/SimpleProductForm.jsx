import React, { useState } from 'react'
//*MUI components
import { Button, TextField, useTheme, Fab, AutoComplete, Typography, Stepper, Step, StepLabel, StepContent, Paper, Tooltip, IconButton} from '@mui/material'
import CameraIcon from '@mui/icons-material/AddPhotoAlternate';
import { Box } from '@mui/system'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NightsStayTwoToneIcon from '@mui/icons-material/NightsStayTwoTone';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

//*THEME
import { UserDialog } from '../../../../CoreComponents/UserFeedback/Dialog.jsx'
import { BV_THEME } from '../../../../theme/BV-theme.js'

//*Network and API
import api from '../../../../axios.js'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import useAuth from '../../../../contextHooks/useAuthContext.js';
import { ProductsPrice } from '../components/ProductsPrice.jsx';
import { ProductsTime } from '../components/ProductsTime.jsx';
//Stepper
// import VerticalLinearStepper from './StepperTest.jsx';

export const SimpleProductForm = ({editing, product}) => {
    //*UTILS
    const theme = useTheme(BV_THEME)
    const navigate = useNavigate()
    const {user} = useAuth()

    //*DATA STATES
    const [productData, setProductData] = useState({
        name:editing ? product.name : "",
        label:editing ? product.img : "",
        price:editing ? product.price : [{amount:undefined,packageSize:25}, {amount:undefined,packageSize:80}, {amount:undefined,packageSize:1000}],
        seedId:editing ? product.seedId : "",
        provider:editing ? product.provider : "",
        providerSeedName:editing ? product.provider : "",
        day:editing ? product.parameters.day : "",
        night:editing ? product.parameters.night : "",
        cycleType: "",
        seeding:editing ? product.parameters.seedingRate : "",
        harvest:editing ? product.parameters.harvestRate : "",
        status:editing ? product.status : ""
    })

    //*Render states
    const [showTimes, setShowTimes] = useState(false)
    const [dialog, setDialog] = useState({
        open:false,
        title:"",
        message:"",
        actions:[]
    })
    const [selectedPackage, setSelectedPackage] = useState({amount:null,packageSize:25}) 
    const [activeStep, setActiveStep] = useState(0)

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
        if(error[e.target.id] && error[e.target.id].failed){
            setError({
                ...error,
                [e.target.id]:{
                    failed:false,
                    message:""
                }
            })
        }
        
        if(e.target.id === "price"){
            // Array.prototype.findIndex
            const index = productData.price.findIndex((obj) => {
                return obj.packageSize === selectedPackage.packageSize
            })
            setProductData(current => {
                const price = current.price.map((obj, idx) => {
                    if(idx === index) {
                        return {...obj, amount:e.target.value}
                    }
                    return obj
                })
                return {...current, price:price} 
            })
            return
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
    
    const mapErrors = () => {
        const errors = []
        Object.entries(productData).forEach((val, index) => {
            console.log(val)
            console.log((val[1] === "" || val[1] === null || val[1] === undefined))
            if((val[1] === "" || val[1] === null || val[1] === undefined) && val[0] !== "label"){
                errors.push(val)
            }
        })
        let errorMapped
        errors.forEach((err) => {
            errorMapped = {
                ...errorMapped,
                [err[0]]:{
                    failed:true,
                    message:"Please correct or fill this value."
                }
            }
        })

        return {errors, errorMapped}
    }

    const handleComplete = () => {
        
        const {errors, errorMapped} = mapErrors()
        console.log(errors)
        if(errors.length>0){
            setError({
                ...error,
                ...errorMapped
            })
            setDialog({
                ...dialog,
                open:true,
                title:"You cannot save an uncomplete product",
                message:"Please complete the values marked.",
            })
            return
        }

        console.log(productData)
        //     //*Request if is creating product
        //     api.api.post(`${api.apiVersion}/products/`, mappedProduct)
        //     .then(response => {
        //         setDialog({
        //             ...dialog,
        //             open:true,
        //             title:"Product created succesfully",
        //             message:"What do you want to do?",
        //             actions:[
        //                 {
        //                     label:"Create another",
        //                     execute: () => {
        //                         window.location.reload()
        //                     }
        //                 },
        //                 {
        //                     label:"Exit",
        //                     execute: () => {
        //                         navigate(`/${user.uid}/${user.role}/production`)
        //                     }
        //                 },
        //             ]
        //         })       
        //     })
        //     .catch(err => {
        //         setDialog({
        //             ...dialog,
        //             open:true,
        //             title:"Error adding product",
        //             message:"What do you want to do?",
        //             actions:[
        //                 {
        //                     label:"Try again",
        //                     execute: () => {
        //                         window.location.reload()
        //                     }
        //                 },
        //                 {
        //                     label:"Cancel",
        //                     execute: () => {
        //                         navigate(`/${user.uid}/${user.role}/production`)
        //                     }
        //                 },
        //             ]   
        //         })
        //     })
        // }
    }


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
      
    const handleNext = () => {
        const {errors, errorMapped} = mapErrors()
        if(errors.length > 0 ){
            let failed
            switch(activeStep){
                case 0:
                    if(errorMapped["name"]){
                        setError({
                            ...error,
                            ...errorMapped
                        })
                        return
                    }
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                    break;
                case 1:
                    failed = errorMapped["seeding"] || errorMapped["harvest"] || errorMapped["day"] || errorMapped["night"] || errorMapped["price"]
                    if(failed){
                        setError({
                            ...error,
                            ...errorMapped
                        })
                        return
                    }
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                    break;
                case 2:
                    failed = errorMapped["seedId"] || errorMapped["provider"] || errorMapped["status"]
                    if(failed){
                        setError({
                            ...error,
                            ...errorMapped
                        })
                        return
                    }
                default:
                    break;
            }
        }

        setActiveStep((prev) => prev + 1)
        
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
            <Typography>{step.description}</Typography>
            <Box sx={{ mb: 2 }}>
                <div>
                    <Button
                        variant="contained"
                        onClick={isLastStep(index) ? handleComplete : handleNext}
                        sx={()=>({...BV_THEME.button.standard,mt: 1, mr: 1,})}
                        
                    >
                        {isLastStep(index) ? 'Save Product' : 'Continue'}
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

    // useEffect(() => {
    //     console.log(error)
    // },[error])
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
            <Box sx={{ width: "90%", display:"flex", flexDirection:"row" }}>
                <Box sx={{ width: "35%" }}>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel 
                                sx={{fontSizeAdjust:"20px"}}
                            >
                                {step.label}
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
                    
                <Box sx={{ width: "65%", display:"flex", flexDirection:"column", padding:"5%", alignItems:"center" }}>
                    {
                    activeStep === 0 ? (
                        <>
                        <TextField defaultValue={editing ? product.name : undefined} value={productData.name} helperText={error.name.message} error={error.name.failed} id="name" onChange={handleChangeProductData} label="Product name" sx={theme.input.mobile.fullSize.desktop.fullSize}/>
                        <Fab color="primary" component="label" id="label" aria-label="add" sx={{marginY:"4%"}} size="large" helpertext="Label">
                            <input  type="file" accept="image/*" onChange={handleChangeLabel} hidden />
                            <CameraIcon />
                        </Fab>
                        </>
                        ) : null
                    }
                    {
                    activeStep === 1 ? (
                        <>
                        <TextField defaultValue={editing ? product.parameters.seedingRate : undefined} value={productData.seeding} helperText={error.seeding.message} error={error.seeding.failed} id="seeding" type="number" onChange={handleChangeProductData} label="Seeding" sx={theme.input.mobile.fullSize.desktop.fullSize}/>
                        <TextField defaultValue={editing ? product.parameters.harvestRate : undefined} value={productData.harvest} helperText={error.harvest.message} error={error.harvest.failed} id="harvest" type="number" onChange={handleChangeProductData} label="Harvest" sx={theme.input.mobile.fullSize.desktop.fullSize}/>
                        {/* <TextField defaultValue={editing ? product.parameters.harvestRate : undefined} helperText={error.harvest.message} error={error.harvest.failed} id="day" type="number" onChange={handleChangeProductData} label="Day" sx={theme.input.mobile.fullSize.desktop.fullSize}/>
                        <TextField defaultValue={editing ? product.parameters.harvestRate : undefined} helperText={error.harvest.message} error={error.harvest.failed} id="night" type="number" onChange={handleChangeProductData} label="Night" sx={theme.input.mobile.fullSize.desktop.fullSize}/> */}
                        <ProductsTime productData={productData} setProductData={setProductData}/>
                        
                        <ProductsPrice
                        productData={productData} 
                        handleChangeProductData={handleChangeProductData}
                        setSelectedPackage={setSelectedPackage}
                        selectedPackage={selectedPackage}
                        editing={editing}
                        product={product}
                        error={error}
                        />
                        <TextField defaultValue={editing ? product.parameters.status : undefined} value={productData.status} helperText={error.harvest.message} error={error.harvest.failed} id="status" type="text" onChange={handleChangeProductData} label="Status" sx={theme.input.mobile.fullSize.desktop.fullSize}/>
                        </>
                        ) : null
                    }
                    {
                    activeStep === 2 ? (
                        <>
                        <TextField defaultValue={editing ? product.seedId : undefined}  value={productData.seedId} helperText={error.seedId.message} error={error.seedId.failed} id="seedId" onChange={handleChangeProductData} label="SeedID" sx={theme.input.mobile.fullSize.desktop.fullSize}/>
                        <TextField defaultValue={editing ? product.provider : undefined} value={productData.providerSeedName} helperText={error.provider.message} error={error.provider.failed} id="providerSeedName" onChange={handleChangeProductData} label="Official product name" sx={theme.input.mobile.fullSize.desktop.fullSize}/>
                        <TextField defaultValue={editing ? product.provider : undefined} value={productData.provider}  helperText={error.provider.message} error={error.provider.failed} id="provider" onChange={handleChangeProductData} label="Email / route" sx={theme.input.mobile.fullSize.desktop.fullSize}/>
                        </>
                        ) : null
                    }
                </Box>
            </Box>
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
)}