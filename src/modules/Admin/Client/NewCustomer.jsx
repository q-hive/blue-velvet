import React, {useState} from 'react'
//*MUI Components
import { 
    Autocomplete, TextField, 
    Typography, Button, Box, Divider, Fab 
} from '@mui/material'

import { BV_THEME } from '../../../theme/BV-theme'

import CameraIcon from '@mui/icons-material/AddPhotoAlternate';





export const NewCustomer = () => {
    const [input, setInput] = useState({
        name:           undefined,
        email:          undefined,
        image:          undefined,
        role:           undefined,
        street:         undefined,
        number:         undefined,
        ZipCode:        undefined,
        city:           undefined,
        state:          undefined,
        country:        undefined,
        references:     undefined,
        businessName:   undefined,
        bnkAcc:         undefined
    })
    
    const [options, setOptions] = useState({
        roles: ["El chido", "El mero mero", "Steve"]

    })

    const handleSaveCustomer = () => {
        console.log("Saving Customer")
        console.log(input)
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

            <Fab color="primary" component="label" id="label" aria-label="add" sx={{marginY:"4%", width:100,height:100}} size="large" helpertext="Label">
                <input  type="file" accept="image/*" onChange={handleChangeLabel} hidden />
                <CameraIcon sx={{fontSize:"5vh"}} />
            </Fab>

            
            <Typography variant="h6" mt="4vh">
                Customer Information 
            </Typography>
            
            <Divider variant="middle" sx={{width:{xs:"98%",sm:"50%",md:"50%"}, marginY:"1vh"}}/>

            
            <TextField id="name"  onChange={(e) => handleInput(e,e.target.value,"input")} label="Name" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
            <TextField id="email" onChange={(e) => handleInput(e,e.target.value,"input")} label="Email" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
            <Autocomplete
                options={options.roles}
                onChange={handleInput}
                id="role"
                sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})}
                renderInput={(params) => { 
                    return <TextField
                            {...params}
                            label="Role"
                        />
                }}
            />
            <Typography variant="h6" mt="4vh">
                Address 
            </Typography>
            <TextField onChange={(e) => handleInput(e,e.target.value,"input")} id="street" label="Street" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
            <TextField onChange={(e) => handleInput(e,e.target.value,"input")} id="number" label="No." type="number" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
            <TextField onChange={(e) => handleInput(e,e.target.value,"input")} id="ZipCode" label="ZipCode" type="text" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
            <TextField onChange={(e) => handleInput(e,e.target.value,"input")} id="city" label="City" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
            <TextField onChange={(e) => handleInput(e,e.target.value,"input")} id="state" label="State" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
            <TextField onChange={(e) => handleInput(e,e.target.value,"input")} id="country" label="Country" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
            <TextField onChange={(e) => handleInput(e,e.target.value,"input")} id="references" multiline label="References" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />




            <Typography variant="h6" mt="4vh" align="left">
                Business Information 
            </Typography>
            <Divider variant="middle" sx={{width:{xs:"98%",sm:"50%",md:"50%"}, marginY:"1vh"}}/>

            <TextField onChange={(e) => handleInput(e, e.target.value,"input")} id="businessName" label="Name" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
            <TextField onChange={(e) => handleInput(e, e.target.value,"input")} id="bnkAcc" label="Bank Account" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />

            <Button variant="contained" onClick={handleSaveCustomer} sx={{marginTop:"2vh"}}>
                Save Customer
            </Button>

    
        </Box>
    </Box>
    </>

  )
}
