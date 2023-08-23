import React, {useEffect, useState} from 'react'

//*MUI Components
import { Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fade, Grid, InputAdornment, LinearProgress, Paper, TextField, Typography, useTheme } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
//*THEME
import {BV_THEME} from '../../../../theme/BV-theme'
//*ICONS
import Add from '@mui/icons-material/Add'

//*APP Components
import { UserDialog } from '../../../../CoreComponents/UserFeedback/Dialog'

//*UTILS
import { productsColumns, productsColumnsMobile } from '../../../../utils/TableStates'

//*network AND API
import api from '../../../../axios'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../../../../contextHooks/useAuthContext'
import { Stack } from '@mui/system'
// import { getGrowingProducts, updateContainerConfig } from '../../../CoreComponents/requests'
// import { containerConfigModel } from '../../../utils/models'
import { useTranslation } from 'react-i18next'

export const ProductionManagementDashboard = () => {
    const theme = useTheme(BV_THEME);
    //*CONTEXTS
    const {user, credential} = useAuth()
    const {t} = useTranslation(['production_management_module', 'buttons'])
    
    //*Render states
    const [columnsState, setColumnsState] = useState(productsColumns)
    const [rows, setRows] = useState(JSON.parse(window.localStorage.getItem('allProducts')) || [])
    const [loading, setLoading] = useState(false)
    const [growingProducts, setGrowingProducts] = useState(null)
    const [dialog, setDialog] = useState({
        open:false,
        title:"",
        message:"",
        actions:[]
    })
    // const [containerConfig, setContainerConfig] = useState(containerConfigModel)

    //*Network, routing and api
    const {state} = useLocation()

    const handleMobileTable = () => {
        setColumnsState(productsColumnsMobile)
    }
    
    const handleCloseDialog = () => {
        setDialog({
            ...dialog,
            open:false
        })
        
    }

    const handleOverHeadInput = (e) => {
        // setContainerConfig({
        //     ...containerConfig,
        //     overhead:Number(e.target.value)
        // })
    }

    const handleAcceptContainerConfig = () => {
        setLoading(true)
    }
    

    // useEffect(()=>{
        // getGrowingProducts({
        //     user:user,
        //     credential:credential,
        //     setProdData:setGrowingProducts,
        // })
    // },[])

    // console.log("growin products pm",growingProducts)

    
    // const displayGrowingProducts = () =>{
    // let testArr =[{name:"Sunflower",remainingDays:5,gownPercentage:49},{name:"Peas",remainingDays:6,gownPercentage:32},{name:"Daikon Radish",remainingDays:1,gownPercentage:75}]
    // return(
    //     growingProducts 
    //             != null ? 
    //     growingProducts
    // .map((product,id)=>{
    //     let differenceInMs = (new Date(product.EstimatedHarvestDate).getTime() - new Date().getTime())
    //     let msInDay = 1000 * 60 * 60 * 24
    //     product.remainingDays = Math.ceil(differenceInMs / msInDay)
        
    //     return(
            
    //         <Paper key={id} elevation={0} sx={{marginTop:"3%"}}>
    //             <Box sx={{display:"flex" , flexDirection:"row", justifyContent:"space-between" }}>
                                                
                                                
    //                 <Grid container>
    //                     <Grid item xs={6}>
    //                         <Typography variant={"h6"} color={"secondary.dark"} >
    //                         {product.ProductName}: 
    //                         </Typography>
    //                     </Grid>
                                                    
    //                     <Grid item xs={4}>
    //                         <Typography variant={"overline"} color={"secondary.light"}>
    //                             {product.remainingDays} days remaining
    //                         </Typography>
    //                     </Grid>

    //                     {/* <Grid item xs={2}>
    //                         <Typography color={product.gownPercentage>=66?"primary.dark":product.gownPercentage<33?"orange":"secondary.dark"} variant={"h6"}>
    //                             {product.gownPercentage} %
    //                         </Typography>
    //                     </Grid> */}
    //                 </Grid>

    //             </Box>
    //             <Typography variant={"overline"} color={"secondary.light"}>
    //                 BETA - (False %)
    //             </Typography>
    //             <LinearProgress sx={{height:"3vh"}} variant="determinate" value={30} />
    //         </Paper>

    //     )
    // })
    // :
    // <Typography>there are no growing products at the moment</Typography>
    // )
    // }

    

  return (
    <>  
        <Fade in={true} timeout={1000} unmountOnExit>
            <Box width="100%">
                <Container maxWidth={"xl"} sx={{padding:"2%"}}>
                    <Box sx={
                        
                        {
                            width:"100%", 
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
                            


                        <Grid container maxWidth={"xl"} spacing={2} marginTop={2}>

                            <Grid item xs={12} md={6} lg={12}>
                                <Paper 
                                elevation={4} 
                                sx={{
                                    padding: BV_THEME.spacing(2),
                                    display: "flex",
                                    overflow: "auto",
                                    flexDirection: "column",
                                    minHeight: 480
                                }}
                                >
                                    <Typography variant="h6" color="secondary">
                                        {t(`product_${state.strain.name}`,{ns:'production_management_module'})}
                                    </Typography>
                                </Paper>
                            </Grid>
                            {/* <Grid item xs={12} md={6} lg={12} >
                                <Paper elevation={4} sx={{
                                                        padding: BV_THEME.spacing(2),
                                                        display: "flex",
                                                        overflow: "auto",
                                                        flexDirection: "column",
                                                        minHeight: 480
                                                    }}>
                                    <Typography variant="h6" color="secondary">
                                        All products
                                    </Typography>

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
                                        sx={{marginY:"2vh", display:() => theme.mobile.hidden,height:"100%"}}
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
                                </Paper>
                            </Grid> */}

                        {/*Grid Container End */}    
                        </Grid>

                        {
                            user.role === "admin" && (
                                <Grid container maxWidth={"xl"} spacing={2} marginTop={2}>
                                    <Grid item xs={12} md={6} lg={12} >
                                        <Paper elevation={4} sx={{
                                                                padding: BV_THEME.spacing(2),
                                                                display: "flex",
                                                                overflow: "auto",
                                                                flexDirection: "column",
                                                                minHeight: 480
                                                            }}>
                                            <Typography variant="h6" color="secondary">
                                                Manage and configure {state.strain.name}
                                            </Typography>

                                            {
                                        loading
                                        ?   
                                        <LinearProgress color="primary" sx={{marginY:"2vh"}}/>
                                        :   
                                        <>
                                            <TextField
                                                label="Overhead production %"
                                                helperText="Place an INTEGER to setup the overhead"
                                                inputProps={
                                                    {
                                                        endAdornment: <InputAdornment position="end"> % </InputAdornment>
                                                    }
                                                }  
                                                onChange={handleOverHeadInput}
                                                type="number"     
                                            />

                                            <Button variant='contained' disabled={user.role === "employee"} color='primary' startIcon={<Add/>} onClick={handleAcceptContainerConfig} sx={{minWidth:"20%"}}>
                                                {t('accept_config',{ns:'buttons'})}
                                            </Button>
                                        
                                        </>
                                    }     
                                        </Paper>
                                    </Grid>

                                {/*Grid Container End */}    
                                </Grid>
                            ) 
                        }
                        
                        
                    </Box>
                </Container>


                
            </Box>
        </Fade>

        


        
    </>
  )
}
