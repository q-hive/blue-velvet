import React, { useState, useEffect, useRef } from 'react'

//*COMPONENTS FROM MUI
import { 
    Autocomplete, Box, Button, 
    TextField, Typography, useTheme, 
    Fab 
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import CameraIcon from '@mui/icons-material/AddPhotoAlternate';

//*THEME
import { BV_THEME } from '../../../../theme/BV-theme'
import { UserDialog } from '../../../../CoreComponents/UserFeedback/Dialog'
//*NETWORK AND API
import api from '../../../../axios'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../../contextHooks/useAuthContext'

//*Auth
const amounts = ["25","30","40","50","60","70","80","90"]

export const MixProductsForm = () => {
    const theme = useTheme(BV_THEME);
    
    //*DATA STATES
    const [strains, setStrains] = useState([])
    const [mix, setMix] = useState({
        products:[],
        name:"",
        label:null,
        cost:0
    })

    //*RENDER STATES
    const [actualValue, setActualValue] = useState({
        strain:"",
        amount:null
    })
    const [showFinal, setShowFinal] = useState(false)
    const [canAdd, setCanAdd] = useState(true)
    const ref = useRef(null)
    

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
            ref.current.value = ""
            setMix({
                ...mix,
                products:[...mix.products, actualValue]
            })

        }

    }

    const handleChangeFinalData = (e) => {
        setMix({
            ...mix,
            [e.target.id]:e.target.value            
        })
    }

    const handleChangeLabel = (e) => {
        console.log(e.target.files)
        setMix({
            ...mix,
            label:e.target.files
        })
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
        console.log(mix)
        const model = {
            name:   mix.name,
            price:   Number(mix.price), // * Cost per tray,
            mix: {
                isMix:true,
                name:mix.name,
                products:mix.products
            },
            status:"stopped"
        }
        const hasLabel = mix.label !== null
        let label
        if(hasLabel){
            label = new FormData()

            label.append(
                "label",
                mix.label[0],
                mix.label[0].name
            )

            model.label = label
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
                            navigate(`/${user.uid}/${user.role}/production`)
                        }
                        
                    },
                    {
                        label:"End",
                        btn_color:"secondary",
                        execute:() => {
                            navigate(`/${user.uid}/${user.role}/dashboard`)
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
                    ref={ref}
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
            <Button variant="contained" size='large' disabled={showFinal} onClick={handleSetMix}>
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
                        <TextField label="Mix Name" id="name" onChange={handleChangeFinalData} variant="outlined" sx={theme.input.mobile.fullSize.desktop.halfSize}>
                            
                        </TextField>

                        <TextField label="Mix Price" id="price" onChange={handleChangeFinalData} variant="outlined" sx={theme.input.mobile.fullSize.desktop.halfSize}>
                            
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

                        <Fab color="primary" component="label" id="label" aria-label="add" sx={{marginY:"4%"}} >
                                <input  type="file" accept="image/*" onChange={handleChangeLabel} hidden />
                                <CameraIcon />
                        </Fab>
                    
                    <Button variant="contained" onClick={handleSendMixData} size='large' >
                        Save product mix
                    </Button>

                </Box>
            </div>
            :
            null
        }
        

    
        

        
    </div>
    



  )
}
