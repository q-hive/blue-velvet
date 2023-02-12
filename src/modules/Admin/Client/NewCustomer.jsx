import React, {useState} from 'react'
//*MUI Components
import { 
    Autocomplete, TextField, 
    Typography, Button, Box, Divider, Fab, Stepper, Step, StepLabel, StepContent 
} from '@mui/material'

import { BV_THEME } from '../../../theme/BV-theme'

import CameraIcon from '@mui/icons-material/AddPhotoAlternate';
import useAuth from '../../../contextHooks/useAuthContext';
import api from '../../../axios.js'
import { UserDialog } from '../../../CoreComponents/UserFeedback/Dialog';
import { useLocation, useNavigate } from 'react-router-dom';
import { editCustomer } from '../../../CoreComponents/requests';




export const NewCustomer = (props) => {
    const useQuery = () => new URLSearchParams(useLocation().search)
    const query = useQuery()

    const paramVerb = () => {
        if(Boolean(query.get('type'))){
            return "Update"
        }

        return "Save"
    }

    const isEdition = props.edit.isEdition
    const prevValues = props.edit?.values?.customer

    console.log("prevValues",prevValues)
    
    //*Contexts
    const {user, credential} = useAuth()
    const navigate = useNavigate()
    
    const [input, setInput] = useState({
        name:           props.edit.isEdition ? props.edit.values.customer.name :  undefined,
        email:          props.edit.isEdition ? props.edit.values.customer.email :  undefined,
        image:          props.edit.isEdition ? props.edit.values.customer.image :  undefined,
        role:           undefined,
        street:         props.edit.isEdition ? props.edit.values.customer.address.street :  undefined,
        number:         props.edit.isEdition ? props.edit.values.customer.address.stNumber :  undefined,
        ZipCode:        props.edit.isEdition ? props.edit.values.customer.address.zip :  undefined,
        city:           props.edit.isEdition ? props.edit.values.customer.address.city :  undefined,
        state:          props.edit.isEdition ? props.edit.values.customer.address.state :  undefined,
        country:        props.edit.isEdition ? props.edit.values.customer.address.country :  undefined,
        references:     props.edit.isEdition ? props.edit.values.customer.address.references :  undefined,
        businessName:   props.edit.isEdition ? props.edit.values.customer.businessData.name :  undefined,
        bnkAcc:         props.edit.isEdition ? props.edit.values.customer.businessData.bankAccount :  undefined
    })
    
    const [options, setOptions] = useState({
        roles: ["Business manager", "Finance manager", "Other"]

    })

    //Dialog
    const [dialog, setDialog] = useState({
        open:false,
        title:"",
        message:"",
        actions:[]
    })

    
    //* STEPPER
    const [activeStep, setActiveStep] = useState(0)
    const [showFinal, setShowFinal] = useState(false)

    const handleSaveCustomer = () => {
        const mappedCustomer = {
            "name":               input.name,
            "role":               input.role,
            "email":              input.email,
            "image":              "N/A",
            "address":            {
                "stNumber":   input.number,   
                "street":     input.street,
                "zip":        input.ZipCode,
                "city":       input.city,
                "state":      input.state,
                "country":    input.country,
                "references": input.references,
            },
            "businessData": {
                "name":         input.businessName,
                "bankAccount":  input.bnkAcc
            }
        }

        if(isEdition){
            mappedCustomer["_id"] = props.edit.values.customer._id
            editCustomer(user, credential, mappedCustomer)
            .then(response => {
                console.log(response)
                if(response.status === 500){
                    setDialog({
                        ...dialog,
                        open:true,
                        title:"Customer could not be updated due to a server error",
                        actions:[ 
                            {
                                label:"Retry",
                                btn_color:"primary",
                                execute:() => {
                                    setDialog({...dialog,open:false}),
                                    setActiveStep(0)
                                }
                            },
                            {
                                label:"Close",
                                btn_color:"secondary",
                                execute:() => {
                                    setDialog({...dialog,open:false})
                                }
                            }
                        ]
                        
                    }) 
                }
                if(response.status === 200){
                    setDialog({
                        ...dialog,
                        open:true,
                        title:"Customer modified",
                        actions:[ {
                            label:"Ok",
                            btn_color:"primary",
                            execute:() => {
                                navigate(`/${user.uid}/admin/client`)
                            }
                            }
                        ]
                        
                    })
                }
            
            })
            .catch(err => console.log(err))
            return
        }
        
        api.api.post(`${api.apiVersion}/customers/`, mappedCustomer, {
            headers:{
                authorization:  credential._tokenResponse.idToken,
                user:           user
            }
        })
        .then((response) => {

            console.log("status",response.status)
            if(response.status === 500){
                setDialog({
                    ...dialog,
                    open:true,
                    title:"Customer could not be added",
                    actions:[ 
                        {
                            label:"Retry",
                            btn_color:"primary",
                            execute:() => {
                                setDialog({...dialog,open:false}),
                                setActiveStep(0)
                            }
                        },
                        {
                            label:"Close",
                            btn_color:"secondary",
                            execute:() => {
                                setDialog({...dialog,open:false})
                            }
                        }
                    ]
                    
            }) }
            if(response.status === 201){
                setDialog({
                    ...dialog,
                    open:true,
                    title:"Customer Added",
                    actions:[ {
                        label:"Ok",
                        btn_color:"primary",
                        execute:() => {
                            window.location.reload()
                        }
                        }
                    ]
                    
                })
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    const handleChangeLabel = (date) => {
        console.log("Changing Customer pic")
    }

    const handleInput = (e,v,r) => {
        let id
        id =  e.target.id
        if(r === "selectOption"){
            id = e.target.id.split('-')[0]
        }
        
        setInput({
            ...input,
            [id]:v
        })
    }



    //*********** STEPPER
    const steps = [
        {
            label: 'Details',
            description: `Please enter the customer's information`,
        },
        {
            label: 'Address',
            description:
            "Please enter the customer's Address",
        },
        {
            label: 'Business Information',
            description:
            "Please enter the customer's billing details",
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

    const stepBoxSx = {
        display:"flex",
        width:"100%", 
        justifyContent:"center",
        marginTop:"2vh", 
        flexDirection:"column",
        alignItems:"center"
    }

    

    const getStepContent = (step,index) => {
        return ( 
            <>
            <Typography sx={{display:{xs:"none", sm:"flex"}}}>{step.description}</Typography>
            <Box sx={{ mb: 2 }}>
                <div>
                    <Button
                        variant="contained"
                        onClick={isLastStep(index) ? handleSaveCustomer : handleNext}
                        sx={()=>({...BV_THEME.button.standard,mt: 1, mr: 1,})}
                        
                    >
                        {isLastStep(index) ? `${paramVerb()} Customer` : 'Continue'}
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
                        onClick={isLastStep(index) ? handleSaveCustomer : handleNext}
                        sx={()=>({...BV_THEME.button.standard})}
                        
                    >
                        {isLastStep(index) ? `${paramVerb()} Customer` : 'Continue'}
                    </Button>
                    
                    
                
            </Box>
        )

    }
    ///////////////////////////////////////////////////////////////////////////////////////
  return (
    <>
    <Box sx={
        {
            display:"flex", 
            width:"100%", 
            marginTop:"5vh",
            justifyContent:"center",
            justifyItems:"center", 
            alignItems:"center", 
            flexDirection:"column"
        }
    }>
        <Typography variant="h4" color="secondary" marginY={{xs:"5vh",md:"4vh"}}>
            Create New Customer
        </Typography> 
        <Box sx={{ width: {xs:"100%",sm:"90%"}, display:"flex", flexDirection:{xs:"column",sm:"row"}  }}>
        


        {/*Mobile Stepper controls */}
        <Box justifyContent={"space-evenly"} sx={{ width: "100%", display:{xs:"flex", sm:"none"}}}>
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
        <Box sx={{ width:{xs:"94%",sm:"68%"}, display:"flex", flexDirection:"column", padding:"2%", alignItems:"center" }}>
            {getMobileStepperButtons(activeStep)}

            {/* First Step */}
            {
                activeStep === 0 ? (
                    <>
                        <Box sx={stepBoxSx}>
                            <Typography variant="h6">
                                Customer Information 
                            </Typography>
                            
                            <Divider variant="middle" sx={{width:{xs:"98%",sm:"50%",md:"50%"}, marginY:"1vh"}}/>

                            <Fab color="primary" component="label" id="label" aria-label="add" sx={{marginY:"4%", width:100,height:100}} size="large" helpertext="Label">
                                <input  type="file" accept="image/*" onChange={handleChangeLabel} hidden />
                                <CameraIcon sx={{fontSize:"5vh"}} />
                            </Fab>
                            
                            <TextField defaultValue={isEdition ? prevValues.name : undefined} id="name"  onChange={(e) => handleInput(e,e.target.value,"input")} label="Name" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
                            <TextField defaultValue={isEdition ? prevValues.email : undefined} id="email" onChange={(e) => handleInput(e,e.target.value,"input")} label="Email" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
                            <Autocomplete
                                options={options.roles}
                                onChange={handleInput}
                                id="role"
                                sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})}
                                defaultValue={isEdition ? prevValues.role : undefined}
                                renderInput={(params) => { 
                                    return <TextField
                                            {...params}
                                            label="Role"
                                        />
                                }}
                            />

                        </Box>
                    </>
                ) : null
            }


            {/* Second Step */}
            {
                activeStep === 1 ?( 
                    <>
                        <Box sx={stepBoxSx}>
                            <Typography variant="h6">
                                Address 
                            </Typography>
                            <Divider variant="middle" sx={{width:{xs:"98%",sm:"50%",md:"50%"}, marginY:"1vh"}}/>

                            <TextField defaultValue={isEdition ? prevValues?.address?.street : undefined} onChange={(e) => handleInput(e,e.target.value,"input")} id="street" label="Street" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
                            <Box display="flex" flexDirection="row" width={{xs:"99%",sm:"49%"}}>
                                <TextField defaultValue={isEdition ? prevValues?.address?.stNumber : undefined} onChange={(e) => handleInput(e,e.target.value,"input")} id="number" label="No." type="number" sx={()=>({...BV_THEME.input.mobile.halfSize.desktop.halfSize})} />
                                <TextField defaultValue={isEdition ? prevValues?.address?.zip : undefined} onChange={(e) => handleInput(e,e.target.value,"input")} id="ZipCode" label="ZipCode" type="text" sx={()=>({...BV_THEME.input.mobile.halfSize.desktop.halfSize})} />
                            </Box>
                            <TextField defaultValue={isEdition ? prevValues?.address?.city : undefined} onChange={(e) => handleInput(e,e.target.value,"input")} id="city" label="City" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
                            <TextField defaultValue={isEdition ? prevValues?.address?.state : undefined} onChange={(e) => handleInput(e,e.target.value,"input")} id="state" label="State" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
                            <TextField defaultValue={isEdition ? prevValues?.address?.country : undefined} onChange={(e) => handleInput(e,e.target.value,"input")} id="country" label="Country" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
                            <TextField defaultValue={isEdition ? prevValues?.address?.references : undefined} onChange={(e) => handleInput(e,e.target.value,"input")} id="references" multiline label="References" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
                        </Box>
                    </>
                ) : null
            }

            {/* Third Step */}
            {
                activeStep === 2 ?( 
                    <>
                        <Box sx={stepBoxSx}>
                            <Typography variant="h6" align="left">
                                Business Information 
                            </Typography>
                            <Divider variant="middle" sx={{width:{xs:"98%",sm:"50%",md:"50%"}, marginY:"1vh"}}/>

                            <TextField defaultValue={isEdition ? prevValues?.businessData?.name : undefined} onChange={(e) => handleInput(e, e.target.value,"input")} id="businessName" label="Name" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
                            <TextField defaultValue={isEdition ? prevValues?.businessData?.bankAccount : undefined} onChange={(e) => handleInput(e, e.target.value,"input")} id="bnkAcc" label="Bank Account" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />

                        </Box>
                    </>
                ) : null
            }

    
        </Box>
    </Box>
    </Box>
    <UserDialog
        setDialog={setDialog}
        dialog={dialog}
        open={dialog.open}
        title={dialog.title}
        content={dialog.message}
        actions={dialog.actions}
    />
    </>

  )
}
