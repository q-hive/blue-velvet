import React, { useState } from 'react'
//*MUI components
import { Button, TextField, useTheme, Fab, AutoComplete, Typography, Stepper, Step, StepLabel, StepContent, Paper, Fade, IconButton} from '@mui/material'
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
    const {user, credential} = useAuth()

    //*DATA STATES
    const [productData, setProductData] = useState({
        name:               editing ? product.name : "",
        label:              editing ? product.img : "",
        smallPrice:         editing ? product.price.find((price) => price.packageSize === 25).amount      : "",     
        mediumPrice:        editing ? product.price.find((price) => price.packageSize === 80).amount      : "",
        seedId:             editing ? product.seedId : "",
        provider:           editing ? product.provider : "",
        providerSeedName:   editing ? product.provider : "",
        day:                editing ? product.parameters.day : "",
        night:              editing ? product.parameters.night : "",
        //*HANDLE PRODUCSTS CYCLE TYPE
        cycleType:          "",
        seeding:            editing ? product.parameters.seedingRate : "",
        harvest:            editing ? product.parameters.harvestRate : "",
        status:             editing ? product.status : ""
    })

    //*Render states
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
        smallPrice:{
            failed:false,
            message:""
        },
        mediumPrice:{
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
        

        switch(e.target.id){
            case "25":
                setProductData({
                    ...productData,
                    smallPrice:Number(e.target.value)
                })
                break;
            case "80":
                setProductData({
                    ...productData,
                    mediumPrice:Number(e.target.value)
                })
                break;
            case "1000":
                setProductData({
                    ...productData,
                    largePrice:Number(e.target.value)
                })
                break;
            default:
                setProductData({
                    ...productData,
                    [e.target.id]:e.target.value
                })
                break;

        }
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

    const saveProduct = (mappedProduct) => {
        api.api.post(`${api.apiVersion}/products/`, mappedProduct, {
            headers:{
                authorization:credential._tokenResponse.idToken,
                user:user,
            }
        })
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

    const handleComplete = () => {
        
        const {errors, errorMapped} = mapErrors()
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

        //*Request if is creating product
        const mappedProduct = {
            name:       productData.name,
            // image:      { type: String,   required: false },     // *TODO MANAGE IMAGE PROCESSING
            // desc:       { type: String,   required: false },     // * Description
            status:     productData.status,
            // * ID of quality of the seeds - track the seeds origin - metadata 
            seed:       { 
                        seedId:         productData.seedId, 
                        seedName:       productData.providerSeedName
            }, //* SEND THE SEED ID AND CREATE IT IN THE DATABASE 
            provider:   { 
                        email:          productData.provider, 
                        name:           productData.provider
            }, //* SEND THE PROVIDER DATA AND CREATE FIRST IN DB
            price:      [
                {
                    amount:         productData.smallPrice,
                    packageSize:    25
                },
                {
                    amount:         productData.mediumPrice,
                    packageSize:    80
                },
            ], 
            mix:        { isMix:        false},
            parameters: {
                         day:            Number(productData.day),       // * In days check email
                         night:          Number(productData.night),     // * In days check email
                         seedingRate:    Number(productData.seeding),   // * Per tray
                         harvestRate:    Number(productData.harvest)    // * Per tray
            }
        }

        saveProduct(mappedProduct)
            
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

            return
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
            <Typography sx={{display:{xs:"none", sm:"flex"}}}>{step.description}</Typography>
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
                        onClick={isLastStep(index) ? handleComplete : handleNext}
                        sx={()=>({...BV_THEME.button.standard})}
                        
                    >
                        {isLastStep(index) ? 'Save Product' : 'Continue'}
                    </Button>
                    
                    
                
            </Box>
        )

    }

    // useEffect(() => {
    //     console.log(error)
    // },[error])
  return (
    <div style={{width:"100%"}}>
        <Fade in={true} timeout={1000} unmountOnExit>
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
            <Box sx={{ width: "90%", display:"flex", flexDirection:{xs:"column",sm:"row"} }}>
            
                <Box sx={{ width: "90%", display:{xs:"flex", sm:"none"}}}>
                    <Stepper activeStep={activeStep} >
                            {steps.map((step, index) => (
                            <Step key={step.label}>
                                <StepLabel sx={{fontSizeAdjust:"20px"}}>
                                    {step.label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                <Box sx={{ width: "35%", display:{xs:"none", sm:"inline-block"}}}>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel sx={{fontSizeAdjust:"20px"}}>
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
                    
                <Box sx={{ width:{xs:"90%",sm:"65%"}, display:"flex", flexDirection:"column", padding:"5%", alignItems:"center" }}>
                    {getMobileStepperButtons(activeStep)}
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
                        editing={editing}
                        product={product}
                        error={error}
                        sx={theme.input.mobile.halfSize.desktop.halfSize}
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
        </Fade>

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