import { request } from "../utils/helpers/requestsHelper";

const useDelivery =  (headers) => {

  const getDeliveryPacksOrders = async () => {
    return await request('GET',`delivery/packs/orders`, headers);
  };

  const getRoutesOrders = async () => {
    return await request('GET',`delivery/routes/orders`, headers);
  };


  return {
    getDeliveryPacksOrders,
    getRoutesOrders,
  }

};

export default useDelivery;
