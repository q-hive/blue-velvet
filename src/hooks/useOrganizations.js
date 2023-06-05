import { request } from "../utils/helpers/requestsHelper";
import useAuth from "../contextHooks/useAuthContext";

const useOrganizations =  () => {

  const { user, credential } = useAuth()

  const headers = {
    headers:{
      authorization: credential._tokenResponse.idToken,
      user: user
    }
  }

  const getOrganizations = async () => {
    return await request('GET','organizations/', {headers: headers});
  };

  const getOrganization = async (id) => {
    return await request('GET',`organizations/${id}`, {headers: headers});
  };

  const createOrganization = async (mappedOrganizationData) => {
    return await request('POST',`auth/create/admin`, {headers: headers, data: mappedOrganizationData, api:false});
  };

  const updateOrganization = async (id, mappedOrganizationData) => {
    return await request('PUT',`organizations/${id}`, {headers: headers, data: mappedOrganizationData});
  };

  const deleteOrganization = async (id) => {
    return await request('DELETE',`organizations/${id}`, {headers: headers});
  };

  return {
    getOrganizations,
    getOrganization,
    createOrganization,
    updateOrganization,
    deleteOrganization
  }

};

export default useOrganizations;
