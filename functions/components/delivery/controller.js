import Organization from '../../models/organization.js'
import {mongoose} from '../../mongo.js'
import { groupOrders, groupOrdersForDelivery, groupOrdersForPackaging } from '../orders/controller.js'
import { getAllOrders, getFilteredOrders, getOrderById } from '../orders/store.js'
import { grouPProductionForWorkDay } from '../production/controller.js'
import { getProductionByStatus } from '../production/store.js'

const orgModel = mongoose.model('organizations', Organization)


export const buildPackagesFromOrders = (orders) => {
    const ordersGroupped = groupOrdersForPackaging(orders)
    return ordersGroupped
}

export const buildDeliveryFromOrders = async (orders) => {
    const ordersGroupped = await groupOrdersForDelivery(orders)
    return ordersGroupped
}

export const getPackagingForDay = (date, orgId, container = undefined) => {
    return new Promise(async (resolve, reject) => {
        if(date === "statusReady"){
            try {
                const packaging = await getPackagingByOrders(orgId)
                return resolve(packaging)
            } catch (err) {
                return reject(err)
            }
            
        }
        
        const ordersInPackaging = await orgModel.findOne({"_id":mongoose.Types.ObjectId(orgId)},{"packaging":true})
        
        const getOrdersObjectsById = ordersInPackaging.packaging.map(async (orderId) => {
            const orderObject = await getOrderById(orgId, orderId)
            return orderObject.orders[0]
        })

        Promise.all(getOrdersObjectsById)
        .then(async (orders) => {
            let ordersHashMapByDate = groupOrders("date", orders, date)
            let ordersGrouppedArray = []
            
            ordersGrouppedArray = ordersHashMapByDate.map((obj) => {
                if(!obj){
                    return
                }
                
                const date = Object.keys(obj)[0]
                return obj[date]
            }).filter((elem) => elem!== undefined)

            
           
            
            if(ordersGrouppedArray.length === 0){
                return resolve([])
            }

            
            
            const packages = buildPackagesFromOrders(ordersGrouppedArray)

            resolve(packages)
        })
        .catch(err => {
            console.log("Error getting orders by mapping ids in packaging for day controller")
            reject(err)
        })
    })
}

export const getDeliveryByDate = (date, orgId, container = undefined) => {
    return new Promise(async(resolve, reject) => {
        if(date === "statusReady"){
            try {
                const delivery = await getDeliveryByOrders(orgId)
                return resolve(delivery)
            } catch(err) {
                return reject(err)
            }
        }
        
        const ordersReadyForDelivery = await orgModel.findOne({"_id":mongoose.Types.ObjectId(orgId)},{"deliveryReady":true})

        const getOrdersObjectsById = ordersReadyForDelivery.deliveryReady.map(async (orderId) => {
            const orderObject = await getOrderById(orgId, orderId)
            return orderObject[0]
        })

        Promise.all(getOrdersObjectsById)
        .then(async (orders) => {
            console.log(orders)
            let ordersHashMapByDate = groupOrders("date", orders, date)
            let ordersGrouppedArray = []
            
            ordersGrouppedArray = ordersHashMapByDate.map((obj) => {
                if(!obj){
                    return
                }
                
                const date = Object.keys(obj)[0]
                return obj[date]
            }).filter((elem) => elem!== undefined)

            
           
            
            if(ordersGrouppedArray.length === 0){
                return resolve([])
            }

            
            
            const packages = buildPackagesFromOrders(ordersGrouppedArray)

            resolve(packages)
        })
        .catch(err => {
            console.log("Error getting orders by mapping ids in packaging for day controller")
            reject(err)
        })
    
    })
}

export const getPackagingByOrders = async (orgId) => {
    console.log("Getting packages for all orders in DB")
    const orders2 = await getFilteredOrders(orgId,undefined, false, {"key":"status", "value":"packing"})
    if(orders2.length >0) {
        const packages = buildPackagesFromOrders(orders2)
        console.log(packages)
        return packages
    }
    
    return []
}
export const getDeliveryByOrders = async (orgId) => {
    console.log("Getting delivery data for all orders in DB")
    const orders2 = await getFilteredOrders(orgId,undefined, false, {"key":"status", "value":"ready"})
    if(orders2.length >0) {
        const delivery = await buildDeliveryFromOrders(orders2)
        return delivery
    }
    
    return []
}