import axios from 'axios'

const hosts = ['http://localhost:9999', "https://bluevelvetdeploy.herokuapp.com"]

const apiVersion = '/api/v1'

const api = axios.create({
    baseURL:hosts[process.env.REACT_APP_HOST_ORIGIN] || 1,
    headers:{
        "Content-Type":"application/json"
    },
    withCredentials:true
})

const updateToken = (token) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`    
}


export default { api, updateToken, apiVersion }