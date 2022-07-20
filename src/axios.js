import axios from 'axios'

const hosts = ['http://localhost:9999/api/v1']


const api = axios.create({
    baseURL:hosts[0],
    headers:{
        "Content-Type":"application/json"
    },
    withCredentials:true
})

const updateToken = (token) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`    
}


export default { api, updateToken }