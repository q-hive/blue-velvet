import React, {useEffect, useState} from 'react'

//*MUI Components
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
//*ICONS
import Add from '@mui/icons-material/Add'

//*network
import api from '../../../axios'
import { productsColumns } from '../../../utils/TableStates'
import { useNavigate } from 'react-router-dom'
import { UserDialog } from '../../../CoreComponents/UserFeedback/Dialog'

export const ProductionMain = () => {
    const [columnsState, setColumnsState] = useState(productsColumns)
    const [rows, setRows] = useState([])
    const [dialog, setDialog] = useState({
        open:false,
        title:"",
        message:"",
        actions:[]
    })

    const navigate = useNavigate()

    const handleNewProduct = () => {
        setDialog({
            ...dialog,
            open:true,
            title:"Is a mix?",
            actions:[ {
                label:"Yes",
                execute:() => {
                    navigate("newProduct?mix=true")
                }
                },
                {
                    label:"No",
                    execute: () => {
                        navigate("newProduct")
                    }
                }
            ]
            
        })
        
    }
    
    const handleCloseDialog = () => {
        setDialog({
            ...dialog,
            open:false
        })
        
    }
    
    useEffect(() => {
        const requests = async () => {
            //*API SHOULD ACCEPT PARAMETERS IN ORDER TO GET THE MERGED DATA FROM ORDERS AND TASKS
            //*TODO API SHOULD REQUEST FOR PRODUCTION LINES
            const productsRequest = await api.api.get('/api/v1/products/?orders&&tasks')
            productsRequest.data.products = true
            return [productsRequest.data]
        }

        requests()
        .then(resArray => {
            //*If the data requested is valid (contains all the fields of the GridColDef) 
            //*then set the rows (first products) data in order to render it in table
            const products = resArray.find((response) => response.products === true)
            setRows(products.data)
        })
        .catch(err => {
            console.log(err)
        })
    }, [])
  return (
    <Box sx={
        {
            width:"100%", 
            height:"100vh",
            "& .header-products-table":{
                backgroundColor:"#0E0C8F",
                color:"white"
            }
        }
    }>

        <UserDialog
        setDialog={setDialog}
        open={dialog.open}
        title={dialog.title} 
        content={dialog.message} 
        actions={dialog.actions}
        />
        {/* <Dialog open={dialog.open} onClose={handleCloseDialog}>
            <DialogTitle>
                {dialog.title}
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    {dialog.message}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                {dialog.actions.map((value, index) =>{
                    return <Button key={index} onClick={value.execute}>{value.label}</Button>
                })}
            </DialogActions>
        </Dialog> */}

        
        <Typography variant="h4">
            Production management (products)
        </Typography>
        <Box sx={{display:"flex", justifyContent:"flex-end"}}>
            <Button startIcon={<Add/>} onClick={handleNewProduct} sx={{color:"white", backgroundColor:"#0E0C8F"}}>
                Add new product
            </Button>
        </Box>
        <DataGrid
        columns={columnsState}
        rows={rows}
        getRowId={(row) => {
            return row._id
        }}
        />
    </Box>
  )
}
