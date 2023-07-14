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

// [x]: Obtener los packages y deliveries de las ordenes pendientes (no status delivered)
const getPendingOrders = async (orgId, buildFn) => {
    const filteredOrders = await getFilteredOrders(orgId, undefined, false, null)

    if (filteredOrders.length) {
        const pendingOrders = filteredOrders.filter((dbOrder) => dbOrder.status !== "delivered")
        return pendingOrders.length ? await buildFn(pendingOrders) : []
    }

    return []
}

export const getPackagingByOrders = async (orgId) => getPendingOrders(orgId, buildPackagesFromOrders);

export const getDeliveryByOrders = async (orgId) => getPendingOrders(orgId, buildDeliveryFromOrders);
