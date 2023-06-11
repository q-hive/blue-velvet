import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useParams } from 'react-router-dom'
//*Contexts
import useAuth from '../../../contextHooks/useAuthContext'
//*MUI Components
import { Box, Container, Fade, LinearProgress, Typography, Grid, Paper, Button } from '@mui/material'
//THEME
import { BV_THEME } from '../../../theme/BV-theme'
//*Netword and routing
import { DataGrid } from '@mui/x-data-grid'
// CUSTOM HOOKS
import useOrders from '../../../hooks/useOrders'
import useCustomers from '../../../hooks/useCustomers'

export const SalesView = () => {
  const { orderId } = useParams();
  const { user, credential } = useAuth()
  let headers = {
    authorization: credential._tokenResponse.idToken,
    user: user
  }
  const { getOrders } = useOrders(headers);
  const { getCustom } = useCustomers(headers)


  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [orderData, setOrderData] = useState()
  const [customer, setCustomer] = useState()

  const renderHeaderHook = (headerName) => {
    const JSXByHname = {
      "Name": "Name",
      "Status": "Status",
      "Small": "Small",
      "Medium": "Medium",
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
    }
  ]

  useEffect(() => {
    setLoading(() => {
      return true
    })
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

  return (
    <>
      <Fade in={true} timeout={1000} unmountOnExit>
        <Box sx={{ width: "100%", height: "100%" }}>
          <Container maxWidth="xl" sx={{ padding: "2%" }}>

            {/* TITLE */}
            <Typography variant="h4" color="secondary" textAlign="center" margin={BV_THEME.margin.mainHeader}>Order #{orderId}</Typography>

            {/* STATUS */}
            <Box display="flex" justifyContent="flex-end">
              <Typography variant="subtitle1" color="secondary">Status: {orderData?.status || "---"}</Typography>
            </Box>

            {/* DELIVERY DATE */}
            <Paper elevation={4} sx={{ padding: BV_THEME.spacing(2), marginY: "2vh" }}>
              <Typography variant="h6" color="secondary">DELIVERY DATE</Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1" color="textSecondary">Created: {moment(orderData?.created).format('DD/MM/YYYY HH:mm:ss')}</Typography>
                <Typography variant="body1" color="textSecondary">Delivery: {moment(orderData?.date).format('DD/MM/YYYY HH:mm:ss')}</Typography>
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

                {/* DELIVERY ADDRESS */}
                <Paper elevation={4} sx={{ padding: BV_THEME.spacing(2), minHeight: "20vh", marginTop: "2vh" }}>
                  <Typography variant="h6" color="secondary">DELIVERY ADDRESS</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body1" color="textSecondary">Street: {orderData?.address?.street || "---"}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" color="textSecondary">St. Number: {orderData?.address?.number || "---"}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" color="textSecondary">Zip Code: {orderData?.address?.zipcode || "---"}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" color="textSecondary">State: {orderData?.address?.state || "---"}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" color="textSecondary">Country: {orderData?.address?.country || "---"}</Typography>
                    </Grid>
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
                </Paper>
              </Grid>

              {/* RIGHT SIDE */}
              <Grid item xs={12} md={5}>
                {/* CUSTOMER */}
                <Paper elevation={4} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" color="secondary">CUSTOMER</Typography>
                  <Box elevation={4} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", height: "100%" }}>
                    <Box elevation={4} sx={{ display: "flex", flexDirection: { xs: "row", md: "column" }, flexWrap: "wrap", flex: 1 }}>
                      {/* INFORMATION */}
                      <Box sx={{ flex: 1, paddingX: "1vh", maxWidth: { xs: "50%", md: "100%" } }}>
                        <Typography variant="subtitle1" color="secondary" sx={{ my: "10px" }}>INFORMATION</Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ my: "10px" }}>Name: {customer?.name || "---"}</Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ my: "10px" }}>Email: {customer?.email || "---"}</Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ my: "10px" }}>Role: {customer?.role || "---"}</Typography>
                      </Box>
                      {/* BUSINESS INFO */}
                      <Box sx={{ flex: 1, paddingX: "1vh", maxWidth: { xs: "50%", md: "100%" } }}>
                        <Typography variant="subtitle1" color="secondary" sx={{ my: "10px" }}>BUSINESS INFO</Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ my: "10px" }}>Name: {customer?.businessData?.name || "---"}</Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ my: "10px" }}>Bank Account: {customer?.businessData?.bankAccount || "---"}</Typography>
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
                        <Grid item md={12} xs={6}>
                          <Typography variant="body2" color="textSecondary">St. Number: {customer?.address?.stNumber || '---'}</Typography>
                        </Grid>
                        <Grid item md={12} xs={6}>
                          <Typography variant="body2" color="textSecondary">Zip Code: {customer?.address?.zip || '---'}</Typography>
                        </Grid>
                        <Grid item md={12} xs={6}>
                          <Typography variant="body2" color="textSecondary">State: {customer?.address?.state || '---'}</Typography>
                        </Grid>
                        <Grid item md={12} xs={6}>
                          <Typography variant="body2" color="textSecondary">Country: {customer?.address?.country || '---'}</Typography>
                        </Grid>
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
        </Box>
      </Fade>
    </>
  );




}
