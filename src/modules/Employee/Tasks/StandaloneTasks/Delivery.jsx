import React, { useState, useEffect } from 'react';
import {
  Fade,
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Select,
  MenuItem,
  Button,
  Modal,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { List, ViewModule } from '@mui/icons-material';
import useAuth from '../../../../contextHooks/useAuthContext';
import useOrders from '../../../../hooks/useOrders';
import useCustomers from '../../../../hooks/useCustomers';
import { UserDialog } from '../../../../CoreComponents/UserFeedback/Dialog';
import { BV_THEME } from '../../../../theme/BV-theme';

const DetailedOrders = ({ orders, customers, handleMarkAsDelivered }) => {
  return (
    <Container maxWidth='xl' sx={{ paddingY: BV_THEME.spacing(2) }}>
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid key={order._id} item xs={12} md={6} lg={4}>
            <Paper elevation={4} sx={{ padding: BV_THEME.spacing(2) }}>
              <Grid container spacing={2}>
                {/* Top / Top Left */}
                <Grid item xs={6} md={12}>
                  <Typography variant='subtitle1'>
                    <b>Delivery Address:</b>
                  </Typography>
                  <Typography variant='body1'>
                    {order.address.street}, No. {order.address.stNumber}
                  </Typography>
                  <Typography variant='body1'>
                    {order.address.city}, {order.address.state},{' '}
                    {order.address.country}
                  </Typography>
                </Grid>

                {/* Middle / Top Right */}
                <Grid item xs={6} md={12}>
                  <Typography variant='subtitle1'>
                    <b>Income:</b> ${order.price}
                  </Typography>
                  <Typography variant='subtitle1'>
                    <b>Status:</b> {order.status}
                  </Typography>
                  <Typography variant='subtitle1'>
                    <b>Customer:</b>{' '}
                    {customers.find((c) => c._id === order.customer)?.name}
                  </Typography>
                  <Typography variant='subtitle1'>
                    <b>Delivery date:</b>{' '}
                    {new Date(order.date).toLocaleDateString()}
                  </Typography>
                </Grid>

                {/* Bottom */}
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <div
                    style={{
                      overflowX: 'auto',
                      width: '100%',
                      maxHeight: 300,
                      marginTop: 8,
                    }}
                  >
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        borderSpacing: '0 8px',
                      }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              borderBottom: '1px solid black',
                              padding: '8px',
                            }}
                          >
                            Product
                          </th>
                          <th
                            style={{
                              borderBottom: '1px solid black',
                              padding: '8px',
                            }}
                          >
                            Status
                          </th>
                          <th
                            style={{
                              borderBottom: '1px solid black',
                              padding: '8px',
                            }}
                          >
                            25gr
                          </th>
                          <th
                            style={{
                              borderBottom: '1px solid black',
                              padding: '8px',
                            }}
                          >
                            80gr
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.products.map((product) => (
                          <tr key={product._id}>
                            <td
                              style={{
                                borderBottom: '1px solid black',
                                padding: '8px',
                              }}
                            >
                              {product.name}
                            </td>
                            <td
                              style={{
                                borderBottom: '1px solid black',
                                padding: '8px',
                              }}
                            >
                              {product.status}
                            </td>
                            <td
                              style={{
                                borderBottom: '1px solid black',
                                padding: '8px',
                              }}
                            >
                              {product.packages.find(
                                (pkg) => pkg.size === 'small'
                              )?.number || 0}
                            </td>
                            <td
                              style={{
                                borderBottom: '1px solid black',
                                padding: '8px',
                              }}
                            >
                              {product.packages.find(
                                (pkg) => pkg.size === 'medium'
                              )?.number || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button
                    variant='outlined'
                    sx={{ mt: 2 }}
                    onClick={() => handleMarkAsDelivered(order)}
                  >
                    Mark as delivered
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const SimpleOrders = ({ orders, customers, handleMarkAsDelivered }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productsModalOpen, setProductsModalOpen] = useState(false);

  const handleProductsModalOpen = (order) => {
    setSelectedOrder(order);
    setProductsModalOpen(true);
  };

  const handleProductsModalClose = () => {
    setSelectedOrder(null);
    setProductsModalOpen(false);
  };

  return (
    <Container
      maxWidth='xl'
      sx={{
        py: BV_THEME.spacing(2),
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <table
        style={{
          width: '80%',
          borderCollapse: 'collapse',
          borderSpacing: '0 8px',
          textAlign: 'center',
        }}
      >
        <thead>
          <tr>
            <th>Delivery date</th>
            <th>Customer</th>
            <th>Income</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{new Date(order.date).toLocaleDateString()}</td>
              <td>{customers.find((c) => c._id === order.customer)?.name}</td>
              <td>{order.price}</td>
              <td>{order.status}</td>
              <td>
                <Button
                  variant='outlined'
                  onClick={() => handleProductsModalOpen(order)}
                >
                  Details
                </Button>
                <Button
                  variant='outlined'
                  onClick={() => handleMarkAsDelivered(order)}
                >
                  Delivery
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={productsModalOpen} onClose={handleProductsModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            bgcolor: 'white',
            borderRadius: 8,
            p: 4,
          }}
        >
          {selectedOrder && (
            <>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant='h6'>
                  <b>Products</b>
                </Typography>
              </Box>
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  overflow: 'auto',
                }}
              >
                <table
                  style={{
                    width: '80%',
                    borderCollapse: 'collapse',
                    borderSpacing: '0 8px',
                    textAlign: 'center',
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          borderBottom: '1px solid black',
                          padding: '8px',
                        }}
                      >
                        Product
                      </th>
                      <th
                        style={{
                          borderBottom: '1px solid black',
                          padding: '8px',
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          borderBottom: '1px solid black',
                          padding: '8px',
                        }}
                      >
                        25gr
                      </th>
                      <th
                        style={{
                          borderBottom: '1px solid black',
                          padding: '8px',
                        }}
                      >
                        80gr
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.products.map((product) => (
                      <tr key={product._id}>
                        <td
                          style={{
                            borderBottom: '1px solid black',
                            padding: '8px',
                          }}
                        >
                          {product.name}
                        </td>
                        <td
                          style={{
                            borderBottom: '1px solid black',
                            padding: '8px',
                          }}
                        >
                          {product.status}
                        </td>
                        <td
                          style={{
                            borderBottom: '1px solid black',
                            padding: '8px',
                          }}
                        >
                          {product.packages.find((pkg) => pkg.size === 'small')
                            ?.number || 0}
                        </td>
                        <td
                          style={{
                            borderBottom: '1px solid black',
                            padding: '8px',
                          }}
                        >
                          {product.packages.find((pkg) => pkg.size === 'medium')
                            ?.number || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant='h6'>
                  <b>Delivery Address</b>
                </Typography>
                <Typography variant='body1' sx={{ mb: 1 }}>
                  {`${selectedOrder.address.street}, No. ${selectedOrder.address.stNumber}, ${selectedOrder.address.city}, ${selectedOrder.address.state}, ${selectedOrder.address.country}, Zip Code: ${selectedOrder.address.zip}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant='outlined'
                  onClick={() => handleMarkAsDelivered(selectedOrder)}
                >
                  Mark as delivered
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export const DeliveryComponent = () => {
  const { user, credential } = useAuth();
  let headers = {
    authorization: credential._tokenResponse.idToken,
    user: user,
  };
  const { getOrders } = useOrders(headers);
  const { getCustomers } = useCustomers(headers);
  const [activeOrders, setActiveOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orderBy, setOrderBy] = useState('Delivery Date');
  const [viewMode, setViewMode] = useState('Detailed');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialog, setDialog] = useState({
    open: false,
    title: '',
    message: '',
    actions: [],
  });

  useEffect(() => {
    getOrders()
      .then((res) => {
        const activeStatus = ['harvestReady', 'packing', 'ready'];
        const activeOrdersAPI = res.data.data.filter((order) =>
          activeStatus.includes(order.status)
        );
        setActiveOrders(activeOrdersAPI);
        console.log('[ORDERS]', activeOrdersAPI);
      })
      .catch((err) => {
        console.log(err);
        setDialog({
          ...dialog,
          open: true,
          title: 'Error getting orders',
          message: 'Please try again',
          actions: [
            {
              label: 'Ok',
              execute: () => window.location.reload(),
            },
          ],
        });
      });
    getCustomers()
      .then((res) => {
        setCustomers(res.data.data);
        console.log('[CUSTOMERS]', res.data.data);
      })
      .catch((err) => {
        console.log(err);
        setDialog({
          ...dialog,
          open: true,
          title: 'Error getting customers',
          message: 'Please try again later',
          actions: [
            {
              label: 'Ok',
              execute: () => window.location.reload(),
            },
          ],
        });
      });
  }, []);

  const groupOrders = (orders) => {
    const groupedOrders = {};

    orders.forEach((order) => {
      const groupKey =
        orderBy === 'Delivery Date'
          ? new Date(order.date).toLocaleDateString()
          : customers.find((c) => c._id === order.customer)?.name;
      if (!groupedOrders[groupKey]) {
        groupedOrders[groupKey] = [];
      }
      groupedOrders[groupKey].push(order);
    });

    return groupedOrders;
  };

  const sortOrders = (orders) => {
    if (orderBy === 'Delivery Date') {
      return orders.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (orderBy === 'Customer') {
      return orders.sort((a, b) => a.customer.localeCompare(b.customer));
    }
    return orders;
  };

  // Group and sort the active orders
  const groupedAndSortedOrders = groupOrders(sortOrders(activeOrders));

  const calculateDaysLeft = (groupKey) => {
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const groupKeyDate = new Date(groupKey).setHours(0, 0, 0, 0);
    const daysDiff = Math.floor(
      (groupKeyDate - currentDate) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 1) return 'Tomorrow';
    if (daysDiff > 1) return `${daysDiff} days left`;
    if (daysDiff === 0) return 'Today';
    return 'Date has already passed';
  };

  const handleViewChange = (_, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const handleMarkAsDelivered = (order) => {
    setSelectedOrder(order);
    setDialog({
      ...dialog,
      open: true,
      title: 'Order updated',
      message: 'The order has been marked as delivered',
      actions: [
        {
          label: 'Ok',
          execute: () => window.location.reload(),
        },
      ],
    });
  };

  return (
    <>
      <Fade in={true} timeout={1000} unmountOnExit>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            width: '100%',
            marginTop: '5vh',
          }}
        >
          <Typography variant='h2' color='secondary.dark'>
            Deliveries
          </Typography>

          <Box
            sx={{
              mt: 2,
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              width: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewChange}
                aria-label='View mode switch'
              >
                <ToggleButton value='Simple' aria-label='Simple View'>
                  <List color='secondary' />
                </ToggleButton>
                <ToggleButton value='Detailed' aria-label='Detailed View'>
                  <ViewModule color='secondary' />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='body1' sx={{ mr: 1 }}>
                Order by:
              </Typography>
              <Select
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value='Delivery Date'>Delivery Date</MenuItem>
                <MenuItem value='Customer'>Customer</MenuItem>
              </Select>
            </Box>
          </Box>

          {Object.entries(groupedAndSortedOrders).map(([groupKey, orders]) => (
            <div
              key={groupKey}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                mt: 2,
              }}
            >
              <Typography
                variant='h4'
                color='secondary'
                sx={{ textAlign: 'center', width: '100%', my: 1 }}
              >
                {orderBy === 'Delivery Date'
                  ? `${groupKey} (${calculateDaysLeft(groupKey)})`
                  : `${groupKey}`}
              </Typography>
              {viewMode === 'Detailed' ? (
                <DetailedOrders
                  orders={orders}
                  customers={customers}
                  handleMarkAsDelivered={handleMarkAsDelivered}
                />
              ) : (
                <SimpleOrders
                  orders={orders}
                  customers={customers}
                  handleMarkAsDelivered={handleMarkAsDelivered}
                />
              )}
            </div>
          ))}
        </Box>
      </Fade>

      {/* Modal for "Mark as delivered" */}
      <UserDialog
        title={dialog.title}
        content={dialog.message}
        dialog={dialog}
        setDialog={setDialog}
        actions={dialog.actions}
        open={dialog.open}
      />
    </>
  );
};
