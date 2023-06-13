import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useParams } from 'react-router-dom'
//*Contexts
import useAuth from '../../../contextHooks/useAuthContext'
//*MUI Components
import { Box, Container, Fade, LinearProgress, Typography, Grid, Paper, Button, TextField, Autocomplete } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import EditIcon from '@mui/icons-material/Edit';
//THEME
import { BV_THEME } from '../../../theme/BV-theme'
//*Netword and routing
import { DataGrid } from '@mui/x-data-grid'
// Components
import { UserDialog } from '../../../CoreComponents/UserFeedback/Dialog'
import { UserModal } from '../../../CoreComponents/UserActions/UserModal'
// CUSTOM HOOKS
import useOrders from '../../../hooks/useOrders'
import useCustomers from '../../../hooks/useCustomers'
import useProducts from '../../../hooks/useProducts'

export const SalesView = () => {
  const { orderId } = useParams();
  const { user, credential } = useAuth()
  let headers = {
    authorization: credential._tokenResponse.idToken,
    user: user
  }
  const { getOrders, updateOrder } = useOrders(headers);
  const { getCustom, getCustomers } = useCustomers(headers)
  const { getProducts } = useProducts(headers)


  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [orderData, setOrderData] = useState()
  const [customer, setCustomer] = useState()
  const [showEdit, setShowEdit] = useState(false)
  const [input, setInput] = useState({
    product: {},
    status: {},
    smallPackages: 0,
    mediumPackages: 0,
  });

  const [options, setOptions] = useState({
    customers: [],
    status: [
      { name: "preSoaking" },
      { name: "seeding" },
      { name: "growing" },
      { name: "harvestReady" },
      { name: "packing" },
      { name: "ready" },
      { name: "delivered" }
    ],
    products: []
  })
  const [error, setError] = useState({
    date: {
      message: "Please correct or fill the date.",
      active: false
    },
    customer: {
      message: "Please correct or fill the customer",
      active: false
    },
    product: {
      message: "Please correct or fill the product.",
      active: false
    },
    status: {
      message: "Please correct or fill the status.",
      active: false
    },
    smallPackages: {
      message: "Please correct or fill the number of packages.",
      active: false
    },
    mediumPackages: {
      message: "Please correct or fill the number of packages.",
      active: false
    },
  })

  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    actions: []
  })

  const renderHeaderHook = (headerName) => {
    const JSXByHname = {
      "Name": "Name",
      "Status": "Status",
      "Small": "Small",
      "Medium": "Medium",
      "Actions": "Actions",
    }
    return (
      <>
        {JSXByHname[headerName]}
      </>
    )
  }

  const OrderProductsColumns = [
    {
      field: "name",
      headerName: "Name",
      renderHeader: () => renderHeaderHook("Name"),
      headerAlign: "center",
      align: "center",
      headerClassName: "headerSaleTable",
      minWidth: { xs: "25%", md: 130 },
      flex: 1
    },
    {
      field: "status",
      headerName: "Status",
      renderHeader: () => renderHeaderHook("Status"),
      headerAlign: "center",
      align: "center",
      headerClassName: "headerSaleTable",
      minWidth: { xs: "25%", md: 130 },
      flex: 1
    },
    {
      field: "small",
      headerName: "Small",
      renderHeader: () => renderHeaderHook("Small"),
      headerAlign: "center",
      align: "center",
      headerClassName: "headerSaleTable",
      minWidth: { xs: "25%", md: 130 },
      flex: 1
    },
    {
      field: "medium",
      headerName: "Medium",
      renderHeader: () => renderHeaderHook("Medium"),
      headerAlign: "center",
      align: "center",
      headerClassName: "headerSaleTable",
      minWidth: { xs: "25%", md: 130 },
      flex: 1
    },
    {
      field: "actions",
      headerName: "Actions",
      renderHeader: () => renderHeaderHook("Actions"),
      headerAlign: "center",
      align: "center",
      headerClassName: "headerSaleTable",
      minWidth: { xs: "25%", md: 130 },
      flex: 1,
      renderCell: (params) => {
        const [modal, setModal] = useState({
          open: false,
          title: "",
          content: "",
          actions: []
        })
        const [dialog, setDialog] = useState({
          open: false,
          title: "",
          message: "",
          actions: []
        })

        const [loading, setLoading] = useState(false)

        const deleteOrderproduct = (id) => {
          setLoading(true)
          const newProducts = orderData?.products.filter(product => product._id !== id);
          setOrderData({
            ...orderData,
            products: newProducts
          })
        }

        const handleModal = () => {
          setModal({
            ...modal,
            open: true,
            title: "Select an action",
            actions: [
              {
                label: `Edit`,
                btn_color: "white_btn",
                type: "privileged",
                execute: () => {
                  handleUpdateProduct(params.row)
                }
              },
              {
                label: "Delete",
                type: "dangerous",
                btn_color: "secondary",
                execute: () => {
                  setModal({
                    ...modal,
                    open: false
                  })
                  setDialog({
                    ...dialog,
                    open: true,
                    title: "Are you sure you want to delete this product?",
                    message: "The product will be deleted.",
                    actions: [
                      {
                        label: "Yes",
                        btn_color: "primary",
                        execute: () => {
                          setDialog({
                            ...dialog,
                            open: false,
                          })
                          deleteOrderproduct(params.id)
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
                      },
                    ]
                  })
                }
              },
            ]
          })
        }

        return (
          <>
            <UserModal
              modal={modal}
              setModal={setModal}
              title={modal.title}
              content={modal.content}
              actions={modal.actions}
            />

            <UserDialog
              title={dialog.title}
              content={dialog.message}
              dialog={dialog}
              setDialog={setDialog}
              actions={dialog.actions}
              open={dialog.open}
            />
            <Button variant="contained" onClick={handleModal} disabled={loading} sx={BV_THEME.button.table}>View</Button>
          </>
        )
      }
    }
  ]

  {/* CATCH CHANGE INPUTS */ }
  const catchDeliveryAddress = (event) => {
    const { name, value } = event.target;
    setOrderData({
      ...orderData,
      address: {
        ...orderData.address,
        [name]: value
      }
    });
  }

  const catchSelectProduct = (e, v, r) => {
    if (r === "selectOption") {
      const product = options.products.find(product => product._id === v._id)
      setInput({
        ...input,
        product: product
      })
    }
  }

  const catchSelectStatus = async (e, v, r) => {
    let id
    let value
    id = e.target.id
    switch (r) {
      case "input":
        value = v
        switch (id) {
          case "smallPackages":
            value = Number(v)
            break;
          case "mediumPackages":
            value = Number(v)
            break;
        }
        break;
      case "selectOption":
        id = e.target.id.split("-")[0]
        value = v
        break;
      default:
        break;
    }

    if (error[id] && error[id].active) {
      setError({
        ...error,
        [id]: {
          ...error[id],
          active: false
        }
      })
    }

    setInput({
      ...input,
      [id]: value
    })

    if (id === 'customer') {
      setOrderData({
        ...orderData,
        customer: value._id
      });
    }
    console.log(input);
  }

  const catchChangeDate = (date) => {
    if (error.date.active) {
      setError({
        ...error,
        date: {
          ...error.date,
          active: false
        }
      })
    }
    setOrderData({
      ...orderData,
      date: date
    });
  }

  const handleUpdateProduct = (params) => {
    console.log("HANDLE UPDATE PRODUCT", params);
  }

  const handleUpdateOrder = () => {
    console.log(orderData);
    updateOrder(orderId, orderData)
      .then((res) => {
        setDialog({
          ...dialog,
          open: true,
          title: res.data.message,
          actions: [{
            label: "Ok",
            execute: () => {
              setDialog({
                ...dialog,
                open: false
              });
              window.location.reload();
            }
          }]
        })
      })
      .catch((err) => {
        console.log(err);
        setDialog({
          ...dialog,
          open: true,
          title: "Error updating order",
          actions: [{
            label: "Reload",
            execute: () => {
              window.location.reload()
            }
          }]
        })
      })
  }

  const handleEditMode = async () => {
    const getData = async () => {
      const customers = await getCustomers();
      const products = await getProducts();
      return { customers: customers.data.data, products: products.data.data }
    }

    getData()
      .then((data) => {
        setOptions((options) => {
          return ({
            ...options,
            products: data.products,
            customers: data.customers
          })
        })
        console.log("{DATA}", data);
        console.log("{ORDER DATA}", orderData);
        console.log("{OPTIONS}", options);
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleSaveProduct = () => {
    console.log("ADDING PRODUCT");
    console.log("INPUT", product);
    console.log("Order Data", orderData);
  }

  useEffect(() => {
    setLoading(() => {
      return true
    })
    handleEditMode()
    getOrders(orderId)
      .then((res) => {
        const orders = res.data.data;
        const foundOrder = orders.find((order) => order._id === orderId);
        setOrderData(foundOrder)
        const orderProducts = foundOrder.products.map((product) => {
          return {
            id: product._id,
            name: product.name,
            status: product.status,
            small: product.packages[0].number,
            medium: product.packages[0].number
          };
        });
        setRows(orderProducts)

        getCustom(foundOrder.customer)
          .then((res) => {
            const customer = res.data.data
            setCustomer(customer)
            setLoading(() => {
              return false
            })
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [])

  const deliveryAddressCard = () => {
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1" color="textSecondary">Street: {orderData?.address?.street || "---"}</Typography>
          </Grid>
          {['stNumber', 'zip', 'state', 'country'].map((field) => (
            <Grid key={field} item xs={6}>
              <Typography variant="body1" color="textSecondary">
                {`${field.charAt(0).toUpperCase() + field.slice(1)}: ${orderData?.address?.[field] || '---'}`}
              </Typography>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Typography variant="body1" color="textSecondary">References: {orderData?.address?.references || "---"}</Typography>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" sx={{ marginTop: "2vh" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              window.open(`https://www.google.com.mx/maps/place/${orderData?.address?.coords?.latitude},${orderData?.address?.coords?.longitude}`, "_blank");
            }}
          >
            View
          </Button>
        </Grid>
      </>
    )
  }

  const updateDeliveryAddressCard = () => {
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField name='street' onChange={catchDeliveryAddress} value={orderData?.address?.street} label="Street" type="text" variant="standard" sx={{ width: "100%" }} />
          </Grid>
          {['stNumber', 'zip', 'state', 'country'].map((field) => (
            <Grid key={field} item xs={6}>
              <TextField name={field} onChange={catchDeliveryAddress} value={orderData?.address?.[field]} label={`${field.charAt(0).toUpperCase() + field.slice(1)}`} type="text" variant="standard" sx={{ width: "100%" }} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <TextField name="references" onChange={catchDeliveryAddress} value={orderData?.address?.references} label="References" type="text" variant="standard" sx={{ width: "100%" }} />
          </Grid>
        </Grid>
      </>
    )
  }

  return (
    <>
      <Fade in={true} timeout={1000} unmountOnExit>
        <Box sx={{ width: "100%", height: "100%" }}>

          <UserDialog
            setDialog={setDialog}
            dialog={dialog}
            open={dialog.open}
            title={dialog.title}
            content={dialog.message}
            actions={dialog.actions}
          />

          <Container maxWidth="xl" sx={{ padding: "2%" }}>

            {/* TITLE */}
            <Typography variant="h4" color="secondary" textAlign="center" margin={BV_THEME.margin.mainHeader}>Order #{orderId}</Typography>

            {/* STATUS */}
            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle1" color="secondary">Status: {orderData?.status || "---"}</Typography>
              <Box>
                {showEdit
                  ? <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateOrder}
                  >
                    Save
                  </Button>
                  : null
                }
                <Button variant="contained"
                  onClick={() => {
                    setShowEdit(!showEdit);
                    handleEditMode()
                  }}
                  color="secondary"
                >
                  <EditIcon />
                </Button>
              </Box>
            </Box>

            {/* DELIVERY DATE */}
            <Paper elevation={4} sx={{ padding: BV_THEME.spacing(2), marginY: "2vh" }}>
              <Typography variant="h6" color="secondary">DELIVERY DATE</Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1" color="textSecondary">Created: {moment(orderData?.created).format('DD/MM/YYYY HH:mm:ss')}</Typography>
                {showEdit
                  ? <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Select a date"
                      onChange={catchChangeDate}
                      renderInput={(params) => {
                        const { date } = error
                        return <TextField
                          {...params}
                          helperText={date.active ? date.message : ""}
                          error={date.active}
                        />
                      }}
                      value={orderData.date}
                      sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize, })}
                      disablePast={true}
                    />
                  </LocalizationProvider>

                  : <Typography variant="body1" color="textSecondary">Delivery: {moment(orderData?.date).format('DD/MM/YYYY HH:mm:ss')}</Typography>
                }
              </Box>
            </Paper>

            {/* SCREEN DIVIDER */}
            <Grid container spacing={2}>

              {/* LEFT SIDE */}
              <Grid item xs={12} md={7}>
                {/* PRODUCTS */}
                <Paper elevation={4} sx={{ padding: BV_THEME.spacing(2), minHeight: "40vh", height: "40vh" }}>
                  <Typography variant="h6" color="secondary">PRODUCTS</Typography>
                  {loading ? (
                    <LinearProgress color="primary" sx={{ marginY: "2vh" }} />
                  ) : (
                    <Box sx={{ height: "100%", width: "100%" }}>
                      <DataGrid
                        columns={OrderProductsColumns}
                        rows={rows}
                        sx={{
                          width: "100%", height: "90%",
                          "& .headerSaleTable": {
                            backgroundColor: BV_THEME.palette.primary.main,
                            color: "white"
                          }
                        }}
                        getRowId={(row) => row.id}
                      />
                    </Box>
                  )}
                </Paper>

                {/* EDIT PRODUCTS */}
                {showEdit
                  ? <Paper elevation={4} sx={{ padding: BV_THEME.spacing(2), marginY: "2vh" }}>
                    <Typography variant="h6" color="secondary">New/Edit PRODUCTS</Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

                      <Autocomplete
                        id="product"
                        options={options.products}
                        sx={BV_THEME.input.mobile.fullSize.desktop.fullSize}
                        renderInput={(params) => {
                          const { product } = error
                          return <TextField
                            {...params}
                            helperText={product.active ? product.message : ""}
                            error={product.active}
                            label="Product"
                          />
                        }}
                        getOptionLabel={(opt) => opt.name ? opt.name : ""}
                        isOptionEqualToValue={(o, v) => {
                          if (Object.keys(v).length === 0) {
                            return true
                          }
                          return o.name === v.name
                        }}
                        onChange={catchSelectProduct}
                        value={Object.keys(input.product) !== 0 ? input.product : undefined}
                      />

                      <Autocomplete
                        id="status"
                        options={options.status}
                        sx={BV_THEME.input.mobile.fullSize.desktop.fullSize}
                        renderInput={(params) => {
                          const { status } = error
                          return <TextField
                            {...params}
                            helperText={status.active ? status.message : ""}
                            error={status.active}
                            label="Status"
                          />
                        }}
                        getOptionLabel={(opt) => opt.name ? opt.name : ""}
                        isOptionEqualToValue={(o, v) => {
                          if (Object.keys(v).length === 0) {
                            return true
                          }
                          return o.name === v.name
                        }}
                        onChange={catchSelectStatus}
                        value={Object.keys(input.status) !== 0 ? input.status : undefined}
                      />

                      <Typography variant="subtitle1" color="secondary" marginY={3}>No. of Packages</Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
                        <TextField
                          id="smallPackages"
                          type="number"
                          label="Small"
                          placeholder="Quantity"
                          sx={BV_THEME.input.mobile.thirdSize.desktop.halfSize}
                          onChange={(e) => catchSelectStatus(e, e.target.value, "input")}
                          helperText={error.smallPackages.active ? error.smallPackages.message : ""}
                          error={error.smallPackages.active}
                          value={input.smallPackages ? input.smallPackages : ""}
                        />
                        <TextField
                          id="mediumPackages"
                          type="number"
                          label="Medium"
                          placeholder="Quantity"
                          sx={BV_THEME.input.mobile.thirdSize.desktop.halfSize}
                          onChange={(e) => catchSelectStatus(e, e.target.value, "input")}
                          helperText={error.mediumPackages.active ? error.mediumPackages.message : ""}
                          error={error.mediumPackages.active}
                          value={input.mediumPackages ? input.mediumPackages : ""}
                        />
                      </Box>

                      <Button id="add" sx={{ marginTop: "2vh" }} onClick={handleSaveProduct}>
                        Add product
                      </Button>
                    </Box>
                  </Paper>
                  : null
                }

                {/* DELIVERY ADDRESS */}
                <Paper elevation={4} sx={{ padding: BV_THEME.spacing(2), minHeight: "20vh", marginTop: "2vh" }}>
                  <Typography variant="h6" color="secondary">DELIVERY ADDRESS</Typography>
                  {showEdit
                    ? updateDeliveryAddressCard()
                    : deliveryAddressCard()
                  }
                </Paper>
              </Grid>

              {/* RIGHT SIDE */}
              <Grid item xs={12} md={5}>
                {/* CUSTOMER */}
                <Paper elevation={4} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" color="secondary" sx={{ paddingTop: BV_THEME.spacing(2), paddingLeft: BV_THEME.spacing(2) }}>CUSTOMER</Typography>
                  {showEdit &&
                    <Autocomplete
                      id="customer"
                      options={options.customers}
                      sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.fullSize })}
                      renderInput={(params) => {
                        const { customer } = error
                        return <TextField
                          {...params}
                          label="Customer"
                          helperText={customer.active ? customer.message : ""}
                          error={customer.active}
                        />
                      }}
                      onChange={catchSelectStatus}
                      getOptionLabel={(opt) => opt.name ? opt.name : ""}
                      value={options.customers.find((obj) => obj._id === orderData.customer)}
                    />
                  }
                  <Box elevation={4} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", height: "100%", padding: BV_THEME.spacing(2) }}>
                    <Box elevation={4} sx={{ display: "flex", flexDirection: { xs: "row", md: "column" }, flexWrap: "wrap", flex: 1 }}>
                      {/* INFORMATION */}
                      <Box sx={{ flex: 1, paddingX: "1vh", maxWidth: { xs: "50%", md: "100%" } }}>
                        <Typography variant="subtitle1" color="secondary" sx={{ my: "10px" }}>INFORMATION</Typography>
                        {['name', 'email', 'role'].map((field) => (
                          <Typography key={field} variant="body2" color="textSecondary" sx={{ my: "10px" }}>
                            {`${field.charAt(0).toUpperCase() + field.slice(1)}: ${customer?.[field] || '---'}`}
                          </Typography>
                        ))}
                      </Box>
                      {/* BUSINESS INFO */}
                      <Box sx={{ flex: 1, paddingX: "1vh", maxWidth: { xs: "50%", md: "100%" } }}>
                        <Typography variant="subtitle1" color="secondary" sx={{ my: "10px" }}>BUSINESS INFO</Typography>
                        {['name', 'bankAccount'].map((field) => (
                          <Typography key={field} variant="body2" color="textSecondary" sx={{ my: "10px" }}>
                            {`${field.charAt(0).toUpperCase() + field.slice(1)}: ${customer?.businessData?.[field] || '---'}`}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                    {/* ADDRESS  */}
                    <Box sx={{ paddingX: "1vh", flex: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" color="secondary">ADDRESS</Typography>
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <Typography variant="body2" color="textSecondary">Street: {customer?.address?.street || '---'}</Typography>
                        </Grid>
                        {['stNumber', 'zip', 'state', 'country'].map((field) => (
                          <Grid key={field} item md={12} xs={6}>
                            <Typography variant="body2" color="textSecondary">
                              {`${field.charAt(0).toUpperCase() + field.slice(1)}: ${customer?.address?.[field] || '---'}`}
                            </Typography>
                          </Grid>
                        ))}
                        <Grid item md={12} xs={12}>
                          <Typography variant="body2" color="textSecondary">References: {customer?.address?.references || '---'}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

            </Grid>
          </Container>
        </Box >
      </Fade >
    </>
  );




}
