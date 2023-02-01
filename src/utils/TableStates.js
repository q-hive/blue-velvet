import {useState} from "react"

import { UserModal } from "../CoreComponents/UserActions/UserModal"

import api from '../axios'
import useAuth from "../contextHooks/useAuthContext"
import { useLocation, useNavigate } from "react-router-dom"
import { UserDialog } from "../CoreComponents/UserFeedback/Dialog"

import { BV_THEME } from "../theme/BV-theme"
import { Button, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Divider, CircularProgress, Chip } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LoadingButton } from "@mui/lab"
import { getInvoicesByCustomer, markInvoiceAsPayed, stopBackgroundTask } from "../CoreComponents/requests"
import { useTranslation } from "react-i18next"
import { t } from "i18next"
import { currencyByLang } from "./currencyByLanguage"

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
                            btn_color:"warning",
                            type:"privileged",
                            execute:() => {
                                navigate(`/${user.uid}/${user.role}/production/editProduct/?id=${params.id}`)
                            }
                        },
                        {
                            label:"Delete",
                            type:"dangerous",
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
        renderHeader:(v) => {
            const {t} = useTranslation(['buttons', 'sales_management_module'])
            return (
                <>{t('employee_table_header_ID',{ns:'sales_management_module'})}</>    
            )
        },  
        headerAlign:"center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"customer",
        headerName:"Customer",
        renderHeader:(v) => {
            const {t} = useTranslation(['buttons', 'sales_management_module'])
            return (
                <>{t('sales_table_header_customer',{ns:'sales_management_module'})}</>    
            )
        },  
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
        field:"cyclic",
        headerName:"type",
        renderHeader:(v) => {
            const {t} = useTranslation(['buttons', 'sales_management_module'])
            return (
                <>{t('sales_table_header_orderType',{ns:'sales_management_module'})}</>    
            )
        },
        headerClassName:"header-sales-table",
        headerAlign:"center",
        align:"center",
        minWidth:{xs:"25%",md:130},
        flex:1,
        renderCell:(params) => {
            return (<>{params.row.cyclic ? 'cyclic' : 'simple'}</>)
        }
    },
    {
        field:"income",
        headerName:"Income",
        renderHeader:(v) => {
            const {t} = useTranslation(['buttons', 'sales_management_module'])
            return (
                <>{t('sales_table_header_orderIncome',{ns:'sales_management_module'})}</>    
            )
        },
        headerClassName:"header-sales-table",
        headerAlign:"center",
        align:"center",
        minWidth:{xs:"25%",md:130},
        flex:1,
        renderCell:(params) => {
            return (
                <>€ {params.row.income}</>
            )
            
        }
    },
    {
        field:"status",
        headerName:"Status",
        renderHeader:(v) => {
            const {t} = useTranslation(['buttons', 'sales_management_module'])
            return (
                <>{t('sales_table_header_orderStatus',{ns:'sales_management_module'})}</>    
            )
        },
        headerAlign:"center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"actions",
        headerName:"Actions",
        renderHeader:(v) => {
            const {t} = useTranslation(['buttons', 'sales_management_module'])
            return (
                <>{t('sales_table_header_actions',{ns:'sales_management_module'})}</>    
            )
        },
        headerAlign:"center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1,
        renderCell:(params) => {
            const {t} = useTranslation(['buttons', 'sales_management_module'])
            const navigate = useNavigate()
            const {user, credential} = useAuth()
            const [loading, setLoading] = useState(false)
            
            const editOrder = () => navigate(`/${user.uid}/admin/edition?type=order`, {state: {edition: {isEdition:true, order:params.row}}})
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

           

            
            const handleModal = () => {
                setModal({
                    ...modal,
                    open:true,
                    title:"Select an action",
                    actions: [
                        {
                            label:`${t('sales_table_modal_action_update', {ns:'sales_management_module'})}`,
                            btn_color:"white_btn",
                            type:"privileged",
                            execute:() => {
                                editOrder()
                                navigate
                            }
                        },
                        {
                            label:loading ? <CircularProgress/> : `${t('sales_table_modal_action_delete', {ns:'sales_management_module'})}`,
                            btn_color:"white_btn",
                            type:"privileged",
                            execute:() => {
                                getOrderInvoice()
                                .then((result) => {
                                    console.log(result)
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
                            label:`${t('sales_table_modal_action_delete', {ns:'sales_management_module'})}`,
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
                        {
                            label:`${t('sales_table_modal_action_stop_Cyclic', {ns:'sales_management_module'})}`,
                            type:"dangerous",
                            btn_color:"warning",
                            execute:()=>{
                                stopBackgroundTask(user, credential, params.row.job)
                                .then(response => {
                                    setModal({
                                        ...modal,
                                        open:false
                                    })

                                    setDialog({
                                        ...dialog,
                                        open:true,
                                        title:"Sucess",
                                        message:"Re-order has been stopped",
                                        actions: [
                                            {
                                                label:"Ok",
                                                execute: () => window.location.reload()
                                            }
                                        ]
                                    })
                                })
                                .catch(err => {
                                    setModal({
                                        ...modal,
                                        open:false
                                    })

                                    setDialog({
                                        ...dialog,
                                        open:true,
                                        title:"There was an error",
                                        message:"Error stopping re-order",
                                        actions: [
                                            {
                                                label:"Reload",
                                                execute: () => window.location.reload()
                                            }
                                        ]
                                    })
                                })
                            },
                            disabled:params.row.job === "No job"
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
                    loading={loading}
                    />

                    <UserDialog
                    title={dialog.title}
                    content={dialog.message}
                    dialog={dialog}
                    setDialog={setDialog}
                    actions={dialog.actions}
                    open={dialog.open}
                    />
                    <LoadingButton loading={loading} variant="contained" onClick={handleModal} disabled={loading} sx={BV_THEME.button.table}>View</LoadingButton>
                </>

                
            )
        } 
    }
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
                            label:`${t('actions_modal_monthInvoice', {ns:'client_management_module'})}`,
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
export const EmployeeColumns = [
    {
        field:"_id",
        renderHeader:(v) => {
            const {t} = useTranslation(['employee_management_module'])
            return (
                <>{t('employee_table_header_ID',{ns:'employee_management_module'})}</>    
            )
        },  
        headerAlign: "center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1,
    },
    {
        field:"name",
        headerName: "Name",
        renderHeader:() => {
            const {t} = useTranslation(['employee_management_module'])
            return (
                <>{t('employee_table_header_Name',{ns:'employee_management_module'})}</>    
            )
        },
        headerAlign: "center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"tasks",
        headerName: "Pending tasks",
        renderHeader:() => {
            const {t} = useTranslation(['employee_management_module'])
            return (
                <>{t('employee_table_header_PendingTasks',{ns:'employee_management_module'})}</>    
            )
        },
        headerAlign: "center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"salary",
        headerName: "Salary",
        renderHeader:() => {
            const {t} = useTranslation(['employee_management_module'])
            return (
                <>{t('employee_table_header_Salary',{ns:'employee_management_module'})}</>    
            )
        },
        headerAlign: "center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field: "actions",
        headerName:"Actions",
        renderHeader:() => {
            const {t} = useTranslation(['employee_management_module'])
            return (
                <>{t('employee_table_header_Actions',{ns:'employee_management_module'})}</>    
            )
        },
        headerAlign:"center",
        align:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1,
        renderCell:(params) => {
            const {t} = useTranslation(['buttons', 'employee_management_module'])
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
                            label:`${t('employee_management_action_edit',{ns:'employee_management_module'})}`,
                            btn_color:"white_btn",
                            type:"privileged",
                            execute:() => {
                                editCustomer()
                                navigate(`/${user.uid}/${user.role}/employees/editEmployee/?id=${params.id}`)
                            }
                        },
                        {
                            label:t('employee_management_action_delete',{ns:'employee_management_module'}),
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
                    <Button variant="contained" onClick={handleModal} disabled={loading} sx={BV_THEME.button.table}>{t('button_view_word',{ns:'buttons'})}</Button>
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