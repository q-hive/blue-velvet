import React, {useEffect, useState} from 'react'

//*MUI Components
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, useTheme } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
//*THEME
import {BV_THEME} from '../../../theme/BV-theme'
//*ICONS
import Add from '@mui/icons-material/Add'

//*APP Components
import { UserDialog } from '../../../CoreComponents/UserFeedback/Dialog'

//*UTILS
import { productsColumns, productsColumnsMobile } from '../../../utils/TableStates'
import { breakpoints } from '@mui/system'

//*network AND API
import api from '../../../axios'
import { useNavigate } from 'react-router-dom'
import { UserModal } from '../../../CoreComponents/UserActions/UserModal'

export const ProductionMain = () => {
    const theme = useTheme(BV_THEME);
    const [columnsState, setColumnsState] = useState(productsColumns)
    const [rows, setRows] = useState([])
    const [dialog, setDialog] = useState({
        open:false,
        title:"",
        message:"",
        actions:[]
    })

    const navigate = useNavigate()

    const handleMobileTable = () => {
        setColumnsState(productsColumnsMobile)
    }

    const handleUpdateTable = () => {
        //*This functions is going to dissapear is no longer needed
    }

    const handleNewProduct = () => {
        setDialog({
            ...dialog,
            open:true,
            title:"Is a mix?",
            actions:[ {
                label:"Yes",
                btn_color:"primary",
                execute:() => {
                    navigate("newProduct?mix=true")
                }
                },
                {
                    label:"No",
                    btn_color:"secondary",
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
            const productsRequest = await api.api.get(`${api.apiVersion}/products/?orders&&tasks`)
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
    <>
        <Box>
            <Container sx={{padding:"5%"}}>
            <Box sx={
                
                {
                    width:"100%", 
                    height:"80vh",
                    "& .header-products-table":{
                        backgroundColor:BV_THEME.palette.primary.main,
                        color:"white"
                    }
                }
            }>

                <UserDialog
                setDialog={setDialog}
                dialog={dialog}
                open={dialog.open}
                title={dialog.title}
                content={dialog.message}
                actions={dialog.actions}
                />
                

                <Typography variant="h4" textAlign={"center"} margin={theme.margin.mainHeader}>
                    Production management (products)
                </Typography>
                <Box sx={{
                        display:"flex", 
                        justifyContent:{xs:"center",sm:"space-between"}
                        }}>
                    <Button 
                        variant='text' 
                        color="primary" 
                        onClick={handleUpdateTable} 
                        sx={{display:() => theme.mobile.hidden}}  
                    >
                        See production lines
                    </Button>
                    <Button variant="contained" startIcon={<Add/>} onClick={handleNewProduct} color="primary"  >
                        Add new product
                    </Button>
                </Box>
                <DataGrid
                columns={columnsState}
                rows={rows}
                getRowId={(row) => {
                    return row._id
                }}
                sx={{marginY:"2vh", display:() => theme.mobile.hidden}}
                />

                <DataGrid
                columns={productsColumnsMobile}
                rows={rows}
                getRowId={(row) => {
                    return row._id
                }}
                sx={{marginY:"2vh", display:() => theme.mobile.only}}
                />
            </Box>
            </Container>
        </Box>
    </>
  )
}
