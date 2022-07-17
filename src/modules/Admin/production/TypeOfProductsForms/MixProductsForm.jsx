import { Autocomplete, Box, Button, TextField } from '@mui/material'
import React from 'react'

export const MixProductsForm = () => {
    const strains = ["Raddish", "Tomatoe", "Khalua"]
    
  return (
    <div style={{paddingLeft:"10vw", paddingRight:"10vw"}}>
        <Box sx={{display:"flex", width:"100%", justifyContent:"space-between",justifyItems:"center", alignItems:"center"}}>
            <Autocomplete
            options={strains}
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
            }}
            />
            <Autocomplete
            options={strains}
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
            }}
            />
            <Autocomplete
            options={strains}
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
            }}
            />
            <Autocomplete
            options={strains}
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
            }}
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
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
            }}
            />
            <Autocomplete
            options={strains}
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
            }}
            />
            <Autocomplete
            options={strains}
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
            }}
            />
            <Autocomplete
            options={strains}
            renderInput={(params) => {
                return <TextField label="Strain" {...params}/>
            }}
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
            <TextField label="Mix name"/>
            <TextField label="Mix label"/>
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
            <Button variant="contained">
                Done
            </Button>
        </Box>
    </div>
  )
}
