import { request } from "../utils/helpers/requestsHelper";

const useCustomers =  (headers) => {

  const addCustomer = async (mappedCustomer) => {
    return await request('POST',`customers/`, headers, {data: mappedCustomer});
  };

  const updateCustomer = async (id, mappedCustomer) => {
    return await request('PATCH',`customers/${id}`, headers, {data: mappedCustomer});
  };

  const getCustomers = async () => {
    return await request('GET',`customers/`, headers);
  };

  const getCustom = async (id) => {
    return await request('GET',`customers/${id}`, headers);
  };

  return {
    addCustomer,
    updateCustomer,
    getCustomers,
    getCustom,
  }

};

export default useCustomers;
