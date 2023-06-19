import React, { useState, useEffect } from 'react'

//*MUI COMPONENTS
import {
  Autocomplete, Backdrop, Box, Button, Divider, Fab, TextField, Typography, Fade, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Checkbox, Tooltip
} from '@mui/material'

import CameraIcon from '@mui/icons-material/AddPhotoAlternate'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import Delete from '@mui/icons-material/Delete';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import DomainDisabledIcon from '@mui/icons-material/DomainDisabled';
//*CONTEXTS
import useAuth from '../../../contextHooks/useAuthContext'

//*NETWORK, ROUTING AND API
import { useNavigate } from 'react-router-dom'
import useOrganizations from '../../../hooks/useOrganizations';

//*THEME
import { BV_THEME } from '../../../theme/BV-theme'
import { UserDialog } from '../../../CoreComponents/UserFeedback/Dialog'

// *VALIDATIONS
import { validateInput } from '../../../utils/helpers/inputValidator'

export const NewOrganization = (props) => {

  const {user, credential} = useAuth()
  let headers = {
    authorization:credential._tokenResponse.idToken,
    user: user
  }
  const { createOrganization, getOrganization, updateOrganization } = useOrganizations(headers);
  const navigate = useNavigate()

  const [clientId, setClientId] = useState(0)
  const [clientUid, setClientUid] = useState(0)
  const [loading, setLoading] = useState(false)

  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    actions: []
  })

  // Initial States
  const initialStateAdmin = {
    image: "https://cdn-icons-png.flaticon.com/512/147/147144.png",
    email: "",
    name: "",
    lname: "",
    phone: "",
    password: "",
    passphrase: "",
  };

  const initialStateOrganization = {
    name: "",
    containers: [],
    address: {
      stNumber: "",
      street: "",
      zip: "",
      city: "",
      state: "",
      country: "",
      references: "",
      coords: {
        latitude: "",
        longitude: ""
      }
    }
  };

  const initialStateOrganizationContainer = {
    check:false,
    name: "",
    capacity: 0,
    available: 0,
    employees: [],
    production: [],
    products: [],
    address: {
      stNumber: "",
      street: "",
      zip: "",
      city: "",
      state: "",
      country: "",
      references: "",
      coords: {
        latitude: "",
        longitude: ""
      }
    },
    workday: {},
    config: {
      overhead: 0
    }
  };



  // States with the initial state
  const [phoneExt, setPhoneExt] = useState("");
  const [admin, setAdmin] = useState(initialStateAdmin);
  const [organization, setOrganization] = useState(initialStateOrganization);
  const [organizationContainers, setOrganizationContainers] = useState([initialStateOrganizationContainer]);
  // Error messages
  const [errorMessages, setErrorMessages] = useState({});

  // Input handlers
  const handlePhoneExt = (event) => {
    const { name, value } = event.target;
    const { valid, message } = validateInput(name, value);
    setErrorMessages((prevErrors) => ({ ...prevErrors, [name]: valid ? "" : message }));
    setPhoneExt(value);
  };

  const handleAdminChange = (event) => {
    const { name, value } = event.target;
    const { valid, message } = validateInput(name, value);
    setErrorMessages((prevErrors) => ({ ...prevErrors, [name]: valid ? "" : message }));
    setAdmin((prevAdmin) => ({ ...prevAdmin, [name]: value }));
  };

  const handleOrganizationChange = (event) => {
    const { name, value } = event.target;
    setOrganization((prevOrganization) => ({
      ...prevOrganization,
      [name]: value
    }));
  };

  const handleOrganizationAddressChange = (event) => {
    const { name, value } = event.target;
    setOrganization((prevOrganization) => ({
      ...prevOrganization,
      address: { ...prevOrganization.address, [name]: value }
    }));
  };

  const handleOrganizationAddressCoordsChange = (event) => {
    const { name, value } = event.target;
    setOrganization((prevOrganization) => ({
      ...prevOrganization,
      address: {
        ...prevOrganization.address,
        coords: { ...prevOrganization.address.coords, [name]: value }
      }
    }));
  };

  const handleOrganizationContainersChange = (event, index) => {
    const { name, value } = event.target;
    setOrganizationContainers((prevContainers) => {
      const updatedContainers = [...prevContainers];
      updatedContainers[index] = {
        ...updatedContainers[index],
        [name]: value
      };
      return updatedContainers;
    });
  };

  const handleOrganizationContainersAddressChange = (event, index) => {
    const { name, value } = event.target;
    setOrganizationContainers((prevContainers) => {
      const updatedContainers = [...prevContainers];
      updatedContainers[index] = {
        ...updatedContainers[index],
        address: { ...updatedContainers[index].address, [name]: value }
      };
      return updatedContainers;
    });
  };

  const handleOrganizationContainersAddressCoordsChange = (event, index) => {
    const { name, value } = event.target;
    setOrganizationContainers((prevContainers) => {
      const updatedContainers = [...prevContainers];
      updatedContainers[index] = {
        ...updatedContainers[index],
        address: {
          ...updatedContainers[index].address,
          coords: { ...updatedContainers[index].address.coords, [name]: value }
        }
      };
      return updatedContainers;
    });
  };

  const addContainer = () => {
    setOrganizationContainers((prevContainers) => [
      ...prevContainers,
      initialStateOrganizationContainer
    ]);
  };

  const deleteContainer = (index, e) => {
    e.stopPropagation();
    setOrganizationContainers((prevContainers) => {
      const updatedContainers = [...prevContainers];
      updatedContainers.splice(index, 1);
      return updatedContainers;
    });
  };

  const handleCheckBox = (index) => {
    const updateContainer = [...organizationContainers];
    updateContainer[index].check = !updateContainer[index].check;
    setOrganizationContainers(updateContainer);
  }

  const isFormValid = () => {

    let word = admin.password;
    let phrase = admin.passphrase;

    if (props.edit) {
      word = true
      phrase = true
    }

    return (
      admin.email &&
      word &&
      phrase &&
      phoneExt &&
      admin.name &&
      admin.phone &&
      admin.lname &&
      organization.name &&
      organization.address.stNumber &&
      organization.address.street &&
      organization.address.zip &&
      organization.address.city &&
      organization.address.state &&
      organization.address.country &&
      organizationContainers
        .filter((container) => !container.check)
        .every(
          (container) =>
            container.name &&
            container.capacity &&
            container.address.stNumber &&
            container.address.street &&
            container.address.zip &&
            container.address.city &&
            container.address.state &&
            container.address.country &&
            container.address.references &&
            container.address.coords.latitude &&
            container.address.coords.longitude
        ) &&
      !Object.values(errorMessages).filter((value) => value !== "").length
    );
  };

  const handleSaveOrganization = () => {
    const mappedOrganizationData = {
      image: admin.image,
      email: admin.email,
      name: admin.name,
      lname: admin.lname,
      phone: phoneExt + admin.phone,
      password: admin.password,
      passphrase: admin.passphrase,
      organization: {
        name: organization.name,
        address: organization.address,
        containers: organizationContainers
          .map((organizationContainer) => {
            if (organizationContainer.check) {
              return {
                ...organizationContainer,
                address: organization.address
              }
            }
            return organizationContainer
          })
          .filter(organizationContainer => organizationContainer !== null),
      }
    };
    setLoading(true)

    if (!props.edit) {
      return createOrg(mappedOrganizationData)
    } else {
      mappedOrganizationData._id = clientId;
      mappedOrganizationData.uid = clientUid;
      if (!mappedOrganizationData.password) delete mappedOrganizationData.password;
      if (!mappedOrganizationData.passphrase) delete mappedOrganizationData.passphrase;
      return updateOrg(mappedOrganizationData)
    }
  };

  const createOrg = (mappedOrganizationData) => {
    createOrganization(mappedOrganizationData)
      .then((res) => {

        setLoading(false)

        setDialog({
          ...dialog,
          open: true,
          title: "Organization Added",
          actions: [
            {
              label: "Add Another",
              btn_color: "primary",
              execute: () => {
                window.location.reload()
              }
            },
            {
              label: "Go to Dashboard",
              btn_color: "white_btn",
              execute: () => {
                navigate(`/${user.uid}/${user.role}/dashboard`)
              }
            }
          ]

        })
      })
      .catch((err) => {
        if (err.response.status === 500 || err.response.status === 400) {
          setDialog({
            ...dialog,
            open: true,
            title: "Organization could not be added",
            message: err.response.data.message,
            actions: [
              {
                label: "Retry",
                btn_color: "primary",
                execute: () => {
                  handleSaveOrganization()
                  setDialog({ ...dialog, open: false })
                }
              },
              {
                label: "Close",
                btn_color: "secondary",
                execute: () => {
                  setDialog({ ...dialog, open: false })
                  setLoading(false)
                }
              }
            ]

          })
        }
      })
  }

  const updateOrg = (mappedOrganizationData) => {
    let id = new URLSearchParams(window.location.search).get("id")
    updateOrganization(id, mappedOrganizationData)
      .then((res) => {

        setLoading(false)

        setDialog({
          ...dialog,
          open: true,
          title: "Organization updated",
          actions: [
            {
              label: "Edit again",
              btn_color: "primary",
              execute: () => {
                window.location.reload()
              }
            },
            {
              label: "Go to Dashboard",
              btn_color: "white_btn",
              execute: () => {
                navigate(`/${user.uid}/${user.role}/dashboard`)
              }
            }
          ]

        })
      })
      .catch((err) => {
        if (err.response.status === 500 || err.response.status === 400) {
          setDialog({
            ...dialog,
            open: true,
            title: "Organization could not be updated",
            message: err.response.data.message,
            actions: [
              {
                label: "Retry",
                btn_color: "primary",
                execute: () => {
                  handleSaveOrganization()
                  setDialog({ ...dialog, open: false })
                }
              },
              {
                label: "Close",
                btn_color: "secondary",
                execute: () => {
                  setDialog({ ...dialog, open: false })
                  setLoading(false)
                }
              }
            ]

          })
        }
      })
  }

  let OrganizationInEdition

  useEffect(() => {
    if (props.edit) {
      let id = new URLSearchParams(window.location.search).get("id")
      getOrganization(id)
        .then((res) => {
          OrganizationInEdition = res.data.data

          setClientId(OrganizationInEdition.admin._id);
          setClientUid(OrganizationInEdition.admin.uid);

          setAdmin(prevAdmin => ({
            ...prevAdmin,
            ...OrganizationInEdition.admin,
            phone: OrganizationInEdition.admin.phone.substring(3)
          }));

          setPhoneExt(OrganizationInEdition.admin.phone.substring(0, 3));

          setOrganization({
            ...organization,
            name: OrganizationInEdition.name,
            address: OrganizationInEdition.address,
          });

          setOrganizationContainers(OrganizationInEdition.containers);

        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [])

  const handleChangeLabel = () => {
    console.log("Changing label but not really")
  }

  return (
    <>
      <Backdrop open={loading} children={<CircularProgress />} sx={{ zIndex: 1100 }} />
      <Fade in={true} timeout={1000} unmountOnExit>
        <Box sx={
          {
            display: "flex",
            width: "100%",
            alignItems: "center",
            marginTop: "5vh",
            paddingBottom: "5vh",
            flexDirection: "column",
          }
        }>
          <Box sx={{ width: "90%", display: "flex", flexDirection: { xs: "column", sm: "column" } }} alignItems="center" >

            <Typography variant="h4" mb={{ xs: "5vh", md: "3vh" }}>{props.edit ? "Edit" : "Create"} an organization</Typography>

            {/* // ORGANIZATION */}
            <Typography variant="h5" mt="4vh">Organization Information</Typography>
            <Divider variant="middle" sx={{ width: { xs: "98%", sm: "50%", md: "50%" }, marginY: "1vh" }} />
            <TextField id="organizationName" name='name' onChange={handleOrganizationChange} value={organization?.name} label="Name" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />

            {/* // ORGANIZATION ADDRESS */}
            <Typography variant="h5" mt="4vh">Address</Typography>
            <Divider variant="middle" sx={{ width: { xs: "98%", sm: "50%", md: "50%" }, marginY: "1vh" }} />
            <TextField id="organizationStreet" name='street' onChange={handleOrganizationAddressChange} value={organization?.address?.street} label="Street" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
            <Box sx={{ width: { xs: "98%", sm: "49%" } }} >
              <TextField id="organizationNumber" name='stNumber' onChange={handleOrganizationAddressChange} value={organization?.address?.stNumber} label="No." type="number" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
              <TextField id="organizationZipCode" name='zip' onChange={handleOrganizationAddressChange} value={organization?.address?.zip} label="ZipCode" type="text" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
            </Box>
            <TextField id="organizationCity" name='city' onChange={handleOrganizationAddressChange} value={organization?.address?.city} label="City" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
            <TextField id="organizationState" name='state' onChange={handleOrganizationAddressChange} value={organization?.address?.state} label="State" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
            <TextField id="organizationCountry" name='country' onChange={handleOrganizationAddressChange} value={organization?.address?.country} label="Country" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
            <TextField id="organizationReferences" name='references' onChange={handleOrganizationAddressChange} value={organization?.address?.references} multiline label="References" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
            <Box sx={{ width: { xs: "98%", sm: "49%" } }} >
              <TextField id="organizatioLnatitude" name='latitude' onChange={handleOrganizationAddressCoordsChange} value={organization?.address?.coords?.latitude} label="Latitude" type="number" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
              <TextField id="organizationLongitude" name='longitude' onChange={handleOrganizationAddressCoordsChange} value={organization?.address?.coords?.longitude} label="Longitude" type="number" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
            </Box>

            {/* // ORGANIZATION CONTAINERS */}
            <Box sx={{ marginTop: "4vh", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", spacing: { xs: 1, sm: 2 }, width: { xs: "100%", sm: "50%", md: "50%" } }} >
              <Typography variant="h5" align="left">Container Information</Typography>
              <Button variant="contained" onClick={addContainer} sx={{ marginLeft: "1vh" }}>
                <PlaylistAddIcon color="white" />
              </Button>
            </Box>
            <Divider variant="middle" sx={{ width: { xs: "98%", sm: "50%", md: "50%" }, marginY: "1vh" }} />
            {organizationContainers.map((container, index) => (
              <Box key={index} sx={{ marginTop: "1vh", display: "flex", flexDirection: "column", alignItems: "center", width: { xs: "100%", sm: "50%", md: "50%" } }} >
                <Accordion sx={{ width: { xs: "100%", sm: "100%", md: "100%" } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ width: { xs: "100%", sm: "100%" }, display: "flex", flexDirection: "row", justifyContent: 'space-between', alignContent: 'center' }} >
                      <Box sx={{ width: { xs: "100%", sm: "100%" }, display: "flex", flexDirection: "row", justifyContent: 'start', alignContent: 'center' }} >
                        <Typography variant="h6">Container #{index + 1}</Typography>
                      </Box>
                      {organizationContainers.length > 1
                        ? <Delete color="error" onClick={(e) => deleteContainer(index, e)} sx={{ marginTop: ".5vh" }} />
                        : null}
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <TextField name='name' onChange={(event) => handleOrganizationContainersChange(event, index)} value={container?.name} label="Name" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.fullSize })} />
                    <TextField name='capacity' type="number" onChange={(event) => handleOrganizationContainersChange(event, index)} value={container?.capacity} label="Capacity" InputProps={{ endAdornment: <Typography>/trays</Typography> }} sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
                    <Tooltip title={container.check ? "Click to input other address" : "Click to use organization address"} arrow>
                      <Checkbox icon={<DomainAddIcon color="primary" />} checkedIcon={<DomainDisabledIcon color="error" />} onChange={() => handleCheckBox(index)} onClick={(event) => event.stopPropagation()} />
                    </Tooltip>
                    <TextField name='street' onChange={(event) => handleOrganizationContainersAddressChange(event, index)} value={container.check ? organization?.address?.street : container?.address?.street} label="Street" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.fullSize })} disabled={container.check} />
                    <Box sx={{ width: { xs: "100%", sm: "100%" }, display: "flex", flexDirection: "row", alignItems: "center" }} >
                      <TextField name='stNumber' onChange={(event) => handleOrganizationContainersAddressChange(event, index)} value={container.check ? organization?.address?.stNumber : container?.address?.stNumber} label="No." type="number" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.fullSize })} disabled={container.check} />
                      <TextField name='zip' onChange={(event) => handleOrganizationContainersAddressChange(event, index)} value={container.check ? organization?.address?.zip : container?.address?.zip} label="ZipCode" type="text" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.fullSize })} disabled={container.check} />
                    </Box>
                    <TextField name='city' onChange={(event) => handleOrganizationContainersAddressChange(event, index)} value={container.check ? organization?.address?.city : container?.address?.city} label="City" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.fullSize })} disabled={container.check} />
                    <TextField name='state' onChange={(event) => handleOrganizationContainersAddressChange(event, index)} value={container.check ? organization?.address?.state : container?.address?.state} label="State" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.fullSize })} disabled={container.check} />
                    <TextField name='country' onChange={(event) => handleOrganizationContainersAddressChange(event, index)} value={container.check ? organization?.address?.country : container?.address?.country} label="Country" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.fullSize })} disabled={container.check} />
                    <TextField name='references' onChange={(event) => handleOrganizationContainersAddressChange(event, index)} value={container.check ? organization?.address?.references : container?.address?.references} multiline label="References" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.fullSize })} disabled={container.check} />
                    <Box sx={{ width: { xs: "100%", sm: "100%" }, display: "flex", flexDirection: "row", alignItems: "center" }} >
                      <TextField name='latitude' onChange={(event) => handleOrganizationContainersAddressCoordsChange(event, index)} value={container.check ? organization?.address?.coords?.latitude : container?.address?.coords?.latitude} label="Latitude" type="number" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.fullSize })} disabled={container.check} />
                      <TextField name='longitude' onChange={(event) => handleOrganizationContainersAddressCoordsChange(event, index)} value={container.check ? organization?.address?.coords?.longitude : container?.address?.coords?.longitude} label="Longitude" type="number" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.fullSize })} disabled={container.check} />
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            ))}

            {/* // ADMIN */}
            <Typography variant="h5" mt="4vh" align="left">{props.edit ? "Edit" : "New"} admin account Information</Typography>
            <Divider variant="middle" sx={{ width: { xs: "98%", sm: "50%", md: "50%" }, marginY: "1vh" }} />
            <Fab color="primary" component="label" id="label" aria-label="add" sx={{ marginY: "4%", width: 100, height: 100 }} size="large" helpertext="Label">
              <input type="file" accept="image/*" onChange={handleChangeLabel} hidden />
              <CameraIcon sx={{ fontSize: "5vh" }} />
            </Fab>
            <TextField id="email" name='email' onChange={handleAdminChange} value={admin?.email} label="Email" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} error={Boolean(errorMessages.email)} helperText={errorMessages.email || ""} />
            <Box sx={{ width: { xs: "98%", sm: "49%" } }} >
              <TextField id="name" name='name' onChange={handleAdminChange} value={admin?.name} label="First Name" type="text" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} error={Boolean(errorMessages.name)} helperText={errorMessages.name || ""} />
              <TextField id="lname" name='lname' onChange={handleAdminChange} value={admin?.lname} label="Last Name" type="text" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} error={Boolean(errorMessages.lname)} helperText={errorMessages.lname || ""} />
            </Box>
            <Box sx={{ width: { xs: "98%", sm: "49%" }, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }} >
              <TextField id="phoneExt" name='phoneExt' onChange={handlePhoneExt} value={phoneExt} label="Ext" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.quarterSize })} error={Boolean(errorMessages.phoneExt)} helperText={errorMessages.phoneExt || ""} />
              <TextField id="phone" name='phone' onChange={handleAdminChange} value={admin?.phone} label="Phone" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.fullSize })} error={Boolean(errorMessages.phone)} helperText={errorMessages.phone || ""} />
            </Box>
            <Box sx={{ width: { xs: "98%", sm: "49%" } }} >
              <TextField id="password" name='password' onChange={handleAdminChange} value={admin?.password} label="Set a password" type="password" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} error={Boolean(errorMessages.password)} helperText={errorMessages.password || ""} />
              <TextField id="passphrase" name='passphrase' onChange={handleAdminChange} value={admin?.passphrase} label="Set a passphrase" type="password" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} error={Boolean(errorMessages.passphrase)} helperText={errorMessages.passphrase || ""} />
            </Box>
            {/* // SAVE */}
            <Button variant="contained" onClick={handleSaveOrganization} disabled={!isFormValid()} sx={{ marginTop: "2vh" }}>
              {loading ? <CircularProgress /> : (!props.edit ? "Save Organization" : "Update Organization")}
            </Button>
          </Box>
        </Box>
      </Fade>

      <UserDialog
        setDialog={setDialog}
        dialog={dialog}
        open={dialog.open}
        title={dialog.title}
        content={dialog.message}
        actions={dialog.actions}
      />
    </>
  )
}
