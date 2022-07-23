import React, { useState } from 'react'
//*MUI components
import { Button, TextField, Fab } from '@mui/material'
import CameraIcon from '@mui/icons-material/AddPhotoAlternate';
import { Box } from '@mui/system'

//*THEME
import { UserDialog } from '../../../../CoreComponents/UserFeedback/Dialog.jsx'

//*Network and API
import api from '../../../../axios.js'
import { useNavigate } from 'react-router-dom'

export const SimpleProductForm = () => {
    const [productData, setProductData] = useState({
        name:"",
        label:null,
        price:0,
        seedId:"",
        day:0,
        night:0,
        seeding:0,
        harvest:0,
    })
    
    const [stepBtnLabel, setStepBtnLabel] = useState("Done")
    const [showTimes, setShowTimes] = useState(false)

    const [dialog, setDialog] = useState({
        open:false,
        title:"",
        message:"",
        actions:[]
    })

    const navigate = useNavigate()
    
    const handleChangeProductData = (e) => {
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
        if(!showTimes){
            setShowTimes(!showTimes)
            setStepBtnLabel("Set product")
            return
        }

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
                            navigate('production')
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

    
  return (
    <div>
        {
            showTimes
            ?
            <>
                <TextField id="night" onChange={handleChangeProductData} type="number" label="Dark time" />
                <TextField id="light" onChange={handleChangeProductData} type="number" label="Light time" />
            </>
            :
            <>
                <TextField id="name" onChange={handleChangeProductData} label="Product name"/>
                <Fab color="primary" component="label" id="label" aria-label="add" sx={{marginY:"4%"}} >
                    <input  type="file" accept="image/*" onChange={handleChangeLabel} hidden />
                    <CameraIcon />
                </Fab>
                <TextField id="seeding" type="number" onChange={handleChangeProductData} label="Seeding"/>
                <TextField id="harvest" type="number" onChange={handleChangeProductData} label="Harvest"/>
                <TextField id="price" onChange={handleChangeProductData} label="Price"/>
                <TextField id="provider" onChange={handleChangeProductData} label="Email / route"/>
                <TextField id="seedId" onChange={handleChangeProductData} label="SeedID"/>
            </>

        }

        <UserDialog
        dialog={dialog}
        setDialog={setDialog}
        open={dialog.open}
        title={dialog.title}
        content={dialog.message} 
        actions={dialog.actions}
        />
        <Button variant="contained" onClick={handleComplete}>{stepBtnLabel}</Button>
    </div>
  )
}
