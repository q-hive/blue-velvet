import React, {useState, useEffect} from 'react'

//*MUI COMPONENTS
import { Autocomplete,Backdrop, Box, Button, Divider, Fab, TextField, Typography, Fade, CircularProgress } from '@mui/material'
import CameraIcon from '@mui/icons-material/AddPhotoAlternate'

//*CONTEXTS
import useAuth from '../../../contextHooks/useAuthContext'

//*NETWORK, ROUTING AND API
import { useNavigate } from 'react-router-dom'

//*THEME
import { BV_THEME } from '../../../theme/BV-theme'
import { UserDialog } from '../../../CoreComponents/UserFeedback/Dialog'

// *VALIDATIONS
import { validateInput } from '../../../utils/helpers/inputValidator'

// *CUSTOM HOOKS
import useEmployees from '../../../hooks/useEmployees'

export const NewEmployee = (props) => {

    const {user, credential} = useAuth()
    let headers = {
        authorization:credential._tokenResponse.idToken,
        user: user
    }
    const {getEmployee, addEmployee} = useEmployees(headers);
    const navigate = useNavigate()

    const [loading,setLoading] = useState(false)

    const [dialog, setDialog] = useState({
        open:false,
        title:"",
        message:"",
        actions:[]
    })

    const [phoneExt, setPhoneExt] = useState("");
    const [input, setInput] = useState({
        name:           "",
        email:          "",
        phone:          "",
        lname:          "",
        password:       "",
        salary:         "",
        image:          "",
        street:         "",
        number:         "",
        ZipCode:        "",
        city:           "",
        state:          "",
        country:        "",
        references:     "",
    })
    // Error messages
    const [errorMessages, setErrorMessages] = useState({});


    let UserInEdition

    useEffect(()=>{
        if(props.edit){    
            let id = new URLSearchParams(window.location.search).get("id")
            getEmployee(id)
            .then((res) => {
                console.log(res.data.data)
                UserInEdition=res.data.data
                console.log("user in edition",UserInEdition)
                setPhoneExt(UserInEdition.phone.substring(0, 3));
                setInput({...input, 
                    name:           UserInEdition.name, 
                    email:          UserInEdition.email,
                    phone:          UserInEdition.phone.substring(3),
                    lname:          UserInEdition.lname,
                    password:       UserInEdition.password,
                    salary:         UserInEdition.salary,
                    image:          UserInEdition.image,
                    street:         UserInEdition.address.street,
                    number:         UserInEdition.address.stNumber,
                    ZipCode:        UserInEdition.address.zip,
                    city:           UserInEdition.address.city,
                    state:          UserInEdition.address.state,
                    country:        UserInEdition.address.country,
                    references:     UserInEdition.address.references,
                })
            })
            .catch((err) => {
                console.log(err)
            })   
        }
    },[])
    
    
    const handleInput = (e,v,r) => {
        const { id, value } = e.target;
        const { valid, message } = validateInput(id, value);
        setErrorMessages((prevErrors) => ({ ...prevErrors, [id]: valid ? "" : message }));
        if(r === "selectOption"){
            id = e.target.id.split('-')[0]
        }
        
        setInput({
            ...input,
            [id]:v
        })
    }

    const handlePhoneExt = (event) => {
        const { id, value } = event.target;
        const { valid, message } = validateInput(id, value);
        setErrorMessages((prevErrors) => ({ ...prevErrors, [id]: valid ? "" : message }));
        setPhoneExt(value);
    };
    

    const handleChangeLabel = () => {
        console.log("Changing label but not really")
    }

    const createEmployee = (mappedEmployeeData) => {
        console.log("[Creating employee ]");
        addEmployee(mappedEmployeeData)
        .then((res) => {
            
            setLoading(false)
            
            setDialog({
                ...dialog,
                open:true,
                title:"Employee Added",
                message: "The employee has been added successfully",
                actions:[ 
                    {
                        label:"Add Another",
                        btn_color:"primary",
                        execute:() => {
                            window.location.reload()
                        }
                    },
                    {
                    label:"Go to Dashboard",
                    btn_color:"white_btn",
                    execute:() => {
                        navigate(`/${user.uid}/${user.role}/dashboard`)
                    }
                    }
                ]
                
            })
        })
        .catch((err) => {
            console.log("error  ",err)
            if(err.response.status === 500 || err.response.status === 400){
                setDialog({
                    ...dialog,
                    open:true,
                    title:"Employee could not be added",
                    message: err.response.data.message,
                    actions:[ 
                        {
                            label:"Retry",
                            btn_color:"primary",
                            execute:() => {
                                setDialog({...dialog,open:false})
                            }
                        },
                        {
                            label:"Try later",
                            btn_color:"secondary",
                            execute:() => {
                                navigate(`/${user.uid}/${user.role}/dashboard`)
                            }
                        }
                    ]
                    
                }) 
            }
        })
    }

    const updateEmployee = () => {
        setDialog({
            ...dialog,
            open:true,
            title:"Feature unavailable.",
            message:"At the momment this feature is not available, we are working to cerate a better experience, please be patient.",
            actions:[{
                label:"OK",
                execute:() => navigate(`/${user.uid}/${user.role}/employees`)
            }]
        })
    }
    
    const handleCreateEmployee = () => {
        const mappedEmployeeData = {
            "email":        input.email,
            "password":     input.password,
            "name":         input.name,
            "lname":        input.lname,
            "phone":        phoneExt + input.phone,
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

        setLoading(true)
        
        if(!props.edit){
            return createEmployee(mappedEmployeeData)
        } else {
            return updateEmployee(mappedEmployeeData)
        }
    }
  return (
    <>
        <Backdrop open={loading} children={<CircularProgress/>}/>
        <Fade in={true} timeout={1000} unmountOnExit>
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

                    <Box sx={{width:{xs:"98%",sm:"49%"}}} >
                        <TextField id="name" value={input.name} onChange={(e) => handleInput(e,e.target.value,"input")} label="First Name" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} /*InputLabelProps={{ shrink: edition ? true:false }}*/ error={Boolean(errorMessages.name)} helperText={errorMessages.name || ""} />
                        <TextField id="lname" value={input.lname} onChange={(e) => handleInput(e,e.target.value,"input")} label="Last Name" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} error={Boolean(errorMessages.lname)} helperText={errorMessages.lname || ""} />
                    </Box>
                    <TextField id="salary" type="number" value={input.salary}  onChange={(e) => handleInput(e,e.target.value,"input")} label="Salary" InputProps={{endAdornment: <Typography>/HR</Typography>}} sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.thirdSize})} />

                    
                    <Typography variant="h6" mt="4vh">
                        Address 
                    </Typography>
                    <TextField  onChange={(e) => handleInput(e,e.target.value,"input")} id="street" value={input.street}  label="Street" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
                    <Box sx={{width:{xs:"98%",sm:"49%"}}} >
                        <TextField onChange={(e) => handleInput(e,e.target.value,"input")} id="number" value={input.number} label="No." type="number" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
                        <TextField onChange={(e) => handleInput(e,e.target.value,"input")} id="ZipCode" value={input.ZipCode} label="ZipCode" type="text" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
                    </Box>
                    <TextField onChange={(e) => handleInput(e,e.target.value,"input")} id="city" value={input.city} label="City" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
                    <TextField onChange={(e) => handleInput(e,e.target.value,"input")} id="state" value={input.state} label="State" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
                    <TextField onChange={(e) => handleInput(e,e.target.value,"input")} id="country" value={input.country} label="Country" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />
                    <TextField onChange={(e) => handleInput(e,e.target.value,"input")} id="references" value={input.street} multiline label="References" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} />




                    <Typography variant="h6" mt="4vh" align="left">
                        New account Information 
                    </Typography>
                    <Divider variant="middle" sx={{width:{xs:"98%",sm:"50%",md:"50%"}, marginY:"1vh"}}/>

                    <TextField id="email" onChange={(e) => handleInput(e,e.target.value,"input")} label="Email" value={input.email} sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} error={Boolean(errorMessages.email)} helperText={errorMessages.email || ""} />
                    <Box sx={{ width: { xs: "98%", sm: "49%" }, display: "flex", flexDirection: "row", alignItems: "center", justifyContent:"center" }} >
                        <TextField id="phoneExt" onChange={(e) => handlePhoneExt(e)} value={phoneExt} label="Ext" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.quarterSize })} error={Boolean(errorMessages.phoneExt)} helperText={errorMessages.phoneExt || ""} />
                        <TextField id="phone" onChange={(e) => handleInput(e,e.target.value,"input")} label="Phone" value={input.phone} sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.fullSize})} error={Boolean(errorMessages.phone)} helperText={errorMessages.phone || ""} />
                    </Box>
                    <TextField id="password" onChange={(e) => handleInput(e, e.target.value,"input")} type="password" label="Set a password" sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})} error={Boolean(errorMessages.password)} helperText={errorMessages.password || ""} />
                    <Button variant="contained" onClick={handleCreateEmployee} sx={{marginTop:"2vh"}}>
                        {loading?<CircularProgress />:"Save employee"}
                    </Button>

            
                </Box>
                
            </Box>
        </Fade>
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
