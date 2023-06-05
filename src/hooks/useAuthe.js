import { request } from "../utils/helpers/requestsHelper"; 

const useAuthe =  () => {

  const login = async (loginData, role='') => {
    let endpoint = "auth/login/";
    if (role) endpoint+=role;
    return await request('POST',endpoint,{data: loginData, api:false});
  };

  return {
    login,
  }

};

export default useAuthe;