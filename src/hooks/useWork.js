import { request } from "../utils/helpers/requestsHelper";

const useWork =  (headers) => {

  const updateTaskHistory = async (taskHistoryModel, header=headers) => {
    return await request('PATCH',`work/taskHistory`, header, {data: taskHistoryModel });
  };

  const updateProduction = async (containerId, productionModelsIds, actualStatus, header=headers) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return await request('PATCH',`work/production/${containerId}?tz=${userTimeZone}`, header, {data: {productionModelsIds, actualStatus} });
  };

  const deliveryOneOrder = async (containerId, orderId) => {
    // Change the order, the order products and the production model on status 'delivered' (Create other if it`s cyclic)
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return await request('PATCH', `work/production/${containerId}/${orderId}?tz=${userTimeZone}`, headers);
  };

  const getWorkTimeByContainer = async (userId, containerId) => {
    return await request('GET',`work/time/${userId}?containerId=${containerId}`, headers);
  };

  const updateUserPerformance = async (userId, performance) => {
    return await request('PATCH',`work/performance/${userId}`, headers, {data: performance});
  };

  const updateWorkDay = async (userId, containerId, info, header=headers) => {
    return await request('PATCH',`work/workday/${userId}/${containerId}?delete=true`, header, {data: info});
  };

  return {
    updateTaskHistory,
    updateProduction,
    deliveryOneOrder,
    getWorkTimeByContainer,
    updateUserPerformance,
    updateWorkDay
  }

};

export default useWork;
