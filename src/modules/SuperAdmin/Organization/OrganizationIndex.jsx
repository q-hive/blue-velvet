import { Add } from '@mui/icons-material'
import { Box, Button, Container, LinearProgress, Typography, Fade } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BV_THEME } from '../../../theme/BV-theme'
import useOrganizations from '../../../hooks/useOrganizations'
import { UserModal } from "../../../CoreComponents/UserActions/UserModal"
import { UserDialog } from "../../../CoreComponents/UserFeedback/Dialog"


export const OrganizationIndex = () => {
  const { getOrganizations, deleteOrganization } = useOrganizations();

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSaveOrganization = (id) => {
    if (id) {
      navigate(`editOrganization/?id=${id}`)
    }else {
      navigate('new')
    }
  }

  const renderHeaderHook = (headerName) => {
    const JSXByHname = {
      "id": "Id",
      "Name": "Name",
      "Administrator": "Administrator",
      "Containers": "Containers",
      "Customers": "Customers",
      "Address": "Address",
      "Actions": "Actions"
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
      headerClassName: "header-organizations-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      renderHeader: () => renderHeaderHook("Name"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-organizations-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1
    },
    {
      field: "owner",
      headerName: "Administrator",
      renderHeader: () => renderHeaderHook("Administrator"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-organizations-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1
    },
    {
      field: "containers",
      headerName: "Containers",
      renderHeader: () => renderHeaderHook("Containers"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-organizations-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1
    },
    {
      field: "customers",
      headerName: "Customers",
      renderHeader: () => renderHeaderHook("Customers"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-organizations-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1
    },
    {
      field: "address",
      headerName: "Address",
      renderHeader: () => renderHeaderHook("Address"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-organizations-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1,
      renderCell: (params) => {
        const coords = params.row.address;
        const openInMaps = () => {
          const mapsUrl = `https://www.google.com.mx/maps/place/${coords.latitude},${coords.longitude}`;
          window.open(mapsUrl);
        };

        return (
          <Button
            variant="contained"
            onClick={openInMaps}
            disabled={loading}
            sx={BV_THEME.button.table}
          >
            Open in Maps
          </Button>
        );
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      renderHeader: () => renderHeaderHook("Actions"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-organizations-table",
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

        const deleteOrg = async () => {
          setLoading(true)
          const response = await deleteOrganization(params.id)
          return response
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
                  handleSaveOrganization(params.id)
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
                    title: "Are you sure you want to delete an organization?",
                    message: "The organization will be deleted. Production management may be affected.",
                    actions: [
                      {
                        label: "Yes",
                        btn_color: "primary",
                        execute: () => {
                          setDialog({
                            ...dialog,
                            open: false,
                          })
                          deleteOrg()
                            .then((res) => {
                              if (res.status === 204) {
                                setDialog({
                                  ...dialog,
                                  open: true,
                                  title: "Organization deleted",
                                  message: "The organization, admin account and passphrase were deleted",
                                  actions: [
                                    {
                                      label: "Ok",
                                      execute:() => {window.location.reload()}
                                    }
                                  ]
                                })
                              }
                            })
                            .catch(err => {
                              console.log("Error deleting organization")
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

  useEffect(() => {
    setLoading(() => {
      return true
    })
    getOrganizations()
      .then((res) => {
        const organizationData = res.data.data.map((organization) => {
          return {
            _id: organization._id,
            name: organization.name,
            owner: organization.owner,
            containers: organization.containers.length,
            customers: organization.customers.length,
            address: organization.address.coords
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
        <Box width="100%" height="100%">
          <Container sx={{ padding: "2%" }}>
            <Box sx={{
              width: "100%",
              height: "80vh",
              "& .header-organizations-table": {
                backgroundColor: BV_THEME.palette.primary.main,
                color: "white"
              }
            }}
            >

              <Typography variant="h4" color="secondary" textAlign={"center"} margin={BV_THEME.margin.mainHeader}>Organizations</Typography>

              <Box sx={{ width: "100%", height: "100%" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "3vh" }} >
                  <Button variant='contained' color='primary' startIcon={<Add />} onClick={()=>handleSaveOrganization()} sx={{ minWidth: "20%" }}>New organization</Button>
                </Box>
                {
                  loading
                    ?
                    <LinearProgress color="primary" sx={{ marginY: "2vh" }} />
                    :
                    <>
                      <DataGrid
                        columns={OrganizationColumns}
                        rows={rows}
                        sx={{ width: "100%", height: "80%" }}
                        getRowId={(row) => {
                          return row._id
                        }}
                      />
                    </>
                }
              </Box>
            </Box>
          </Container>
        </Box>
      </Fade>
    </>
  )
}
