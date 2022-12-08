import Organization from '../../models/organization.js'
import {mongoose} from '../../mongo.js'
import { groupOrders } from '../orders/controller.js'
import { getOrderById } from '../orders/store.js'

const orgModel = mongoose.model('organizations', Organization)


export const getPackagingForDay = (date, orgId) => {
    return new Promise(async (resolve, reject) => {
        const ordersInPackaging = await orgModel.findOne({"_id":mongoose.Types.ObjectId(orgId)},{"packaging":true})
        
        const getOrdersObjectsById = ordersInPackaging.packaging.map(async (orderId) => {
            const orderObject = await getOrderById(orgId, orderId)
            return orderObject.orders[0]
        })

        Promise.all(getOrdersObjectsById)
        .then((orders) => {
            const ordersGroupped = groupOrders("date", orders, date)
            resolve(ordersGroupped)
        })
        .catch(err => {
            console.log("Error getting orders by mapping ids in packaging for day controller")
            reject(err)
        })
    })
}