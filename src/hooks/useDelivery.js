import { request } from "../utils/helpers/requestsHelper";

const useDelivery =  (headers) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const getDeliveryPacksOrders = async () => {
    return await request('GET',`delivery/packs/orders?tz=${userTimeZone}`, headers);
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
