import { request } from "../utils/helpers/requestsHelper";

const useTasks =  (headers) => {

  const getTaskHistory = async (startDate, endDate) => {
    return await request('GET',`tasks/history/?date=${startDate}&endDate=${endDate}`, headers);
  };

  const stopBackgroundJob = async (jobId, jobData) => {
    return await request('POST',`backgroundJobs/stopJob/${jobId}`, headers, {data: jobData});
  };

  return {
    getTaskHistory,
    stopBackgroundJob,
  }

};

export default useTasks;
