import React, { useEffect, useState } from 'react';
//*MUI Components
import {
  Autocomplete,
  TextField,
  Typography,
  Button,
  Box,
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
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

//*App components
import { BV_THEME } from '../../../../theme/BV-theme';
import { CheckBoxGroup } from '../../../../CoreComponents/CheckboxGroup';

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
    cyclic: false,
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  //*Render states
  const [productsInput, setProductsInput] = useState(true);
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
      console.log('[strlongitude]', value.address?.coords?.longitude);
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

        if (!input.product.mix.isMix) {
          products.push({
            name: input.product.name,
            status: input.status.name,
            seedId: input.product?.seed,
            provider: input.product?.provider,
            _id: input.product._id,
            packages: packages,
          });
        }

        if (input.product.mix.isMix) {
          products.push({
            name: input.product.name,
            status: input.status.name,
            mixStatuses: input.status.mix,
            seedId: input.product?.seed,
            provider: input.product?.provider,
            _id: input.product._id,
            packages: packages,
          });
        }

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

      /*
            if(input.date !== undefined && Object.keys(input.customer).length !== 0){
                
            }
            */
    }
    if (e.target.id === 'test') {
      if (products !== 0) {
        setProductsInput(false);
      }
      return;
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
        setOpen(true);
        products.splice(0, products.length - 1);
        setDialog({
          ...dialog,
          open: true,
          title: 'Order created succesfully',
          message: 'Check the status of the order in the orders section',
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
        sx={BV_THEME.input.mobile.fullSize.desktop.halfSize}
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

    const validateCustomerAndDate = () => {
      return Boolean(input.customer) && Boolean(input.date);
    };

    const validProduct = Object.keys(input.product) !== 0;
    const validPackages = validatePackages();
    const validDate = validateCustomerAndDate();

    if (/* validProduct && validPackages && */ validDate) {
      setCanSendOrder(() => {
        return true;
      });
    }
  }, [
    input.product,
    input.smallPackages,
    input.mediumPackages,
    input.size,
    input.customer,
    input.date,
  ]);

  return (
    <>
      <UserDialog
        title={dialog.title}
        content={dialog.message}
        dialog={dialog}
        setDialog={setDialog}
        actions={dialog.actions}
        open={dialog.open}
      />

      <Fade in={true} timeout={1000} unmountOnExit>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            marginTop: '5vh',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              width: '90%',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'column' },
            }}
            alignItems='center'
            textAlign='center'
          >
            {productsInput ? (
              <>
                <Autocomplete
                  id='product'
                  options={options.products}
                  sx={BV_THEME.input.mobile.fullSize.desktop.halfSize}
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
                    Object.keys(input.product) !== 0 ? input.product : undefined
                  }
                />

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
                    <Typography variant='h5' color='secondary' marginY={3}>
                      Mix products statuses
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
                              variant='h6'
                              color='secondary'
                              marginY={2}
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

                <Typography variant='h5' color='secondary' marginY={3}>
                  No. of Packages
                </Typography>

                <Box>
                  <TextField
                    id='smallPackages'
                    type='number'
                    label='25 gr'
                    placeholder='Quantity'
                    sx={BV_THEME.input.mobile.thirdSize.desktop.quarterSize}
                    onChange={(e) =>
                      handleChangeInput(e, e.target.value, 'input')
                    }
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
                    sx={BV_THEME.input.mobile.thirdSize.desktop.quarterSize}
                    onChange={(e) =>
                      handleChangeInput(e, e.target.value, 'input')
                    }
                    helperText={
                      error.mediumPackages.active
                        ? error.mediumPackages.message
                        : ''
                    }
                    error={error.mediumPackages.active}
                    value={input.mediumPackages ? input.mediumPackages : ''}
                  />
                </Box>

                <Button
                  id='add'
                  sx={{ marginTop: '2vh' }}
                  onClick={handleAddToOrder}
                >
                  Add product
                </Button>

                <Button
                  variant='contained'
                  id='test'
                  onClick={handleSetOrder}
                  disabled={products.length < 1}
                  sx={{
                    marginTop: '2vh',
                    color: { ...BV_THEME.palette.white_btn },
                  }}
                >
                  Select customer and Delivery Date
                </Button>
              </>
            ) : (
              <>
                <Typography variant='h4' mb={{ xs: '5vh', md: '3vh' }}>
                  New order settings
                </Typography>

                <Autocomplete
                  id='customer'
                  options={options.customers}
                  sx={() => ({
                    ...BV_THEME.input.mobile.fullSize.desktop.halfSize,
                  })}
                  renderInput={(params) => {
                    const { customer } = error;
                    return (
                      <TextField
                        {...params}
                        label='Customer'
                        helperText={customer.active ? customer.message : ''}
                        error={customer.active}
                      />
                    );
                  }}
                  onChange={handleChangeInput}
                  getOptionLabel={(opt) => (opt.name ? opt.name : '')}
                  value={input.customer ? input.customer : undefined}
                />

                <Typography variant='h6' mb='1vh' mt='4vh'>
                  Delivery date
                </Typography>
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
                      ...BV_THEME.input.mobile.fullSize.desktop.halfSize,
                    })}
                    disablePast={true}
                    // shouldDisableDate={disableNonAvailableDays}
                    // minDate={calculateMinDate()}
                  />
                </LocalizationProvider>

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

                <Box
                  sx={{
                    width: { xs: '98%', sm: '49%' },
                    mt: '4vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                  }}
                >
                  <Typography variant='h6' sx={{ flexGrow: 1 }}>
                    Delivery address
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
                    width: { xs: '98%', sm: '50%', md: '50%' },
                    marginY: '1vh',
                  }}
                />
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
                <Box sx={{ width: { xs: '98%', sm: '49%' } }}>
                  <TextField
                    name='stNumber'
                    onChange={handleDeliveryAddress}
                    value={deliveryAddress?.stNumber}
                    label='No.'
                    type='number'
                    sx={() => ({
                      ...BV_THEME.input.mobile.fullSize.desktop.halfSize,
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
                      ...BV_THEME.input.mobile.fullSize.desktop.halfSize,
                    })}
                    disabled={sameCustomerAddress}
                  />
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
                <Box sx={{ width: { xs: '98%', sm: '49%' } }}>
                  <TextField
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
                  />
                </Box>

                <Button
                  id='accept'
                  variant='contained'
                  onClick={handleSetOrder}
                  disabled={!canSendOrder}
                  sx={{
                    marginTop: '1vh',
                    color: { ...BV_THEME.palette.white_btn },
                  }}
                >
                  Set Order
                </Button>
              </>
            )}

            {/* Generate Feedback table */}
            {products.length != 0 ? (
              <Box
                sx={{
                  display: 'inline-block',
                  minWidth: '22em',
                  textAlign: 'justify',
                  alignItems: 'center',
                  marginY: '5vh',
                  padding: '3px',
                }}
              >
                <hr color='secondary' />
                <Typography
                  color='secondary'
                  sx={{ textAlign: 'center', marginTop: 1 }}
                >
                  Products in Order
                </Typography>

                <table
                  style={{
                    marginTop: '1vh',
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  <thead>
                    <tr>
                      <th>
                        <Typography variant='subtitle1'>Name</Typography>
                      </th>
                      <th>
                        <Typography variant='subtitle1'>Status</Typography>
                      </th>
                      <th>
                        <Typography variant='subtitle1'>Small</Typography>
                      </th>
                      <th>
                        <Typography variant='subtitle1'>Medium</Typography>
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
                                <td key={idx} style={{ textAlign: 'center' }}>
                                  <Typography>{pkg.number}</Typography>
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
                            <Button
                              variant='contained'
                              color='error'
                              onClick={() => handleDeleteProduct(product)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Box>
            ) : null}
          </Box>
        </Box>
      </Fade>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
          Order generated succesfully!
        </Alert>
      </Snackbar>
    </>
  );
};
