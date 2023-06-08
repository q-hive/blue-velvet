import { request } from "../utils/helpers/requestsHelper";

const useWork =  (headers) => {

  const updateTaskHistory = async (taskHistoryModel, header=headers) => {
    return await request('PATCH',`work/taskHistory`, header, {data: taskHistoryModel });
  };

  const updateProduction = async (containerId, productionModelsIds, header=headers) => {
    return await request('PATCH',`work/production/${containerId}`, header, {data: productionModelsIds });
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
    getWorkTimeByContainer,
    updateUserPerformance,
    updateWorkDay
  }

};

export default useWork;
