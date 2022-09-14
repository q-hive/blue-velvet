import React, {useState} from 'react'

//*MUI COMPONENTS
import { Autocomplete, Box, Button, Divider, Fab, TextField, Typography } from '@mui/material'
import CameraIcon from '@mui/icons-material/AddPhotoAlternate'

//*CONTEXTS
import useAuth from '../../../contextHooks/useAuthContext'

//*NETWORK, ROUTING AND API
import { useNavigate } from 'react-router-dom'
import api from '../../../axios.js'

//*THEME
import { BV_THEME } from '../../../theme/BV-theme'

export const NewEmployee = () => {
    const {user, credential} = useAuth()
    const navigate = useNavigate()
    
    const [input, setInput] = useState({
        name:           undefined,
        email:          undefined,
        phone:          undefined,
        lname:          undefined,
        password:       undefined,
        salary:         undefined,
        image:          undefined,
        street:         undefined,
        number:         undefined,
        ZipCode:        undefined,
        city:           undefined,
        state:          undefined,
        country:        undefined,
        references:     undefined,
    })
    
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

    const handleChangeLabel = () => {
        console.log("Changing label but not really")
    }

    const handleCreateEmployee = () => {
        const mappedEmployeeData = {
            "email":        input.email,
            "password":     input.password,
            "name":         input.name,
            "lname":        input.lname,
            "phone":        input.phone,
            "image":        "https://cdn-icons-png.flaticon.com/512/147/147144.png",
            "organization": user.organization,
            "salary":       input.salary,
            "address": {
                "stNumber":   input.number,
                "street":     input.street,
                "zip":        input.ZipCode,
                "city":       input.city,
                "state":      input.state,
                "country":    input.country,
                "references": input.references
            }
        }
        
        api.api.post(`/auth/create/employee`, mappedEmployeeData, {
            headers:{
                authorization: credential._tokenResponse.idToken,
                user:          user
            }
        })
        .then((res) => {
            if(res.status === 201){
                navigate(`/${user.uid}/${user.role}/dashboard`)
            }
        })
        .catch((err) => {
            console.log(err)
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
    
            <Typography variant="h4" mb={{xs:"5vh",md:"3vh"}}>Create New Employee</Typography>

            <Fab color="primary" component="label" id="label" aria-label="add" sx={{marginY:"4%", width:100,height:100}} size="large" helpertext="Label">
                <input  type="file" accept="image/*" onChange={handleChangeLabel} hidden />
                <CameraIcon sx={{fontSize:"5vh"}} />
            </Fab>

            
            <Typography variant="h6" mt="4vh">
                Employee Information 
            </Typography>
            
            <Divider variant="middle" sx={{width:{xs:"98%",sm:"50%",md:"50%"}, marginY:"1vh"}}/>

            
            <TextField id="name"  onChange={(e) => handleInput(e,e.target.value,"input")} label="Name" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
            <TextField id="lname"  onChange={(e) => handleInput(e,e.target.value,"input")} label="Last Name" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
            <TextField id="salary" type="number" onChange={(e) => handleInput(e,e.target.value,"input")} label="Salary" InputProps={{endAdornment: <Typography>/HR</Typography>}} sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />

            
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
                New account Information 
            </Typography>
            <Divider variant="middle" sx={{width:{xs:"98%",sm:"50%",md:"50%"}, marginY:"1vh"}}/>

            <TextField id="email" onChange={(e) => handleInput(e,e.target.value,"input")} label="Email" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
            <TextField id="phone" onChange={(e) => handleInput(e,e.target.value,"input")} label="Phone" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
            <TextField id="password" onChange={(e) => handleInput(e, e.target.value,"input")} type="password" label="Set a password" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />

            <Button variant="contained" onClick={handleCreateEmployee} sx={{marginTop:"2vh"}}>
                Save employee
            </Button>

    
        </Box>
    </Box>
    </>
  )
}
