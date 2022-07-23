import React, { useState, useEffect } from 'react'

//*COMPONENTS FROM MUI
import { Autocomplete, Box, Button, TextField, Typography, useTheme, Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import CameraIcon from '@mui/icons-material/AddPhotoAlternate';
//*THEME
import { BV_THEME } from '../../../../theme/BV-theme'
//*NETWORK AND API
import api from '../../../../axios'
import { useNavigate } from 'react-router-dom'
import { UserDialog } from '../../../../CoreComponents/UserFeedback/Dialog'
import useAuth from '../../../../contextHooks/useAuthContext'
import { grey } from '@mui/material/colors'
import { MixName } from './MixName';

const amounts = ["25","30","40","50","60","70","80","90"]

export const MixProductsForm = () => {
    const theme = useTheme(BV_THEME);
    //*TODO STRAINS MUST COME FROM MICROGREENS
    const [strains, setStrains] = useState([])
    const [mix, setMix] = useState({
        products:[],
        name:"",
        label:"",
        cost:0
    })
    const [showFinal, setShowFinal] = useState(false)

    const [actualValue, setActualValue] = useState({
        strain:"",
        amount:null
    })
    

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
    })

    const {user} = useAuth()
    const navigate = useNavigate()
    
    const handleChangeAutoCompletes = (e,v,r) => {
        //*event, value, reason
        switch(r){
            case "selectOption":
                if(e.target.id.split('-')[0] === "strain"){
                    setActualValue({
                        ...actualValue,
                        strain:v._id
                    })
                    break
                } else if (e.target.id.split('-')[0] === "amount") {
                    setActualValue({
                        ...actualValue,
                        amount:v
                    })
                    break;
                }
            case "clear":
                console.log(e, v, r)
                console.log(e.target.ownerDocument.id)
                //*? HOW TO LISTEN WICH VALUE SHOULD BE DELETED FROM ACTUAL VALUE IF TJHE ID IS "" BECAUSE TJHE BUTTON IS APPART FROM INPUT
                if(e.target.ownerDocument.id === "strain"){
                    setActualValue({
                        ...actualValue,
                        strain:""
                    })
                    break
                } else if (e.target.ownerDocument.id === "amount") {
                    setActualValue({
                        ...actualValue,
                        amount:null
                    })
                    break;
                }
                
                break;
            default:
                break;
        }
    }

    
    const handleChangeName = (e) => {
        setMix({
            ...mix,
            name:e.target.value
        })
        
    }
    const handleChangeLabel = () => {
        console.log("Updating label")
    }

    const handleChangeCost = (e) => {
        setMix({
            ...mix,
            cost:e.target.value
        })
        
    }
    
    const handleAddToMixComb = () => {
        if(!((actualValue.strain !== "") && (actualValue.amount !== null))){
            //*TODO SHOW EMPTY INPUTS IN RED
            console.log("There are some empty values, please provide the correct format.")
            console.log(Object.entries(actualValue))
            //*Entry array = entrArr
            console.log(Object.entries(actualValue).map((entrArr, idx) => {
                if(entrArr[1] === ("" || null)) {
                    return entrArr[0]
                }
                
            }))

            
            return
        }
        console.log("Combination completed")
        console.log(actualValue)
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
        setShowFinal(true)
        //*OK THE MIX HAVE THE RIGHT LENGTH, THE TOTAL OF AMOUNT IS 100% ? 
        
    }
    
    const handleSendMixData = () => {
        const mappedProducts = mix.products.map(product => {
            return {id:product.id, amount:product.amount}
        })
        
        const model = {
            name:   mix.name,
            cost:   mix.cost, // * Cost per tray,
            mix: {
                isMix:true,
                name:mix.name,
                products:mappedProducts
            },
        }
        api.api.post(`${api.apiVersion}/products/`, model)
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
                            window.location.reload()
                        }
                        
                    },
                    {
                        label:"End",
                        btn_color:"secondary",
                        execute:() => {
                            navigate('/')
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
        api.api.get(`${api.apiVersion}/products/`)
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

    
  return (
    <div style={{paddingLeft:"10vw", paddingRight:"10vw"}}>
        <UserDialog
        dialog={dialog}
        setDialog={setDialog}
        open={dialog.open}
        title={dialog.title} 
        content={dialog.message}
        actions={dialog.actions}
        />
        
        <Box sx={{display:"flex", width:"100%", justifyContent:"space-between",justifyItems:"center", alignItems:"center", flexDirection:"column"}}>
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
                <Autocomplete
                        options={strains}
                        id="strain"
                        renderInput={(params) => {
                            return <TextField helperText={error.strain.message} error={error.strain.failed} label="Strain" {...params}/>
                        }}
                        getOptionLabel={(option) => {
                            return option.name
                        }}
                        onChange={handleChangeAutoCompletes}
                        sx={theme.input.mobile.fullSize.desktop.halfSize}
                />

                <Autocomplete
                        options={amounts}
                        id="amount"
                        renderInput={(params) => {
                            return <TextField type="number" helperText={error.amount.message} error={error.amount.failed} label="Amount %" {...params}/>
                        }}
                        onChange={handleChangeAutoCompletes}
                        sx={theme.input.mobile.twoThirds.desktop.quarterSize}
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
                <Fab onClick={handleAddToMixComb} color="primary" aria-label="add" >
                    <AddIcon />
                </Fab>

                <Typography margin={"4%"} color={theme.textColor.darkGray}>Mix Length : VAR</Typography>

                

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
            <Button variant="contained" size='large' onClick={handleSetMix}>
                Set Mix
            </Button>

        </Box>

        </Box>

        {
            showFinal
            ?
            <div>
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
                        <TextField label="Mix Name" variant="outlined" sx={theme.input.mobile.fullSize.desktop.halfSize}>
                            
                        </TextField>

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

                    <Fab color="primary" aria-label="add" sx={{marginY:"4%"}} >
                            <CameraIcon />
                    </Fab>
                    
                    <Button variant="contained" size='large' >
                        Save
                    </Button>

                </Box>
            </div>
            :
            null
        }
        

    
        

        
    </div>
    



  )
}
