import React, {useState} from 'react'
//*MUI Components
import { 
    Autocomplete, Checkbox, 
    FormControlLabel, TextField, 
    Typography, Button 
} from '@mui/material'
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'

export const NewOrder = () => {
    const [options, setOptions] = useState({
        customers:  [],
        products:   []
    })
    

    const handleChangeDate = (date) => {
        console.log("Date changing")
    }
  return (
    <>
        <Typography>New order settings</Typography>

        <Autocomplete
        options={options.customers}
        renderInput={(params) => {
            return <TextField
                    {...params}
                    label="Customer"
                />
        }}
        />
        
        <Autocomplete
        options={options.products}
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
        />

        <Typography>Select size</Typography>
        <FormControlLabel control={<Checkbox/>} label="Small"/> 
        <FormControlLabel control={<Checkbox/>} label="Medium"/> 
        <FormControlLabel control={<Checkbox/>} label="Big"/> 

        
        <Typography>Delivery date</Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                label="Select a date"
                onChange={handleChangeDate}
                renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
        

        <Button>
            Add more products
        </Button>

    </>
  )
}
