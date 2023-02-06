import React, {useCallback, useEffect, useMemo, useState} from 'react'

//*MUI Components
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Fade, Grid, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, Paper, TextField, Typography, useTheme } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
//*THEME
import {BV_THEME} from '../../../theme/BV-theme'
//*ICONS
import Add from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

//*APP Components
import { UserDialog } from '../../../CoreComponents/UserFeedback/Dialog'
import { UserModal } from '../../../CoreComponents/UserActions/UserModal'

//*UTILS
import { productsColumns, DisplayViewButton /*productsColumnsMobile*/ } from '../../../utils/TableStates'

//*network AND API
import api from '../../../axios'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../contextHooks/useAuthContext'
import { Stack } from '@mui/system'
import { getGrowingProducts, updateContainerConfig } from '../../../CoreComponents/requests'
import { containerConfigModel } from '../../../utils/models'
import { set } from 'date-fns'


export const ProductionMain = () => {

    
    
    const theme = useTheme(BV_THEME);
    //*CONTEXTS
    const {user, credential} = useAuth()
    
    //*Render states
    
    const [rows, setRows] = useState(JSON.parse(window.localStorage.getItem('products')) || [])
    const [showProduct, setShowProduct] = useState(false)


    const [selectedProduct,setSelectedProduct] = useState(null)
    const [modifiedProduct, setModifiedProduct] = useState(null)
    const [showEdit, setShowEdit] = useState(false)


    const [loading, setLoading] = useState(false)
    const [growingProducts, setGrowingProducts] = useState(null)
    const [dialog, setDialog] = useState({
        open:false,
        title:"",
        message:"",
        actions:[]
    })
    const [modal,setModal] = useState({
        open:false,
        title:"",
        content:"",
        actions:[]
    })
    const [containerConfig, setContainerConfig] = useState(containerConfigModel)

    //*Network, routing and api
    const navigate = useNavigate()

    const deleteProduct = (params) => {
        console.log("Are you sure you want to delete this product?")
        setModal({
            ...modal,
            open:false
        })
        setDialog({
            ...dialog,
            open:true,
            title:"Are you sure you want to delete this product?",
            message:"The product, and all orders related to it will be deleted.",
            actions:[
                {
                    label:"Yes",
                    btn_color:"error",
                    execute:() => {
                        setDialog({
                            ...dialog,
                            open:false,
                        })
                        setLoading(true)
                        
                        api.api.delete(`${api.apiVersion}/products/?id=${params._id}`,{
                            headers:{
                                authorization:credential._tokenResponse.idToken,
                                user:user
                            }
                        })
                        .then(() => {
                            console.log(params)
                            setSelectedProduct(null)
                            setDialog({
                                ...dialog,
                                open:true,
                                title:"Product deleted succesfully",
                                message:"",
                                actions:[
                                    {
                                        label:"Ok",
                                        btn_color:"primary",
                                        execute:() => {
                                            setDialog({
                                                ...dialog,
                                                open:false
                                            })
                                            location.reload()
                                        }
                                    }
                                ]
                            })
                        })
                        .catch((err) => {
                            console.log("error",err)
                            setDialog({
                                ...dialog,
                                open:true,
                                title:"Error deleting product",
                                message:"",
                                actions:[
                                    {
                                        label:"Ok",
                                        btn_color:"primary",
                                        execute:() => {
                                            setDialog({
                                                ...dialog,
                                                open:false
                                            })
                                        }
                                    }
                                ]
                            })
                        })
                    }
                },
                {
                    label: "No",
                    btn_color: "primary",
                    execute: () => {
                        setDialog({
                            ...dialog,
                            open: false,
                        })

                    }
                }
            ]
        })
    }
                    
                
            
        
    


        const renderCell = (params) => {
          const handleClick = () => {
            setSelectedProduct(params.row);
            console.log("rowmijo",params.row)
        }
        
          return (
            <div>
              <Button variant='contained' onClick={handleClick} disabled={loading || (user.role === "employee")} sx={{...BV_THEME.button.table,maxWidth:"48%"}}> {loading ? 'Loading...' : 'View'} </Button>

            </div>
          );
        };

        function ProductCard(product){

            const handleOverHeadInput = (e) => {
                
            }

            
            function SimpleMenu() {
                const [anchorEl, setAnchorEl] = React.useState(null);
              
                const handleClick = (event) => {
                  setAnchorEl(event.currentTarget);
                };
              
                const handleClose = () => {
                  setAnchorEl(null);
                };
              
                return (
                  <div>
                    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} sx={{color:"gray"}}>
                      <MoreVertIcon color='gray'/>
                    </Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>
                                <Button variant="contained" sx={{}}
                                    disabled={user.role !== "admin"}
                                    onClick={() =>{ setShowEdit(true); setModifiedProduct(selectedProduct)}}
                                    color="secondary"
                                    >
                                    <EditIcon/>
                                </Button>
                            </MenuItem>

                            <MenuItem onClick={handleClose}>
                                <Button onClick={() => deleteProduct(selectedProduct)}
                                    color="error" disabled={loading || (user.role === "employee")}
                                    sx={{ padding: "0px", margin: "0px", maxWidth: "48%" }}>
                                    {<DeleteIcon />}
                                </Button>
                            </MenuItem>

                        </Menu>
                  </div>
                );
              }

              return  <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper elevation={4} sx={{
                            padding: BV_THEME.spacing(2),
                            display: "flex",
                            overflow: "auto",
                            flexDirection: "column",
                            minHeight: 280
                        }}><Box sx={{display:"flex", justifyContent:"space-between"}}> 
                            <Typography variant="h5" color="secondary.main">
                                {product.name}
                                
                            </Typography>
                        <IconButton onClick={()=>{setSelectedProduct(null); if(showEdit){setShowEdit(false)}}} sx={{width:"3vh", height:"3vh", align:"right"}}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                            <Grid container spacing={2}>
                                {!product.mix.isMix && <Grid item xs={12}>
                                    <Typography variant='caption'><b>{product.seed.seedId}</b></Typography>
                                </Grid>
                                }

                                <Grid item xs={4}>
                                    <Typography variant="body2" color="grayText">
                                        Active Orders:  {product.orders.length}
                                    </Typography>
                                </Grid>

                                <Grid item xs={4}>
                                    <Typography variant="body2" color="grayText">
                                        Performance:  {product.performance}
                                    </Typography>
                                </Grid>

                                {product.mix.isMix && <Grid item xs={12}>
                                    <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography>Products in Mix</Typography>
                                    </Grid>
                                    {product.mix.products.map((prod)=>{
                                        return <Grid item xs={12}>
                                            <Typography>{prod.strain}</Typography>
                                        </Grid>
                                    })}
                                    </Grid></Grid>}

                                <Grid item xs={12}>
                                    <Typography variant="body1" color="grayText">
                                        Parameters: 
                                    </Typography>
                                </Grid>


                                {!product.mix.isMix && product.parameters.seedingRate ?
                                <Grid item xs={4}>
                                    <Typography variant="body2" color="grayText">
                                         Seeding Rate: {product.parameters.seedingRate }
                                    </Typography>
                                </Grid>
                                : null}

                                {!product.mix.isMix && product.parameters.harvestRate ?
                                <Grid item xs={4}>
                                    <Typography variant="body2" color="grayText">
                                         Harvest Rate: {product.parameters.harvestRate }
                                    </Typography>
                                </Grid>
                                : null}

                                <Grid item xs={4}>
                                    <Typography variant="body2" color="grayText">
                                        Overhead:  {product.parameters.overhead}
                                    </Typography>
                                </Grid>

                                {!product.mix.isMix && product.parameters.day ?
                                <Grid item xs={4}>
                                    <Typography variant="body2" color="grayText">
                                         Day: {product.parameters.day }
                                    </Typography>
                                </Grid>
                                : null}

                                {!product.mix.isMix && product.parameters.night ?
                                <Grid item xs={4}>
                                    <Typography variant="body2" color="grayText">
                                         Night: {product.parameters.night }
                                    </Typography>
                                </Grid>
                                : null}

                                
                            </Grid>

                            
                            
                            <Box display="flex" justifyContent={"flex-end"}  sx={{width:"100%"}}>
                                <SimpleMenu/>
                                {/* <Button variant="contained" sx={{}} disabled={user.role !== "admin"} onClick={()=>setShowEdit(true)} color="secondary">Edit</Button>
                                <Button onClick={()=>deleteProduct(selectedProduct)} color="error" disabled={loading || (user.role === "employee")} sx={{padding:"0px",margin:"0px",maxWidth:"48%"}}> {<DeleteIcon/>} </Button>     */}

                            </Box>
                        </Paper>
                    </Grid>
                    {!!showEdit && <Grid item xs={12} >
                        <Paper elevation={4} sx={{
                            padding: BV_THEME.spacing(2),
                            display: "flex",
                            overflow: "auto",
                            flexDirection: "column",
                            minHeight: 180
                        }}>
                            <Typography variant="h6" color="secondary.main">
                                Manage {product.name} Overhead
                            </Typography>
                            <TextField
                                label="Overhead production %"
                                helperText="Place an INTEGER to setup the overhead"
                                inputProps={{
                                    endAdornment: <InputAdornment position="end"> % </InputAdornment>
                                }}
                                onChange={handleOverHeadInput}
                                type="number"
                            />
        
                            <Button variant='contained' disabled={user.role === "employee"} color='primary' onClick={handleAcceptContainerConfig} sx={{ minWidth: "20%" }}>
                                Accept configuration
                            </Button>
                        </Paper>
                    </Grid>}
                </Grid>        
            
        }

    const productsColumnsMobile = [
        {
            field:"name",
            headerClassName:"header-products-table",
            headerAlign:"center",
            align:"center",
            headerName:"Microgreen",
            flex:1,
        },
        {
            field:"price",
            headerClassName:"header-products-table",
            headerAlign:"center",
            //align:"center",
            headerName:"Prod. Price",
            minWidth:120,
            flex:1,
            renderCell:(params) => {
                return (
                    
                            <Accordion sx={{width:"100%",marginY:"1vh"}}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header" 
                                >
                                    <Typography>Price</Typography>
                                </AccordionSummary>
    
                                <AccordionDetails >
                                        {params.formattedValue.map((obj) => {
                                            return (
                                                <>
                                                <Typography align="justify">Size {obj.packageSize}:  €{obj.amount} </Typography>
                                                <Divider sx={{maxWidth:"100%"}} /> 
                                                </>
                                                )})}
                                </AccordionDetails>
                            </Accordion>
                    
                )
            }
        },
        {
            field:"actions",
            headerClassName:"header-products-table",
            headerAlign:"center",
            align:"center",
            headerName:"Actions",
            //renderCell: (params)=> {return <DisplayViewButton params={params} setShowProduct={setShowProduct}/> },
            renderCell: renderCell,
            flex:1
        },
    ]
    const [columnsState, setColumnsState] = useState(productsColumnsMobile)

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

    const handleOverHeadInput = (e) => {
        setContainerConfig({
            ...containerConfig,
            overhead:Number(e.target.value)
        })
    }

    const handleAcceptContainerConfig = () => {
        setLoading(true)
        updateContainerConfig(user, credential, containerConfig)
        .then((result) => {
            if(result.status === 200) {
                setDialog({
                    ...dialog,
                    open:true,
                    title:"Your container config has been updated successfully",
                    actions:[ 
                        {
                            label:"Ok",
                            btn_color:"primary",
                            execute:() => {
                                setLoading(false)
                                handleCloseDialog()
                            }
                        },
                    ]
                })
            }
            if(result.status === 204) {
                setDialog({
                    ...dialog,
                    open:true,
                    title:result.data.message,
                    actions:[ 
                        {
                            label:"Ok",
                            btn_color:"primary",
                            execute:() => {
                                setLoading(false)
                                handleCloseDialog()
                            }
                        },
                    ]
                })
            }
        })
        .catch(err => {
            console.log(err)
            setDialog({
                ...dialog,
                open:true,
                title:"Error updating the container configuration",
                actions:[ {
                    label:"Retry",
                    btn_color:"primary",
                    execute:async () => {
                        await updateContainerConfig()
                    }
                    },
                    {
                        label:"Cancel",
                        btn_color:"secondary",
                        execute: () => {
                            setLoading(false)
                            handleCloseDialog()
                            
                        }
                    }
                ]
            })
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


    // useEffect(()=>{
        // getGrowingProducts({
        //     user:user,
        //     credential:credential,
        //     setProdData:setGrowingProducts,
        // })
    // },[])

    console.log("growin products pm",growingProducts)

    
    const displayGrowingProducts = () =>{
    let testArr =[{name:"Sunflower",remainingDays:5,gownPercentage:49},{name:"Peas",remainingDays:6,gownPercentage:32},{name:"Daikon Radish",remainingDays:1,gownPercentage:75}]
    return(
        growingProducts 
                != null ? 
        growingProducts
    .map((product,id)=>{
        let differenceInMs = (new Date(product.EstimatedHarvestDate).getTime() - new Date().getTime())
        let msInDay = 1000 * 60 * 60 * 24
        product.remainingDays = Math.ceil(differenceInMs / msInDay)
        
        return(
            
            <Paper key={id} elevation={0} sx={{marginTop:"3%"}}>
                <Box sx={{display:"flex" , flexDirection:"row", justifyContent:"space-between" }}>
                                                
                                                
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography variant={"h6"} color={"secondary.dark"} >
                            {product.ProductName}: 
                            </Typography>
                        </Grid>
                                                    
                        <Grid item xs={4}>
                            <Typography variant={"overline"} color={"secondary.light"}>
                                {product.remainingDays} days remaining
                            </Typography>
                        </Grid>

                        {/* <Grid item xs={2}>
                            <Typography color={product.gownPercentage>=66?"primary.dark":product.gownPercentage<33?"orange":"secondary.dark"} variant={"h6"}>
                                {product.gownPercentage} %
                            </Typography>
                        </Grid> */}
                    </Grid>

                </Box>
                <Typography variant={"overline"} color={"secondary.light"}>
                    BETA - (False %)
                </Typography>
                <LinearProgress sx={{height:"3vh"}} variant="determinate" value={30} />
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
                        <UserModal
                        modal={modal}
                        setModal={setModal}
                        title={modal.title}
                        content={modal.content}
                        actions={modal.actions}
                        />
              
                            

                        <Typography variant="h4" color="secondary" textAlign={"center"} margin={theme.margin.mainHeader}>
                            Production Management
                        </Typography>
                        <Box sx={{display:user.role === "employee" ? 'none' : 'flex', justifyContent:"space-between",marginBottom:"3vh"}} >
                            <Button variant='contained' disabled={user.role === "employee"} color='primary' startIcon={<Add/>} onClick={handleNewProduct} sx={{minWidth:"20%"}}>
                                Add New Product
                            </Button>
                        </Box>

                        <Grid container maxWidth={"xl"} spacing={4} marginTop={2}>
                            {/* <Grid item xs={12} md={6} lg={4} >
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
                            </Grid> */}


                            <Grid item xs={12} md={6} lg={4} order={{xs:"3",md:"1"}}>
                                <Paper elevation={4} sx={{
                                                        padding: BV_THEME.spacing(2),
                                                        display: "flex",
                                                        overflow: "auto",
                                                        flexDirection: "column",
                                                        minHeight: 508
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
                                        columns={productsColumnsMobile}
                                        rows={ rows
                                        }
                                        getRowId={(row) => {
                                            return row._id
                                        }}
                                        getRowHeight={() => 'auto'}
                                        onStateChange={(s,e,d) => {
                                            console.log(s)
                                            console.log(e)
                                            console.log(d)
                                       }}
                                        sx={{marginY:"2vh", maxWidth:"100%"}}
                                    />
                                </>
                            }     
                                </Paper>
                            </Grid>

                        {/*Grid Container End */} 
                            {!!selectedProduct ?  <Grid item xs={12} md={6} lg={4} order={{xs:"1",md:"2"}}>
                               {ProductCard(selectedProduct)}
                            </Grid>   
                            :
                            null
                            }

                            {/* Edit Product Card / Component */}
                            {user.role === "admin" && !!showEdit ? <Grid item xs={12} lg={4} order={{xs:"2",md:"3"}}>
                                <Paper elevation={4} sx={{padding: BV_THEME.spacing(2),
                                                        display: "flex",
                                                        overflow: "auto",
                                                        flexDirection: "column",
                                                        minHeight: 508}}
                                >
                                <Box sx={{display:"flex",align:"right", justifyContent:"right"}}> 
                                    <IconButton onClick={()=>setShowEdit(false)} sx={{width:"3vh", height:"3vh", align:"right"}}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" color="secondary.main">
                                        Edit Product
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>

                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField 
                                        defaultValue={selectedProduct.name} 
                                        value={selectedProduct.name} 
                                        //helperText={error.seeding.message} 
                                        //error={error.seeding.failed} 
                                        id="name" 
                                        type="text"
                                        variant='standard' 
                                        //onChange={handleChangeProductData} 
                                        label="Name" 
                                        sx={theme.input.mobile.fullSize.desktop.fullSize}/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField 
                                        defaultValue={selectedProduct.parameters.seedingRate} 
                                        value={modifiedProduct.parameters.seedingRate} 
                                        //helperText={error.seeding.message} 
                                        //error={error.seeding.failed} 
                                        id="name" 
                                        type="text"
                                        variant='standard' 
                                        //onChange={handleChangeProductData} 
                                        label="Seeding Rate" 
                                        sx={theme.input.mobile.fullSize.desktop.fullSize}/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField 
                                        defaultValue={selectedProduct.parameters.harvestRate} 
                                        value={selectedProduct.parameters.harvestRate} 
                                        //helperText={error.seeding.message} 
                                        //error={error.seeding.failed} 
                                        id="name" 
                                        type="text"
                                        variant='standard' 
                                        //onChange={handleChangeProductData} 
                                        label="harvest Rate" 
                                        sx={theme.input.mobile.fullSize.desktop.fullSize}/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body2">Price</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField 
                                        defaultValue={selectedProduct.price[0].amount} 
                                        value={selectedProduct.price[0].amount} 
                                        //helperText={error.seeding.message} 
                                        //error={error.seeding.failed} 
                                        id="name" 
                                        type="text"
                                        variant='standard' 
                                        //onChange={handleChangeProductData} 
                                        label="25 g" 
                                        sx={theme.input.mobile.fullSize.desktop.fullSize}/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField 
                                        defaultValue={selectedProduct.price[1].amount} 
                                        value={selectedProduct.price[1].amount} 
                                        //helperText={error.seeding.message} 
                                        //error={error.seeding.failed} 
                                        id="name" 
                                        type="text"
                                        variant='standard' 
                                        //onChange={handleChangeProductData} 
                                        label="80 g" 
                                        sx={theme.input.mobile.fullSize.desktop.fullSize}/>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="body2">Seed</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField 
                                        defaultValue={selectedProduct.seed.seedId} 
                                        value={selectedProduct.seed.seedId} 
                                        //helperText={error.seeding.message} 
                                        //error={error.seeding.failed} 
                                        id="name" 
                                        type="text"
                                        variant='standard' 
                                        //onChange={handleChangeProductData} 
                                        label="Seed ID" 
                                        sx={theme.input.mobile.fullSize.desktop.fullSize}/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField 
                                        defaultValue={selectedProduct.seed.seedName} 
                                        value={selectedProduct.seed.seedName} 
                                        //helperText={error.seeding.message} 
                                        //error={error.seeding.failed} 
                                        id="name" 
                                        type="text"
                                        variant='standard' 
                                        //onChange={handleChangeProductData} 
                                        label="Seed Name" 
                                        sx={theme.input.mobile.fullSize.desktop.fullSize}/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField 
                                        defaultValue={selectedProduct.provider.name} 
                                        value={selectedProduct.provider.name} 
                                        //helperText={error.seeding.message} 
                                        //error={error.seeding.failed} 
                                        id="name" 
                                        type="text"
                                        variant='standard' 
                                        //onChange={handleChangeProductData} 
                                        label="Seed provider" 
                                        sx={theme.input.mobile.fullSize.desktop.fullSize}/>
                                    </Grid>
                                    

                                    <Grid item xs={6}>
                                        <Button variant="contained" color="secondary" sx={{width:"100%"}}>
                                            <SaveIcon />
                                        </Button>
                                    </Grid>

                                </Grid>

                                </Paper>
                            </Grid> 
                            :
                            null}
                        </Grid>

                        {/* {
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
                                                Manage and configure the container
                                            </Typography>

                                            {
                                        loading
                                        ?   
                                        <LinearProgress color="primary" sx={{marginY:"2vh"}}/>
                                        :   
                                        <>
                                            {/* <TextField
                                                label="Overhead production %"
                                                helperText="Place an INTEGER to setup the overhead"
                                                inputProps={
                                                    {
                                                        endAdornment: <InputAdornment position="end"> % </InputAdornment>
                                                    }
                                                }  
                                                onChange={handleOverHeadInput}
                                                type="number"     
                                            /> }

                                            <Button variant='contained' disabled={user.role === "employee"} color='primary' startIcon={<Add/>} onClick={handleAcceptContainerConfig} sx={{minWidth:"20%"}}>
                                                Accept configuration
                                            </Button>
                                        
                                        </>
                                    }     
                                        </Paper>
                                    </Grid>

                                {/*Grid Container End }    
                                </Grid>
                            ) 
                        } */}
                        
                        
                    </Box>
                </Container>


                
            </Box>
        </Fade>

        


        
    </>
  )
}
