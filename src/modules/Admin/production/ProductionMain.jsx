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
            const allProducts = await api.api.get(`${api.apiVersion}/products/`)
            productsRequest.data.products = true
            window.localStorage.setItem('products', JSON.stringify(allProducts.data))
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

    //Drawer Task array (TESTING PURPOSES)
    const employeeTasks = [
        {
          label:'Task 1',
        }, 
        {
          label:'Task 2',
        }, 
        {
          label:'Task 3',
        }, 
        {
          label:'Task 4',
        }
      ];
    

  return (
    <>  

        {/*Employee Tasks BEGINS*/}
            <Container maxWidth="md">
                <Box py={8} width="100%"  alignItems="center">
                    <Typography variant="h4" textAlign={"center"} margin={theme.margin.mainHeader}>
                            Employee Tasks
                    </Typography>

                    <Box width="100%" height="60%" textAlign='center' p={5} sx={{border:"2px solid #e3e3e3", borderRadius:"4px"}} justifyContent="center">
                        
                            <Box sx={{display:"flex", flexDirection:"column", width:"auto", height:"auto", p:2}}>
                                
                                <Container maxWidth="xs">
                                    {employeeTasks.map((option) => (
                                            <Button sx={theme.button.sidebar} id={option.label.toLocaleLowerCase()}  >
                                                {option.label}
                                            </Button>
                                        ))
                                    }

                                    <Button variant="contained" sx={theme.button.standard}>
                                        Finish Task
                                    </Button>
                                </Container>
                            </Box>
                        
                    </Box>
                </Box>
            </Container>





        {/*PRODUCTION MAIN BEGINS*/}
        <Box width="100%" height="100%">
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
                        {/* <Button 
                            variant='text' 
                            color="primary" 
                            onClick={handleUpdateTable} 
                            sx={{display:() => theme.mobile.hidden}}  
                        >
                            See production lines
                        </Button> */}
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
                </Box>
            </Container>


            
        </Box>

        


        
    </>
  )
}
