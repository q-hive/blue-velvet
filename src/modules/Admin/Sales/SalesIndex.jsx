import React, { useEffect, useState } from 'react'

//*MUI Components
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Container, Fade, Grid, Grow, LinearProgress,CircularProgress, Paper, Typography, Backdrop } from '@mui/material'
import { LoadingButton } from "@mui/lab"


//*UTILS
import { deliveredSalesColumns, recentSalesColumns, salesColumns } from '../../../utils/TableStates'
import { Add } from '@mui/icons-material'
//THEME
import {BV_THEME} from '../../../theme/BV-theme'

//*Netword and routing
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../contextHooks/useAuthContext'

import { UserModal } from "../../../CoreComponents/UserActions/UserModal"
import { UserDialog } from "../../../CoreComponents/UserFeedback/Dialog"

import { getCustomerData, getOrdersData } from '../../../CoreComponents/requests'
import { useTranslation } from 'react-i18next'
import { currencyByLang } from '../../../utils/currencyByLanguage'

// CUSTOM HOOKS
import useOrders from '../../../hooks/useOrders'


export const SalesIndex = () => {
    const {t, i18n} = useTranslation(['sales_management_module', 'buttons'])
    const {user, credential} = useAuth()
    let headers = {
        authorization: credential._tokenResponse.idToken,
        user:          user
    }
    const { deleteOrder, getOrderInvoiceById } = useOrders(headers)
    
    //*DATA STATES
    const [orders, setOrders] = useState({all:[], delivered:[], cancelled:[], recent:[]})
    
    //*LOADING FOR ACTIONS LIKE DOWNLOADING INVOICE OR LOADING RELATED TO THE WHOLE COMPONENT
    const [loading, setLoading] = useState(false)

    //*LOADING TO WAIT THE REQUEST ORDERS FUNCTION TO COMPLETE
    const [loadingTableData, setLoadingTableData] = useState(true)
    const [totalIncome, setTotalIncome] = useState(0)

    //*RENDER STATE HOOKS
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

    //*Netword and router
    const navigate = useNavigate()
    
    const handleNewOrder = () => {
        navigate('new')
    }

    const renderHeaderHook = (name) => {
        const JSXByHeader = {
            "ID":"ID",
            "Customer": t('sales_table_header_customer',{ns:'sales_management_module'}),
            "type":t('sales_table_header_orderType',{ns:'sales_management_module'}),
            "Income": t('sales_table_header_orderIncome',{ns:'sales_management_module'}),
            "Status":t('sales_table_header_orderStatus',{ns:'sales_management_module'}),
            "Actions":t('sales_table_header_actions',{ns:'sales_management_module'})
        }

        return (
            <>{JSXByHeader[name]}</>    
        )
    }

    const getOrderInvoice = async (params) => {
        const orderPDF = await getOrderInvoiceById(params.id)
        return orderPDF
    }

    const downloadInvoice = (params) => {
        setLoading(true)
        setModal({
            ...modal,
            open:false
        })
        getOrderInvoice(params)
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

    const renderActionsCell = (params) => {
        const editOrder = () => navigate(`/${user.uid}/admin/edition?type=order`, {state: {edition: {isEdition:true, order:params.row}}})
        const delOrder = async () => {
            setLoading(true)
            const deleteOperation = await deleteOrder(params.id)
            return deleteOperation
        }
        
        
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
                        //*THIS LABEL DOESNT HAVE TRANSLATIONS BECAUSE WE DONT HAVE ANYMORE STRINGS AVAILABLE UNDER I18NEXUS
                        label:loading ? <CircularProgress/> : 'Download invoice',
                        btn_color:"white_btn",
                        type:"privileged",
                        execute:() => downloadInvoice(params)
                    },
                    {
                        label:`${t('sales_table_modal_action_delete', {ns:'sales_management_module'})}`,
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
                                            delOrder()
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
                
                <LoadingButton loading={loading} variant="contained" onClick={handleModal} disabled={loading} sx={BV_THEME.button.table}>View</LoadingButton>
            </>

            
        )
    } 
    
    const salesColumns = [
        {
            field:"id",
            headerName:"ID",
            renderHeader:(v) => renderHeaderHook("ID"),  
            headerAlign:"center",
            align:"center",
            headerClassName:"header-sales-table",
            minWidth:{xs:"25%",md:130},
            flex:1
        },
        {
            field:"customer",
            headerName:"Customer",
            renderHeader:(v) => renderHeaderHook("Customer"),  
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
            renderHeader:(v) =>renderHeaderHook("type"),
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
            renderHeader:(v) => renderHeaderHook("Income"),
            headerClassName:"header-sales-table",
            headerAlign:"center",
            align:"center",
            minWidth:{xs:"25%",md:130},
            flex:1,
            renderCell:(params) => {
                return (
                    <>{new Intl.NumberFormat(i18n.language, {style:"currency", currency:currencyByLang[i18n.language]}).format(params.row.income)}</>
                )
                
            }
        },
        {
            field:"status",
            headerName:"Status",
            renderHeader:(v) => renderHeaderHook("Status"),
            headerAlign:"center",
            align:"center",
            headerClassName:"header-sales-table",
            minWidth:{xs:"25%",md:130},
            flex:1
        },
        {
            field:"actions",
            headerName:"Actions",
            renderHeader:(v) => renderHeaderHook("Actions"),
            headerAlign:"center",
            align:"center",
            headerClassName:"header-sales-table",
            minWidth:{xs:"25%",md:130},
            flex:1,
            renderCell:(params) => renderActionsCell(params)
        }
    ]
    
    const fixedHeightPaper = {
        padding: BV_THEME.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
        height: 480
    }
    
    
    useEffect(() => {
        getCustomerData({
            setOrders:setOrders,
            setTotalIncome:setTotalIncome,
            user:user,
            credential:credential,
            setLoading:setLoading,
        })
        getOrdersData({
            setOrders:setOrders,
            setTotalIncome:setTotalIncome,
            user:user,
            credential:credential,
            setLoading:setLoadingTableData
        })
        
    }, [])
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
    <Fade in={true} timeout={1000} unmountOnExit>
        <Box width="100%" height="auto" >
            <Container sx={{padding:"2%"}}>
                <Box sx={{
                            width:"100%", 
                            "& .header-sales-table":{
                                backgroundColor:BV_THEME.palette.primary.main,
                                color:"white"
                            }
                        }}
                >
                    
                    <Typography variant="h4" color="secondary" textAlign={"center"} margin={BV_THEME.margin.mainHeader}>
                        {t('module_index_title',{ns:'sales_management_module'})}
                    </Typography>

                    <Box sx={{width:"100%", height:"100%"}}>
                    
                    
                        <Box sx={{display:"flex", justifyContent:"space-between"}} >
                            <Button variant='contained' color='primary' startIcon={<Add/>} onClick={handleNewOrder} sx={{minWidth:"20%"}}>
                                {t('button_new_order', {ns:'buttons'})}
                            </Button>
                            <Typography>
                                {t('total_income', {ns:'sales_management_module', income:new Intl.NumberFormat(i18n.language, {style:'currency', currency:currencyByLang[i18n.language]}).format(Number(totalIncome.toFixed(2)))})}
                            </Typography>
                        </Box>
                        {/*
                            loading
                            ?   
                            <LinearProgress color="primary" sx={{marginY:"2vh"}}/>
                            :   
                            <DataGrid
                                columns={salesColumns}
                                rows={orders}s
                                sx={{marginY:"2vh",}}
                            />
                        */}
                    </Box>




                </Box>
            </Container>
            
            {/* GRID CONTAINER */}
            <Container  maxWidth="xl" sx={{paddingTop:1,paddingBottom:4,marginX:{xs:4,md:"auto"},marginTop:{xs:4,md:1},
                                            "& .header-sales-table":{
                                                backgroundColor:BV_THEME.palette.primary.main,
                                                color:"white"
                                            }}}>
            <Grid container maxWidth={"xl"} spacing={3}>
                
                {/* Recent */}
                {/* <Grow in={true} timeout={2000} unmountOnExit>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper elevation={4} sx={fixedHeightPaper}>
                        <Typography variant="h6" color="secondary">
                            Recent
                        </Typography>

                        {
                            loading
                            ?   
                            <LinearProgress color="primary" sx={{marginY:"2vh"}}/>
                            :   
                            <DataGrid
                                columns={recentSalesColumns}
                                rows={orders.recent}
                                sx={{marginY:"2vh",}}
                            />
                        }      
                    </Paper>
                </Grid>
                </Grow> */}

                {/* Delivered */}
                {/* <Grow in={true} timeout={2000} unmountOnExit>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper elevation={4} sx={fixedHeightPaper}>
                        <Typography variant="h6" color="secondary">Delivered</Typography>

                        {
                            loading
                            ?   
                            <LinearProgress color="primary" sx={{marginY:"2vh"}}/>
                            :   
                            <DataGrid
                                columns={deliveredSalesColumns}
                                rows={orders.delivered}
                                sx={{marginY:"2vh",}}
                            />
                        }        
                    </Paper>
                </Grid>
                </Grow> */}

                {/* Cancelled */}
                {/* <Grow in={true} timeout={2000} unmountOnExit>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper elevation={4} sx={fixedHeightPaper}>
                        <Typography variant="h6" color="secondary">Cancelled</Typography>
                        {
                            loading
                            ?   
                            <LinearProgress color="primary" sx={{marginY:"2vh"}}/>
                            :   
                            <DataGrid
                                columns={deliveredSalesColumns}
                                rows={orders.cancelled}
                                sx={{marginY:"2vh",}}
                            />
                        }      
                    </Paper>
                </Grid>
                </Grow> */}

                <Grow in={true} timeout={2000} unmountOnExit>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper elevation={4} sx={fixedHeightPaper}>
                            <Backdrop open={loading} children={<CircularProgress/>}/>
                            <Typography variant="h6" color="secondary">All orders</Typography>
                            {
                                loadingTableData
                                ?   
                                <LinearProgress color="primary" sx={{marginY:"2vh"}}/>
                                :   
                                <DataGrid
                                    columns={salesColumns}
                                    rows={orders.all}
                                    sx={{marginY:"2vh",}}
                                    pageSize={25}
                                />
                            }       
                        </Paper>
                    </Grid>
                </Grow>





            </Grid>
            </Container>


        </Box>
    </Fade>
    </>
  )
}


