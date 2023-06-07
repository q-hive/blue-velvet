import axios from "axios";

const request = async function (method, endpoint, headers, {data={}, api=true}={}) {

  const hosts = ['http://localhost:9999', "https://bluevelvetdeploy.herokuapp.com"];
  const apiVersion = '/api/v1';

  let url = `${hosts[process.env.REACT_APP_HOST_ORIGIN ?? 1]}`;

  if (api) url += apiVersion;

  return await axios({
    method: method,
    url: `${url}/${endpoint}`,
    data,
    headers,
    withCredentials: true
  });
};

export { request };
