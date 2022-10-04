import {useState} from "react"

import { UserModal } from "../CoreComponents/UserActions/UserModal"

import api from '../axios'
import useAuth from "../contextHooks/useAuthContext"
import { useNavigate } from "react-router-dom"
import { UserDialog } from "../CoreComponents/UserFeedback/Dialog"

import { BV_THEME } from "../theme/BV-theme"
import { Button, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Divider } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const productsColumns = [
    {
        field:"name",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Microgreen",
        minWidth:150,
        flex:1,
    },
    {
        field:"orders",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Orders",
        width:150,
        renderCell:(params) => {
            params.value.forEach((order, idx) => {
                if(!order){
                    params.value.splice(idx, 1)
                }
                return
            })
            return params.value.length
        },
        flex:1
    },
    {
        field:"price",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Prod. Price",
        minWidth:180,
        flex:1,
        renderCell:(params) => {
            return (
                <>
                    <Box display="flex" p={1}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Price</Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                                    {params.formattedValue.map((obj) => {
                                        return (
                                            <>
                                            <Typography align="center">Size {obj.packageSize}:  ${obj.amount} </Typography>
                                            <Divider /> 
                                            </>
                                            )})}
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </>
            )
        }
    },
    {
        field:"parameters",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Seeds /gr",
        renderCell:(params) => {
            if(params.formattedValue != undefined){
                return params.formattedValue.seedingRate
            }
            return "N/D"
        },
        flex:1
    },
    {
        field:"parameter2",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Harvest",
        valueGetter:(params) => {
            if(params.row.parameters != undefined){
                return params.row.parameters.harvestRate
            }
            return "N/D"
        },
        flex:1
    },
    {
        field:"actions",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Actions",
        renderCell: (params) => {
            const [modal,setModal] = useState({
                open:false,
                title:"",
                content:"",
                actions:[]
            })
            const [dialog, setDialog] = useState({
                open:false,
                title:"",
                message:"",
                actions:[]
            })

            const [loading, setLoading] = useState(false)

            const {user, credential} = useAuth()
            const navigate = useNavigate()
            
            const handleModal = () => {
                setModal({
                    ...modal,
                    open:true,
                    title:"Select an action",
                    actions: [
                        {
                            label:"Stop production",
                            type:"normal",
                            btn_color:"white_btn",
                            execute:() => {
                                setLoading(true)
                                setModal({
                                    ...modal,
                                    open:false
                                })
                                api.api.patch(`${api.apiVersion}/products/?id=${params.id}&field=status`,{value:"stopped"},{
                                    headers:{
                                        authorization:credential._tokenResponse.idToken,
                                        user:user
                                    }
                                })
                                .then((res) => {
                                    setLoading(false)
                                    setDialog({
                                        ...dialog,
                                        open:true,
                                        title:"Production stopped",
                                        message:"The production of the product you selected has been stopped.",
                                        actions:[
                                            {
                                                label:"Ok",
                                                btn_color:"primary",
                                                execute:() => {
                                                    params.api.forceUpdate()
                                                    setDialog({
                                                        ...dialog,
                                                        open:false
                                                    })
                                                }
                                            }
                                        ]
                                    })
                                })
                                .catch(err => {
                                    setLoading(false)
                                    setDialog({
                                        ...dialog,
                                        open:true,
                                        title:"Product update failed",
                                        message:"There was an error updating the product status.",
                                        actions:[
                                            {
                                                label:"Ok",
                                                btn_color:"primary",
                                                execute:() => {
                                                    setDialog({
                                                        ...dialog,
                                                        open:false
                                                    })
                                                }
                                            }
                                        ]
                                    })
                                })
                            }
                        },
                        {
                            label:"Edit product",
                            btn_color:"white_btn",
                            type:"privileged",
                            execute:() => {
                                navigate(`/${user.uid}/${user.role}/production/editProduct/?id=${params.id}`)
                            }
                        },
                        {
                            label:"Delete",
                            type:"dangerous",
                            btn_color:"secondary",
                            execute:() => {
                                console.log("Are you sure you want to delete this product?")
                                setModal({
                                    ...modal,
                                    open:false
                                })
                                setDialog({
                                    ...dialog,
                                    open:true,
                                    title:"Are you sure you want to delete this product?",
                                    message:"The product, and the orders related to this product are going to be deleted.",
                                    actions:[
                                        {
                                            label:"Yes",
                                            btn_color:"primary",
                                            execute:() => {
                                                setDialog({
                                                    ...dialog,
                                                    open:false,
                                                })
                                                setLoading(true)
                                                
                                                api.api.delete(`${api.apiVersion}/products/?id=${params.id}`,{
                                                    headers:{
                                                        authorization:credential._tokenResponse.idToken,
                                                        user:user
                                                    }
                                                })
                                                .then(() => {
                                                    console.log(params)
                                                })
                                                .catch((err) => {
                                                    setDialog({
                                                        ...dialog,
                                                        open:true,
                                                        title:"Error deleting product",
                                                        message:"",
                                                        actions:[
                                                            {
                                                                label:"Ok",
                                                                btn_color:"primary",
                                                                execute:() => {
                                                                    setDialog({
                                                                        ...dialog,
                                                                        open:false
                                                                    })
                                                                }
                                                            }
                                                        ]
                                                    })
                                                })
                                            }
                                        }
                                    ]
                                })
                            }
                        },
                    ]
                })

            }
            
            return (
                <>
                    <UserModal
                    modal={modal}
                    setModal={setModal}
                    title={modal.title}
                    content={modal.content}
                    actions={modal.actions}
                    />

                    <UserDialog
                    title={dialog.title}
                    content={dialog.message}
                    dialog={dialog}
                    setDialog={setDialog}
                    actions={dialog.actions}
                    open={dialog.open}
                    />    
                
                    <Button variant='contained' onClick={handleModal} disabled={loading || (user.role === "employee")} sx={BV_THEME.button.table}> {loading ? 'Loading...' : 'View'} </Button>    
                
                </>
                
            )
        },
        flex:1
    },
    {
        field:"status",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Status",
        flex:1
    },
]

export const productsColumnsMobile = [
    {
        field:"name",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Microgreen",
        minWidth:150,
        flex:1,
    },
    {
        field:"orders",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Orders",
        width:150,
        renderCell:(params) => {
            params.value.forEach((order, idx) => {
                if(!order){
                    params.value.splice(idx, 1)
                }
                return
            })
            return params.value.length
        },
        flex:1
        
    },
    {
        field:"actions",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Actions",
        renderCell: (params) => {
            const [modal,setModal] = useState({
                open:false,
                title:"",
                content:"",
                actions:[]
            })
            const [dialog, setDialog] = useState({
                open:false,
                title:"",
                message:"",
                actions:[]
            })

            const [loading, setLoading] = useState(false)

            const {user, credential} = useAuth()
            const navigate = useNavigate()
            
            const handleModal = () => {
                setModal({
                    ...modal,
                    open:true,
                    title:"Select an action",
                    actions: [
                        {
                            label:"Stop production",
                            type:"normal",
                            btn_color:"white_btn",
                            execute:() => {
                                setLoading(true)
                                setModal({
                                    ...modal,
                                    open:false
                                })
                                api.api.patch(`${api.apiVersion}/products/?id=${params.id}&field=status`,{value:"stopped"},{
                                    headers:{
                                        authorization:credential._tokenResponse.idToken,
                                        user:user
                                    }
                                })
                                .then((res) => {
                                    setLoading(false)
                                    setDialog({
                                        ...dialog,
                                        open:true,
                                        title:"Production stopped",
                                        message:"The production of the product you selected has been stopped.",
                                        actions:[
                                            {
                                                label:"Ok",
                                                btn_color:"primary",
                                                execute:() => {
                                                    params.api.forceUpdate()
                                                    setDialog({
                                                        ...dialog,
                                                        open:false
                                                    })
                                                }
                                            }
                                        ]
                                    })
                                })
                                .catch(err => {
                                    setLoading(false)
                                    setDialog({
                                        ...dialog,
                                        open:true,
                                        title:"Product update failed",
                                        message:"There was an error updating the product status.",
                                        actions:[
                                            {
                                                label:"Ok",
                                                btn_color:"primary",
                                                execute:() => {
                                                    setDialog({
                                                        ...dialog,
                                                        open:false
                                                    })
                                                }
                                            }
                                        ]
                                    })
                                })
                            }
                        },
                        {
                            label:"Edit product",
                            btn_color:"white_btn",
                            type:"privileged",
                            execute:() => {
                                navigate(`/${user.uid}/${user.role}/production/editProduct/?id=${params.id}`)
                            }
                        },
                        {
                            label:"Delete",
                            type:"dangerous",
                            btn_color:"secondary",
                            execute:() => {
                                console.log("Are you sure you want to delete this product?")
                                setModal({
                                    ...modal,
                                    open:false
                                })
                                setDialog({
                                    ...dialog,
                                    open:true,
                                    title:"Are you sure you want to delete this product?",
                                    message:"The product, and the orders related to this product are going to be deleted.",
                                    actions:[
                                        {
                                            label:"Yes",
                                            btn_color:"primary",
                                            execute:() => {
                                                setDialog({
                                                    ...dialog,
                                                    open:false,
                                                })
                                                setLoading(true)
                                                
                                                api.api.delete(`${api.apiVersion}/products/?id=${params.id}`,{
                                                    headers:{
                                                        authorization:credential._tokenResponse.idToken,
                                                        user:user
                                                    }
                                                })
                                                .then(() => {
                                                    console.log(params)
                                                })
                                                .catch((err) => {
                                                    setDialog({
                                                        ...dialog,
                                                        open:true,
                                                        title:"Error deleting product",
                                                        message:"",
                                                        actions:[
                                                            {
                                                                label:"Ok",
                                                                btn_color:"primary",
                                                                execute:() => {
                                                                    setDialog({
                                                                        ...dialog,
                                                                        open:false
                                                                    })
                                                                }
                                                            }
                                                        ]
                                                    })
                                                })
                                            }
                                        }
                                    ]
                                })
                            }
                        },
                    ]
                })

            }
            
            return (
                <>
                    <UserModal
                    modal={modal}
                    setModal={setModal}
                    title={modal.title}
                    content={modal.content}
                    actions={modal.actions}
                    />

                    <UserDialog
                    title={dialog.title}
                    content={dialog.message}
                    dialog={dialog}
                    setDialog={setDialog}
                    actions={dialog.actions}
                    open={dialog.open}
                    />    
                
                    <Button variant='contained' onClick={handleModal} disabled={loading || (user.role === "employee")} sx={BV_THEME.button.table}> {loading ? 'Loading...' : 'View'} </Button>    
                
                </>
                
            )
        },
        flex:1
    },
]

export const salesColumns = [
    {
        field:"id",
        headerName:"ID",
        headerAlign:"center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"customer",
        headerName:"Customer",
        headerAlign:"center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"date1",
        headerName:"Tuesday",
        headerClassName:"header-sales-table",
        headerAlign:"center",
        align:"center",
        minWidth:{xs:"25%",md:100},
        flex:1
    },
    {
        field:"date2",
        headerName:"Friday",
        headerClassName:"header-sales-table",
        headerAlign:"center",
        align:"center",
        minWidth:{xs:"25%",md:100},
        flex:1
    },
    {
        field:"type",
        headerName:"type",
        headerClassName:"header-sales-table",
        headerAlign:"center",
        align:"center",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"income",
        headerName:"Income",
        headerClassName:"header-sales-table",
        headerAlign:"center",
        align:"center",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"status",
        headerName:"Status",
        headerAlign:"center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"actions",
        headerName:"Actions",
        headerAlign:"center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1,
        renderCell:(params) => {
            const {user, credential} = useAuth()
            const [loading, setLoading] = useState(false)
            
            const editOrder = () => console.log("Update Order")
            const deleteOrder = async () => {
                setLoading(true)
                const deleteOperation = await api.api.delete(`${api.apiVersion}/orders/custom/?key=_id&&value=${params.id}`, {
                    headers: {
                        authorization: credential._tokenResponse.idToken,
                        user:          user
                    }
                })

                return deleteOperation
            }
            const getOrderInvoice = async () => {
                setLoading(true)
                const orderPDF = await api.api.get(`${api.apiVersion}/files/order/invoice/${params.id}`, {
                    headers: {
                        authorization: credential._tokenResponse.idToken,
                        user:user
                    }
                })
                return orderPDF
            }
            const [modal,setModal] = useState({
                open:false,
                title:"",
                content:"",
                actions:[]
            })
            const [dialog, setDialog] = useState({
                open:false,
                title:"",
                message:"",
                actions:[]
            })

           

            const navigate = useNavigate()
            
            const handleModal = () => {
                setModal({
                    ...modal,
                    open:true,
                    title:"Select an action",
                    actions: [
                        {
                            label:"Update order",
                            btn_color:"white_btn",
                            type:"privileged",
                            execute:() => {
                                editOrder()
                                // navigate(`/${user.uid}/${user.role}/production/editProduct/?id=${params.id}`)
                            }
                        },
                        {
                            label:"Get Order's invoice",
                            btn_color:"white_btn",
                            type:"privileged",
                            execute:() => {
                                getOrderInvoice()
                                .then((result) => {

                                    const url = window.URL.createObjectURL(new Blob([new Uint8Array(result.data.data.data).buffer]))
                                    const link = document.createElement('a')
                                    link.href = url;
                                    
                                    link.setAttribute('download', `Invoice ${params.id}.pdf`)
                                    
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
                        },
                        {
                            label:"Delete order",
                            type:"dangerous",
                            btn_color:"secondary",
                            execute:() => {
                                setModal({
                                    ...modal,
                                    open:false
                                })
                                setDialog({
                                    ...dialog,
                                    open:true,
                                    title:"Are you sure you want to delete this order?",
                                    actions:[
                                        {
                                            label:"Yes",
                                            btn_color:"primary",
                                            execute:() => {
                                                setDialog({
                                                    ...dialog,
                                                    open:false,
                                                })
                                                deleteOrder()
                                                .then((result) => {
                                                    setLoading(false)
                                                    setDialog({
                                                        ...dialog,
                                                        open: true,
                                                        title:"Order deleted",
                                                        message:"The order was deleted succesfully",
                                                        actions: [
                                                            {
                                                                label:"Ok",
                                                                execute: () => window.location.reload()
                                                            }
                                                        ]
                                                    })
                                                })
                                                .catch((err) => {
                                                    setDialog({
                                                        ...dialog,
                                                        open:true,
                                                        title:"There was an error",
                                                        message:"Error deleting order, reload and try again",
                                                        actions: [
                                                            {
                                                                label:"Reload",
                                                                execute: () => window.location.reload()
                                                            }
                                                        ]
                                                    })  
                                                })
                                            }
                                        },
                                        {
                                            label:"No",
                                            btn_color:"primary",
                                            execute:() => {
                                                setDialog({
                                                    ...dialog,
                                                    open:false,
                                                })
                                            }
                                        },
                                    ]
                                })
                            }
                        },
                    ]
                })

            }
            
            return (
                <>
                    <UserModal
                    modal={modal}
                    setModal={setModal}
                    title={modal.title}
                    content={modal.content}
                    actions={modal.actions}
                    />

                    <UserDialog
                    title={dialog.title}
                    content={dialog.message}
                    dialog={dialog}
                    setDialog={setDialog}
                    actions={dialog.actions}
                    open={dialog.open}
                    />
                    <Button variant="contained" onClick={handleModal} disabled={loading} sx={BV_THEME.button.table}>View</Button>
                </>

                
            )
        } 
    }
]

export const CustomerColumns = [
    {
        field:"_id",
        headerName: "ID",
        headerAlign: "center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"name",
        headerName: "Name",
        headerAlign: "center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"sales",
        headerName: "$ Sales",
        headerAlign: "center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"orders",
        headerName: "Pending Orders",
        headerAlign: "center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1,
        renderCell:(params) => {
            return params.value.length
        }
    },
    {
        field: "actions",
        headerName:"Actions",
        headerAlign:"center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1,
        renderCell:(params) => {
            const [modal,setModal] = useState({
                open:false,
                title:"",
                content:"",
                actions:[]
            })
            const [dialog, setDialog] = useState({
                open:false,
                title:"",
                message:"",
                actions:[]
            })

            const [loading, setLoading] = useState(false)

            const {user, credential} = useAuth()
            const navigate = useNavigate()
            
            const editCustomer = () => console.log("Edit customer")
            const deleteCustomer = async () => {
                setLoading(true)
                const deleteCustomerOperation = await api.api.delete(`${api.apiVersion}/customers/${params.id}`, {
                    headers: {
                        authorization: credential._tokenResponse.idToken,
                        user: user
                    }
                })

                return deleteCustomerOperation
            }
            
            const handleModal = () => {
                setModal({
                    ...modal,
                    open:true,
                    title:"Select an action",
                    actions: [
                        {
                            label:"Edit customer",
                            btn_color:"white_btn",
                            type:"privileged",
                            execute:() => {
                                editCustomer()
                                // navigate(`/${user.uid}/${user.role}/production/editProduct/?id=${params.id}`)
                            }
                        },
                        {
                            label:"Delete customer",
                            type:"dangerous",
                            btn_color:"secondary",
                            execute:() => {
                                setModal({
                                    ...modal,
                                    open:false
                                })
                                setDialog({
                                    ...dialog,
                                    open:true,
                                    title:"Are you sure you want to delete a customer?",
                                    message:"The customer and its orders will be deleted. Production management may be affected.",
                                    actions:[
                                        {
                                            label:"Yes",
                                            btn_color:"primary",
                                            execute:() => {
                                                setDialog({
                                                    ...dialog,
                                                    open:false,
                                                })
                                                deleteCustomer()
                                                .then((result) => {
                                                    setDialog({
                                                        ...dialog,
                                                        open:true,
                                                        title:"Customer deleted",
                                                        message: "Customer, and all its related data has been deleted",
                                                        actions: [
                                                            {
                                                                label:"Ok",
                                                                execute:() => window.location.reload()
                                                            }
                                                        ]
                                                    })
                                                })
                                                .catch((err) => {
                                                    console.log(err)
                                                    setDialog({
                                                        ...dialog,
                                                        open:true,
                                                        title:"Error deleting customer",
                                                        message:"There was an error deleting the customer please reload, and try again",
                                                        actions: [
                                                            {
                                                                label:"ok",
                                                                execute: () => window.location.reload()
                                                            },
                                                            {
                                                                label:"Cancel",
                                                                execute: () => navigate(`/${user.uid}/${user.role}/dashboard`)
                                                            },
                                                        ]
                                                    })
                                                })
                                            }
                                        },
                                        {
                                            label:"No",
                                            btn_color:"primary",
                                            execute:() => {
                                                setDialog({
                                                    ...dialog,
                                                    open:false,
                                                })
                                            }
                                        },
                                    ]
                                })
                            }
                        },
                    ]
                })

            }
            
            return (
                <>
                    <UserModal
                    modal={modal}
                    setModal={setModal}
                    title={modal.title}
                    content={modal.content}
                    actions={modal.actions}
                    />

                    <UserDialog
                    title={dialog.title}
                    content={dialog.message}
                    dialog={dialog}
                    setDialog={setDialog}
                    actions={dialog.actions}
                    open={dialog.open}
                    />
                    <Button variant="contained" onClick={handleModal} disabled={loading} sx={BV_THEME.button.table}>View</Button>
                </>

                
            )
        }
    }
]
export const EmployeeColumns = [
    {
        field:"_id",
        headerName: "ID",
        headerAlign: "center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"name",
        headerName: "Name",
        headerAlign: "center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"tasks",
        headerName: "Pending tasks",
        headerAlign: "center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"salary",
        headerName: "Salary",
        headerAlign: "center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field: "actions",
        headerName:"Actions",
        headerAlign:"center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1,
        renderCell:(params) => {
            
            const [modal,setModal] = useState({
                open:false,
                title:"",
                content:"",
                actions:[]
            })
            const [dialog, setDialog] = useState({
                open:false,
                title:"",
                message:"",
                actions:[]
            })
            
            const [loading, setLoading] = useState(false)
            
            const {user, credential} = useAuth()
            const navigate = useNavigate()
            
            const editCustomer = () => console.log("Edit customer")
            const deleteEmployee = async () => {
                setLoading(true)
                const response = await api.api.delete(`${api.apiVersion}/employees/${params.id}`, {
                    headers: {
                        authorization: credential._tokenResponse.idToken,
                        user: user
                    }
                })

                return response
            }
            
            const actions = [{label:"Delete", execute:deleteEmployee}, {label:"Edit", execute:editCustomer}]

            
            const handleModal = () => {
                setModal({
                    ...modal,
                    open:true,
                    title:"Select an action",
                    actions: [
                        {
                            label:"Edit employee",
                            btn_color:"white_btn",
                            type:"privileged",
                            execute:() => {
                                editCustomer()
                                // navigate(`/${user.uid}/${user.role}/production/editProduct/?id=${params.id}`)
                            }
                        },
                        {
                            label:"Delete employee",
                            type:"dangerous",
                            btn_color:"secondary",
                            execute:() => {
                                setModal({
                                    ...modal,
                                    open:false
                                })
                                setDialog({
                                    ...dialog,
                                    open:true,
                                    title:"Are you sure you want to delete an employee?",
                                    message:"The employee and its tasks will be deleted. Production management may be affected.",
                                    actions:[
                                        {
                                            label:"Yes",
                                            btn_color:"primary",
                                            execute:() => {
                                                setDialog({
                                                    ...dialog,
                                                    open:false,
                                                })
                                                deleteEmployee()
                                                .then((res) => {
                                                    if(res.status === 204){
                                                        setDialog({
                                                            ...dialog,
                                                            open:true,
                                                            title:"Employee deleted",
                                                            message:"The employee account and its data was deleted, what do you want to do?",
                                                            actions:[
                                                                {
                                                                    label:"Exit",
                                                                    execute: navigate(`/${user.uid}/${user.role}/dashboard`)
                                                                }
                                                            ]
                                                        })
                                                    }
                                                })
                                                .catch(err => {
                                                    console.log("Error deleting employee")
                                                })
                                            }
                                        },
                                        {
                                            label:"No",
                                            btn_color:"primary",
                                            execute:() => {
                                                setDialog({
                                                    ...dialog,
                                                    open:false,
                                                })
                                            }
                                        },
                                    ]
                                })
                            }
                        },
                    ]
                })

            }
            
            return (
                <>
                    <UserModal
                    modal={modal}
                    setModal={setModal}
                    title={modal.title}
                    content={modal.content}
                    actions={modal.actions}
                    />

                    <UserDialog
                    title={dialog.title}
                    content={dialog.message}
                    dialog={dialog}
                    setDialog={setDialog}
                    actions={dialog.actions}
                    open={dialog.open}
                    />
                    <Button variant="contained" onClick={handleModal} disabled={loading} sx={BV_THEME.button.table}>View</Button>
                </>

                
            )
        }
    }
]