import { request } from "../utils/helpers/requestsHelper";

const useFiles = (headers) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const getOrderInvoiceById = async (id) => {
    return await request('GET', `files/order/invoice/${id}`, headers);
  };

  const getMonthlyInvoicesByCustomerId = async (id) => {
    return await request('GET', `files/orders/invoice/bydate/month/${id}`, headers);
  };


  return {
    getOrderInvoiceById,
    getMonthlyInvoicesByCustomerId,
  }

};

export default useFiles;
