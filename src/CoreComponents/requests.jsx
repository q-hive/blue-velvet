import React, { useEffect, useState } from 'react'
import api from "../axios"


import useAuth from '../contextHooks/useAuthContext'
import { normalizeDate } from '../utils/times'

export const getOrdersData = (props) => {

    
    //const {user, credential} = useAuth()
    let user = props.user
    let credential = props.credential
    let setLoading = props.setLoading
    let setOrders = props.setOrders
    
    setLoading(true)
    
    api.api.get(`${api.apiVersion}/orders/`, {
        headers: {
            authorization:  credential._tokenResponse.idToken,
            user:           user
        }
    })
    .then(async response => {
        // const cancelled = await api.api.get(`${api.apiVersion}/orders/cancelled`, {
        //     headers: {
        //         authorization:  credential._tokenResponse.idToken,
        //         user:           user
        //     }
        // })
        // const delivered = await api.api.get(`${api.apiVersion}/orders/delivered`, {
        //     headers: {
        //         authorization:  credential._tokenResponse.idToken,
        //         user:           user
        //     }
        // })

        const getCustomer = response.data.data.map(async (order, idx) => {
            const customer = await api.api.get(`${api.apiVersion}/customers/${order.customer}`, {
                headers: {
                    authorization:  credential._tokenResponse.idToken,
                    user:           user
                }
            })
            
            return {...order, fullCustomer:customer.data.data}
        })
        
        Promise.all(getCustomer)
        .then((newResponse) => {
            newResponse.forEach((order, idx) => {
                const orderDate = new Date(order.date)
                
                switch(orderDate.getDay()){
                    case 2:
                        newResponse[idx].date1 = normalizeDate(orderDate) 
                        newResponse[idx].date2 = null 
                        
                    break;
                    case 5:
                        newResponse[idx].date2 = normalizeDate(orderDate)
                        newResponse[idx].date1 = null
                    break;
                    default:
                        break;
                }
            })
            
            props.setTotalIncome(sumPrices())
            
            function sumPrices() { 
                let arr =[]
                newResponse.map((order) => {
                    arr.push(order.price)
                })
                let sum =arr.reduce((a, b) => a + b, 0)
                return(sum)
            
            }

            // const cancelledRows = cancelled.data.data.map((order) => {
            //     return {
            //         "id":       order._id,
            //         "customer": order.customer,
            //         "income":   order.price,
            //         "date2":    order.date,
            //     }
            // })

            // const deliveredRows = delivered.data.data.map((order) => {
            //     return {
            //         "id":       order._id,
            //         "customer": order.customer,
            //         "income":   order.price,
            //         "date2":    order.date,
            //     }
            // })
            const mappedRows = newResponse.map((order) => {
                return {
                    "customer": order.fullCustomer.name,
                    "date1":    order.date1,
                    "date2":    order.date2,
                    "cyclic":   order.cyclic,
                    "income":   order.price,
                    "status":   order.status,
                    "job":      order.job,
                    "id":       order._id
                }
            })
            setOrders((o) => {
                return (
                    {
                        ...o,
                        all:        mappedRows,
                        // cancelled:  cancelledRows,
                        // delivered:  deliveredRows,
                        recent:     mappedRows    
                    }
                )
            })
            setLoading(false)
        })
        .catch((err) => {
            console.log("Error executing request for customers name")
            console.log(err)
        })
    })
    .catch(err => {
        console.log("Error getting orders")
    })

    return 
}


export  const getCustomerData = async  (props) => {

    
    let user = props.user
    let credential = props.credential
    let setLoading = props.setLoading
    // let setRows = props.setCustomers
    let dialog = props.dialog
    let setDialog = props.setDialog    
    
    await api.api.get(`${api.apiVersion}/customers/`, {
            headers: {
                authorization:  credential._tokenResponse.idToken,
                user:           user
            }
        },setLoading(true))
        .then((response) => {
        setLoading(false)
        console.log(response.data.data)
        // setRows(response.data.data)
        if(response.data.data.length === 0 ){
            setDialog({
                ...dialog,
                open:true,
                title:"You have no customers added",
                message:"Please add at least one customer in order to manage them",
                actions: [
                    {
                        label:"Add customer",
                        execute: () => navigate('NewCustomer')
                    },
                    {
                        label: "Cancel",
                        execute: () => navigate(`/${user.uid}/${user.role}/dashboard`)
                    }
                ]
            })
        }
    })
    .catch(err => {
        console.log(err)
    })

    return
}



export const getWorkdayProdData = async (props) => {

    let user = props.user
    let credential = props.credential
    let setRows = props.setProdData


    await api.api.get(`${api.apiVersion}/production/workday?containerId=${user.assignedContainer}`, {
        headers: {
            authorization:  credential._tokenResponse.idToken,
            user:           user
        }
    })
    .then((response) => {
        console.log(response)
        setRows(response.data.data)
    })
    .catch(err => console.log(err))

}

//*THIS METHOD
export const getWorkData = async ({user, credential})=> {
    // if(window.localStorage.getItem("workData")){
    //     return {
    //         workData: JSON.parse(window.localStorage.getItem("workData")),
    //         packs: JSON.parse(window.localStorage.getItem("packs")),
    //         deliverys: JSON.parse(window.localStorage.getItem("deliverys")),
    //     }
    // }
    
    const production = await api.api.get(`${api.apiVersion}/production/workday?containerId=${user.assignedContainer}`,{
        headers:{
            "authorization":    credential._tokenResponse.idToken,
            "user":             user
        }
    })
    const packs = await api.api.get(`${api.apiVersion}/delivery/packs/orders`,{
        headers:{
            "authorization":    credential._tokenResponse.idToken,
            "user":             user
        }
    })
    const deliverys = await api.api.get(`${api.apiVersion}/delivery/routes/orders`,{
        headers:{
            "authorization":    credential._tokenResponse.idToken,
            "user":             user
        }
    })

    return {workData:production.data.data, packs:packs.data.data, deliverys: deliverys.data.data}
}

export const getGrowingProducts = async (props) => {
    let user = props.user
    let credential = props.credential
    let setRows = props.setProdData

    await api.api.get(`${api.apiVersion}/production/status/growing?containerId=${user.assignedContainer}`, {
        headers: {
            authorization:  credential._tokenResponse.idToken,
            user:           user
        }
    })
    .then(result => {
        setRows(result.data.data)
    })
    .catch(err => {
    
    })

}

export const getDeliveries = async (props) => {
    let user = props.user
    let credential = props.credential
    let setRows = props.setProdData

    await api.api.get(`${api.apiVersion}/delivery/routes/orders`, {
        headers: {
            authorization:  credential._tokenResponse.idToken,
            user:           user
        }
    })
    .then(result => {
        setRows(result.data.data)
    })
    .catch(err => {
    
    })
}

export const getPackingProducts = async (props) => {
    let user = props.user
    let credential = props.credential
    let setRows = props.setProdData

    await api.api.get(`${api.apiVersion}/delivery/packs/orders`, {
        headers: {
            authorization:  credential._tokenResponse.idToken,
            user:           user
        }
    })
    .then(result => {
        setRows(result.data.data)
    })
    .catch(err => {
    
    })
}

export const updateEmployeeWorkDay = async (props) => {
    let user = props.user
    let credential = props.credential

    await api.api.patch(`${api.apiVersion}/work/workday/${user._id}/${user.assignedContainer}`, {} ,{
        headers: {
            authorization:  credential._tokenResponse.idToken,
            user:           user
        }
    })
    .then(result => {
        return result.data.success
    })
    .catch(err => {
        Promise.reject(err)
    })

}
export const finishWorkDayInDb = async (props) => {
    let employee = props.employee
    let user = props.user
    let credential = props.credential

    await api.api.patch(`${api.apiVersion}/work/workday/${employee}/${user.assignedContainer}?delete=true`,{},{
        headers: {
            authorization:  credential._tokenResponse.idToken,
            user:           user
        }
    })
    .then(result => {
        return result.data.success
    })
    .catch(err => {
        Promise.reject(err)
    })

}

export const updateContainerConfig = async (user, credential, containerConfigModel) => {
    return await api.api.patch(`${api.apiVersion}/container/config/${user.assignedContainer}`, containerConfigModel, {
        headers: {
            authorization:  credential._tokenResponse.idToken,
            user:           user
        }
    })
}

export const updateProduct = (user,credential,mappedProduct) => {
    return api.api.patch(`${api.apiVersion}/products/?id=${mappedProduct._id}`, {product:mappedProduct}, {
        headers:{
            authorization:credential._tokenResponse.idToken,
            user:user,
        }
    })
}

export const getContainerData = async (user, credential)=> {
    const userOrg = user.organization || JSON.parse(window.localStorage.getItem("usermeta"))?.organization
    
    const containersData = await api.api.get(`${api.apiVersion}/organizations?_id=${userOrg}`,{
        headers:{
            "authorization":    credential._tokenResponse.idToken,
            "user":             user
        }
    })

    return containersData.data.data[0].containers
}

export const stopBackgroundTask = async (user, credential,jobid) => {
    const stopTaskResponse = await api.api.post(`${api.apiVersion}/backgroundJobs/stopJob/${jobid}`,{},{
        headers:{
            "authorization":    credential._tokenResponse.idToken,
            "user":             user
        }
    })

    return stopTaskResponse
}

export const markInvoiceAsPayed = async (user,credential,invoiceId) => {
    const invoiceMarkAsPayedResponse  = await api.api.patch(`${api.apiVersion}/orders/invoices/pay/${invoiceId}?payed=true`,{},{
        headers:{
            "authorization":    credential._tokenResponse.idToken,
            "user":             user
        }
    })

    return invoiceMarkAsPayedResponse
}


export const getInvoicesByCustomer = async (user, credential, customerId) => {
    const invoicesReponse  = await api.api.get(`${api.apiVersion}/orders/invoices/${customerId}`,{
        headers:{
            "authorization":    credential._tokenResponse.idToken,
            "user":             user
        }
    })

    return invoicesReponse
}

export const editCustomer =async (user, credential, data) => {
    const mappedCustomer = {
            "name":               data.name,
            "role":               data.role,
            "email":              data.email,
            "image":              "N/A",
            "address":            {
                "stNumber":   data.address.number,   
                "street":     data.address.street,
                "zip":        data.address.zip,
                "city":       data.address.city,
                "state":      data.address.state,
                "country":    data.address.country,
                "references": data.address.references,
            },
            "businessData": {
                "name":         data.businessData.name,
                "bankAccount":  data.businessData.bankAccount
            }
        }
    
    return api.api.patch(`${api.apiVersion}/customers/${data._id}`, mappedCustomer, {
        headers:{
            authorization:credential._tokenResponse.idToken,
            user:user,
        }
    })
}