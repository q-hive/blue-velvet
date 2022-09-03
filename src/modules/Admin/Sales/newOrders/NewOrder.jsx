import React, {useEffect, useState} from 'react'
//*MUI Components
import { 
    Autocomplete, TextField, 
    Typography, Button, Box, FormHelperText, getInputUtilityClass 
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

// const order = {uGo
//     "customer": {
//         "_id": ""
//     },
//     "products":[],
//     "status":"",
//     "date": ""
// }
const products = []

export const NewOrder = () => {
    //*Auth context
    const {user, credential} = useAuth()

    //*Dialog

    const [dialog, setDialog] = useState({
        open:false,
        title:"",
        message:"",
        actions:[]
    })
    const uGood =()=>{
    setDialog({
        ...dialog,
        open:true,
        title:"Is a mix?",
        actions:[ {
            label:"Yes",
            btn_color:"primary",
            execute:() => {
                navigate("newProduct?mix=true")
            }
            },
            {
                label:"No",
                btn_color:"secondary",
                execute: () => {
                    navigate("newProduct")
                }
            }
        ]
        
    })}

    
    //*Data States
    const [options, setOptions] = useState({
        customers:  [],
        products:   []
    })
    const [input, setInput] = useState({
        customer:           {},
        product:            {},
        smallPackages:      undefined,
        mediumPackages:    undefined,
        largePackages:      undefined,
        size:               undefined,
        date:               undefined
    });

    //*Render states
    const [productsInput, setProductsInput] = useState(false)
    const [canSendOrder, setCanSendOrder] = useState(false)
    const [error, setError] = useState({
        customer:{
            message: "Please correct or fill the customer",
            active: false
        },
        product:{
            message:"Please correct or fill the product.",
            active: false
        },
        date:{
            message:"Please correct or fill the date.",
            active: false
        },
        size:{
            message:"Please correct or fill the size.",
            active: false
        },
        smallPackages:{
            message:"Please correct or fill the number of packages.",
            active: false
        },
        mediumPackages:{
            message:"Please correct or fill the number of packages.",
            active: false
        },
        largePackages:{
            message:"Please correct or fill the number of packages.",
            active: false
        },
    })
    
    const handleChangeInput = (e,v,r) => {
        let id
        let value
        id = e.target.id
        
        switch(r){
            case "input":
                value = v
                switch(id){
                    case "smallPackages":
                        value = Number(v)
                        break;
                    case "mediumPackages":
                        value = Number(v)
                        break;
                    case "largePackages":
                        value = Number(v)
                        break;
                }
                break;
            case "selectOption":
                id = e.target.id.split("-")[0]
                value = v
                break;
            default:
                break;
        }
        
        if(error[id].active){
            setError({
                ...error,
                [id]:{
                    ...error[id],
                    active: false
                }
            })
        }

        
        // const newRgexp =  /^*packages/
        
        console.log(id)
        console.log(value)
        setInput({
            ...input,
            [id]:value
        })

    }
    

    const handleChangeDate = (date) => {

        if(error.date.active){
            setError({
                ...error,
                date:{
                    ...error.date,
                    active:false
                }
            })
        }
        setInput({
            ...input,
            date: date
        })
        
    }
    
    const thereErrors = (input) => {
        setError({
            ...error,
            product:{
                ...error.product,
                active: Object.keys(input.product).length === 0
            },
            packages: {
                ...error.packages,
                active: input.packages === undefined
            },
            size: {
                ...error.size,
                active: input.size === undefined
            }
        })
        
        return (Object.keys(input.product).length === 0 || input.packages === undefined || input.size === undefined)
    }

    const handleAddToOrder = (e) => {
        console.log(e.target.id)
        if(e){
            switch(e.target.id){
                //*Validate if there are empty inputs if true show error
                case "":
                    //*Map actual data and modify input state so can receive packages
                    if(thereErrors(input)){
                        console.log("Errors should be activated")
                        return
                    }
                    if(input.product.packages){
                        setInput({
                            ...input,
                            product:{
                                ...input.product,
                                packages: [...input.product.packages, {number:input.packages, size:input.size}]
                            },
                            packages: undefined,
                            size: undefined
                        })
                        return
                    }

                    setInput({
                        ...input,
                        product:{
                            ...input.product,
                            packages: [{number:input.packages, size:input.size}]
                        },
                        packages: undefined,
                        size: undefined
                    })
                    break;
                case "product":
                    if(input.product?.packages){
                        products.push(input.product)
                    } else {
                        products.push(
                            {
                                ...input.product,
                                "packages":[{number: input.packages, size:input.size}]
                            }
                        )
                    }

                    
                    //*IF there is already a value in input.product check if completed and clean input
                    //* clear input product, packages, size
                    setInput({
                        ...input,
                        product:    {},
                        packages:   undefined,
                        size:       undefined
                    })
                    break;
                default:
                    break;
            }
        }
    }
    
    const handleSetOrder = async (e) => {
        console.log(e.target.id)
        if(e.target.id === "accept") {
            console.log(input.customer)
            setError({
                ...error,
                date:{
                    ...error.date,
                    active:input.date === undefined
                },
                customer:{
                    ...error.product,
                    active: Object.keys(input.customer).length === 0
                }
            })

            if(input.date !== undefined && Object.keys(input.customer).length !== 0){
                setProductsInput(true)
            }
            return 
        }
        
        console.log("Order Set! (but not really)")
        console.log(input)
        console.log(products)

        const mapInput = () => {
            let mappedData
            let useProducts = false

            const mappedInput = {
                "name": input.product.name,
                "status": "production",
                "seedId": input.product.seed,
                "provider": input.product.provider,
                "_id": input.product._id,
                "packages": [
                    {
                        "number":input.smallPackages,
                        "size": "small"
                    },
                    {
                        "number":input.mediumPackages,
                        "size": "medium"
                    },
                    ]
                } 

            //*If the size is larger, then the actual mappedProduct should change
            if(input.product.price.length === 3){
                mappedProduct["packages"].push({number:input.largePackages, size:"large"})

            }
            
            if(products.length>0){
                useProducts = true
            }

            
            
            mappedData = {
                "customer": input.customer,
                "products": useProducts ? products : [mappedInput],
                "status":"uncompleted",
                "date": input.date
            }

            return mappedData
        }
            
        try {
            const response = await api.api.post(`${api.apiVersion}/orders/`, mapInput(), {
                headers: {
                    authorization:  credential._tokenResponse.idToken,
                    user:           user
                }
            })

            console.log(response)

            if(response.status === 201){
                uGood()
            }
        } catch (err) {
            console.log(err)
        }
    
    
        return
    }
        

    const checkboxOptions = [
        { id: "option1", label: "small" },
        { id: "option2", label: "medium" },
        { id: "option3", label: "large" },   
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

    useEffect(() => {
        const validatePackages = () => {
            if(input.smallPackages && input.mediumPackages && input.largePackages){
                return true
            }

            return false
        }
        
        const validProduct = Object.keys(input.product) !== 0
        const validPackages = validatePackages()
        
        console.log(validPackages)
        if(validProduct && validPackages){
            setCanSendOrder(() => {
                return true
            })
        }
    
    }, [input.product, input.smallPackages,input.mediumPackages,input.largePackages, input.size])

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
                    const {product} = error
                    return <TextField
                            {...params}
                            helperText={product.active ? product.message : ""}
                            error={product.active}
                            label="Product"
                        />
                }}
                getOptionLabel={(opt) => opt.name ? opt.name : ""}
                isOptionEqualToValue={(o,v) => {
                    if(Object.keys(v).length === 0){
                        return true
                    }
                    return o.name === v.name
                }}
                onChange={handleChangeInput}
                value={Object.keys(input.product) !== 0 ? input.product : undefined}
                />

                {/* <TextField
                    id="packages"
                    type="number"
                    label="Number of packages"
                    sx={BV_THEME.input.mobile.fullSize.desktop.halfSize}
                    onChange={(e) => handleChangeInput(e, e.target.value, "input")}
                    helperText={error.packages.active ? error.packages.message : ""}
                    error={error.packages.active}
                    value={input.packages ? input.packages : ""}
                />

                 <Typography variant="h6" mb="2vh" mt="4vh">Select size</Typography>
                
                <CheckBoxGroup valueState={input} valueUpdate={setInput}>{checkboxOptions}</CheckBoxGroup>
                 //*TODO MANAGE ERROR FOR CHECKBOXGROUP 
                
                <Button id="packages" onClick={handleAddToOrder}>
                    Add packages
                </Button> */}

                <Typography variant="h5" color="secondary" marginY={3}>No. of Packages</Typography>
                
                <Box>

                    <TextField
                        id="smallPackages"
                        type="number"
                        label="Small"
                        placeholder="Quantity"
                        sx={BV_THEME.input.mobile.thirdSize.desktop.quarterSize}
                        onChange={(e) => handleChangeInput(e, e.target.value, "input")}
                        helperText={error.smallPackages.active ? error.smallPackages.message : ""}
                        error={error.smallPackages.active}
                        value={input.smallPackages ? input.smallPackages : ""}
                    />
                    <TextField
                        id="mediumPackages"
                        type="number"
                        label="Medium"
                        placeholder="Quantity"
                        sx={BV_THEME.input.mobile.thirdSize.desktop.quarterSize}
                        onChange={(e) => handleChangeInput(e, e.target.value, "input")}
                        helperText={error.mediumPackages.active ? error.mediumPackages.message : ""}
                        error={error.mediumPackages.active}
                        value={input.mediumPackages ? input.mediumPackages : ""}
                    />
                    <TextField
                        id="largePackages"
                        type="number"
                        label="Large"
                        placeholder="Quantity"
                        sx={BV_THEME.input.mobile.thirdSize.desktop.quarterSize}
                        onChange={(e) => handleChangeInput(e, e.target.value, "input")}
                        helperText={error.largePackages.active ? error.largePackages.message : ""}
                        error={error.largePackages.active}
                        value={input.largePackages ? input.largePackages : ""}
                    />
                </Box>
                
                <Button id="add" sx={{marginTop:"2vh"}} onClick={handleAddToOrder}>
                    Add product
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
                        const {customer} = error
                        return <TextField
                                {...params}
                                label="Customer"
                                helperText={customer.active ? customer.message : ""}
                                error={customer.active}
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
                        renderInput={(params) => {
                            const {date} = error
                            return <TextField 
                                    {...params} 
                                    helperText={date.active ? date.message : ""}
                                    error={date.active} 
                                    />
                        }}
                        value={input.date}
                        sx={()=>({...BV_THEME.input.mobile.fullSize.desktop.halfSize,})}
                    />
                </LocalizationProvider>
                <Button variant="contained" id="accept" onClick={handleSetOrder} sx={{marginTop:"2vh", color:{...BV_THEME.palette.white_btn}}}>
                    Select products
                </Button>
            </>
            }

            <Button id="order" variant="contained" onClick={handleSetOrder} disabled={!canSendOrder} sx={{marginTop:"2vh", color:{...BV_THEME.palette.white_btn}}}>
                Set Order
            </Button>

    
        </Box>
    </Box>
    </>

  )
}
