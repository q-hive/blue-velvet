import { Add } from '@mui/icons-material'
import { Box, Button, Container, LinearProgress, Typography, Fade } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BV_THEME } from '../../../theme/BV-theme'
import { EmployeeColumns } from '../../../utils/TableStates'
import api from '../../../axios.js'
import useAuth from '../../../contextHooks/useAuthContext'
import { useTranslation } from 'react-i18next'

import { UserModal } from "../../../CoreComponents/UserActions/UserModal"
import { UserDialog } from "../../../CoreComponents/UserFeedback/Dialog"


export const OrganizationIndex = () => {
  const { user, credential } = useAuth()
  const { t } = useTranslation(['organization_management_module', 'buttons'])

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const handleNewOrganization = () => {
    navigate('new')
  }

  const renderHeaderHook = (headerName) => {
    const JSXByHname = {
      "id": t('organization_table_header_ID', { ns: 'organization_management_module' }),
      "Name": t('organization_table_header_Name', { ns: 'organization_management_module' }),
      "Pending tasks": t('organization_table_header_PendingTasks', { ns: 'organization_management_module' }),
      "Salary": t('organization_table_header_Salary', { ns: 'organization_management_module' }),
      "Actions": t('organization_table_header_Actions', { ns: 'organization_management_module' })
    }

    return (
      <>
        {JSXByHname[headerName]}
      </>
    )
  }

  const EmployeeColumns = [
    {
      field: "_id",
      headerName: "id",
      renderHeader: () => renderHeaderHook("id"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-sales-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      renderHeader: () => renderHeaderHook("Name"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-sales-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1
    },
    {
      field: "tasks",
      headerName: "Pending tasks",
      renderHeader: () => renderHeaderHook("Pending tasks"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-sales-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1
    },
    {
      field: "salary",
      headerName: "Salary",
      renderHeader: () => renderHeaderHook("Salary"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-sales-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1
    },
    {
      field: "actions",
      headerName: "Actions",
      renderHeader: () => renderHeaderHook("Actions"),
      headerAlign: "center",
      align: "center",
      headerClassName: "header-sales-table",
      minWidth: { xs: "25%", md: 130 },
      flex: 1,
      renderCell: (params) => {
        const { t } = useTranslation(['buttons', 'organization_management_module'])
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

        const { user, credential } = useAuth()
        const navigate = useNavigate()

        const editCustomer = () => console.log("Edit organization")
        const deleteEmployee = async () => {
          setLoading(true)
          const response = await api.api.delete(`${api.apiVersion}/organizations/${params.id}`, {
            headers: {
              authorization: credential._tokenResponse.idToken,
              user: user
            }
          })

          return response
        }

        const handleModal = () => {
          setModal({
            ...modal,
            open: true,
            title: "Select an action",
            actions: [
              {
                label: `${t('organization_management_action_edit', { ns: 'organization_management_module' })}`,
                btn_color: "white_btn",
                type: "privileged",
                execute: () => {
                  editCustomer()
                  navigate(`/${user.uid}/${user.role}/organization/editOrganization/?id=${params.id}`)
                }
              },
              {
                label: t('organization_management_action_delete', { ns: 'organization_management_module' }),
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
                    message: "The organization and its tasks will be deleted. Production management may be affected.",
                    actions: [
                      {
                        label: "Yes",
                        btn_color: "primary",
                        execute: () => {
                          setDialog({
                            ...dialog,
                            open: false,
                          })
                          deleteEmployee()
                            .then((res) => {
                              if (res.status === 204) {
                                setDialog({
                                  ...dialog,
                                  open: true,
                                  title: "Organization deleted",
                                  message: "The organization account and its data was deleted",
                                  actions: [
                                    {
                                      label: "Ok",
                                      execute: window.location.reload()
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
            <Button variant="contained" onClick={handleModal} disabled={loading} sx={BV_THEME.button.table}>{t('button_view_word', { ns: 'buttons' })}</Button>
          </>

        )
      }
    }
  ]

  useEffect(() => {
    setLoading(() => {
      return true
    })
    api.api.get(`${api.apiVersion}/employees/`, {
      headers: {
        authorization: credential._tokenResponse.idToken,
        user: user
      }
    })
      .then((res) => {
        setRows(res.data.data)
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
              "& .header-sales-table": {
                backgroundColor: BV_THEME.palette.primary.main,
                color: "white"
              }
            }}
            >

              <Typography variant="h4" color="secondary" textAlign={"center"} margin={BV_THEME.margin.mainHeader}>

                {t('module_index_title', { ns: 'organization_management_module' })}
              </Typography>

              <Box sx={{ width: "100%", height: "100%" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "3vh" }} >
                  <Button variant='contained' color='primary' startIcon={<Add />} onClick={handleNewOrganization} sx={{ minWidth: "20%" }}>
                    {t('button_new_organization', { ns: 'buttons' })}
                  </Button>
                </Box>
                {
                  loading
                    ?
                    <LinearProgress color="primary" sx={{ marginY: "2vh" }} />
                    :
                    <>
                      <DataGrid
                        columns={EmployeeColumns}
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
