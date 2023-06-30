import { request } from "../utils/helpers/requestsHelper";

const useProduction =  (headers) => {

  const getContainerWorkDayProduction = async (containerId) => {
    return await request('GET',`production/workday?containerId=${containerId}`, headers);
  };

  const getGrowingStatus = async (containerId) => {
    return await request('GET',`production/status/growing?containerId=${containerId}`, headers);
  };

  const getOrderProduction = async (containerId, orderId) => {
    return await request('GET',`production/${containerId}/${orderId}`, headers);
  };

  const addOrderProduction = async (containerId, productionModelData) => {
    return await request('POST',`production/${containerId}`, headers, {data: productionModelData});
  };

  const updateOrderProduction = async (containerId, productionModelData) => {
    return await request('PATCH',`production/${containerId}`, headers, {data: productionModelData});
  };

  const deleteOrderProduction = async (containerId, productionData) => {
    return await request('DELETE',`production/${containerId}`, headers, {data: productionData});
  };

  return {
    getContainerWorkDayProduction,
    getGrowingStatus,
    getOrderProduction,
    addOrderProduction,
    updateOrderProduction,
    deleteOrderProduction
  }

};

export default useProduction;
