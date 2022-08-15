import React, {useState} from 'react'
//*MUI Components
import { 
    Autocomplete, Checkbox, 
    FormControlLabel, TextField, 
    Typography, Button, Box, Stack 
} from '@mui/material'
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import { BV_THEME } from '../../../../theme/BV-theme'

export const NewOrder = () => {
    const [options, setOptions] = useState({
        customers:  ["Elmo","test"],
        products:   ["prime"]
    })
    

    const handleChangeDate = (date) => {
        console.log("Date changing")
    }
  return (
    <>
    <Box sx={
        {
            display:"flex",
            width:"100%", 
            alignItems:"center",
            marginTop:"5vh", 
            flexDirection:"column",
        }
    }>
        <Box sx={{ width: "90%", display:"flex", flexDirection:{xs:"column",sm:"column"}  }} alignItems="center" textAlign="center">
    
        <Typography variant="h4" mb={{xs:"5vh",md:"3vh"}}>New order settings</Typography>

        <Autocomplete
            options={options.customers}
            sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})}
            renderInput={(params) => { 
                return <TextField
                        {...params}
                        label="Customer"
                    />
            }}
        />
        
        <Autocomplete
            options={options.products}
            sx={BV_THEME.input.mobile.fullSize.desktop.halfSize}
            renderInput={(params) => { 
                return <TextField
                        {...params}
                        label="Product"
                    />
            }}
        />
        
        <TextField
            type="number"
            label="Number of packages"
            sx={BV_THEME.input.mobile.fullSize.desktop.halfSize}
        />

        <Typography variant="h6" mb="2vh" mt="4vh">Select size</Typography>
        <Stack direction="row" >
            <FormControlLabel control={<Checkbox/>} label="Small"/> 
            <FormControlLabel control={<Checkbox/>} label="Medium"/> 
            <FormControlLabel control={<Checkbox/>} label="Large"/> 
        </Stack>

        
        <Typography variant="h6" mb="1vh" mt="4vh">Delivery date</Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                label="Select a date"
                onChange={handleChangeDate}
                renderInput={(params) => <TextField {...params} />}
                sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize,})}
            />
        </LocalizationProvider>
        

        <Button sx={{marginTop:"2vh"}}>
            Add more products
        </Button>

    
        </Box>
    </Box>
    </>

  )
}
