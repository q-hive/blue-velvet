import React, { useState } from 'react'
//*MUI components
import { Button, TextField, useTheme, Fab} from '@mui/material'
import CameraIcon from '@mui/icons-material/AddPhotoAlternate';
import { Box } from '@mui/system'

//*Network and API
import api from '../../../../axios.js'
import { UserDialog } from '../../../../CoreComponents/UserFeedback/Dialog.jsx'
import { Navigate, useNavigate } from 'react-router-dom'
import { BV_THEME } from '../../../../theme/BV-theme.js'

export const SimpleProductForm = () => {
    const theme = useTheme(BV_THEME)
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
    
    const [stepBtnLabel, setStepBtnLabel] = useState("Accept")
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
    <div style={{paddingLeft:"10vw", paddingRight:"10vw"}}>
        {
            showTimes
            ?
            <>
                <TextField type="number" label="Dark time" />
                <TextField type="number" label="Light time" />
            </>
            :
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
            }>
                <TextField id="name" onChange={handleChangeProductData} label="Product name" sx={theme.input.mobile.fullSize.desktop.thirdSize}/>
                <TextField id="label" onChange={handleChangeProductData} label="Product label" sx={theme.input.mobile.fullSize.desktop.thirdSize}/>
                <TextField id="seeding" type="number" onChange={handleChangeProductData} label="Seeding" sx={theme.input.mobile.fullSize.desktop.thirdSize}/>
                <TextField id="harvest" type="number" onChange={handleChangeProductData} label="Harvest" sx={theme.input.mobile.fullSize.desktop.thirdSize}/>
                <TextField id="price" onChange={handleChangeProductData} label="Price" sx={theme.input.mobile.fullSize.desktop.thirdSize}/>
                <TextField id="route" onChange={handleChangeProductData} label="Email / route" sx={theme.input.mobile.fullSize.desktop.thirdSize}/>
                <TextField id="seedId" onChange={handleChangeProductData} label="SeedID" sx={theme.input.mobile.fullSize.desktop.thirdSize}/>
                <Fab color="primary" aria-label="add" size="large" sx={{marginY:"4%"}} >
                            <CameraIcon />
                    </Fab>

                <Button variant="contained" size="large" onClick={handleComplete}>{stepBtnLabel}</Button>
                </Box>
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
        
    </div>
  )
}
