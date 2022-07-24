import {useState} from "react"

import { Button } from "@mui/material"
import { UserModal } from "../CoreComponents/UserActions/UserModal"

import api from '../axios'
import useAuth from "../contextHooks/useAuthContext"

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
        field:"cost",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Prod. Cost",
        width:150,
        flex:1
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

            const {user} = useAuth()
            console.log(user)
            
            const handleModal = () => {
                setModal({
                    ...modal,
                    open:true,
                    title:"Select an action",
                    actions: [
                        {
                            label:"Stop production",
                            type:"normal",
                            execute:() => {
                                // api.api.patch(`${api.apiVersion}/prducts/stop/?id=${params}`)
                                //.then(() => {})
                                //.catch(err => {})
                            }
                        },
                        {
                            label:"Edit product",
                            type:"privileged",
                            execute:() => {
                                console.log("Redirect to the type of product screen with prefilled data")    
                            }
                        },
                        {
                            label:"Allocate task",
                            type:"normal",
                            execute:() => {
                                console.log("Redirect to task allocation screen")    
                            }
                        },
                        {
                            label:"Delete",
                            type:"dangerous",
                            execute:() => {
                                console.log("Are you sure you want to delete this product?")    
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
                
                    <Button variant='contained' onClick={handleModal} > View actions </Button>    
                
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
        renderCell:() => {
            return "In production"
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
            return '5'
        },
        flex:1
        
    },
    {
        field:"tasks",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
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
        align:"center",
        headerName:"Start date"
    },
    {
        field:"end",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"End Date"
    },
    {
        field:"updated",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Updated",
        width:150
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
        }
    },
    {
        field:"Active",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Active tasks",
        width:150
    },
    {
        field:"products",
        headerClassName:"header-products-table",
        headerAlign:"center",
        align:"center",
        headerName:"Products",
        renderCell:(params) => {
            return 35
        }
    },
]