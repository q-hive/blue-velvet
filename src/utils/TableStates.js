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
        field:"performance",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Performance",
        flex:1,

    },
    {
        field:"tasks",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Pending Tasks",
        width:150,
        flex:1
    },
    {
        field:"orders",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Orders",
        width:150,
        renderCell:(params) => {
            return '5'
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
        field:"seedingRate",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Seed charge",
        renderCell:(params) => {
            return 35
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
                            label:"Allocate task",
                            btn_color:"white_btn",
                            type:"normal",
                            execute:() => {
                                console.log("Redirect to task allocation screen")    
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
                
                    <Button variant='contained' onClick={handleModal} disabled={loading} sx={BV_THEME.button.table}> {loading ? 'Loading...' : 'View'} </Button>    
                
                </>
                
            )
        },
        flex:1
    },
    {
        field:"status",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Status",
        flex:1
    },
]

export const productsColumnsMobile = [
    {
        field:"name",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Microgreen",
        minWidth:150,
        flex:1,
    },
    {
        field:"orders",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Orders",
        width:150,
        renderCell:(params) => {
            return '5'
        },
        flex:1
        
    },
    {
        field:"tasks",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Options",
        width:150,
        flex:1
    },

]

export const ProductionLinesColumns = [
    {
        field:"start",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Start date"
    },
    {
        field:"end",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"End Date"
    },
    {
        field:"updated",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Updated",
        width:150
    },
    {
        field:"orders",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Orders",
        width:150,
        renderCell:(params) => {
            return '5'
        }
    },
    {
        field:"Active",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Active tasks",
        width:150
    },
    {
        field:"products",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Products",
        renderCell:(params) => {
            return 35
        }
    },
]

export const salesColumns = [
    {
        field:"id",
        headerName:"ID",
        headerAlign:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"customer",
        headerName:"Customer",
        headerAlign:"center",
        headerClassName:"header-sales-table",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"date1",
        headerName:"Tuesday",
        headerClassName:"header-sales-table",
        headerAlign:"center",
        minWidth:{xs:"25%",md:100},
        flex:1
    },
    {
        field:"date2",
        headerName:"Friday",
        headerClassName:"header-sales-table",
        headerAlign:"center",
        minWidth:{xs:"25%",md:100},
        flex:1
    },
    {
        field:"type",
        headerName:"type",
        headerClassName:"header-sales-table",
        headerAlign:"center",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"income",
        headerName:"Income",
        headerClassName:"header-sales-table",
        headerAlign:"center",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
    {
        field:"status",
        headerName:"Status",
        headerClassName:"header-sales-table",
        headerAlign:"center",
        minWidth:{xs:"25%",md:130},
        flex:1
    },
]