import React, { useState, useEffect } from 'react'

//*MUI COMPONENTS
import { Autocomplete, Backdrop, Box, Button, Divider, Fab, TextField, Typography, Fade, CircularProgress } from '@mui/material'
import CameraIcon from '@mui/icons-material/AddPhotoAlternate'

//*CONTEXTS
import useAuth from '../../../contextHooks/useAuthContext'

//*NETWORK, ROUTING AND API
import { useNavigate } from 'react-router-dom'
import api from '../../../axios.js'

//*THEME
import { BV_THEME } from '../../../theme/BV-theme'
import { UserDialog } from '../../../CoreComponents/UserFeedback/Dialog'

export const NewOrganization = (props) => {

  const { user, credential } = useAuth()
  const navigate = useNavigate()

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
    customers: [],
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
    name: "",
    capacity: "",
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

  const initialStateOrganizationCustomer = {
    email: "",
    name: "",
    image: "https://cdn-icons-png.flaticon.com/512/147/147144.png"
  };

  // States with the initial state
  const [admin, setAdmin] = useState(initialStateAdmin);
  const [organization, setOrganization] = useState(initialStateOrganization);
  const [organizationContainers, setOrganizationContainers] = useState([initialStateOrganizationContainer]);
  const [organizationCustomers, setOrganizationCustomers] = useState([initialStateOrganizationCustomer]);

  // Input handlers
  const handleAdminChange = (event) => {
    const { name, value } = event.target;
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

  const handleOrganizationCustomersChange = (event, index) => {
    const { name, value } = event.target;
    setOrganizationCustomers((prevCustomers) => {
      const updatedCustomers = [...prevCustomers];
      updatedCustomers[index] = {
        ...updatedCustomers[index],
        [name]: value
      };
      return updatedCustomers;
    });
  };

  const addContainer = () => {
    setOrganizationContainers((prevContainers) => [
      ...prevContainers,
      initialStateOrganizationContainer
    ]);
  };

  const deleteContainer = (index) => {
    setOrganizationContainers((prevContainers) => {
      const updatedContainers = [...prevContainers];
      updatedContainers.splice(index, 1);
      return updatedContainers;
    });
  };

  const addCustomer = () => {
    setOrganizationCustomers((prevCustomers) => [
      ...prevCustomers,
      initialStateOrganizationCustomer
    ]);
  };

  const deleteCustomer = (index) => {
    setOrganizationCustomers((prevCustomers) => {
      const updatedCustomers = [...prevCustomers];
      updatedCustomers.splice(index, 1);
      return updatedCustomers;
    });
  };


  const isFormValid = () => {
    return (
      admin.email &&
      admin.password &&
      admin.passphrase &&
      admin.name &&
      admin.lname &&
      organization.name &&
      organization.address.stNumber &&
      organization.address.street &&
      organization.address.zip &&
      organization.address.city &&
      organization.address.state &&
      organization.address.country &&
      organizationContainers.every(
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
      organizationCustomers.every(
        (customer) => customer.email && customer.name //&& customer.image
      )
    );
  };

  const handleSaveOrganization = () => {
    const mappedOrganizationData = {
      image: admin.image,
      email: admin.email,
      name: admin.name,
      lname: admin.lname,
      phone: admin.phone,
      password: admin.password,
      passphrase: admin.passphrase,
      organization: {
        name: organization.name,
        containers: organizationContainers,
        customers: organizationCustomers,
        address: organization.address
      }
    };
    console.log(mappedOrganizationData);
    setLoading(true)

    if (!props.edit) {
      return createOrganization(mappedOrganizationData)
    } else {
      return updateOrganization(mappedOrganizationData)
    }
  };

  const createOrganization = (mappedOrganizationData) => {
    console.log(mappedOrganizationData);
    return
    api.api.post(`/auth/create/admin`, mappedOrganizationData, {
      headers: {
        authorization: credential._tokenResponse.idToken,
        user: user
      }
    })
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
        console.log("error  ", err)
        if (err.response.status === 500 || err.response.status === 400) {
          setDialog({
            ...dialog,
            open: true,
            title: "Organization could not be added",
            actions: [
              {
                label: "Retry",
                btn_color: "primary",
                execute: () => {
                  handlecreateOrganization()
                  setDialog({ ...dialog, open: false })
                }
              },
              {
                label: "Close",
                btn_color: "secondary",
                execute: () => {
                  setDialog({ ...dialog, open: false })
                }
              }
            ]

          })
        }
      })
  }

  const updateOrganization = () => {
    setDialog({
      ...dialog,
      open: true,
      title: "Feature unavailable.",
      message: "At the momment this feature is not available, we are working to cerate a better experience, please be patient.",
      actions: [{
        label: "OK",
        execute: () => navigate(`/${user.uid}/${user.role}/organizations`)
      }]
    })
  }

  let OrganizationInEdition

  useEffect(() => {
    if (props.edit) {
      let id = new URLSearchParams(window.location.search).get("id")
      api.api.get(`${api.apiVersion}/organizations/${id}`, {
        headers: {
          authorization: credential._tokenResponse.idToken,
          user: user
        }
      })
        .then((res) => {
          console.log(res.data.data)
          OrganizationInEdition = res.data.data
          console.log("Organization in edition", OrganizationInEdition)
          // TODO: Set object to edit
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
      <Backdrop open={loading} children={<CircularProgress />} />
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

            <Typography variant="h4" mb={{ xs: "5vh", md: "3vh" }}>Create an organization</Typography>

            {/* // ORGANIZATION */}
            <Typography variant="h5" mt="4vh">Organization Information</Typography>
            <Divider variant="middle" sx={{ width: { xs: "98%", sm: "50%", md: "50%" }, marginY: "1vh" }} />
            <TextField id="organizationName" name='name' onChange={handleOrganizationChange} value={organization.name} label="Name" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />

            {/* // ORGANIZATION ADDRESS */}
            <Typography variant="h5" mt="4vh">Address</Typography>
            <Divider variant="middle" sx={{ width: { xs: "98%", sm: "50%", md: "50%" }, marginY: "1vh" }} />
            <TextField id="organizationStreet" name='street' onChange={handleOrganizationAddressChange} value={organization.address.street} label="Street" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
            <Box sx={{ width: { xs: "98%", sm: "49%" } }} >
              <TextField id="organizationNumber" name='stNumber' onChange={handleOrganizationAddressChange} value={organization.address.stNumber} label="No." type="number" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
              <TextField id="organizationZipCode" name='zip' onChange={handleOrganizationAddressChange} value={organization.address.zip} label="ZipCode" type="text" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
            </Box>
            <TextField id="organizationCity" name='city' onChange={handleOrganizationAddressChange} value={organization.address.city} label="City" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
            <TextField id="organizationState" name='state' onChange={handleOrganizationAddressChange} value={organization.address.state} label="State" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
            <TextField id="organizationCountry" name='country' onChange={handleOrganizationAddressChange} value={organization.address.country} label="Country" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
            <TextField id="organizationReferences" name='references' onChange={handleOrganizationAddressChange} value={organization.address.references} multiline label="References" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
            <Box sx={{ width: { xs: "98%", sm: "49%" } }} >
              <TextField id="organizatioLnatitude" name='latitude' onChange={handleOrganizationAddressCoordsChange} value={organization.address.coords.latitude} label="Latitude" type="number" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
              <TextField id="organizationLongitude" name='longitude' onChange={handleOrganizationAddressCoordsChange} value={organization.address.coords.longitude} label="Longitude" type="number" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
            </Box>

            {/* // ORGANIZATION CONTAINERS */}
            <Typography variant="h5" mt="4vh" align="left">Container Information</Typography>
            <Divider variant="middle" sx={{ width: { xs: "98%", sm: "50%", md: "50%" }, marginY: "1vh" }} />
            {organizationContainers.map((container, index) => (
              <>
                <Typography variant="h6" mt="2vh" align="left">Container #{index + 1}</Typography>
                <TextField name='name' onChange={(event) => handleOrganizationContainersChange(event, index)} value={container.name} label="Name" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
                <TextField name='capacity' type="number" onChange={(event) => handleOrganizationContainersChange(event, index)} value={container.capacity} label="Capacity" InputProps={{ endAdornment: <Typography>/U</Typography> }} sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.thirdSize })} />
                <TextField name='street' onChange={(event) => handleOrganizationContainersAddressChange(event, index)} value={container.address.street} label="Street" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
                <Box sx={{ width: { xs: "98%", sm: "49%" } }} >
                  <TextField name='stNumber' onChange={(event) => handleOrganizationContainersAddressChange(event, index)} value={container.address.stNumber} label="No." type="number" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
                  <TextField name='zip' onChange={(event) => handleOrganizationContainersAddressChange(event, index)} value={container.address.zip} label="ZipCode" type="text" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
                </Box>
                <TextField name='city' onChange={(event) => handleOrganizationContainersAddressChange(event, index)} value={container.address.city} label="City" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
                <TextField name='state' onChange={(event) => handleOrganizationContainersAddressChange(event, index)} value={container.address.state} label="State" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
                <TextField name='country' onChange={(event) => handleOrganizationContainersAddressChange(event, index)} value={container.address.country} label="Country" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
                <TextField name='references' onChange={(event) => handleOrganizationContainersAddressChange(event, index)} value={container.address.references} multiline label="References" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
                <Box sx={{ width: { xs: "98%", sm: "49%" } }} >
                  <TextField name='latitude' onChange={(event) => handleOrganizationContainersAddressCoordsChange(event, index)} value={container.address.coords.latitude} label="Latitude" type="number" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
                  <TextField name='longitude' onChange={(event) => handleOrganizationContainersAddressCoordsChange(event, index)} value={container.address.coords.longitude} label="Longitude" type="number" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
                </Box>
                {organizationContainers.length > 1
                  ? <Button variant="contained" color="error" onClick={() => deleteContainer(index)} sx={{ marginTop: "2vh" }}>Delete</Button>
                  : null}
              </>
            ))}
            <Button variant="contained" onClick={addContainer} sx={{ marginTop: "2vh" }}>Add Container</Button>

            {/* // ORGANIZATION CUSTOMERS */}
            <Typography variant="h5" mt="4vh" align="left">Customers Information</Typography>
            <Divider variant="middle" sx={{ width: { xs: "98%", sm: "50%", md: "50%" }, marginY: "1vh" }} />
            {organizationCustomers.map((customer, index) => (
              <>
                <Typography variant="h6" mt="2vh" align="left">Customer #{index + 1}</Typography>
                <Fab color="primary" component="label" aria-label="add" sx={{ marginY: "1%", width: 100, height: 100 }} size="large" helpertext="Label">
                  <input type="file" accept="image/*" onChange={handleChangeLabel} hidden />
                  <CameraIcon sx={{ fontSize: "5vh" }} />
                </Fab>
                <TextField name='email' onChange={(event) => handleOrganizationCustomersChange(event, index)} value={customer.email} label="Email" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
                <TextField name='name' onChange={(event) => handleOrganizationCustomersChange(event, index)} value={customer.name} label="Name" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
                {organizationCustomers.length > 1
                  ? <Button variant="contained" color="error" onClick={() => deleteCustomer(index)} sx={{ marginTop: "2vh" } }>Delete</Button>
                  : null}
              </>
            ))}
            <Button variant="contained" onClick={addCustomer} sx={{ marginTop: "2vh" }}>Add Customer</Button>

            {/* // ADMIN */}
            <Typography variant="h5" mt="4vh" align="left">New admin account Information</Typography>
            <Divider variant="middle" sx={{ width: { xs: "98%", sm: "50%", md: "50%" }, marginY: "1vh" }} />
            <Fab color="primary" component="label" id="label" aria-label="add" sx={{ marginY: "4%", width: 100, height: 100 }} size="large" helpertext="Label">
              <input type="file" accept="image/*" onChange={handleChangeLabel} hidden />
              <CameraIcon sx={{ fontSize: "5vh" }} />
            </Fab>
            <TextField id="email" name='email' onChange={handleAdminChange} value={admin.email} label="Email" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
            <Box sx={{ width: { xs: "98%", sm: "49%" } }} >
              <TextField id="name" name='name' onChange={handleAdminChange} value={admin.name} label="First Name" type="text" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
              <TextField id="lname" name='lname' onChange={handleAdminChange} value={admin.lname} label="Last Name" type="text" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
            </Box>
            <TextField id="phone" name='phone' onChange={handleAdminChange} value={admin.phone} label="Phone" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
            <Box sx={{ width: { xs: "98%", sm: "49%" } }} >
              <TextField id="password" name='password' onChange={handleAdminChange} value={admin.password} label="Set a password" type="password" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
              <TextField id="passphrase" name='passphrase' onChange={handleAdminChange} value={admin.passphrase} label="Set a passphrase" type="password" sx={() => ({ ...BV_THEME.input.mobile.fullSize.desktop.halfSize })} />
            </Box>

            {/* // SAVE */}
            <Button variant="contained" onClick={handleSaveOrganization} disabled={!isFormValid()} sx={{ marginTop: "2vh" }}>
              {loading ? <CircularProgress /> : "Save Organization"}
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
