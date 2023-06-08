import React, { useState, useEffect, useRef } from 'react'

//*COMPONENTS FROM MUI
import { 
    Autocomplete, Box, Button, 
    TextField, Typography, useTheme, 
    Fab, Fade,
    Stepper, Step, StepLabel, StepContent, Paper, InputAdornment, 
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import CameraIcon from '@mui/icons-material/AddPhotoAlternate';

//*THEME
import { BV_THEME } from '../../../../theme/BV-theme'
import { UserDialog } from '../../../../CoreComponents/UserFeedback/Dialog'
//*NETWORK AND API
import { useNavigate } from 'react-router-dom'
//*Auth
import useAuth from '../../../../contextHooks/useAuthContext'
//*App components
import { ProductsPrice } from '../components/ProductsPrice';
import { borderColor } from '@mui/system';
// CUSTOM HOOKS
import useProducts from '../../../../hooks/useProducts';

export const MixProductsForm = ({editing, product}) => {
    const theme = useTheme(BV_THEME);
    //* STEPPER
    const [activeStep, setActiveStep] = useState(0)
    
    //*DATA STATES
    const [strains, setStrains] = useState([])
    const [mix, setMix] = useState({
        products: editing ? product.mix.products : [],
        label: null,
        cost:0
    })

    //*RENDER STATES
    const [inputValue, setInputValue] = useState({
        strain:         "",
        amount:         "",
        label:          "",
        smallPrice:     editing ? product.price[0].amount : "",
        mediumPrice:    editing ? product.price[1].amount : "",
        name:           editing ? product.name : ""
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
        smallPrice:{
            failed:false,
            message:""
        },
        mediumPrice:{
            failed:false,
            message:""
        }
    })

    const handleDeleteProduct = (product)=>{
        console.log("antes",mix.products)

          let arr = mix.products.filter(prod =>{
            if(editing)
                return prod.strain != product.strain 
            else
                return prod.product.name != product.product.name
          })

          setMix({
            ...mix,
            products:arr
            
        })
        
        console.log("despues",mix.products)
        console.log("tempArr",arr)
        
    }

    const {user, credential} = useAuth()
    let headers = {
        authorization:credential._tokenResponse.idToken,
        user:user
    }
    const { addMixProduct, getProducts } = useProducts(headers)
    const navigate = useNavigate()

    const getProductName=(strain)=>{
        console.log("id a buscar",strain)
        let testName = JSON.parse(localStorage.getItem('products')).find((prod) => prod._id === strain)
        console.log("testName",testName)
        if(testName !== undefined )
        return testName.name
    }
    
    const handleInputChange = (e,v,r) => {
        
        let id
        
        if(e.target.id.includes('-')){
            id = e.target.id.split('-')[0]
        } else {
            id = e.target.id
        }

        switch(id){
            case "25":
                id = "smallPrice"
                console.log(v)
                break;
            case "80":
                id = "mediumPrice"
                console.log("80",v)
                break;
            case "name":

            default:
                break;
        }

        {editing ? null:null}


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
        const errors = []
        
        const valuesMapped = Object.entries(object).map((entry, idx) => {
            if(activeStep === 0) {
                if(entry[0] === "strain" && (entry[1] === "" || entry[1] === null || entry[1] === undefined)){
                    errors.push(entry[0])
                    
                    return {
                        [entry[0]]:{
                            failed:true,
                            message:"Please select a strain"
                        }
                    }
                }
                if(entry[0] === "amount" && (entry[1] === "" || entry[1] === null || entry[1] === undefined || entry[1] === 0)){
                    errors.push(entry[0])
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

        return {errors, mappedErrors}
    }
    
    const handleAddToMixComb = () => {
        const {errors, mappedErrors} = mapErrors(inputValue)
        if(errors.length >0) {
            setError({
                ...error,
                ...mappedErrors
            })
            return
        }
        
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
        

        setInputValue({
            ...inputValue,
            strain: "",
            amount: ""
        })
        return
    }
    // const handleChangeFinalData = (e) => {
    //     setMix({
    //         ...mix,
    //         [e.target.id]:e.target.value            
    //     })
    // }

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
        let mappedProducts
        if(mix.products.length>0){
            mappedProducts = mix.products.map((prod) => {
                return {strain:prod.product._id, amount: Number(prod.amount)}
            })
        } else {
            return
        }
        
        const model = {
            name:   inputValue.name,
            price:   [
                {
                    amount:inputValue.smallPrice,
                    packageSize: 25
                },
                {
                    amount:inputValue.mediumPrice,
                    packageSize: 80
                },
            ], // * Cost per tray,
            mix: {
                isMix:      true,
                products:   mappedProducts
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
        
        addMixProduct(model)
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
        getProducts()
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
        if(mix.products.length >0){
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
            }else(
                setCanAdd(true)
            )
        }
    }, [mix])

    //*********** STEPPER
    const steps = [
        {
          label: 'Set strains in Mix',
          description: `Please enter the strains in your Mix`,
        },
        {
          label: 'Mix Name and Price',
          description:
            'Please provide the name of your mix and the price to use',
        },
    ];
      
    const handleNext = () => {
        setShowFinal(true)
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


    console.log("strains",strains)

    

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
                        {isLastStep(index) ? 'Save Mix' : 'Continue'}
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
                        {isLastStep(index) ? 'Save Mix' : 'Continue'}
                    </Button>
                    
                    
                
            </Box>
        )

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
        
        <Fade in={true} timeout={1000} unmountOnExit>
        
        <Box sx={{display:"flex", width:"100%", marginTop:"5vh",justifyContent:"center",justifyItems:"center", alignItems:"center", flexDirection:"column"}}>
        
        
        
        
            <Box sx={{ width: "90%", display:"flex", flexDirection:{xs:"column",sm:"row"} }}>
                
                {/*Mobile Stepper controls */}            
                <Box justifyContent={"space-evenly"} sx={{ width: "90%", display:{xs:"flex", sm:"none"}}}>
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

                {/*Desktop Stepper controls */}
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

                {/* Forms */}  
                <Box sx={{ width:{xs:"90%",sm:"65%"}, display:"flex", flexDirection:"column", padding:"5%", alignItems:"center" }}>
                    {getMobileStepperButtons(activeStep)}
                            
                            
                {
                    activeStep === 0 ? (
                        <>
                        <Box sx={
                                {
                                    display:"flex",
                                    width:"100%", 
                                    justifyContent:"center",
                                    marginTop:"5vh", 
                                    flexDirection:"column",
                                    alignItems:"center"
                                }
                                }
                            >
                            <Autocomplete
                                options={strains}
                                id="strain"
                                renderInput={(params) => {
                                    return <TextField helperText={error.strain.message} error={error.strain.failed} {...params} label="Strain"/>
                                }}
                                getOptionLabel={(option) => {
                                    if(!option.name){
                                        return ""
                                    }
                                    return option.name
                                }}
                                isOptionEqualToValue={(o,v) => {
                                    if(v === ""){
                                        return true
                                    }

                                    return o.name === v.name
                                }}
                                onChange={(e,v,r) => handleInputChange(e, v, r)}
                                sx={theme.input.mobile.fullSize.desktop.halfSize}
                                value={inputValue.strain}   
                            />

                            <TextField
                                id="amount"
                                label="Percentage"
                                ref={ref}
                                type="number"
                                InputProps={{endAdornment: <InputAdornment position="end">%</InputAdornment>}}
                                onChange={(e) => handleInputChange(e, e.target.value, "input")}
                                sx={theme.input.mobile.twoThirds.desktop.quarterSize}
                                error={error.amount.failed}
                                helperText={error.amount.message}
                                value={inputValue.amount}
                            />
                            <Typography align='center' color={theme.textColor.lightGray}>Minimum Strains : 2</Typography>
                        </Box>


                            <Box sx={
                                {
                                    display:"flex",
                                    width:{xs:"66%", sm:"34%"}, 
                                    justifyContent:"space-evenly",
                                    marginTop:"5vh", 
                                    flexDirection:{xs:"row", sm:"column"},
                                    alignItems:"center",
                                }
                            }>
                                <Fab onClick={handleAddToMixComb} disabled={!canAdd} color="primary" aria-label="add" >
                                    <AddIcon />
                                </Fab>

                                <Typography margin={"4%"} color={theme.textColor.darkGray}>Mix Length : {mix.products.length}</Typography>

                                

                            </Box>

                            <Box sx={
                                {
                                display:"flex", 
                                alignItems:"center", 
                                justifyContent:"center",
                                marginTop:"5vh",
                                width:"100%"

                                }
                            }>
                            <Button variant="contained" size='large' disabled={showFinal} onClick={handleSetMix}>
                                Set Mix
                            </Button>

                            

                        </Box>

                        {/* Generate Feedback table */}
                        {mix.products.length != 0 ? 
                            <Box  sx={{display:"inline-block",minWidth:"15em",textAlign:"justify",alignItems:"center",marginTop:"10vh",padding:"3px"}}>
                                <hr color="secondary"/>
                                <Typography color="secondary" sx={{textAlign:"center",marginTop:1}}>Products in Mix</Typography>
                                {mix.products.map((product,id)=>{
                                    return (
                                        <Box key={id} sx={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:3}}>
                                            <Typography sx={{flex:1}}>
                                                {product.amount}% {product.product?.name.toString()} {getProductName(product.strain)}
                                            </Typography>
                                            <Button variant="contained" onClick={()=>handleDeleteProduct(product)}>
                                                Delete
                                            </Button>
                                        </Box>
                                    )
                                })}

                            </Box>
                            :
                            null
                        }
                        </>
                    ) : null
                }

                            
                            
                            

                        

                        {
                            activeStep === 1
                            ?
                            ( <>
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
                                        <TextField label="Mix Name" id="name" value={inputValue.name} onChange={(e) => handleInputChange(e, e.target.value, "input")} variant="outlined" sx={theme.input.mobile.fullSize.desktop.halfSize}>
                                            
                                        </TextField>

                                        <ProductsPrice
                                        productData={inputValue}
                                        handleChangeProductData={handleInputChange}
                                        editing={editing}
                                        editValues={editing ? product.price:[]} 
                                        error={error}
                                        mix={true}
                                        />    
                                </Box>
                                <Box sx={
                                    {
                                        display:"flex", 
                                        alignItems:"center", 
                                        justifyContent:"center",
                                        width:"100%",
                                        flexDirection:"column"

                                    }
                                }>

                                        <Fab color="primary" component="label" id="label" aria-label="add" sx={{marginY:"4%"}} >
                                            <input  type="file" accept="image/*" onChange={handleChangeLabel} hidden />
                                            <CameraIcon />
                                        </Fab>
                                    
                                    <Button variant="contained" onClick={handleSendMixData} size='large' >
                                        Save product mix
                                    </Button>

                                </Box>
                            </>):
                            null
                        }
                        </Box>
                        

                    
                        
                        </Box>
        </Box>
        </Fade>                
    </div>
    



  )
}
