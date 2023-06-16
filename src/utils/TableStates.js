import {useState} from "react"

import { UserModal } from "../CoreComponents/UserActions/UserModal"

import api from '../axios'
import useAuth from "../contextHooks/useAuthContext"
import { useLocation, useNavigate } from "react-router-dom"
import { UserDialog } from "../CoreComponents/UserFeedback/Dialog"

import { BV_THEME } from "../theme/BV-theme"
import { Button, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Divider, CircularProgress, Chip } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { getInvoicesByCustomer, markInvoiceAsPayed, stopBackgroundTask } from "../CoreComponents/requests"
import { useTranslation } from "react-i18next"
import { t } from "i18next"
import { currencyByLang } from "./currencyByLanguage"
import { ProductCard } from "../modules/Admin/production/ProductionMain"

export function DisplayViewButton ({params,setShowProduct}) {
    console.log("params",params)
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
        setShowProduct(true)
       /* setModal({
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
                    btn_color:"warning",
                    type:"privileged",
                    execute:() => {
                        navigate(`/${user.uid}/${user.role}/production/editProduct/?id=${params.id}`)
                    }
                },
                {
                    label:"Delete",
                    type:"privileged",
                    btn_color:"warning",
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
        })*/

    }

    const deleteProduct = (params) => {
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
            <Button onClick={()=>deleteProduct(params)} color="error" disabled={loading || (user.role === "employee")} sx={{padding:"0px",margin:"0px"}}> {loading ? 'Loading...' : <DeleteIcon/>} </Button>    
        </>
        
    )
}

export const productsColumns = [
    {
        field:"name",
        headerClassName:"header-products-table",
        headerName:"Microgreen",
        renderHeader:() => {
            const {t} = useTranslation(['buttons', 'production_management_module'])
            return (
                <>{t('table_header_products_name',{ns:'production_management_module'})}</>
            )
        },
        headerAlign:"center",
        align:"center",
        minWidth:150,
        flex:1,
        renderCell:(params) => {
            const {t} = useTranslation()
            
            return (
                <>
                    {t(`product_${params.value}`,{ns:'production_management_module'})}    
                </>
            )
        }
    },
    {
        field:"orders",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Orders",
        renderHeader:() => {
            const {t} = useTranslation(['buttons', 'production_management_module'])
            return (
                <>{t('table_header_products_ordersNumber',{ns:'production_management_module'})}</>
            )
        },
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
        //align:"center",
        headerName:"Prod. Price",
        renderHeader:() => {
            const {t} = useTranslation(['buttons', 'production_management_module'])
            return (
                <>{t('table_header_products_price',{ns:'production_management_module'})}</>
            )
        },
        minWidth:180,
        flex:1,
        renderCell:(params) => {
            const {t, i18n} = useTranslation(['production_management_module'])
            
            return (
                
                        <Accordion sx={{width:"100%",marginY:"1vh"}}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header" 
                            >
                                <Typography>{t('price_cell_dropdown_header_production_table',{ns:'production_management_module'})}</Typography>
                            </AccordionSummary>

                            <AccordionDetails >
                                    {params.formattedValue.map((obj) => {
                                        return (
                                            <>
                                            <Typography align="justify">
                                                {
                                                    t(
                                                        'price_size_cell_dropdown_header_production_table',
                                                        {
                                                            ns:'production_management_module', 
                                                            grams:obj.packageSize,
                                                            price:new Intl.NumberFormat(
                                                                i18n.language,
                                                                {
                                                                    style:'currency', 
                                                                    currency:currencyByLang[i18n.language]
                                                                }
                                                            ).format(obj.amount)
                                                        }
                                                    )
                                                }
                                            </Typography>
                                            <Divider sx={{maxWidth:"100%"}} /> 
                                            </>
                                            )})}
                            </AccordionDetails>
                        </Accordion>
                
            )
        }
    },
    {
        field:"parameters",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Seeds /gr",
        renderHeader:() => {
            const {t} = useTranslation(['buttons', 'production_management_module'])
            return (
                <>{t('table_header_products_seedingRate',{ns:'production_management_module'})}</>
            )
        },
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
        renderHeader:() => {
            const {t} = useTranslation(['buttons', 'production_management_module'])
            return (
                <>{t('table_header_products_harvestRate',{ns:'production_management_module'})}</>
            )
        },
        valueGetter:(params) => {
            if(params.row.parameters != undefined){
                return params.row.parameters.harvestRate
            }
            return "N/D"
        },
        flex:1
    },
    {
        field:"performance",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Performance",
        renderHeader:() => {
            const {t} = useTranslation(['buttons', 'production_management_module'])
            return (
                <>{t('table_header_products_performance',{ns:'production_management_module'})}</>
            )
        },
        minWidth:150,
        flex:1,
    },
    {
        field:"actions",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Actions",
        renderHeader:() => {
            const {t} = useTranslation(['buttons', 'production_management_module'])
            return (
                <>{t('table_header_products_actions',{ns:'production_management_module'})}</>
            )
        },
        renderCell: (params) => {
            const {t} = useTranslation(['buttons','production_management_module'])
            
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
                            label:`${t('product_management_action_stop',{ns:'production_management_module'})}`,
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
                            label:`${t('product_management_action_manage',{ns:'production_management_module'})}`,
                            type:"normal",
                            btn_color:"white_btn",
                            execute:() => {
                                navigate(`/${user.uid}/${user.role}/production/management/${params.id}`,{state:{strain:params.row}})
                            }
                        },
                        {
                            label:`${t('product_management_action_edit',{ns:'production_management_module'})}`,
                            btn_color:"warning",
                            type:"privileged",
                            execute:() => {
                                navigate(`/${user.uid}/${user.role}/production/editProduct/?id=${params.id}`)
                            }
                        },
                        {
                            label:`${t('product_management_action_delete',{ns:'production_management_module'})}`,
                            type:"privileged",
                            btn_color:"warning",
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
                
                    <Button variant='contained' onClick={handleModal} disabled={loading || (user.role === "employee")} sx={BV_THEME.button.table}> {loading ? 'Loading...' : `${t('button_view_word', {ns:'buttons'})}`} </Button>    
                
                </>
                
            )
        },
        renderCell:(params)=> DisplayViewButton(params) ,
        flex:1
    },
    {
        field:"status",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Status",
        renderHeader:() => {
            const {t} = useTranslation(['buttons', 'production_management_module'])
            return (
                <>{t('table_header_products_status',{ns:'production_management_module'})}</>
            )
        },
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
        flex:1,
    },
    {
        field:"price",
        headerClassName:"header-products-table",
        headerAlign:"center",
        //align:"center",
        headerName:"Prod. Price",
        minWidth:120,
        flex:1,
        renderCell:(params) => {
            return (
                
                        <Accordion sx={{width:"100%",marginY:"1vh"}}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header" 
                            >
                                <Typography>Price</Typography>
                            </AccordionSummary>

                            <AccordionDetails >
                                    {params.formattedValue.map((obj) => {
                                        return (
                                            <>
                                            <Typography align="justify">Size {obj.packageSize}:  €{obj.amount} </Typography>
                                            <Divider sx={{maxWidth:"100%"}} /> 
                                            </>
                                            )})}
                            </AccordionDetails>
                        </Accordion>
                
            )
        }
    },
    {
        field:"actions",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Actions",
        renderCell: (params)=> DisplayViewButton(params) ,
        flex:1
    },
]

export const recentSalesColumns = [
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
        field:"income",
        headerName:"Income",
        headerClassName:"header-sales-table",
        headerAlign:"center",
        align:"center",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"date2",
        headerName:"Delivery Date",
        headerClassName:"header-sales-table",
        headerAlign:"center",
        align:"center",
        minWidth:{xs:"25%",md:100},
        flex:1
    },
]

export const deliveredSalesColumns = [
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
        field:"income",
        headerName:"Income",
        headerClassName:"header-sales-table",
        headerAlign:"center",
        align:"center",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"date2",
        headerName:"Delivery Date",
        headerClassName:"header-sales-table",
        headerAlign:"center",
        align:"center",
        minWidth:{xs:"25%",md:100},
        flex:1
    },
]

export const CustomerColumns = [
    {
        field:"_id",
        headerName: "ID",
        renderHeader:(v) => {
            const {t} = useTranslation(['client_management_module'])
            return (
                <>{t('client_table_header_ID',{ns:'client_management_module'})}</>    
            )
        },  
        headerAlign: "center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"name",
        headerName: "Name",
        renderHeader:(v) => {
            const {t} = useTranslation(['client_management_module'])
            return (
                <>{t('client_table_header_name',{ns:'client_management_module'})}</>    
            )
        },  
        headerAlign: "center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"sales",
        headerName: "$ Sales",
        renderHeader:(v) => {
            const {t} = useTranslation(['client_management_module'])
            return (
                <>{t('client_table_header_sales',{ns:'client_management_module'})}</>    
            )
        },  
        headerAlign: "center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"monthlySales",
        headerName: "$ This Month's Sales",
        renderHeader:(v) => {
            const {t} = useTranslation(['client_management_module'])
            return (
                <>{t('client_table_header_monthlySales',{ns:'client_management_module'})}</>    
            )
        },
        headerAlign: "center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"orders",
        headerName: "Pending Orders",
        renderHeader:(v) => {
            const {t} = useTranslation(['client_management_module'])
            return (
                <>{t('client_table_header_pendingOrders',{ns:'client_management_module'})}</>    
            )
        },
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
        renderHeader:(v) => {
            const {t} = useTranslation(['client_management_module'])
            return (
                <>{t('client_table_header_actions',{ns:'client_management_module'})}</>    
            )
        },
        headerAlign:"center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1,
        renderCell:(params) => {
            const {t} = useTranslation(['buttons'])
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
            
            const editCustomer = () => navigate(`/${user.uid}/admin/edition?type=customer`, {state:{ edition: {customer: params.row}}})
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
            const monthlyInvoice = async () => {
                setLoading(true)
                const orderPDF = await api.api.get(`${api.apiVersion}/files/orders/invoice/bydate/month/${params.id}`, {
                    headers: {
                        authorization: credential._tokenResponse.idToken,
                        user:user
                    }
                })
                return orderPDF
            }
            
            const handleModal = () => {
                setModal({
                    ...modal,
                    open:true,
                    title:"Select an action",
                    actions: [
                        {
                            label:`${t('actions_modal_edit', {ns:'client_management_module'})}`,
                            btn_color:"white_btn",
                            type:"privileged",
                            execute:() => {
                                editCustomer()
                                // navigate(`/${user.uid}/${user.role}/production/editProduct/?id=${params.id}`)
                            }
                        },
                        {
                            label:`${t('actions_modal_monthInvoice', {ns:'client_management_module'})}`,
                            btn_color:"white_btn",
                            type:"privileged",
                            execute:() => {
                                monthlyInvoice()
                                .then((result) => {
                                    console.log(result)
                                    const url = window.URL.createObjectURL(new Blob([new Uint8Array(result.data.data.data).buffer]))
                                    const link = document.createElement('a')
                                    link.href = url;
                                    
                                    link.setAttribute('download', `Invoice for ${params.row.name}.pdf`)
                                    
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
                            label:`${t('actions_modal_delete', {ns:'client_management_module'})}`,
                            type:"dangerous",
                            btn_color:"warning",
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
                        {
                            label:`${t('actions_modal_reviewInvoices', {ns:'client_management_module'})}`,
                            type:"white_btn",
                            btn_color:"primary",
                            execute:async() => {
                                setLoading(true)

                                let invoicesRes
                                try {
                                    invoicesRes = await getInvoicesByCustomer(user,credential,params.row._id) 
                                    navigate(`/${user.uid}/${user.role}/invoices/${params.row._id}`,{state:{customerData:params.row, invoices:invoicesRes.data}})
                                } catch (err) {
                                    console.log(err)
                                }
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
                    <Button variant="contained" onClick={handleModal} disabled={loading} sx={BV_THEME.button.table}>{t('button_view_word', {ns:'buttons'})}</Button>
                </>

                
            )
        }
    }
]
export const adminDashboardEmployees = [
{
    field:"name",
    headerName:"Employee",
    headerAlign:"center",
    align:"center",
    headerClassName:"header-sales-table",
    minWidth:{xs:"25%",md:130},
    flex:1
},
{
    field:"level",
    headerName:"Level",
    headerAlign:"center",
    align:"center",
    headerClassName:"header-sales-table",
    minWidth:{xs:"25%",md:130},
    flex:1
}
]

export const invoicesColumns = [
    {
        headerName:"Creation date",
        field:"date",
        width:250
    },
    {
        headerName:"ID",
        field:"_id",
        width:250
    },
    {
        headerName:"Income",
        field:"totalIncome"
    },
    {
        headerName:"Payment status",
        field:"payed",
        width:150,
        renderCell: (params) => {
            return <Chip label={params.row.payed ? "paid" : "unpaid"} color={params.row.payed ? "success" : "warning"}/>
        }
    },
    {
        field:"actions",
        headerName:" ",
        width:200,
        renderCell:(params) => {
            const {user, credential} = useAuth()
            const navigate = useNavigate('/');
            
            const handleMarkAsPayed = () => {
                markInvoiceAsPayed(user, credential, params.row._id)
                .then((response) => {
                    navigate(`/${user.uid}/${user.role}/client`)
                } )
                .catch(err => {
                    console.log(err)
                })
            }
            
            return <Button onClick={handleMarkAsPayed} variant="contained">Mark as payed</Button>
        }
    }
]