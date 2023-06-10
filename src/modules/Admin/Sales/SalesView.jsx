import React, { useEffect, useState } from 'react'
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
import useOrganizations from '../../../hooks/useOrganizations'
import useCustomers from '../../../hooks/useCustomers'

export const SalesView = () => {
  const { orderId } = useParams();
  const { user, credential } = useAuth()
  let headers = {
    authorization: credential._tokenResponse.idToken,
    user: user
  }
  const { getCustomers } = useCustomers(headers)
  const { getOrganizations } = useOrganizations(headers);


  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  const renderHeaderHook = (headerName) => {
    const JSXByHname = {
      "id": "Id",
      "NameX": "NameX",
      "Administrator": "Administrator",
      "Containers": "Containers",
      "Customers": "Customers",
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

  const OrganizationColumns = [
    {
      field: "_id",
      headerName: "Id",
      renderHeader: () => renderHeaderHook("id"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-sale-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1,
    },
    {
      field: "nameX",
      headerName: "NameX",
      renderHeader: () => renderHeaderHook("NameX"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-sale-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1
    },
    {
      field: "owner",
      headerName: "Administrator",
      renderHeader: () => renderHeaderHook("Administrator"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-sale-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1
    },
    {
      field: "containers",
      headerName: "Containers",
      renderHeader: () => renderHeaderHook("Containers"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-sale-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1
    },
    {
      field: "customers",
      headerName: "Customers",
      renderHeader: () => renderHeaderHook("Customers"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-sale-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1
    },
    {
      field: "name",
      headerName: "Name",
      renderHeader: () => renderHeaderHook("Name"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-sale-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1
    },
    {
      field: "status",
      headerName: "Status",
      renderHeader: () => renderHeaderHook("Status"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-sale-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1
    },
    {
      field: "small",
      headerName: "Small",
      renderHeader: () => renderHeaderHook("Small"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-sale-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1
    },
    {
      field: "medium",
      headerName: "Medium",
      renderHeader: () => renderHeaderHook("Medium"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-sale-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1
    }
  ]

  useEffect(() => {
    setLoading(() => {
      return true
    })
    getOrganizations()
      .then((res) => {
        const organizationData = res.data.data.map((organization) => {
          return {
            _id: organization._id,
            nameX: organization.name,
            owner: organization.owner,
            containers: organization.containers.length,
            customers: organization.customers.length,
            name: 0,
            status: 0,
            small: 0,
            medium: 0

          };
        });
        setRows(organizationData)
        setLoading(() => {
          return false
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <>
      <Fade in={true} timeout={1000} unmountOnExit>
        <Box sx={{
          width: "100%", height: "100%",
          "& .header-sale-table": {
            backgroundColor: BV_THEME.palette.primary.main,
            color: "white"
          }
        }}>
          <Container maxWidth="xl" sx={{ padding: "2%" }}>

            {/* TITLE */}
            <Typography variant="h4" color="secondary" textAlign="center" margin={BV_THEME.margin.mainHeader}>Order #{orderId}</Typography>

            {/* STATUS */}
            <Box display="flex" justifyContent="flex-end">
              <Typography variant="subtitle1" color="secondary">Status: {"status"}</Typography>
            </Box>

            {/* DELIVERY DATE */}
            <Paper elevation={4} sx={{ padding: BV_THEME.spacing(2), marginY: "2vh" }}>
              <Typography variant="h6" color="secondary">DELIVERY DATE</Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1" color="textSecondary">Created: {"creationDate"}</Typography>
                <Typography variant="body1" color="textSecondary">Delivery: {"deliveryDate"}</Typography>
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
                        columns={OrganizationColumns}
                        rows={rows}
                        sx={{ width: "100%", height: "90%" }}
                        getRowId={(row) => row._id}
                      />
                    </Box>
                  )}
                </Paper>

                {/* DELIVERY ADDRESS */}
                <Paper elevation={4} sx={{ padding: BV_THEME.spacing(2), minHeight: "20vh", marginTop: "2vh" }}>
                  <Typography variant="h6" color="secondary">DELIVERY ADDRESS</Typography>
                  <Typography variant="body1" color="textSecondary">Street: {"deliveryAddress.street"}</Typography>
                  <Typography variant="body1" color="textSecondary">St. Number: {"deliveryAddress.number"}</Typography>
                  <Typography variant="body1" color="textSecondary">Zip Code: {"deliveryAddress.zipcode"}</Typography>
                  <Typography variant="body1" color="textSecondary">State: {"deliveryAddress.state"}</Typography>
                  <Typography variant="body1" color="textSecondary">Country: {"deliveryAddress.country"}</Typography>
                  <Typography variant="body1" color="textSecondary">References: {"deliveryAddress.references"}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: "2vh" }}
                    onClick={() => {
                      window.open("https://maps.google.com", "_blank");
                    }}
                  >
                    View
                  </Button>
                </Paper>
              </Grid>

              {/* RIGHT SIDE */}
              <Grid item xs={12} md={5}>
                {/* CUSTOMER */}
                <Paper elevation={4} sx={{ padding: 2, height: "100%", display: "flex", flexDirection: { xs: "column", md: "column" } }}>
                  <Typography variant="h6" color="secondary">CUSTOMER</Typography>
                  {/* UP */}
                  <Box elevation={4} sx={{ display: "flex", flexDirection: { xs: "row", md: "column" }, flexWrap: "wrap" }}>
                    {/* INFORMATION */}
                    <Box sx={{ flex: 1, paddingX: "1vh", maxWidth: { xs: "50%", md: "100%" } }}>
                      <Typography variant="subtitle1" color="secondary">INFORMATION</Typography>
                      <Typography variant="body2" color="textSecondary">Name: {"customerData.name"}</Typography>
                      <Typography variant="body2" color="textSecondary">Email: {"customerData.email"}</Typography>
                      <Typography variant="body2" color="textSecondary">Role: {"customerData.role"}</Typography>
                    </Box>
                    {/* BUSINESS INFO */}
                    <Box sx={{ flex: 1, paddingX: "1vh", maxWidth: { xs: "50%", md: "100%" } }}>
                      <Typography variant="subtitle1" color="secondary">BUSINESS INFO</Typography>
                      <Typography variant="body2" color="textSecondary">Name: {"customerData.businessName"}</Typography>
                      <Typography variant="body2" color="textSecondary">Bank Account: {"customerData.bankAccount"}</Typography>
                    </Box>
                  </Box>
                  {/* DOWN */}
                  {/* ADDRESS */}
                  <Box sx={{ paddingX: "1vh", flexGrow: 1, maxHeight: "50vh" }}>
                    <Typography variant="subtitle1" color="secondary">ADDRESS</Typography>
                    <Typography variant="body2" color="textSecondary">Street: {"customerData.address.street"}</Typography>
                    <Typography variant="body2" color="textSecondary">St. Number: {"customerData.address.number"}</Typography>
                    <Typography variant="body2" color="textSecondary">Zip Code: {"customerData.address.zipcode"}</Typography>
                    <Typography variant="body2" color="textSecondary">State: {"customerData.address.state"}</Typography>
                    <Typography variant="body2" color="textSecondary">Country: {"customerData.address.country"}</Typography>
                    <Typography variant="body2" color="textSecondary">References: {"customerData.address.references"}</Typography>
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
