import React, {useEffect, useState} from 'react'
//*MUI Components
import { 
    Autocomplete, TextField, 
    Typography, Button, Box 
} from '@mui/material'
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'

//*App components
import { BV_THEME } from '../../../../theme/BV-theme'
import {CheckBoxGroup} from "../../../../CoreComponents/CheckboxGroup"

//*Contexts
import useAuth from '../../../../contextHooks/useAuthContext'

//*Network and API
import api from '../../../../axios.js'

export const NewOrder = () => {
    //*Auth context
    const {user, credential} = useAuth()
    
    
    //*Data States
    const [options, setOptions] = useState({
        customers:  [],
        products:   []
    })
    const [input, setInput] = useState({
        customer:   {},
        product:    {},
        packages:   undefined,
        size:       undefined,
        date:       undefined
    });

    //*Render states
    const [productsInput, setProductsInput] = useState(false)

    const handleChangeInput = (e,v,r) => {
        let id
        id = e.target.id
        if(r === "selectOption"){
            id = e.target.id.split("-")[0]
        }
        setInput({
            ...input,
            [id]:v
        })
    }
    

    const handleChangeDate = (date) => {
        setInput({
            ...input,
            date: date
        })
        
    }

    const handleSetOrder = (e) => {
        if(e.target.id === "accept") {
            setProductsInput(true)
            return 
        }
        
        console.log("Order Set! (but not really)")
        console.log(input)
    }

    const checkboxOptions = [
        { id: "option1", label: "Small" },
        { id: "option2", label: "Medium" },
        { id: "option3", label: "Large" },   
    ]

    useEffect(() => {
        const getData = async () => {
            const customers = await api.api.get(`${api.apiVersion}/customers/`, {
                headers:{
                    "authorization":    credential._tokenResponse.idToken,
                    "user":             user
                }
            })
            const products = await api.api.get(`${api.apiVersion}/products/`, {
                headers:{
                    "authorization":    credential._tokenResponse.idToken,
                    "user":             user
                }
            })
            return {customers:customers.data.data, products: products.data.data}
        }

        getData()
        .then((data) => {
            setOptions((options) => {
                return ({
                    ...options,
                    products: data.products,
                    customers: data.customers
                })
            })
        })
        .catch(err => {
            console.log(err)
        })
    },[])

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
    
        {
            productsInput
            ?
            <>
                <Autocomplete
                id="product"
                options={options.products}
                sx={BV_THEME.input.mobile.fullSize.desktop.halfSize}
                renderInput={(params) => { 
                    return <TextField
                            {...params}
                            label="Product"
                        />
                }}
                getOptionLabel={(opt) => opt.name}
                onChange={handleChangeInput}
                />

                <TextField
                    id="packages"
                    type="number"
                    label="Number of packages"
                    sx={BV_THEME.input.mobile.fullSize.desktop.halfSize}
                    onChange={(e) => handleChangeInput(e, e.target.value, "input")}
                />

                <Typography variant="h6" mb="2vh" mt="4vh">Select size</Typography>
                <CheckBoxGroup valueState={input} valueUpdate={setInput}>{checkboxOptions}</CheckBoxGroup>

                <Button sx={{marginTop:"2vh"}}>
                    Add more products
                </Button>
            
            </>
            :
            <>
                <Typography variant="h4" mb={{xs:"5vh",md:"3vh"}}>New order settings</Typography>

                <Autocomplete
                    id="customer"
                    options={options.customers}
                    sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize})}
                    renderInput={(params) => { 
                        return <TextField
                                {...params}
                                label="Customer"
                            />
                    }}
                    onChange={handleChangeInput}
                    getOptionLabel={(opt) => opt.name}
                />

                <Typography variant="h6" mb="1vh" mt="4vh">Delivery date</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Select a date"
                        onChange={handleChangeDate}
                        renderInput={(params) => <TextField {...params} />}
                        sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize,})}
                    />
                </LocalizationProvider>
                <Button variant="contained" id="accept" onClick={handleSetOrder} sx={{marginTop:"2vh", color:{...BV_THEME.palette.white_btn}}}>
                    Select products
                </Button>
            </>
            }

            <Button variant="contained" onClick={handleSetOrder} sx={{marginTop:"2vh", color:{...BV_THEME.palette.white_btn}}}>
                Set Order
            </Button>

    
        </Box>
    </Box>
    </>

  )
}
