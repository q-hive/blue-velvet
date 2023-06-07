import { request } from "../utils/helpers/requestsHelper";

const useProduction =  (headers) => {

  const getContainerWorkDayProduction = async (containerId) => {
    return await request('GET',`production/workday?containerId=${containerId}`, headers);
  };

  const getGrowingStatus = async (containerId) => {
    return await request('GET',`production/status/growing?containerId=${containerId}`, headers);
  };


  return {
    getContainerWorkDayProduction,
    getGrowingStatus,
  }

};

export default useProduction;
