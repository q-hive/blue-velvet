import { request } from "../utils/helpers/requestsHelper";

const useOrganizations =  (headers) => {

  const getOrganizations = async () => {
    return await request('GET','organizations/', headers);
  };

  const getOrganization = async (id) => {
    return await request('GET',`organizations/${id}`, headers);
  };

  const getAllUsers = async (orgId) => {
    return await request('GET', `organizations/${orgId}/allUsers`, headers);
  };

  const createOrganization = async (mappedOrganizationData) => {
    return await request('POST',`auth/create/admin`, headers, {data: mappedOrganizationData, api:false});
  };

  const updateOrganization = async (id, mappedOrganizationData) => {
    return await request('PUT',`organizations/${id}`, headers, {data: mappedOrganizationData});
  };

  const deleteOrganization = async (id) => {
    return await request('DELETE',`organizations/${id}`, headers);
  };

  return {
    getOrganizations,
    getOrganization,
    getAllUsers,
    createOrganization,
    updateOrganization,
    deleteOrganization
  }

};

export default useOrganizations;
