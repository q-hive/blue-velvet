import axios from 'axios'

const hosts = ['http://localhost:9999']


const api = axios.create({
    baseURL:hosts[0],
    headers:{
        "Content-Type":"application/json"
    },
    withCredentials:true
})

export default api