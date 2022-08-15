import React, {useState} from 'react'
//*MUI Components
import { 
    Autocomplete, TextField, 
    Typography, Button, Box, Divider, Fab 
} from '@mui/material'

import { BV_THEME } from '../../../theme/BV-theme'

import CameraIcon from '@mui/icons-material/AddPhotoAlternate';





export const NewCustomer = () => {
    const [options, setOptions] = useState({
        rates:   ["$20/h","$30/h","$40/h"],
        roles: ["El chido", "El mero mero", "Steve"]

    })

    const handleSaveCustomer = (date) => {
        console.log("Saving Customer")
    }

    const handleChangeLabel = (date) => {
        console.log("Changing Customer pic")
    }

  return (
    <>
    <Box sx={
        {
            display:"flex",
            width:"100%", 
            alignItems:"center",
            marginTop:"5vh",
            paddingBottom:"5vh", 
            flexDirection:"column",
        }
    }>
        <Box sx={{ width: "90%", display:"flex", flexDirection:{xs:"column",sm:"column"}  }} alignItems="center" >
    
            <Typography variant="h4" mb={{xs:"5vh",md:"3vh"}}>Create New Customer</Typography>

            <Fab color="primary" component="label" id="label" aria-label="add" sx={{marginY:"4%", width:200,height:200}} size="large" helpertext="Label">
                <input  type="file" accept="image/*" onChange={handleChangeLabel} hidden />
                <CameraIcon sx={{fontSize:"10vh"}} />
            </Fab>

            
            <Typography variant="h6" mt="4vh">
                Customer Information 
            </Typography>
            
            <Divider variant="middle" sx={{width:{xs:"98%",sm:"50%",md:"50%"}, marginY:"1vh"}}/>

            
            <TextField label="Name" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
            <Autocomplete
                options={options.roles}
                sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})}
                renderInput={(params) => { 
                    return <TextField
                            {...params}
                            label="Role"
                        />
                }}
            />
            <TextField label="Address" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />




            <Typography variant="h6" mt="4vh" align="left">
                Business Information 
            </Typography>
            <Divider variant="middle" sx={{width:{xs:"98%",sm:"50%",md:"50%"}, marginY:"1vh"}}/>

            <TextField label="Bank Account" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
            <Autocomplete
                options={options.rates}
                sx={BV_THEME.input.mobile.fullSize.desktop.halfSize}
                renderInput={(params) => { 
                    return <TextField
                            {...params}
                            label="Hourly Rate $"
                        />
                }}
            />
            <TextField label="Social Insurance" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
            

            <Button variant="contained" onClick={handleSaveCustomer} sx={{marginTop:"2vh"}}>
                Save Customer
            </Button>

    
        </Box>
    </Box>
    </>

  )
}
