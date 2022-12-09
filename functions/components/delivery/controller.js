import Organization from '../../models/organization.js'
import {mongoose} from '../../mongo.js'
import { groupOrders, groupOrdersForPackaging } from '../orders/controller.js'
import { getAllOrders, getOrderById } from '../orders/store.js'
import { grouPProductionForWorkDay } from '../production/controller.js'
import { getProductionByStatus } from '../production/store.js'

const orgModel = mongoose.model('organizations', Organization)


export const buildPackagesFromOrders = (orders) => {
    const ordersGroupped = groupOrdersForPackaging(orders)
    return ordersGroupped
}

export const getPackagingForDay = (date, orgId, container = undefined) => {
    return new Promise(async (resolve, reject) => {
        const ordersInPackaging = await orgModel.findOne({"_id":mongoose.Types.ObjectId(orgId)},{"packaging":true})
        
        const getOrdersObjectsById = ordersInPackaging.packaging.map(async (orderId) => {
            const orderObject = await getOrderById(orgId, orderId)
            return orderObject.orders[0]
        })

        Promise.all(getOrdersObjectsById)
        .then(async (orders) => {
            if(date === "all"){
                const packaging = await getPackagingByOrders(orgId)
                return resolve(packaging)
            }
            

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
    const orders2 = await getAllOrders(orgId,undefined, false, false)

    if(orders2.length >0) {
        return buildPackagesFromOrders(orders2)
    }
    
    return []
}