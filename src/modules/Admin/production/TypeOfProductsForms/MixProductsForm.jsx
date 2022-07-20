import React, { useState } from 'react'

//*COMPONENTS FROM MUI
import { Autocomplete, Box, Button, TextField } from '@mui/material'

//*NETWORK AND API
import api from '../../../../axios'


export const MixProductsForm = () => {
    //*TODO STRAINS MUST COME FROM MICROGREENS
    const strains = ["Raddish", "Tomatoe", "Khalua"]
    const [mix, setMix] = useState({
        products:[],
        name:"",
        label:"",
        cost:0
    })

    const handleChangeAutoCompletes = (e,v,r) => {
        //*event, value, reason
        switch(r){
            case "selectOption":
                mix.products.push(v)
                break;
            case "clear":
                console.log(e)
                break;
            default:
                break;
        }
    }

    const handleChangeName = (e) => {
        console.log(e)
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
        console.log(mix)
        const model = {
            name:   mix.name,
            cost:   mix.cost, // * Cost per tray,
            mix: {
                isMix:true,
                name:mix.name,
                products:mix.products
            },
        }
        api.api.post('/products/', model)
    }
  return (
    <div style={{paddingLeft:"10vw", paddingRight:"10vw"}}>
        <Box sx={{display:"flex", width:"100%", justifyContent:"space-between",justifyItems:"center", alignItems:"center"}}>
            <Autocomplete
            options={strains}
            id="p1"
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
            }}
            onChange={handleChangeAutoCompletes}
            />
            <Autocomplete
            options={strains}
            id="p2"
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
            }}
            onChange={handleChangeAutoCompletes}
            />
            <Autocomplete
            options={strains}
            id="p3"
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
            }}
            onChange={handleChangeAutoCompletes}
            />
            <Autocomplete
            options={strains}
            id="p4"
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
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
            id="p5"
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
            }}
            onChange={handleChangeAutoCompletes}
            />
            <Autocomplete
            options={strains}
            id="p6"
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
            }}
            onChange={handleChangeAutoCompletes}
            />
            <Autocomplete
            options={strains}
            id="p7"
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
            }}
            onChange={handleChangeAutoCompletes}
            />
            <Autocomplete
            options={strains}
            id="p8"
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
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
            <TextField onChange={handleChangeCost} id="cost" type="number" label="Cost"/>
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
