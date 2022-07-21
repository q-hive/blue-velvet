import { Button } from "@mui/material"
import { BV_THEME } from "../theme/BV-theme"

export const productsColumns = [
    {
        field:"name",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Microgreen",
        minWidth:150,
        flex:1,
    },
    {
        field:"performance",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Performance",
        flex:1,

    },
    {
        field:"tasks",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Pending Tasks",
        width:150,
        flex:1
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
        field:"cost",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Prod. Cost",
        width:150,
        flex:1
    },
    {
        field:"seedingRate",
        headerClassName:"header-products-table",
        headerAlign:"center",
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
        headerName:"Actions",
        renderCell: (params) => {
            return <Button variant='contained'> View actions </Button>
        },
        flex:1
    },
    {
        field:"status",
        headerClassName:"header-products-table",
        headerAlign:"center",
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