import React, {useEffect, useState} from 'react'

//*MUI Components
import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

//*network
import api from '../../../axios'

const productsColumns = [
    {
        field:"name",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Microgreen"
    },
    {
        field:"cost",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Performance"
    },
    {
        field:"tasks",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Pending Tasks",
        width:150
    },
    {
        field:"orders",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Orders",
        width:150
    },
    {
        field:"cost",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Prod. Cost",
        width:150
    },
    {
        field:"seedingRate",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Seed charge"
    },
    {
        field:"actions",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Actions"
    },
    {
        field:"status",
        headerClassName:"header-products-table",
        headerAlign:"center",
        headerName:"Status"
    },
]

export const ProductionMain = () => {
    const [columnsState, setColumnsState] = useState(productsColumns)
    const [rows, setRows] = useState([])
    useEffect(() => {
        const requests = async () => {
            //*API SHOULD ACCEPT PARAMETERS IN ORDER TO GET THE MERGED DATA FROM ORDERS AND TASKS
            //*TODO API SHOULD REQUEST FOR PRODUCTION LINES
            const productsRequest = await api.get('/api/v1/products')
            return [productsRequest.data]
        }

        requests()
        .then(resArray => {
            //*If the data requested is valid (contains all the fields of the GridColDef) 
            //*then set the rows (first products) data in order to render it in table
            console.log(resArray)
        })
        .catch(err => {
            console.log(err)
        })
    }, [])
  return (
    <Box sx={
        {
            width:"100vw", 
            height:"100vh",
            "& .header-products-table":{
                backgroundColor:"#0E0C8F",
                color:"white"
            }
        }
    }>
        <DataGrid
        columns={columnsState}
        rows={rows}
        />
    </Box>
  )
}
