import React, { useEffect, useState } from 'react'
import { Box, Button, Container, Fade, LinearProgress, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { UserDialog } from '../../../../CoreComponents/UserFeedback/Dialog'
import { BV_THEME } from '../../../../theme/BV-theme'
import { invoicesColumns } from '../../../../utils/TableStates'
import { Add } from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'

export const InvoicesIndex = () => {
    const {state} = useLocation()
    const [reload, setReload] = useState(false);
    
    const [dialog, setDialog] = useState({
        open:       false,
        title:      "",
        message:    "",
        actions:    []
    })
    const [rows, setRows] = useState(state.invoices.success ? state.invoices.data : [])

    const [loading, setLoading] = useState(true);
    
    const handleNewInvoice = () => {
        setDialog({
            ...dialog,
            open:true,
            title:"Feature not available",
            message:"Please wait until the feature is available",
            actions:[
                {
                    label:"Ok",
                    execute:() => setDialog({...dialog, open:false})
                }
            ]
        })
    }


    useEffect(() => {
        //*IF REQUEST FOR INVOICES FAIL FROM TABLE STATE, THEN REQUEST INVOICES HERE USING THE LOCATION PARAM (CUSTOMER ID)
        setLoading(() => false)
    },[])
  return (
    <Fade in={true} timeout={1000} unmountOnExit>
        <Box width="100%" height="100%">
            <UserDialog dialog={dialog} setDialog={setDialog} open={dialog.open} title={dialog.title} content={dialog.message} actions={dialog.actions}/>
            
            <Container sx={{padding:"2%"}}>
                <Box sx={{
                            width:"100%", 
                            height:"80vh",
                            "& .header-sales-table":{
                                backgroundColor:BV_THEME.palette.primary.main,
                                color:"white"
                            }
                        }}
                >
                    
                    <Typography variant="h4" color="secondary" textAlign={"center"} margin={BV_THEME.margin.mainHeader}>
                        Invoices for {state.customerData.name}
                    </Typography>

                <Box sx={{width:"100%", height:"100%"}}>
                    
                    <Box sx={{display:"flex", justifyContent:"space-between", marginBottom:"3vh"}} >
                        <Button variant='contained' color='primary' startIcon={<Add/>} onClick={handleNewInvoice} sx={{minWidth:"20%"}}>
                            New invoice
                        </Button>
                    </Box>

                    {
                        loading
                        ?   
                        <LinearProgress color="primary" sx={{marginY:"2vh"}}/>
                        : 
                        <DataGrid
                        columns={invoicesColumns}
                        rows={rows}
                        sx={{width:"100%", height:"80%"}}
                        getRowId={(row) => {
                            return row._id
                        }}
                        />
                    }
                    </Box>


                </Box>
            </Container>  
        </Box>
    </Fade>
  )
}
