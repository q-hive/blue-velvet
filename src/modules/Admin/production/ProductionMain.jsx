import React, {useEffect, useState} from 'react'

//*MUI Components
import { Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fade, Grid, LinearProgress, Paper, Typography, useTheme } from '@mui/material'
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
import { Stack } from '@mui/system'
import { getGrowingProducts } from '../../../CoreComponents/requests'

export const ProductionMain = () => {
    
    const theme = useTheme(BV_THEME);
    //*CONTEXTS
    const {user, credential} = useAuth()
    
    //*Render states
    const [columnsState, setColumnsState] = useState(productsColumns)
    const [rows, setRows] = useState(JSON.parse(window.localStorage.getItem('products')) || [])
    const [loading, setLoading] = useState(false)
    const [growingProducts, setGrowingProducts] = useState(null)
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
            const productsRequest = await api.api.get(`${api.apiVersion}/products/?orders&tasks&performance`, {
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


    useEffect(()=>{
        getGrowingProducts({
            user:user,
            credential:credential,
            setProdData:setGrowingProducts,
        })
    },[])

    console.log("growin products pm",growingProducts)

    
    const displayGrowingProducts = () =>{
    let testArr =[{name:"Sunflower",remainingDays:5,gownPercentage:49},{name:"Peas",remainingDays:6,gownPercentage:32},{name:"Daikon Radish",remainingDays:1,gownPercentage:75}]
    return(
        growingProducts 
                != null ? 
        growingProducts
    .map((product,id)=>{
        return(
            
            <Paper key={id} elevation={0} sx={{marginTop:"3%"}}>
                <Box sx={{display:"flex" , flexDirection:"row", justifyContent:"space-between" }}>
                                                
                                                
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography variant={"h6"} color={"secondary.dark"} >
                            {product.name}: 
                            </Typography>
                        </Grid>
                                                    
                        <Grid item xs={4}>
                            <Typography variant={"overline"} color={"secondary.light"}>
                                {product.remainingDays} days remaining
                            </Typography>
                        </Grid>

                        <Grid item xs={2}>
                            <Typography color={product.gownPercentage>=66?"primary.dark":product.gownPercentage<33?"orange":"secondary.dark"} variant={"h6"}>
                                {product.gownPercentage}%
                            </Typography>
                        </Grid>
                    </Grid>

                </Box>
                <LinearProgress sx={{height:"3vh"}} variant="determinate" value={product.gownPercentage} />
            </Paper>

        )
    })
    :
    <Typography>there are no growing products at the moment</Typography>
    )
    }

    

  return (
    <>  
        {/*PRODUCTION MAIN BEGINS*/}
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
                        

                        <Typography variant="h4" color="secondary" textAlign={"center"} margin={theme.margin.mainHeader}>
                            Production Management
                        </Typography>
                        <Box sx={{display:"flex", justifyContent:"space-between",marginBottom:"3vh"}} >
                        <Button variant='contained' color='primary' startIcon={<Add/>} onClick={handleNewProduct} sx={{minWidth:"20%"}}>
                            Add New Product
                        </Button>
                    </Box>

                    <Grid container maxWidth={"xl"} spacing={2} marginTop={2}>
                        <Grid item xs={12} md={6} lg={4} >
                            <Paper elevation={5} sx={{
                                                        padding: BV_THEME.spacing(2),
                                                        display: "flex",
                                                        overflow: "auto",
                                                        flexDirection: "column",
                                                        minHeight: 480,
                                                        
                                                    }}>
                                <Typography variant="h6" color="secondary">
                                    Growing Products
                                </Typography>

                                {
                                    loading
                                    ?   
                                    <LinearProgress color="primary" sx={{marginY:"2vh"}}/>
                                    :  
                                    <Stack sx={{}}>
                                    
                                        {displayGrowingProducts()}

                                        
                                    </Stack>
                                    
                                }      
                            </Paper>
                        </Grid>


                        <Grid item xs={12} md={6} lg={8} >
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
                        </Grid>

                    {/*Grid Container End */}    
                    </Grid>
                        
                        
                    </Box>
                </Container>


                
            </Box>
        </Fade>

        


        
    </>
  )
}
