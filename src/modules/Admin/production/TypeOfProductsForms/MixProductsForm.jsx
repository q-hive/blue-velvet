import React, { useState, useEffect } from 'react'

//*COMPONENTS FROM MUI
import { Autocomplete, Box, Button, TextField } from '@mui/material'

//*NETWORK AND API
import api from '../../../../axios'
import { useNavigate } from 'react-router-dom'
import { UserDialog } from '../../../../CoreComponents/UserFeedback/Dialog'
import useAuth from '../../../../contextHooks/useAuthContext'

export const MixProductsForm = () => {
    //*TODO STRAINS MUST COME FROM MICROGREENS
    const [strains, setStrains] = useState([])
    const [mix, setMix] = useState({
        products:[],
        name:"",
        label:"",
        cost:0
    })
    const [dialog, setDialog] = useState({
        open:false,
        title:"",
        message:"",
        actions:[]
    })

    const {user} = useAuth()
    const navigate = useNavigate()
    
    const handleChangeAutoCompletes = (e,v,r) => {
        //*event, value, reason
        switch(r){
            case "selectOption":
                mix.products.push(v._id)
                break;
            case "clear":
                console.log(e)
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
    
    const handleSendMixData = () => {
        const model = {
            name:   mix.name,
            cost:   mix.cost, // * Cost per tray,
            mix: {
                isMix:true,
                name:mix.name,
                products:mix.products
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
                        execute: () => {
                            window.location.reload()
                        }
                    },
                    {
                        label:"End",
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
        
        <Box sx={{display:"flex", width:"100%", justifyContent:"space-between",justifyItems:"center", alignItems:"center"}}>
            <Autocomplete
            options={strains}
            id="p1"
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
            }}
            getOptionLabel={(option) => {
                return option.name
            }}
            onChange={handleChangeAutoCompletes}
            />
            <Autocomplete
            options={strains}
            id="p2"
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
            }}
            getOptionLabel={(option) => {
                return option.name
            }}
            onChange={handleChangeAutoCompletes}
            />
            <Autocomplete
            options={strains}
            id="p3"
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
            }}
            getOptionLabel={(option) => {
                return option.name
            }}
            onChange={handleChangeAutoCompletes}
            />
            <Autocomplete
            options={strains}
            id="p4"
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
            }}
            getOptionLabel={(option) => {
                return option.name
            }}
            onChange={handleChangeAutoCompletes}
            />
        </Box>
        <Box sx={
            {
                display:"flex",
                width:"100%", 
                justifyContent:"space-between",
                marginTop:"5vh"
            }
        }>
            <Autocomplete
            options={strains}
            id="a1"
            renderInput={(params) => {
                return <TextField label="Amount %" {...params}/>
            }}
            getOptionLabel={(option) => {
                return option.name
            }}
            onChange={handleChangeAutoCompletes}
            />
            <Autocomplete
            options={strains}
            id="a2"
            renderInput={(params) => {
                return <TextField label="Amount %" {...params}/>
            }}
            getOptionLabel={(option) => {
                return option.name
            }}
            onChange={handleChangeAutoCompletes}
            />
            <Autocomplete
            options={strains}
            id="a3"
            renderInput={(params) => {
                return <TextField label="Amount %" {...params}/>
            }}
            getOptionLabel={(option) => {
                return option.name
            }}
            onChange={handleChangeAutoCompletes}
            />
            <Autocomplete
            options={strains}
            id="a4"
            renderInput={(params) => {
                return <TextField label="Amount %" {...params}/>
            }}
            getOptionLabel={(option) => {
                return option.name
            }}
            onChange={handleChangeAutoCompletes}
            />
        </Box>
        <Box sx={
            {
                display:"flex", 
                width:"100%", 
                justifyContent:"space-evenly",
                alignItems:"center",
                marginTop:"5vh"
            }
        }>
            <TextField onChange={handleChangeName} id="name" label="Mix name"/>
            {/* //*TODO SET Component for adding photo (LUIS H) - NO CONNECTION TO DB THIS IS HANDLED BY OTHER TEAMMATE */}
            <TextField onChange={handleChangeLabel} id="label" label="Mix label"/>
        </Box>
        <Box sx={
            {
                display:"flex", 
                width:"100%", 
                justifyContent:"space-evenly",
                alignItems:"center",
                marginTop:"5vh"
            }
        }>
            <TextField onChange={handleChangeCost} id="cost" type="number" label="Price"/>
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
            <Button variant="contained" onClick={handleSendMixData}>
                Done
            </Button>
        </Box>
    </div>
  )
}
