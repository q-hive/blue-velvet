import React, { useEffect, useState } from 'react';
//*MUI Components
import {
  Autocomplete,
  TextField,
  Typography,
  Button,
  Box,
  Grid,
  Container,
  Paper,
  Snackbar,
  Alert,
  Stack,
  CircularProgress,
  Fade,
  FormControl,
  FormControlLabel,
  Checkbox,
  Divider,
  Tooltip,
  IconButton,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import DeleteIcon from '@mui/icons-material/Delete';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

//*App components
import { BV_THEME } from '../../../../theme/BV-theme';
import { CheckBoxGroup } from '../../../../CoreComponents/CheckboxGroup';

import { formattedDate } from '../../../../utils/times';
//*Contexts
import useAuth from '../../../../contextHooks/useAuthContext';

//*Network and API
import { useLocation, useNavigate } from 'react-router-dom';
import { UserDialog } from '../../../../CoreComponents/UserFeedback/Dialog';

// CUSTOM HOOKS
import useOrders from '../../../../hooks/useOrders';
import useCustomers from '../../../../hooks/useCustomers';
import useProducts from '../../../../hooks/useProducts';
import DateRangePicker from '../../../../CoreComponents/Dates/DateRangePicker';

export const NewOrder = (props) => {
  const [sameCustomerAddress, setSameCustomerAddress] = useState(false);
  const initialDeliveryAddress = {
    street: '',
    stNumber: '',
    zip: '',
    city: '',
    state: '',
    country: '',
    references: '',
    coords: {
      latitude: '',
      longitude: '',
    },
  };
  const [deliveryAddress, setDeliveryAddress] = useState(
    initialDeliveryAddress
  );
  const [products, setProducts] = useState([]);

  //*Auth context
  const getContextProducts = () => {
    let scopeProducts;

    if (props.edit.isEdition) {
      console.log('isEdition');
      scopeProducts = props.edit.order.products.map((product) => {
        return product;
      });

      products.push(scopeProducts);
    }
    return products;
  };

  const { user, credential } = useAuth();
  let headers = {
    authorization: credential._tokenResponse.idToken,
    user: user,
  };
  const { getOrderInvoiceById, addOrder } = useOrders(headers);
  const { getCustomers } = useCustomers(headers);
  const { getProducts } = useProducts(headers);

  const navigate = useNavigate();
  //*Data States
  const [loading, setLoading] = useState(false);
  const [canAddProduct, setCanAddProduct] = useState(false);
  const [loadingWithDefault, setLoadingWithDefault] = useState();
  const [options, setOptions] = useState({
    customers: [],
    status: [
      {
        selectable: true,
        shortCycle: false,
        name: 'preSoaking',
        label: 'To be soaked',
      },
      {
        selectable: true,
        shortCycle: true,
        name: 'seeding',
        label: 'To be seeded',
      },
      {
        selectable: false,
        shortCycle: true,
        name: 'growing',
        label: 'Product is growing',
      },
      {
        selectable: true,
        shortCycle: true,
        name: 'harvestReady',
        label: 'Product is ready to harvest',
      },
      {
        selectable: true,
        shortCycle: true,
        name: 'packing',
        label: 'Product is ready to pack',
      },
      {
        selectable: true,
        shortCycle: true,
        name: 'ready',
        label: 'Product packed',
      },
    ],
    products: [],
  });
  const [input, setInput] = useState({
    customer: props.edit.isEdition ? props.edit.values.order.customer : {},
    product: {},
    status: '',
    smallPackages: 0,
    size: undefined,
    mediumPackages: 0,
    date: undefined,
    cyclic: true,
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  //*Render states
  const [canSendOrder, setCanSendOrder] = useState(false);
  const [error, setError] = useState({
    customer: {
      message: 'Please correct or fill the customer',
      active: false,
    },
    product: {
      message: 'Please correct or fill the product.',
      active: false,
    },
    status: {
      message: 'Please correct or fill the status.',
      active: false,
    },
    date: {
      message: 'Please correct or fill the date.',
      active: false,
    },
    size: {
      message: 'Please correct or fill the size.',
      active: false,
    },
    smallPackages: {
      message: 'Please correct or fill the number of packages.',
      active: false,
    },
    mediumPackages: {
      message: 'Please correct or fill the number of packages.',
      active: false,
    },
  });
  //Snackbar
  const [open, setOpen] = useState(false);

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  //Get invoice
  const getOrderInvoice = async (params) => {
    setLoading(true);
    const orderPDF = await getOrderInvoiceById(params._id);
    return orderPDF;
  };

  //Dialog
  const [dialog, setDialog] = useState({
    open: false,
    title: '',
    message: '',
    actions: [],
  });
  //

  const handleDeliveryAddress = (event) => {
    const { name, value } = event.target;
    setDeliveryAddress((prevAddress) => ({
      ...prevAddress,
      ...(name === 'latitude' || name === 'longitude'
        ? { coords: { ...prevAddress.coords, [name]: value } }
        : { [name]: value }),
    }));
  };

  const useSameCustomerAddress = () => {
    setSameCustomerAddress((prevValue) => !prevValue);
    setDeliveryAddress({
      street: input.customer.address?.street || '',
      stNumber: input.customer.address?.stNumber || '',
      zip: input.customer.address?.zip || '',
      city: input.customer.address?.city || '',
      state: input.customer.address?.state || '',
      country: input.customer.address?.country || '',
      references: input.customer.address?.references || '',
      coords: {
        latitude: input.customer.address?.coords?.latitude || '',
        longitude: input.customer.address?.coords?.longitude || '',
      },
    });
  };

  const handleChangeInput = async (e, v, r) => {
    let id;
    let value;
    id = e.target.id;
    switch (r) {
      case 'input':
        value = v;
        if (id === 'smallPackages' || id === 'mediumPackages') {
          value = Number(v);
        }
        break;
      case 'selectOption':
        id = e.target.id.split('-')[0];
        value = v;
        break;
      default:
        break;
    }

    if (error[id] && error[id].active) {
      setError({
        ...error,
        [id]: {
          ...error[id],
          active: false,
        },
      });
    }

    setInput((prevInput) => ({
      ...prevInput,
      [id]: value,
      status:
        prevInput.status.mix && id === 'status'
          ? prevInput.status
          : id === 'status'
          ? value
          : prevInput.status,
    }));
    if (id === 'customer') {
      setSameCustomerAddress(true);
      setDeliveryAddress({
        street: value.address?.street || '',
        stNumber: value.address?.stNumber || '',
        zip: value.address?.zip || '',
        city: value.address?.city || '',
        state: value.address?.state || '',
        country: value.address?.country || '',
        references: value.address?.references || '',
        coords: {
          latitude: value.address?.coords?.latitude || '',
          longitude: value.address?.coords?.longitude || '',
        },
      });
    }
  };

  const handleChangeDate = (date) => {
    if (error.date.active) {
      setError({
        ...error,
        date: {
          ...error.date,
          active: false,
        },
      });
    }
    setInput({
      ...input,
      date: date,
    });
  };

  const thereErrors = (input) => {
    setError({
      ...error,
      product: {
        ...error.product,
        active: Object.keys(input.product).length === 0,
      },
      packages: {
        ...error.packages,
        active: input.packages === undefined,
      },
      size: {
        ...error.size,
        active: input.size === undefined,
      },
    });

    return (
      Object.keys(input.product).length === 0 ||
      input.packages === undefined ||
      input.size === undefined
    );
  };

  const handleAddToOrder = (e) => {
    let packages;
    if (e) {
      if (e.target.id === 'add') {
        packages = [
          {
            number: input.smallPackages,
            size: 'small',
          },
          {
            number: input.mediumPackages,
            size: 'medium',
          },
        ];

        let newProduct = {
          name: input.product.name,
          status: input.status.name,
          seedId: input.product?.seed,
          provider: input.product?.provider,
          _id: input.product._id,
          packages: packages,
        };

        if (input.product.mix.isMix) {
          newProduct.mixStatuses = input.status.mix;
        }

        products.push(newProduct);

        setInput({
          ...input,
          product: {},
          status: '',
          smallPackages: 0,
          mediumPackages: 0,
        });
      }
    }
  };
  const handleDeleteProduct = (product) => {
    console.log('antes', products);

    var arr = products.filter((prod) => {
      return prod.name != product.name;
    });
    setProducts(arr);

    console.log('despues', products);
    console.log('tempArr', arr);
  };

  function disableNonAvailableDays(date) {
    const day = date.getDay();
    return day === 0 || day === 1 || day === 3 || day === 4 || day === 6;
  }

  function calculateMinDate() {
    let minDate;
    const hoy = new Date();
    const getMaxGrowingDays = () => {
      products;
    };

    hoy.setDate(hoy.getDate() + 7);
    return hoy;
  }

  const handleSetOrder = async (e) => {
    if (e.target.id === 'accept') {
      console.log(input.customer);
      setError({
        ...error,
        date: {
          ...error.date,
          active: input.date === undefined,
        },
        customer: {
          ...error.product,
          active: Object.keys(input.customer).length === 0,
        },
      });
    }

    const mapInput = () => {
      let mappedData;
      let useProducts = false;
      let packages;
      if (input.smallPackages && input.mediumPackages) {
        packages = [
          {
            number: input.smallPackages,
            size: 'small',
          },
          {
            number: input.mediumPackages,
            size: 'medium',
          },
        ];
      } else {
        packages = [
          {
            number: input.smallPackages || input.mediumPackages,
            size: input.smallPackages
              ? 'small'
              : input.mediumPackages
              ? 'medium'
              : 'small',
          },
        ];
      }

      const mappedInput = {
        name: input.product.name,
        status: input.product.name,
        seedId: input.product.seed,
        provider: input.product.provider,
        _id: input.product._id,
        packages: packages,
      };

      if (products.length > 0) {
        useProducts = true;
      }

      // Pone el status de la orden dependiendo de los status de los productos
      const getOrderStatus = (orderProducts) => {
        let allStatus = [];
        orderProducts.map((product) => {
          allStatus.push(product.status);
        });

        const uniqueStatus = new Set(allStatus);
        if (uniqueStatus.size === 1) {
          return [...uniqueStatus][0];
        } else if (uniqueStatus.size > 1) {
          return 'production';
        }
      };

      mappedData = {
        customer: input.customer,
        products: useProducts ? products : [mappedInput],
        status: getOrderStatus(useProducts ? products : [mappedInput]),
        date: input.date,
        cyclic: input.cyclic,
        address: deliveryAddress,
      };

      return mappedData;
    };

    try {
      console.log('MAPINPUT:', mapInput());
      const response = await addOrder(mapInput());

      if (response.status === 201) {
        const formatDataToList = (data) => (
          <>
            <p>Production schedule for the following days:</p>
            <ol>
              {data.map((item, index) => (
                <li key={index}>
                  <p>{`${item.name} for ${formattedDate(
                    new Date(item.startDate)
                  )} on status ${item.status}`}</p>
                </li>
              ))}
            </ol>
          </>
        );

        setOpen(true);
        products.splice(0, products.length - 1);
        setDialog({
          ...dialog,
          open: true,
          title: 'Order created succesfully',
          message: formatDataToList(response.data.data),
          actions: [
            {
              label: 'Continue',
              btn_color: 'primary',
              execute: () => {
                window.location.reload();
              },
            },
            {
              label: loading ? <CircularProgress /> : "Print Order's Invoice",
              btn_color: 'secondary',
              execute: () => {
                setLoading(true);
                getOrderInvoice(response.data.data)
                  .then((result) => {
                    const url = window.URL.createObjectURL(
                      new Blob([new Uint8Array(result.data.data.data).buffer])
                    );
                    const link = document.createElement('a');
                    link.href = url;

                    link.setAttribute(
                      'download',
                      `Invoice ${response.data.data._id}.pdf`
                    );

                    document.body.appendChild(link);
                    link.click();
                    setLoading(false);
                  })
                  .catch((err) => {
                    setLoading(false);
                    setDialog({
                      ...dialog,
                      open: true,
                      title: 'Error getting file',
                      message:
                        'Please try again, there was an issue getting the file',
                      actions: [
                        {
                          label: 'Ok',
                          execute: () => window.location.reload(),
                        },
                      ],
                    });
                  });
              },
            },
          ],
        });
      }
      if (response.status === 500) {
        setDialog({
          ...dialog,
          open: true,
          title: 'Order could not be created',
          actions: [
            {
              label: 'Retry',
              btn_color: 'primary',
              execute: () => {
                window.location.reload();
              },
            },
            {
              label: 'Close',
              btn_color: 'secondary',
              execute: () => {
                setDialog({ ...dialog, open: false });
              },
            },
          ],
        });
      }
    } catch (err) {
      console.log(err);
      let message = 'Please try again later';
      if (err.response) {
        switch (err.response.status) {
          case 500:
            message = 'Server error, please try again later';
          // case 400: message="Server error, please try again later"
        }
      }
      setDialog({
        ...dialog,
        open: true,
        title: 'Order could not be created',
        message: message,
        actions: [
          {
            label: 'Reload page',
            btn_color: 'primary',
            execute: () => {
              window.location.reload();
            },
          },
          {
            label: 'Close',
            btn_color: 'secondary',
            execute: () => {
              setDialog({ ...dialog, open: false });
            },
          },
        ],
      });
    }

    return;
  };

  const handleSelectProduct = (e, v, r) => {
    if (r === 'selectOption') {
      const product = options.products.find((product) => product._id === v._id);
      setInput({
        ...input,
        product: product,
      });
    }
  };

  const handleChangeMixStatus = (e, v, r, product) => {
    let idx;

    if (!input.status.mix) {
      setInput({
        ...input,
        status: {
          name: 'mixed',
          mix: [
            {
              name: v.name,
              product: product.name,
              value: v,
            },
          ],
        },
      });
      return;
    }

    idx = input.status?.mix?.findIndex((elem) => elem.product == product.name);

    if (idx !== -1) {
      setInput((ipt) => {
        const { status } = ipt;
        const { mix } = status;
        const mixUpdated = [...mix];

        mixUpdated[idx] = {
          ...mix[idx],
          value: v,
        };
        return {
          ...ipt,
          status: {
            ...status,
            name: 'mixed',
            mix: mixUpdated,
          },
        };
      });
    } else {
      setInput({
        ...input,
        status: {
          name: 'mixed',
          mix: [
            ...input.status.mix,
            {
              name: v.name,
              product: product.name,
              value: v,
            },
          ],
        },
      });
    }
  };

  const StatusComponent = (props) => {
    let prod = props.product ? props.product : input.product;
    let tempOpts = options.status.filter((status) => status.selectable);
    let valueForMix =
      input.status?.mix &&
      input.status?.mix.find((elem) => elem.product == prod.name)
        ? input.status?.mix.find((elem) => elem.product == prod.name).value
        : undefined;

    if (
      Object.keys(prod).length > 0 &&
      prod.parameters.day + prod.parameters.night < 10
    ) {
      tempOpts = tempOpts.filter((status) => status.shortCycle);
    }

    return (
      <Autocomplete
        id={`status`}
        options={tempOpts}
        sx={BV_THEME.input.mobile.fullSize.desktop.fullSize}
        renderInput={(params) => {
          const { status } = error;
          return (
            <TextField
              {...params}
              helperText={status.active ? status.message : ''}
              error={status.active}
              label='Status'
            />
          );
        }}
        getOptionLabel={(opt) => (opt.label ? opt.label : '')}
        isOptionEqualToValue={(o, v) => {
          if (!v) {
            return true;
          }

          if (v && Object.keys(v).length === 0) {
            return true;
          }

          return o.name === v.name;
        }}
        onChange={
          props.product
            ? (e, v, r) => handleChangeMixStatus(e, v, r, prod)
            : handleChangeInput
        }
        value={props.product ? valueForMix : input.status}
      />
    );
  };

  useEffect(() => {
    const getData = async () => {
      const customers = await getCustomers();
      const products = await getProducts();
      return { customers: customers.data.data, products: products.data.data };
    };

    getData()
      .then((data) => {
        setOptions((options) => {
          return {
            ...options,
            products: data.products,
            customers: data.customers,
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const validatePackages = () => {
      return Boolean(input.smallPackages) || Boolean(input.mediumPackages);
    };

    const validateProuctAndStatus = () => {
      return (
        Object.keys(input.product).length !== 0 &&
        Object.keys(input.status).length !== 0
      );
    };

    const validateCustomerAndDate = () => {
      return Boolean(input.customer) && Boolean(input.date);
    };

    const validateDeliveryAddress = () => {
      return (
        Boolean(deliveryAddress.street) &&
        Boolean(deliveryAddress.stNumber) &&
        Boolean(deliveryAddress.zip) &&
        Boolean(deliveryAddress.city) &&
        Boolean(deliveryAddress.state) &&
        Boolean(deliveryAddress.country)
      );
    };

    const validProductAndStatus = validateProuctAndStatus();
    const validPackages = validatePackages();
    const validDate = validateCustomerAndDate();
    const validAddress = validateDeliveryAddress();

    if (validDate && validAddress && products.length !== 0) {
      setCanSendOrder(() => {
        return true;
      });
    }
    if (validProductAndStatus && validPackages) {
      setCanAddProduct(true);
    } else {
      setCanAddProduct(false);
    }
  }, [
    input.product,
    input.smallPackages,
    input.mediumPackages,
    input.size,
    input.customer,
    input.date,
    deliveryAddress,
    products,
  ]);

  return (
    <>
      <Fade in={true} timeout={1000} unmountOnExit>
        <Box sx={{ width: '100%', height: '100%' }}>
          {/* DIALOG */}
          <UserDialog
            title={dialog.title}
            content={dialog.message}
            dialog={dialog}
            setDialog={setDialog}
            actions={dialog.actions}
            open={dialog.open}
          />

          {/* NEW ORDER CONTENT */}
          <Container maxWidth='xl' sx={{ padding: '2%' }}>
            {/* TITLE */}
            <Typography
              variant='h4'
              color='secondary'
              textAlign='center'
              margin={BV_THEME.margin.mainHeader}
            >
              NEW ORDER SETTINGS
            </Typography>

            {/* SCREEN DIVIDER */}
            <Grid container spacing={2}>
              {/* LEFT SIDE */}
              <Grid item xs={12} md={6}>
                {/* PRODUCTS */}
                <Paper
                  elevation={4}
                  sx={{
                    padding: BV_THEME.spacing(2),
                    minHeight: '40vh',
                  }}
                >
                  {/* PRODUCTS HEADER */}
                  <Box>
                    <Typography
                      variant='h6'
                      color='secondary'
                      textAlign='center'
                    >
                      SELECT PRODUCTS
                    </Typography>
                  </Box>

                  {/* PRODUCTS BODY */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    {/* PRODUCTS SELECTION */}
                    <Autocomplete
                      id='product'
                      options={options.products}
                      sx={BV_THEME.input.mobile.fullSize.desktop.fullSize}
                      renderInput={(params) => {
                        const { product } = error;
                        return (
                          <TextField
                            {...params}
                            helperText={product.active ? product.message : ''}
                            error={product.active}
                            label='Product'
                          />
                        );
                      }}
                      getOptionLabel={(opt) => (opt.name ? opt.name : '')}
                      isOptionEqualToValue={(o, v) => {
                        if (Object.keys(v).length === 0) {
                          return true;
                        }
                        return o.name === v.name;
                      }}
                      onChange={handleSelectProduct}
                      value={
                        Object.keys(input.product) !== 0
                          ? input.product
                          : undefined
                      }
                    />

                    {/* STATUS SELECTION (MIX AND NORMAL) */}

                    {Object.keys(input.product).length > 0 &&
                    input.product.mix.isMix ? (
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant='subtitle1'
                          color='secondary'
                          marginY={1}
                        >
                          MIX PRODUCTS STATUSES
                        </Typography>
                        <Box
                          sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          {input.product.mix.products.map((product) => {
                            let tempProd = options.products.find(
                              (prod) => prod._id === product.strain
                            );

                            return (
                              <Box
                                sx={{
                                  width: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                }}
                              >
                                <Typography
                                  variant='subtitle1'
                                  color='secondary'
                                  marginY={1}
                                >
                                  {tempProd.name}
                                </Typography>
                                <StatusComponent product={tempProd} />
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    ) : (
                      <StatusComponent />
                    )}

                    {/* NO OF PACKAGES SELECTION */}
                    <Typography
                      variant='subtitle1'
                      color='secondary'
                      marginY={1}
                      textAlign='center'
                    >
                      NO. OF PACKAGES
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <TextField
                        id='smallPackages'
                        type='number'
                        label='25 gr'
                        placeholder='Quantity'
                        sx={BV_THEME.input.mobile.thirdSize.desktop.thirdSize}
                        onChange={(e) =>
                          handleChangeInput(e, e.target.value, 'input')
                        }
                        inputProps={{ min: '0', step: '1', pattern: '\\d+' }}
                        helperText={
                          error.smallPackages.active
                            ? error.smallPackages.message
                            : ''
                        }
                        error={error.smallPackages.active}
                        value={input.smallPackages ? input.smallPackages : ''}
                      />
                      <TextField
                        id='mediumPackages'
                        type='number'
                        label='80 gr'
                        placeholder='Quantity'
                        sx={BV_THEME.input.mobile.thirdSize.desktop.thirdSize}
                        onChange={(e) =>
                          handleChangeInput(e, e.target.value, 'input')
                        }
                        inputProps={{ min: '0', step: '1', pattern: '\\d+' }}
                        helperText={
                          error.mediumPackages.active
                            ? error.mediumPackages.message
                            : ''
                        }
                        error={error.mediumPackages.active}
                        value={input.mediumPackages ? input.mediumPackages : ''}
                      />
                    </Box>

                    {/* BUTTON TO ADD PRODUCT TO ORDER */}
                    <Button
                      id='add'
                      variant='contained'
                      onClick={handleAddToOrder}
                      disabled={!canAddProduct}
                      sx={{
                        marginTop: '1vh',
                        width: '25%',
                        color: { ...BV_THEME.palette.white_btn },
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                </Paper>

                {/* PRODUCTS IN ORDER */}
                <Paper
                  elevation={4}
                  sx={{
                    padding: BV_THEME.spacing(2),
                    minHeight: '25vh',
                    marginTop: '2vh',
                  }}
                >
                  {/* PRODUCTS IN ORDER HEADER */}
                  <Typography
                    variant='h6'
                    color='secondary'
                    sx={{ textAlign: 'center' }}
                  >
                    PRODUCTS IN ORDER
                  </Typography>

                  {/* LIST OF PRODUCTS */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: '13vh',
                    }}
                  >
                    {products.length != 0 ? (
                      <Box
                        sx={{
                          display: 'inline-block',
                          minWidth: '22em',
                          textAlign: 'justify',
                          alignItems: 'center',
                          padding: '5px',
                        }}
                      >
                        <div style={{ maxHeight: '25vh', overflowY: 'auto' }}>
                          <table
                            style={{
                              width: '100%',
                              textAlign: 'center',
                            }}
                          >
                            <thead>
                              <tr>
                                <th>
                                  <Typography variant='subtitle1'>
                                    Name
                                  </Typography>
                                </th>
                                <th>
                                  <Typography variant='subtitle1'>
                                    Status
                                  </Typography>
                                </th>
                                <th>
                                  <Typography variant='subtitle1'>
                                    25gr
                                  </Typography>
                                </th>
                                <th>
                                  <Typography variant='subtitle1'>
                                    80gr
                                  </Typography>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {getContextProducts().map((product, id) => {
                                return (
                                  <tr key={id} style={{ textAlign: 'center' }}>
                                    <td>
                                      <Typography>{product.name}</Typography>
                                    </td>
                                    <td>
                                      <Typography sx={{ mx: 2 }}>
                                        {product.status}
                                      </Typography>
                                    </td>
                                    {product.packages.length > 1 ? (
                                      product.packages.map((pkg, idx) => {
                                        return (
                                          <td
                                            key={idx}
                                            style={{ textAlign: 'center' }}
                                          >
                                            <Typography>
                                              {pkg.number}
                                            </Typography>
                                          </td>
                                        );
                                      })
                                    ) : product.packages[0].size === 'small' ? (
                                      <>
                                        <td style={{ textAlign: 'center' }}>
                                          <Typography>
                                            {product.packages[0].number}
                                          </Typography>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                          <Typography>0</Typography>
                                        </td>
                                      </>
                                    ) : (
                                      <>
                                        <td style={{ textAlign: 'center' }}>
                                          <Typography>0</Typography>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                          <Typography>
                                            {product.packages[0].number}
                                          </Typography>
                                        </td>
                                      </>
                                    )}
                                    <td>
                                      <Tooltip
                                        title={'Delete product from order'}
                                        arrow
                                      >
                                        <IconButton
                                          variant='contained'
                                          color='error'
                                          onClick={() =>
                                            handleDeleteProduct(product)
                                          }
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <HeartBrokenIcon color='primary' fontSize='large' />
                        <Typography marginTop={2} textAlign='center'>
                          There is not any product added to the order
                        </Typography>
                        <Typography textAlign='center'>
                          Add one on the section above!
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* RIGHT SIDE */}
              <Grid item xs={12} md={6}>
                {/* DELIVERY DATA SECTION */}
                <Paper
                  elevation={4}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* RIGTH TITLE */}
                  <Typography
                    variant='h6'
                    color='secondary'
                    sx={{
                      paddingTop: BV_THEME.spacing(2),
                      paddingLeft: BV_THEME.spacing(2),
                      textAlign: 'center',
                    }}
                  >
                    DELIVERY DATA
                  </Typography>
                  <Box
                    elevation={4}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-evenly',
                      height: '100%',
                      padding: BV_THEME.spacing(2),
                    }}
                  >
                    {/* UP SECTION */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingX: '1vh',
                        maxWidth: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                        }}
                      >
                        {/* CUSTOMER */}
                        <Autocomplete
                          id='customer'
                          options={options.customers}
                          sx={() => ({
                            ...BV_THEME.input.mobile.fullSize.desktop.fullSize,
                          })}
                          renderInput={(params) => {
                            const { customer } = error;
                            return (
                              <TextField
                                {...params}
                                label='Customer'
                                helperText={
                                  customer.active ? customer.message : ''
                                }
                                error={customer.active}
                              />
                            );
                          }}
                          onChange={handleChangeInput}
                          getOptionLabel={(opt) => (opt.name ? opt.name : '')}
                          value={input.customer ? input.customer : undefined}
                        />

                        {/* CALENDAR */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label='Select a date'
                            onChange={handleChangeDate}
                            renderInput={(params) => {
                              const { date } = error;
                              return (
                                <TextField
                                  {...params}
                                  helperText={date.active ? date.message : ''}
                                  error={date.active}
                                />
                              );
                            }}
                            value={input.date}
                            sx={() => ({
                              ...BV_THEME.input.mobile.fullSize.desktop
                                .fullSize,
                            })}
                            disablePast={true}
                          />
                        </LocalizationProvider>
                      </Box>

                      {/* CHECKBOX CICLIC */}
                      <FormControl>
                        <FormControlLabel
                          control={
                            <Checkbox
                              id='cyclic'
                              checked={input.cyclic}
                              onChange={(e) =>
                                handleChangeInput(e, e.target.checked, 'input')
                              }
                            />
                          }
                          label='Cyclic order'
                        />
                      </FormControl>
                      {input.cyclic && (
                        <DateRangePicker
                          startDate={startDate}
                          endDate={endDate}
                          onStartDateChange={handleStartDateChange}
                          onEndDateChange={handleEndDateChange}
                        />
                      )}
                    </Box>
                    {/* DOWN SECTION */}
                    {/* DELIVERY ADDRESS */}
                    <Box
                      sx={{
                        flex: 1,
                        paddingX: '1vh',
                        maxWidth: '100%',
                      }}
                    >
                      {/* SUBTITLE */}
                      <Box
                        sx={{
                          mt: '2vh',
                          textAlign: 'center',
                          display: 'flex',
                          justifyContent: 'center',
                          alignContent: 'center',
                        }}
                      >
                        <Typography
                          variant='subtitle1'
                          color='secondary'
                          sx={{ my: '10px', flexGrow: 1 }}
                        >
                          DELIVERY ADDRESS
                        </Typography>
                        <Tooltip
                          title={
                            sameCustomerAddress
                              ? 'Click to input other address'
                              : 'Click to use customer address'
                          }
                          arrow
                        >
                          <IconButton
                            onClick={useSameCustomerAddress}
                            color={sameCustomerAddress ? 'error' : 'primary'}
                          >
                            {sameCustomerAddress ? (
                              <PersonAddDisabledIcon />
                            ) : (
                              <PersonAddIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Divider
                        variant='middle'
                        sx={{
                          width: '98%',
                          marginY: '1vh',
                        }}
                      />
                      {/* ADDRESS INPUTS */}
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <TextField
                          name='street'
                          onChange={handleDeliveryAddress}
                          value={deliveryAddress?.street}
                          label='Street'
                          sx={() => ({
                            ...BV_THEME.input.mobile.fullSize.desktop.halfSize,
                          })}
                          disabled={sameCustomerAddress}
                        />
                        <Box sx={{ width: '50%', display: 'flex' }}>
                          <TextField
                            name='stNumber'
                            onChange={handleDeliveryAddress}
                            value={deliveryAddress?.stNumber}
                            label='No.'
                            type='number'
                            sx={() => ({
                              ...BV_THEME.input.mobile.fullSize.desktop
                                .halfSize,
                            })}
                            disabled={sameCustomerAddress}
                          />
                          <TextField
                            name='zip'
                            onChange={handleDeliveryAddress}
                            value={deliveryAddress?.zip}
                            label='ZipCode'
                            type='text'
                            sx={() => ({
                              ...BV_THEME.input.mobile.fullSize.desktop
                                .halfSize,
                            })}
                            disabled={sameCustomerAddress}
                          />
                        </Box>
                      </Box>
                      <TextField
                        name='city'
                        onChange={handleDeliveryAddress}
                        value={deliveryAddress?.city}
                        label='City'
                        sx={() => ({
                          ...BV_THEME.input.mobile.fullSize.desktop.halfSize,
                        })}
                        disabled={sameCustomerAddress}
                      />
                      <TextField
                        name='state'
                        onChange={handleDeliveryAddress}
                        value={deliveryAddress?.state}
                        label='State'
                        sx={() => ({
                          ...BV_THEME.input.mobile.fullSize.desktop.halfSize,
                        })}
                        disabled={sameCustomerAddress}
                      />
                      <TextField
                        name='country'
                        onChange={handleDeliveryAddress}
                        value={deliveryAddress?.country}
                        label='Country'
                        sx={() => ({
                          ...BV_THEME.input.mobile.fullSize.desktop.halfSize,
                        })}
                        disabled={sameCustomerAddress}
                      />
                      <TextField
                        name='references'
                        onChange={handleDeliveryAddress}
                        value={deliveryAddress?.references}
                        multiline
                        label='References'
                        sx={() => ({
                          ...BV_THEME.input.mobile.fullSize.desktop.halfSize,
                        })}
                        disabled={sameCustomerAddress}
                      />
                      {/* HACK: Uncomment if the latitude and longitude are necessary  */}
                      {/* <TextField
                        name='latitude'
                        onChange={handleDeliveryAddress}
                        value={deliveryAddress?.coords?.latitude}
                        label='Latitude'
                        type='number'
                        sx={() => ({
                          ...BV_THEME.input.mobile.fullSize.desktop.halfSize,
                        })}
                        disabled={sameCustomerAddress}
                      />
                      <TextField
                        name='longitude'
                        onChange={handleDeliveryAddress}
                        value={deliveryAddress?.coords?.longitude}
                        label='Longitude'
                        type='number'
                        sx={() => ({
                          ...BV_THEME.input.mobile.fullSize.desktop.halfSize,
                        })}
                        disabled={sameCustomerAddress}
                      /> */}

                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {/* CREATE ORDER BUTTON */}
                        <Button
                          id='accept'
                          variant='contained'
                          onClick={handleSetOrder}
                          disabled={!canSendOrder}
                          sx={{
                            marginTop: '1vh',
                            width: '25%',
                            color: { ...BV_THEME.palette.white_btn },
                          }}
                        >
                          Set Order
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>

          {/* SNACKBAR */}
          <Snackbar
            open={open}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={5000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity='success'
              sx={{ width: '100%' }}
            >
              Order generated succesfully!
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </>
  );
};
