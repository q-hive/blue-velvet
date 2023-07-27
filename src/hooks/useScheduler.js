import { request } from "../utils/helpers/requestsHelper";

const useScheduler = (headers) => {

  const getSchedulesByCriteria = async (orderId, productId = null) => {
    return await request('GET', `scheduler/?orderId=${orderId}${productId ? `&productId=${productId}` : ''}`, headers);
  };

  return {
    getSchedulesByCriteria,
  }

};

export default useScheduler;
