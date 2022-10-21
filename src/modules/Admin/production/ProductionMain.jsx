import React, {useEffect, useState} from 'react'

//*MUI Components
import { Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fade, LinearProgress, Typography, useTheme } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
//*THEME
import {BV_THEME} from '../../../theme/BV-theme'
//*ICONS
import Add from '@mui/icons-material/Add'

//*APP Components
import { UserDialog } from '../../../CoreComponents/UserFeedback/Dialog'

//*UTILS
import { productsColumns, productsColumnsMobile } from '../../../utils/TableStates'

//*network AND API
import api from '../../../axios'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../contextHooks/useAuthContext'

export const ProductionMain = () => {
    
    const theme = useTheme(BV_THEME);
    //*CONTEXTS
    const {user, credential} = useAuth()
    
    //*Render states
    const [columnsState, setColumnsState] = useState(productsColumns)
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const [dialog, setDialog] = useState({
        open:false,
        title:"",
        message:"",
        actions:[]
    })

    //*Network, routing and api
    const navigate = useNavigate()

    const handleMobileTable = () => {
        setColumnsState(productsColumnsMobile)
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
            const productsRequest = await api.api.get(`${api.apiVersion}/products/?orders&&tasks`, {
                headers:{
                    user:user,
                    authorization:credential._tokenResponse.idToken
                }
            })
            return productsRequest.data
        }

        setLoading(true)
        requests()
        .then(products => {
            let test = 0
            window.localStorage.setItem('products', JSON.stringify(products.data))
            if(products.data.length === 0){
                return setDialog((...dialog) => {
                    return ({
                        ...dialog,
                        open:   true,
                        title:  "No products added",
                        message:"Your container doesnt have any product, please create a new one.",
                        actions:[
                            {
                                label:"Create new product",
                                execute:() => handleNewProduct()
                            }
                        ]
                    })
                })
            }
            setRows(products.data)
            setLoading(false)
        })
        .catch(err => {
            console.log(err)
            setDialog({
                ...dialog,
                open:true,
                title:"Error getting products",
                message:"Sorry, we are having trouble to get the products. Try again.",
                actions:[
                    {
                        label:"Reload page",
                        execute:() => window.location.reload()
                    }
                ]
            })
        })
    }, [])

    

  return (
    <>  
        {/*PRODUCTION MAIN BEGINS*/}
        <Fade in={true} timeout={1000} unmountOnExit>
            <Box width="100%">
                <Container sx={{padding:"2%"}}>
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
                                justifyContent:{xs:"center",sm:"flex-end"}
                                }}>
                            <Button variant="contained" startIcon={<Add/>} onClick={handleNewProduct} color="primary" disabled={user.role === "employee"} >
                                Add new product
                            </Button>
                        </Box>
                        
                        {
                            loading
                            ?   
                            <LinearProgress color="primary" sx={{marginY:"2vh"}}/>
                            :   
                            <>
                                <DataGrid
                                    columns={columnsState}
                                    rows={ rows
                                    }
                                    getRowId={(row) => {
                                        return row._id
                                    }}
                                    getRowHeight={() => 'auto'}
                                    sx={{marginY:"2vh", display:() => theme.mobile.hidden}}
                                />
                                <DataGrid
                                    columns={productsColumnsMobile}
                                    rows={rows}
                                    getRowId={(row) => {
                                        return row._id
                                    }}
                                    onStateChange={(s,e,d) => {
                                        // console.log(s)
                                        // console.log(e)
                                        // console.log(d)
                                    }}
                                    
                                    sx={{marginY:"2vh", display:() => theme.mobile.only}}
                                />
                            </>
                        }
                        
                    </Box>
                </Container>


                
            </Box>
        </Fade>

        


        
    </>
  )
}
