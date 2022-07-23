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
    
    //*DATA STATES
    const [strains, setStrains] = useState([])
    const [mix, setMix] = useState({
        products:[],
        name:"",
        label:"",
        cost:0
    })

    //*RENDER STATES
    const [actualValue, setActualValue] = useState({
        strain:"",
        amount:null
    })
    const [showFinal, setShowFinal] = useState(false)
    const [canAdd, setCanAdd] = useState(true)

    

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
    
    const handleChangeStrain = (e,v,r) => {
        //*event, value, reason
        switch(r){
            case "selectOption":
                if(e.target.id.split('-')[0] === "strain"){
                    setActualValue({
                        ...actualValue,
                        strain:v._id
                    })

                    if(error.strain.failed){
                        setError({
                            ...error,
                            strain:{
                                failed:false
                            }
                        })
                    }
                    break
                } 
            case "clear":
                setActualValue({
                    ...actualValue,
                    strain:""
                })
                break;
            default:
                break;
        }
    }

    const handleChangeAmount = (e) => {
        setActualValue({
            ...actualValue,
            [e.target.id]:Number(e.target.value)
        })

        if(error.amount.failed){
            setError({
                ...error,
                amount:{
                    failed:false
                }
            })
        }
    }
    
    const handleAddToMixComb = () => {
        //*Entry array = entrArr
        // const empty = Object.entries(actualValue).map((entrArr, idx) => {
            //*This doesnt update both error states when they are empty
            // if(entrArr[1] === "" || entrArr[1] === null) {
            //     console.log(error[entrArr[0]])
            //     setError({
            //         ...error,
            //         [entrArr[0]]:{
            //             failed:true,
            //             message:"Empty values are not accepted"
            //         }
            //     })
            // }
        // })
        
        if(actualValue.amount === null && actualValue.strain === ""){
            setError(
                {
                    ...error,
                    strain:{
                        failed:true,
                        message:"Empty values are not accepted"
                    },
                    amount:{
                        failed:true,
                        message:"Empty values are not accepted"
                    },
                }
            )
            return
        }
        
        if(actualValue.strain === "" && actualValue.amount !== null){
            setError(
                {
                    ...error,
                    strain:{
                        failed:true,
                        message:"Empty values are not accepted"
                    }, 
                }
            )
            return
        }

        if(actualValue.strain !== "" && actualValue.amount === null){
            setError(
                {
                    ...error,
                    amount:{
                        failed:true,
                        message:"Empty values are not accepted"
                    }, 
                }
            )
            return
        }


        if(actualValue.strain !== "" && actualValue !== null){
            setMix({
                ...mix,
                products:[...mix.products, actualValue]
            })
        }

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

    useEffect(() => {
        if(mix.products.length >1){
            //*The limit sum of amounts should be 100%
            const total = mix.products.reduce((prev, curr) => {
                let prevObj
                if(typeof prev === "object"){
                    prevObj = prev.amount
                } else {
                    prevObj = prev
                }
                return curr.amount + prevObj
            })
            console.log(total)

            if(total === 100){
                //*Disable button
                setCanAdd(false)
            }
        }
    }, [mix])

    
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
                            return <TextField helperText={error.strain.message} error={error.strain.failed} {...params} label="Strain"/>
                        }}
                        getOptionLabel={(option) => {
                            return option.name
                        }}
                        onChange={handleChangeStrain}
                        sx={theme.input.mobile.fullSize.desktop.halfSize}
                />

                <TextField
                    id="amount"
                    label="Amount %"
                    onChange={handleChangeAmount}
                    sx={theme.input.mobile.twoThirds.desktop.quarterSize}
                    error={error.amount.failed}
                    helperText={error.amount.message}
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
                <Fab onClick={handleAddToMixComb} disabled={!canAdd} color="primary" aria-label="add" >
                    <AddIcon />
                </Fab>

                <Typography margin={"4%"} color={theme.textColor.darkGray}>Mix Length : {mix.products.length}</Typography>

                

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

                        <TextField label="Mix Price" variant="outlined" sx={theme.input.mobile.fullSize.desktop.halfSize}>
                            
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
