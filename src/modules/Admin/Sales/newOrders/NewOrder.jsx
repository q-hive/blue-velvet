import React, {useEffect, useState} from 'react'
//*MUI Components
import { 
    Autocomplete, TextField, 
    Typography, Button, Box, FormHelperText, getInputUtilityClass, Snackbar, Alert, Stack, CircularProgress 
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
import { useLocation, useNavigate } from 'react-router-dom'
import { UserDialog } from '../../../../CoreComponents/UserFeedback/Dialog'


export const NewOrder = (props) => {
    const [products,setProducts]= useState([])
    
    // const useQuery = () => new URLSearchParams(useLocation().search)
    // const query = useQuery()

    // const paramVerb = () => {
    //     if(Boolean(query.get('type'))){
    //         return "Update"
    //     }

    //     return "Save"
    // }

    // const isEdition = props.edit.isEdition
    // const prevOrderID = props.edit.values.order

    

    //*Auth context
    const getContextProducts = () => {
        let scopeProducts
        
        if(props.edit.isEdition){
            scopeProducts = props.edit.order.products.map((product) => {
                return product
            })

            products.push(scopeProducts)

        }
        return products
    }
    
    const {user, credential} = useAuth()

    const navigate = useNavigate()
    //*Data States
    const [loading,setLoading] = useState(false)
    const [loadingWithDefault, setLoadingWithDefault] = useState()
    const [options, setOptions] = useState({
        customers:  [],
        products:   []
    })
    const [input, setInput] = useState({
        customer:           {},
        product:            {},
        smallPackages:      undefined,
        mediumPackages:     undefined,
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
    })
    //Snackbar
    const [open, setOpen] = useState(false);

        const handleClose = (event, reason) => {
            if (reason === 'clickaway') {
            return;
            }

            setOpen(false);
        };
    //

    //Get invoice
    const getOrderInvoice = async (params) => {
        setLoading(true)
        const orderPDF = await api.api.get(`${api.apiVersion}/files/order/invoice/${params._id}`, {
            headers: {
                authorization: credential._tokenResponse.idToken,
                user:user
            }
        })
        return orderPDF
    }

    // const getPrevValues = async ()=> {
    //     const ordersData = await api.api.get(`${api.apiVersion}/orders/?id=${prevOrderID}`,{
    //         headers:{
    //             "authorization":    credential._tokenResponse.idToken,
    //             "user":             user
    //         }
    //     })

    //     return ordersData.data
    // }

    

    

    // const pV = getPrevValues()


    // console.log("prevValues",pV)
    //

    //Dialog
    const [dialog, setDialog] = useState({
        open:false,
        title:"",
        message:"",
        actions:[]
    })
    //
    
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
        let packages
        if(e){
            if(e.target.id === "add"){
                if(input.smallPackages && input.mediumPackages){
                    packages = [
                        {
                            "number":input.smallPackages,
                            "size": "small"
                        },
                        {
                            "number":input.mediumPackages,
                            "size": "medium"
                        }
                    ]
                } else {
                    packages = [
                        {
                            "number": input.smallPackages || input.mediumPackages,
                            "size": input.smallPackages ? "small" : input.mediumPackages ? "medium" : "small"
                        }
                    ]
                }
                
                products.push({
                    "name": input.product.name,
                    "status": "production",
                    "seedId": input.product?.seed,
                    "provider": input.product?.provider,
                    "_id": input.product._id,
                    "packages": packages
                })

                setInput({
                    ...input,
                    product:        {},
                    smallPackages:  undefined,
                    mediumPackages: undefined,
                })
            }
        }
    }
    const handleDeleteProduct = (product)=>{
        console.log("antes",products)

          var arr = products.filter(prod =>{
            return prod.name != product.name
          })
          setProducts(arr)
        
        console.log("despues",products)
        console.log("tempArr",arr)
        
    }
    
    const handleSetOrder = async (e) => {
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

        const mapInput = () => {
            let mappedData
            let useProducts = false
            let packages
            if(input.smallPackages && input.mediumPackages){
                packages = [
                    {
                        "number":input.smallPackages,
                        "size": "small"
                    },
                    {
                        "number":input.mediumPackages,
                        "size": "medium"
                    }
                ]
            } else {
                packages = [
                    {
                        "number": input.smallPackages || input.mediumPackages,
                        "size": input.smallPackages ? "small" : input.mediumPackages ? "medium" : "small"
                    }
                ]
            }

            
            const mappedInput = {
                "name": input.product.name,
                "status": "production",
                "seedId": input.product.seed,
                "provider": input.product.provider,
                "_id": input.product._id,
                "packages": packages
            }

            if(products.length>0){
                useProducts = true
            }

            
            
            mappedData = {
                "customer": input.customer,
                "products": useProducts ? products : [mappedInput],
                "status":"seeding",
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

            if(response.status === 201){
                setOpen(true);
                products.splice(0, products.length-1)
                setDialog({
                    ...dialog,
                    open:true,
                    title:"Order created succesfully",
                    actions:[ 
                        {
                            label:"Continue",
                            btn_color:"primary",
                            execute:() => {
                                window.location.reload()
                            }
                        },
                        {
                            label:loading ? <CircularProgress/> : "Print Order's Invoice",
                            btn_color:"secondary",
                            execute:() => {
                                getOrderInvoice(response.data.data).then((result) => {

                                    const url = window.URL.createObjectURL(new Blob([new Uint8Array(result.data.data.data).buffer]))
                                    const link = document.createElement('a')
                                    link.href = url;
                                    
                                    link.setAttribute('download', `Invoice ${response.data.data._id}.pdf`)
                                    
                                    document.body.appendChild(link)
                                    link.click()
                                    setLoading(false)
                                })
                                .catch((err) => {
                                    setLoading(false)
                                    setDialog({
                                        ...dialog,
                                        open:true,
                                        title:"Error getting file",
                                        message: "Please try again, there was an issue getting the file",
                                        actions:[
                                            {
                                                label:"Ok",
                                                execute:() => window.location.reload()
                                            }
                                        ]

                                    })
                                })
                            }
                        }
                    ]
                    
                })

            }
            if(response.status === 500){
                setDialog({
                    ...dialog,
                    open:true,
                    title:"Order could not be created",
                    actions:[ 
                        {
                            label:"Retry",
                            btn_color:"primary",
                            execute:() => {
                                window.location.reload()
                            }
                        },
                        {
                            label:"Close",
                            btn_color:"secondary",
                            execute:() => {
                                setDialog({...dialog,open:false})
                            }
                        }
                    ]
                    
                }) }
        } catch (err) {
            console.log(err)
        }
    
    
        return
    }
        
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
            return Boolean(input.smallPackages) || Boolean(input.mediumPackages)
        }
        
        const validProduct = Object.keys(input.product) !== 0
        const validPackages = validatePackages()
        
        if(validProduct && validPackages){
            setCanSendOrder(() => {
                return true
            })
        }
    
    }, [input.product, input.smallPackages,input.mediumPackages, input.size])

  return (
    <>
                <UserDialog
                    title={dialog.title}
                    content={dialog.message}
                    dialog={dialog}
                    setDialog={setDialog}
                    actions={dialog.actions}
                    open={dialog.open}
                />

    

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
                {
                    props.edit.isEdition

                    ?
                        <div>Must show component for DEFAULT PRODUCT FROM ROW OF DATA GRIS IN SALES MODULE</div>                    
                    :
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
                }
            

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
                    {/* <TextField
                        id="largePackages"
                        type="number"
                        label="Large"
                        placeholder="Quantity"
                        sx={BV_THEME.input.mobile.thirdSize.desktop.quarterSize}
                        onChange={(e) => handleChangeInput(e, e.target.value, "input")}
                        helperText={error.largePackages.active ? error.largePackages.message : ""}
                        error={error.largePackages.active}
                        value={input.largePackages ? input.largePackages : ""}
                    /> */}
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

            {/* Generate Feedback table */}
            {products.length != 0 ? 
                <Box  sx={{display:"inline-block",minWidth:"22em",textAlign:"justify",alignItems:"center",marginTop:"10vh",padding:"3px"}}>
                    <hr color="secondary"/>
                    <Typography color="secondary" sx={{textAlign:"center",marginTop:1}}>
                        Products in Order
                    </Typography>
                    
                    <table style={{marginTop:"1vh",width:"100%"}}>
                        <thead>
                            <tr>
                                <th><Typography variant="subtitle1">Name</Typography></th>
                                <th><Typography variant="subtitle1">Small</Typography></th>
                                <th><Typography variant="subtitle1">Medium</Typography></th>
                            </tr>
                        </thead>

                <tbody>
                    {getContextProducts().map((product,id)=>{
                        return (
                            
                            <tr key={id}>
                                <td>
                                    <Typography>{product.name}</Typography>
                                </td>
                                {  
                                        product.packages.length > 1 ? 
                                        
                                            product.packages.map((pkg,idx)=>{
                                                return (
                                            <td key={idx} style={{textAlign:"center"}}>
                                                <Typography>{pkg.number}</Typography>
                                            </td>)})
                                        :
                                        product.packages[0].size === "small" ? 
                                            <>
                                                <td style={{ textAlign: "center" }}>
                                                    <Typography>{product.packages[0].number}</Typography>
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    <Typography>0</Typography>
                                                </td>
                                            </>
                                            :
                                            <>
                                                <td style={{ textAlign: "center" }}>
                                                    <Typography>0</Typography>
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    <Typography>{product.packages[0].number}</Typography>
                                                </td>
                                            </>
                                }
                                <td>
                                    <Button variant="contained" onClick={()=>handleDeleteProduct(product)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
                </table>

                </Box>
                :
                null
            }

    
        </Box>


    </Box>
    <Snackbar open={open} anchorOrigin={{vertical: "bottom",horizontal: "center" }} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Order generated succesfully!
        </Alert>
    </Snackbar>
    </>

  )
}
