import React, { useEffect, useState } from 'react'
import useOrganizations from '../hooks/useOrganizations'
import useOrders from '../hooks/useOrders'
import useCustomers from '../hooks/useCustomers'
import useProduction from '../hooks/useProduction'
import useDelivery from '../hooks/useDelivery'
import useWork from '../hooks/useWork'
import useContainers from '../hooks/useContainers'
import useProducts from '../hooks/useProducts'
import useTasks from '../hooks/useTasks'
import { formattedDate } from '../utils/times'

export const getOrdersData = (props) => {

    
    let user = props.user
    let credential = props.credential
    let setLoading = props.setLoading
    let setOrders = props.setOrders
    const {getOrders} = useOrders({
        authorization:  credential._tokenResponse.idToken,
        user:           user
    })
    
    setLoading(true)
    
    getOrders()
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
            const {getCustom} = useCustomers({
                authorization:  credential._tokenResponse.idToken,
                user:           user
            })
            const customer = await getCustom(order.customer)
            
            return {...order, fullCustomer:customer.data.data}
        })
        
        Promise.all(getCustomer)
        .then((newResponse) => {
            newResponse.forEach((order, idx) => {
                const orderDate = new Date(order.date)
                newResponse[idx].deliveryDate = formattedDate(orderDate) 
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
                    "deliveryDate":    order.deliveryDate,
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
    const {getCustomers} = useCustomers({
        authorization:  credential._tokenResponse.idToken,
        user:           user
    })
    
    await getCustomers()
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
    const { getContainerWorkDayProduction } = useProduction({
        authorization:  credential._tokenResponse.idToken,
        user:           user
    }) 

    await getContainerWorkDayProduction(user.assignedContainer) 
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
    let headers = {
        authorization:    credential._tokenResponse.idToken,
        user:             user
    }
    const { getContainerWorkDayProduction } = useProduction(headers)
    const { getDeliveryPacksOrders, getRoutesOrders } = useDelivery(headers)

    const production = await getContainerWorkDayProduction(user.assignedContainer)
    const packs = await getDeliveryPacksOrders()
    const deliverys = await getRoutesOrders()

    return {workData:production.data.data, packs:packs.data.data, deliverys: deliverys.data.data}
}

export const getGrowingProducts = async (props) => {
    let user = props.user
    let credential = props.credential
    let setRows = props.setProdData
    const { getGrowingStatus } = useProduction({
        authorization:  credential._tokenResponse.idToken,
        user:           user
    })

    await getGrowingStatus(user.assignedContainer)
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
    const { getRoutesOrders } = useDelivery({
        authorization:  credential._tokenResponse.idToken,
        user:           user
    })
    await getRoutesOrders()
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
    const { getDeliveryPacksOrders } = useDelivery({
        authorization:  credential._tokenResponse.idToken,
        user:           user
    })

    await getDeliveryPacksOrders()
    .then(result => {
        setRows(result.data.data)
    })
    .catch(err => {
    
    })
}

export const updateEmployeeWorkDay = async (props) => {
    let user = props.user
    let credential = props.credential
    const { updateWorkDay } = useWork({
        authorization:  credential._tokenResponse.idToken,
        user:           user
    })
    await updateWorkDay(user._id, user.assignedContainer, {})
    .then(result => {
        return result.data.success
    })
    .catch(err => {
        Promise.reject(err)
    })

}
export const finishWorkDayInDb = async (props) => {
    let user = props.user
    let credential = props.credential
    const { updateWorkDay } = useWork({
        authorization:  credential._tokenResponse.idToken,
        user:           user
    })
    await updateWorkDay(user,user.assignedContainer, {})
    .then(result => {
        return result.data.success
    })
    .catch(err => {
        Promise.reject(err)
    })

}

export const updateContainerConfig = async (user, credential, containerConfigModel) => {
    const { updateContainer } = useContainers({
        authorization:  credential._tokenResponse.idToken,
        user:           user
    })
    return await updateContainer(user.assignedContainer, containerConfigModel)
}

export const updateProduct = (user,credential,mappedProduct) => {
    const { updateProductById } = useProducts({
        authorization:  credential._tokenResponse.idToken,
        user:           user
    })
    return updateProductById(mappedProduct._id, {product:mappedProduct})
}

//*UPDATE THE DATA THAT ACTUALLY AFFECTS THE PRODUCTION DATA (I THINK ALL UPDATES AFFECT PRODUCTION DATA)
export const updateProductConfig = (user, credential, productionDataUpdate, productId) => {
    const { updateProductConfigById } = useProducts({
        authorization:  credential._tokenResponse.idToken,
        user:           user
    })
    return updateProductConfigById(productId, {...productionDataUpdate})
}

export const getContainerData = async (user, credential)=> {
    const {getOrganization} = useOrganizations({
        authorization:credential._tokenResponse.idToken,
        user:user,
    })
    const userOrg = user.organization || JSON.parse(window.localStorage.getItem("usermeta"))?.organization
    const containersData = await getOrganization(userOrg)
    return containersData.data.data.containers
}

export const stopBackgroundTask = async (user, credential,jobid) => {
    const {stopBackgroundJob} = useTasks({
        authorization:credential._tokenResponse.idToken,
        user:user,
    })
    const stopTaskResponse = await stopBackgroundJob(jobid, {})

    return stopTaskResponse
}

export const markInvoiceAsPayed = async (user,credential,invoiceId) => {
    const {updateInvoicePay} = useOrders({
        authorization:credential._tokenResponse.idToken,
        user:user,
    })
    const invoiceMarkAsPayedResponse  = await updateInvoicePay(invoiceId, {})

    return invoiceMarkAsPayedResponse
}


export const getInvoicesByCustomer = async (user, credential, customerId) => {
    const {getCustomerOrderInvoices} = useOrders({
        authorization:credential._tokenResponse.idToken,
        user:user,
    })

    const invoicesReponse  = await getCustomerOrderInvoices(customerId)

    return invoicesReponse
}

export const editCustomer =async (user, credential, data) => {
    const { updateCustomer } = useCustomers({
        authorization:credential._tokenResponse.idToken,
        user:user,
    })

    const mappedCustomer = {
            "name":               data.name,
            "role":               data.role,
            "email":              data.email,
            "image":              "N/A",
            "address":            {
                "stNumber":   data.address.stNumber,   
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
    
    return updateCustomer(data._id, mappedCustomer)
}