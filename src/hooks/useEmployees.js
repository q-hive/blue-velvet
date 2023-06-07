import { request } from "../utils/helpers/requestsHelper";

const useEmployees =  (headers) => {

  const getEmployees = async () => {
    return await request('GET',`employees/`, headers);
  };

  const addEmployee = async (mappedEmployeeData) => {
    return await request('POST',`auth/create/employee`, headers, {data: mappedEmployeeData, api: false});
  };

  const getEmployee = async (id) => {
    return await request('GET',`employees/${id}`, headers);
  };

  const deleteEmployeeById = async (id) => {
    return await request('DELETE',`employees/${id}`, headers);
  };

  const getWorkDayAnalytics = async () => {
    return await request('GET',`employees/analytics/workday`, headers);
  };

  return {
    getEmployees,
    addEmployee,
    getEmployee,
    deleteEmployeeById,
    getWorkDayAnalytics,
  }

};

export default useEmployees;
