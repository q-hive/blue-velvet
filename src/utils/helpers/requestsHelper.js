import axios from "axios";

const request = async function (method, endpoint, {headers, data={}, api=true}={}) {

  const hosts = ['http://localhost:9999', "https://bluevelvetdeploy.herokuapp.com"];
  const apiVersion = '/api/v1';
  const access_token = true; // TODO: Get access token

  let url = `${hosts[process.env.REACT_APP_HOST_ORIGIN ?? 1]}`;

  const newHeaders = {
    headers: {
      'Content-Type': 'application/json',
      authorization: headers?.headers.authorization || '',
      user: headers?.headers.user || '',
    }
  }

  if (access_token) newHeaders.Authorization = `Bearer ${access_token}`;

  if (api) url += apiVersion;

  return await axios({
    method: method,
    url: `${url}/${endpoint}`,
    data,
    headers: newHeaders,
    withCredentials: true
  });
};

export { request };
