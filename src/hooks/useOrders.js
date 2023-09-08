import { request } from "../utils/helpers/requestsHelper";

const useOrders =  (headers) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const addOrder = async (orderData) => {
    return await request('POST',`orders/?tz=${userTimeZone}`, headers, {data: orderData});
  };

  const updateOrder = async (orderId, orderData) => {
    return await request('PATCH',`orders/one/${orderId}`, headers, {data: orderData});
  };

  const getOrders = async () => {
    return await request('GET',`orders/`, headers);
  };

  const getUncompletedOrders = async () => {
    return await request('GET',`orders/uncompleted`, headers);
  };

  const deleteOrder = async (id) => {
    return await request('DELETE',`orders/custom/?key=_id&&value=${id}`, headers);
  };

  const getCustomerOrderInvoices = async (customerId) => {
    return await request('GET',`orders/invoices/${customerId}`, headers);
  };

  const updateInvoicePay = async (invoiceId, invoiceData) => {
    return await request('PATCH',`orders/invoices/pay/${invoiceId}?payed=true`, headers, {data: invoiceData});
  };

  return {
    addOrder,
    updateOrder,
    getOrders,
    getUncompletedOrders,
    deleteOrder,
    getCustomerOrderInvoices,
    updateInvoicePay,
  }

};

export default useOrders;
