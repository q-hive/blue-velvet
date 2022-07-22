import React, { useState } from 'react'
//*MUI components
import { Button, TextField } from '@mui/material'
import { Box } from '@mui/system'

//*Network and API
import api from '../../../../axios.js'
import { UserDialog } from '../../../../CoreComponents/UserFeedback/Dialog.jsx'
import { Navigate, useNavigate } from 'react-router-dom'

export const SimpleProductForm = () => {
    const [productData, setProductData] = useState({
        name:"",
        label:"",
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
            
        })
    }

    
  return (
    <div>
        {
            showTimes
            ?
            <>
                <TextField type="number" label="Dark time" />
                <TextField type="number" label="Light time" />
            </>
            :
            <>
                <TextField id="name" onChange={handleChangeProductData} label="Product name"/>
                <TextField id="label" onChange={handleChangeProductData} label="Product label"/>
                <TextField id="seeding" type="number" onChange={handleChangeProductData} label="Seeding"/>
                <TextField id="harvest" type="number" onChange={handleChangeProductData} label="Harvest"/>
                <TextField id="price" onChange={handleChangeProductData} label="Price"/>
                <TextField id="route" onChange={handleChangeProductData} label="Email / route"/>
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
