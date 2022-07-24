import React, { useState } from 'react'
//*MUI components
import { Button, TextField, useTheme, Fab} from '@mui/material'
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

export const SimpleProductForm = () => {
    //*UTILS
    const theme = useTheme(BV_THEME)
    const navigate = useNavigate()
    const {user} = useAuth()

    //*DATA STATES
    const [productData, setProductData] = useState({
        name:"",
        label:null,
        price:null,
        seedId:"",
        provider:"",
        day:null,
        night:null,
        seeding:null,
        harvest:null,
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
            if(val[1] === "" || val[1] === null){
                if((val[0] === "day" || val[0] === "night") && !showTimes) {
                    console.log("Parameters should not be inserted into array because the component is not displayed")
                    return
                }
                
                errors.push(val)
            }
        })
        if(errors.length > 0 ){
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
            const mappedProduct = {
                name:productData.name,
                label:productData.label,
                price:Number(productData.price),
                seedId:productData.seedId,
                parameters: {
                    day:Number(productData.day),
                    night:Number(productData.night),
                    seedingRate:Number(productData.seeding),
                    harvestRate:Number(productData.harvest)
                }
            }
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
                                navigate('production')
                            }
                        },
                    ]   
                })
            })
            }
        }

        
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
                showTimes
                ?
                <>
                    <TextField id="night" helperText={error.night.message} error={error.night.failed} onChange={handleChangeProductData} type="number" label="Dark time" />
                    <TextField id="day" helperText={error.day.message} error={error.day.failed} onChange={handleChangeProductData} type="number" label="Light time" />
                </>
                :
                <>
                    <TextField helperText={error.name.message} error={error.name.failed} id="name" onChange={handleChangeProductData} label="Product name" sx={theme.input.mobile.fullSize.desktop.thirdSize}/>
                    <TextField helperText={error.seeding.message} error={error.seeding.failed} id="seeding" type="number" onChange={handleChangeProductData} label="Seeding" sx={theme.input.mobile.fullSize.desktop.thirdSize}/>
                    <TextField helperText={error.harvest.message} error={error.harvest.failed} id="harvest" type="number" onChange={handleChangeProductData} label="Harvest" sx={theme.input.mobile.fullSize.desktop.thirdSize}/>
                    <TextField helperText={error.price.message} error={error.price.failed} id="price" onChange={handleChangeProductData} label="Price" sx={theme.input.mobile.fullSize.desktop.thirdSize}/>
                    <TextField helperText={error.provider.message} error={error.provider.failed} id="provider" onChange={handleChangeProductData} label="Email / route" sx={theme.input.mobile.fullSize.desktop.thirdSize}/>
                    <TextField helperText={error.seedId.message} error={error.seedId.failed} id="seedId" onChange={handleChangeProductData} label="SeedID" sx={theme.input.mobile.fullSize.desktop.thirdSize}/>
                    <Fab color="primary" component="label" id="label" aria-label="add" sx={{marginY:"4%"}} size="large">
                        <input  type="file" accept="image/*" onChange={handleChangeLabel} hidden />
                        <CameraIcon />
                    </Fab>
                    {/* <TextField id="name" onChange={handleChangeProductData} label="Product name" />
                    <TextField id="seeding" type="number" onChange={handleChangeProductData} label="Seeding" />
                    <TextField id="harvest" type="number" onChange={handleChangeProductData} label="Harvest" />
                    <TextField id="price" onChange={handleChangeProductData} label="Price"/>
                    <TextField id="route" onChange={handleChangeProductData} label="Email / route"/>
                    <TextField id="seedId" onChange={handleChangeProductData} label="SeedID"/> */}
                    {/* <Fab color="primary" aria-label="add" size="large" sx={{marginY:"4%"}} >
                                <CameraIcon />
                    </Fab> */}

                </>

}
        
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
}
