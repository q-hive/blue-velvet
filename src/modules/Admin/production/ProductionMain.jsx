import React, {useCallback, useEffect, useMemo, useState} from 'react'

//*MUI Components
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Fade, Grid, Grow, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, Paper, Slide, TextField, Typography, useTheme } from '@mui/material'
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
import { getGrowingProducts, updateContainerConfig, updateProduct } from '../../../CoreComponents/requests'
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
            if(!params.row.mix.isMix){
            setProductData({
                    name:               params.row.name ,
                    label:              params.row.img ,
                    smallPrice:         params.row.price.find((price) => price.packageSize === 25).amount ,     
                    mediumPrice:        params.row.price.find((price) => price.packageSize === 80).amount ,
                    seedId:             params.row.seed.seedId ,
                    provider:           params.row.provider.name ,
                    providerSeedName:   params.row.seed.seedName ,
                    day:                params.row.parameters.day ,
                    night:              params.row.parameters.night ,
                    overhead:           params.row.parameters.overhead, 
                    //*HANDLE PRODUCSTS CYCLE TYPE
                    cycleType:          "",
                    seeding:            params.row.parameters.seedingRate ,
                    harvest:            params.row.parameters.harvestRate ,
                    status:             params.row.status 
            })
            }else {
                setProductData(params.row)
            }
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
                setProductData({...productData, overhead:Number(e.target.value)})
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

              return <Grid container spacing={2}>
                    <Grow in={true} mountOnEnter unmountOnExit sx={{transfromOrigin:"0 0 0"}}>
                    <Grid item xs={12}>
                        <Paper elevation={4} sx={{
                            padding: BV_THEME.spacing(2),
                            display: "flex",
                            overflow: "auto",
                            flexDirection: "column",
                            minHeight: 280,
                            padding:3
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
                                        Active Orders:  <b>{product.orders.length}</b>
                                    </Typography>
                                </Grid>

                                <Grid item xs={4}>
                                    <Typography variant="body2" color="grayText">
                                        Performance:  <b>{product.performance}</b>
                                    </Typography>
                                </Grid>

                                {product.mix.isMix && <Grid item xs={12}>
                                    <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant={"body1"} color={"grayText"}>Products in Mix</Typography>
                                    </Grid>
                                    {product.mix.products.map((obj)=>{
                                        let tempProd = rows.find((prod)=>prod._id === obj.strain)
                                        return <><Grid item xs={6}>
                                            <Typography 
                                                variant={"body2"} 
                                                color={"grayText"}
                                                marginLeft={"20%"}
                                            >
                                                {tempProd.name}: 
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant={"body2"} color={"grayText"}><b>{obj.amount}%</b></Typography>
                                        </Grid>
                                        </>
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
                                         Seeding Rate: <b>{product.parameters.seedingRate }</b>
                                    </Typography>
                                </Grid>
                                : null}

                                {!product.mix.isMix && product.parameters.harvestRate ?
                                <Grid item xs={4}>
                                    <Typography variant="body2" color="grayText">
                                         Harvest Rate: <b>{product.parameters?.harvestRate }</b>
                                    </Typography>
                                </Grid>
                                : null}

                                <Grid item xs={4}>
                                    <Typography variant="body2" color="grayText">
                                        Overhead:  <b>{product.parameters?.overhead}</b>
                                    </Typography>
                                </Grid>

                                {!product.mix.isMix && product.parameters.day ?
                                <Grid item xs={4}>
                                    <Typography variant="body2" color="grayText">
                                         Day: <b>{product.parameters?.day }</b>
                                    </Typography>
                                </Grid>
                                : null}

                                {!product.mix.isMix && product.parameters.night ?
                                <Grid item xs={4}>
                                    <Typography variant="body2" color="grayText">
                                         Night: <b>{product.parameters.night }</b>
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
                    </Grow>
                    {(!!showEdit && !selectedProduct.mix.isMix) && <Grow in={true} mountOnEnter unmountOnExit>
                        <Grid item xs={12} >
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
                                    endadornment: <InputAdornment position="end"> % </InputAdornment>
                                }}
                                onChange={handleOverHeadInput}
                                value={productData.overhead}
                                type="number"
                            />
        
                            <Button variant='contained' disabled={user.role === "employee"} color='primary' onClick={handleComplete} sx={{ minWidth: "20%" }}>
                                Accept configuration
                            </Button>
                        </Paper>
                    </Grid></Grow>}
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
                                        {params.formattedValue.map((obj,idx) => {
                                            return (
                                                <React.Fragment key={"frag"+idx}>
                                                <Typography align="justify">Size {obj.packageSize}:  €{obj.amount} </Typography>
                                                <Divider sx={{maxWidth:"100%"}} /> 
                                                </React.Fragment>
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

    const [productData, setProductData] = useState({/*
        name:               selectedProduct ? selectedProduct.name : null,
        label:              selectedProduct ? selectedProduct.img : null,
        smallPrice:         selectedProduct ? selectedProduct.price.find((price) => price.packageSize === 25).amount      : null,     
        mediumPrice:        selectedProduct ? selectedProduct.price.find((price) => price.packageSize === 80).amount      : null,
        seedId:             selectedProduct ? selectedProduct.seed.seedId : null,
        provider:           selectedProduct ? selectedProduct.provider.name : null,
        providerSeedName:   selectedProduct ? selectedProduct.seed.seedName : null,
        day:                selectedProduct ? selectedProduct.parameters.day : null,
        night:              selectedProduct ? selectedProduct.parameters.night : null,
        //*HANDLE PRODUCSTS CYCLE TYPE
        cycleType:          "",
        seeding:            selectedProduct ? selectedProduct.parameters.seedingRate : null,
        harvest:            selectedProduct ? selectedProduct.parameters.harvestRate : null,
        status:             selectedProduct ? selectedProduct.status : null
*/})


    const handleChangeProductData = (e) => {
        /*
        if(error[e.target.id] && error[e.target.id].failed){
            setError({
                ...error,
                [e.target.id]:{
                    failed:false,
                    message:""
                }
            })
        }
        */
        if(!selectedProduct.mix.isMix){
            switch(e.target.id){
                case "25":
                    setProductData({
                        ...productData,
                        smallPrice:Number(e.target.value)
                    })
                    console.log("pd",productData)
                    break;
                case "80":
                    setProductData({
                        ...productData,
                        mediumPrice:Number(e.target.value)
                    })
                    console.log("pd",productData)
                    break;
                case "1000":
                    setProductData({
                        ...productData,
                        largePrice:Number(e.target.value)
                    })
                    console.log("pd",productData)
                    break;
                default:
                    setProductData({
                        ...productData,
                        [e.target.id]:e.target.value
                    })
                    console.log("pd",productData)
                    break;
    
            }

        }else {

            
            let tempPrice = productData.price
            let tempArr = productData.mix.products

            switch(e.target.id){
                case "name":
                    setProductData({
                        ...productData,
                        name:e.target.value
                    })
                    console.log("pd",productData)
                    break;
                case "25":
                    tempPrice[0].amount = e.target.value
                    setProductData({
                        ...productData,
                        price:tempPrice
                    })
                    console.log("pd",productData)
                    break;
                case "80":
                    tempPrice[1].amount = e.target.value
                    setProductData({
                        ...productData,
                        price:tempPrice
                    })
                    console.log("pd",productData)
                    break;
                case "percentage":
                        console.log("arregloj",productData,productData.products,tempArr)
                        tempArr[Number(e.target.name)].amount = e.target.value
                        
                        
                        setProductData({
                            ...productData,
                            mix:{...productData.mix,products:tempArr}
                        })
                        console.log("pd",productData)
                        break;
                default:
                    setProductData({
                        ...productData,
                        [e.target.id]:e.target.value
                    })
                    console.log("pd",productData)
                    break;
    
            }
        }

        
    }

    const handleComplete = () => {
        
        /*const {errors, errorMapped} = mapErrors()
        if(errors.length>0){
            setError({
                ...error,
                ...errorMapped
            })
            setDialog({
                ...dialog,
                open:true,
                title:"You cannot save an uncomplete product",
                message:"Please complete the values marked.",
            })
            return
        }*/
        let mappedProduct = {}


        if(!selectedProduct.mix.isMix){
        //*Request if is creating product
        mappedProduct = {
            name:       productData.name,
            // image:      { type: String,   required: false },     // *TODO MANAGE IMAGE PROCESSING
            // desc:       { type: String,   required: false },     // * Description
            status:     productData.status,
            // * ID of quality of the seeds - track the seeds origin - metadata 
            seed:       { 
                        seedId:         productData.seedId, 
                        seedName:       productData.providerSeedName
            }, //* SEND THE SEED ID AND CREATE IT IN THE DATABASE 
            provider:   { 
                        email:          productData.provider, 
                        name:           productData.provider
            }, //* SEND THE PROVIDER DATA AND CREATE FIRST IN DB
            price:      [
                {
                    amount:         productData.smallPrice,
                    packageSize:    25
                },
                {
                    amount:         productData.mediumPrice,
                    packageSize:    80
                },
            ], 
            mix:        { isMix:        false},
            parameters: {
                         overhead:       Number(productData.overhead),
                         day:            Number(productData.day),       // * In days check email
                         night:          Number(productData.night),     // * In days check email
                         seedingRate:    Number(productData.seeding),   // * Per tray
                         harvestRate:    Number(productData.harvest),    // * Per tray
            },
        }
    } else {
        mappedProduct=productData
    }

            mappedProduct.performamce = selectedProduct.performance
            mappedProduct._id = selectedProduct._id
            console.log("overhead b4 update", mappedProduct.parameters?.overhead)
            updateProduct(user,credential,mappedProduct)
            .then((response) => {
                setDialog({
                    ...dialog,
                    open:true,
                    title:"Product updated succesfully",
                    //message:"What do you want to do?",
                    actions:[
                        {
                            label:"Reload",
                            execute: () => {
                                window.location.reload()
                            }
                        },
                    ]
                })     
            })
            .catch(err => {
                setDialog({
                    ...dialog,
                    open:true,
                    title:"Error updating product",
                    message:"What do you want to do?",
                    actions:[
                        {
                            label:"Try again",
                            execute: () => {
                                handleComplete
                            }
                        },
                        {
                            label:"Cancel",
                            execute: () => {
                                window.location.reload()
                            }
                        },
                    ]   
                })
            })
            
            return
        
            
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
                              {/* //GROWING PRODUCTS CARD

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
                                */}


                              {/* Products DataGrid */}
                              <Grid item xs={12} md={6} lg={4} order={{ xs: "3", md: "1" }}>
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
                                              <LinearProgress color="primary" sx={{ marginY: "2vh" }} />
                                              :
                                              <>
                                                  <DataGrid
                                                      columns={productsColumnsMobile}
                                                      rows={rows}
                                                      getRowId={(row) => {
                                                          return row._id
                                                      }}
                                                      getRowHeight={() => 'auto'}
                                                      onStateChange={(s, e, d) => {
                                                          console.log(s)
                                                          console.log(e)
                                                          console.log(d)
                                                      }}
                                                      sx={{ marginY: "2vh", maxWidth: "100%" }}
                                                  />
                                              </>
                                      }
                                  </Paper>
                              </Grid>
                              {/* Products Data<Grid End */}



                              {/* Product Card */}
                              {!!selectedProduct ? <Grid item xs={12} md={6} lg={4} order={{ xs: "1", md: "2" }}>
                                  {ProductCard(selectedProduct)}
                              </Grid>
                                  :
                                  null
                              }

                              {/* Edit Product Card / Component */}
                              {user.role === "admin" && !!showEdit ?
                                  //Load Card
                                  <Grow in={true} mountOnEnter unmountOnExit>
                                      <Grid item xs={12} lg={4} order={{ xs: "2", md: "3" }}>
                                          <Paper elevation={4} sx={{
                                              padding: BV_THEME.spacing(2),
                                              display: "flex",
                                              overflow: "auto",
                                              flexDirection: "column",
                                              minHeight: 508
                                          }}
                                          >
                                              <Box sx={{ display: "flex", align: "right", justifyContent: "right" }}>
                                                  <IconButton onClick={() => setShowEdit(false)} sx={{ width: "3vh", height: "3vh", align: "right" }}>
                                                      <CloseIcon />
                                                  </IconButton>
                                              </Box>

                                              {/*Load content depending on wether product is a mix */}
                                              {
                                                  !selectedProduct.mix.isMix
                                                      ?
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
                                                                  //defaultValue={selectedProduct.name} 
                                                                  value={productData.name}
                                                                  //helperText={error.seeding.message} 
                                                                  //error={error.seeding.failed} 
                                                                  id="name"
                                                                  type="text"
                                                                  variant='standard'
                                                                  onChange={handleChangeProductData}
                                                                  label="Name"
                                                                  sx={theme.input.mobile.fullSize.desktop.fullSize} />
                                                          </Grid>
                                                          <Grid item xs={6}>
                                                              <TextField
                                                                  //defaultValue={selectedProduct.parameters.seedingRate} 
                                                                  value={productData.seeding}
                                                                  //helperText={error.seeding.message} 
                                                                  //error={error.seeding.failed} 
                                                                  id="seeding"
                                                                  type="number"
                                                                  variant='standard'
                                                                  onChange={handleChangeProductData}
                                                                  label="Seeding Rate"
                                                                  sx={theme.input.mobile.fullSize.desktop.fullSize} />
                                                          </Grid>
                                                          <Grid item xs={6}>
                                                              <TextField
                                                                  //defaultValue={selectedProduct.parameters.harvestRate} 
                                                                  value={productData.harvest}
                                                                  //helperText={error.seeding.message} 
                                                                  //error={error.seeding.failed} 
                                                                  id="harvest"
                                                                  type="number"
                                                                  variant='standard'
                                                                  onChange={handleChangeProductData}
                                                                  label="harvest Rate"
                                                                  sx={theme.input.mobile.fullSize.desktop.fullSize} />
                                                          </Grid>
                                                          <Grid item xs={12}>
                                                              <Typography variant="body2">Price</Typography>
                                                          </Grid>
                                                          <Grid item xs={6}>
                                                              <TextField
                                                                  //defaultValue={selectedProduct.price[0].amount} 
                                                                  value={productData.smallPrice}
                                                                  //helperText={error.seeding.message} 
                                                                  //error={error.seeding.failed} 
                                                                  id="25"
                                                                  type="number"
                                                                  variant='standard'
                                                                  onChange={handleChangeProductData}
                                                                  label="25 g"
                                                                  sx={theme.input.mobile.fullSize.desktop.fullSize} />
                                                          </Grid>
                                                          <Grid item xs={6}>
                                                              <TextField
                                                                  //defaultValue={selectedProduct.price[1].amount} 
                                                                  value={productData.mediumPrice}
                                                                  //helperText={error.seeding.message} 
                                                                  //error={error.seeding.failed} 
                                                                  id="80"
                                                                  type="number"
                                                                  variant='standard'
                                                                  onChange={handleChangeProductData}
                                                                  label="80 g"
                                                                  sx={theme.input.mobile.fullSize.desktop.fullSize} />
                                                          </Grid>

                                                          <Grid item xs={12}>
                                                              <Typography variant="body2">Seed</Typography>
                                                          </Grid>
                                                          <Grid item xs={6}>
                                                              <TextField
                                                                  //defaultValue={selectedProduct.seed.seedId} 
                                                                  value={productData.seedId}
                                                                  //helperText={error.seeding.message} 
                                                                  //error={error.seeding.failed} 
                                                                  id="seedId"
                                                                  type="text"
                                                                  variant='standard'
                                                                  onChange={handleChangeProductData}
                                                                  label="Seed ID"
                                                                  sx={theme.input.mobile.fullSize.desktop.fullSize} />
                                                          </Grid>
                                                          <Grid item xs={6}>
                                                              <TextField
                                                                  //defaultValue={selectedProduct.seed.seedName} 
                                                                  value={productData.providerSeedName}
                                                                  //helperText={error.seeding.message} 
                                                                  //error={error.seeding.failed} 
                                                                  id="providerSeedName"
                                                                  type="text"
                                                                  variant='standard'
                                                                  onChange={handleChangeProductData}
                                                                  label="Seed Name"
                                                                  sx={theme.input.mobile.fullSize.desktop.fullSize} />
                                                          </Grid>
                                                          <Grid item xs={6}>
                                                              <TextField
                                                                  //defaultValue={selectedProduct.provider.name} 
                                                                  value={productData.provider}
                                                                  //helperText={error.seeding.message} 
                                                                  //error={error.seeding.failed} 
                                                                  id="provider"
                                                                  type="text"
                                                                  variant='standard'
                                                                  onChange={handleChangeProductData}
                                                                  label="Seed provider"
                                                                  sx={theme.input.mobile.fullSize.desktop.fullSize} />
                                                          </Grid>


                                                          <Grid item xs={6}>
                                                              <Button variant="contained" color="secondary" onClick={handleComplete} sx={{ width: "100%" }}>
                                                                  <SaveIcon />
                                                              </Button>
                                                          </Grid>

                                                      </Grid>

                                                      //Single Product Content Ends

                                                      :



                                                      //Mix Content begins

                                                      <Grid container spacing={2}>
                                                          <Grid item xs={12}>
                                                              <Typography variant="h6" color="secondary.main">
                                                                  Edit Mix
                                                              </Typography>
                                                          </Grid>
                                                          <Grid item xs={12}>

                                                          </Grid>
                                                          <Grid item xs={12}>
                                                              <TextField
                                                                  //defaultValue={selectedProduct.name} 
                                                                  value={productData.name}
                                                                  //helperText={error.seeding.message} 
                                                                  //error={error.seeding.failed} 
                                                                  id="name"
                                                                  type="text"
                                                                  variant='standard'
                                                                  onChange={handleChangeProductData}
                                                                  label="Name"
                                                                  sx={theme.input.mobile.fullSize.desktop.fullSize} />
                                                          </Grid>
                                                          {productData.mix.products.map((prod, idx) => {
                                                              console.log("indecs", idx)
                                                              let actualProduct
                                                              actualProduct = rows.find((prd) => prd._id === prod.strain)
                                                              return (<>
                                                                  <Grid item xs={6}>
                                                                      <Typography alignSelf={"center"} marginTop="2vh">{actualProduct.name}</Typography>
                                                                  </Grid>
                                                                  <Grid item xs={6}>
                                                                      <TextField
                                                                          //defaultValue={selectedProduct.parameters.seedingRate} 
                                                                          value={prod.amount}
                                                                          name={idx}
                                                                          //helperText={error.seeding.message} 
                                                                          //error={error.seeding.failed} 
                                                                          id="percentage"
                                                                          type="number"
                                                                          variant='standard'
                                                                          onChange={handleChangeProductData}
                                                                          label="Percentage of mix"
                                                                          sx={theme.input.mobile.fullSize.desktop.fullSize} />
                                                                  </Grid>
                                                              </>

                                                              )


                                                          })}

                                                          <Grid item xs={12}>
                                                              <Typography variant="body2">Price</Typography>
                                                          </Grid>
                                                          {productData.price.map((price, idx) => {


                                                              return (
                                                                  <Grid item xs={6}>
                                                                      <TextField
                                                                          //defaultValue={selectedProduct.price[0].amount} 
                                                                          value={productData.price[idx].amount}
                                                                          //helperText={error.seeding.message} 
                                                                          //error={error.seeding.failed} 
                                                                          id={`${price.packageSize}`}
                                                                          type="number"
                                                                          variant='standard'
                                                                          onChange={handleChangeProductData}
                                                                          label={`${price.packageSize}` + "g"}
                                                                          sx={theme.input.mobile.fullSize.desktop.fullSize} />
                                                                  </Grid>

                                                              )
                                                          })}


                                                          <Grid item xs={12}>
                                                              <Button variant="contained" color="secondary" onClick={handleComplete} sx={{ width: "100%" }}>
                                                                  <SaveIcon />
                                                              </Button>
                                                          </Grid>

                                                      </Grid>



                                                  //Mix Content ends

                                              }


                                          </Paper>
                                      </Grid>
                                  </Grow>

                                  //Card ends
                                  :
                                  null
                              }
                          </Grid>

                        
                        
                    </Box>
                </Container>


                
            </Box>
        </Fade>

        


        
    </>
  )
}
