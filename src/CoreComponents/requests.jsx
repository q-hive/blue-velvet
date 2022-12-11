import React, { useEffect, useState } from 'react'
import api from "../axios"


import useAuth from '../contextHooks/useAuthContext'

export const getOrdersData = (props) => {

    
    //const {user, credential} = useAuth()
    let user = props.user
    let credential = props.credential
    let setLoading = props.setLoading
    let setOrders = props.setOrders
    
    api.api.get(`${api.apiVersion}/orders/`, {
        headers: {
            authorization:  credential._tokenResponse.idToken,
            user:           user
        }
    
    }, setLoading(true))
    .then(async response => {
        const cancelled = await api.api.get(`${api.apiVersion}/orders/cancelled`, {
            headers: {
                authorization:  credential._tokenResponse.idToken,
                user:           user
            }
        })
        const delivered = await api.api.get(`${api.apiVersion}/orders/delivered`, {
            headers: {
                authorization:  credential._tokenResponse.idToken,
                user:           user
            }
        })

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
                const dayOfOrder = new Date(order.date).getDay()
                switch(dayOfOrder){
                    case 2:
                        newResponse[idx].date1 = order.date 
                        newResponse[idx].date2 = null 
                        
                    break;
                    case 5:
                        newResponse[idx].date2 = order.date
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

            const cancelledRows = cancelled.data.data.map((order) => {
                return {
                    "id":       order._id,
                    "customer": order.customer,
                    "income":   order.price,
                    "date2":    order.date,
                }
            })

            const deliveredRows = delivered.data.data.map((order) => {
                return {
                    "id":       order._id,
                    "customer": order.customer,
                    "income":   order.price,
                    "date2":    order.date,
                }
            })
            const mappedRows = newResponse.map((order) => {
                return {
                    "customer": order.fullCustomer.name,
                    "date1":    order.date1,
                    "date2":    order.date2,
                    "type":     "No type",
                    "income":   order.price,
                    "status":   order.status,
                    "id":       order._id
                }
            })
            setOrders((o) => {
                return (
                    {
                        ...o,
                        all:        mappedRows,
                        cancelled:  cancelledRows,
                        delivered:  deliveredRows,
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
    let setRows = props.setCustomers
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
        setRows(response.data.data)
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
        setRows(response.data.data)
    })

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
        setRows(result.data)
    })
    .catch(err => {
    
    })
}