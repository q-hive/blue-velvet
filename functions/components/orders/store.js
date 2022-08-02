import { mongoose } from '../../mongo.js'
let { ObjectId } = mongoose.Types
import Order from '../../models/order.js'
import { getProductionForOrder } from '../production/store.js'
import { addTimeToDate } from '../../utils/time.js'
import { getOrganizationById } from '../organization/store.js'


export const createNewOrder = (order) => {
    return new Promise(async (resolve, reject) => {
        // TODO: CHRIS TEST
        // * Id for order
        let id = new ObjectId()

        // * 1- Check for suitable production lines
        // * 2- If production line is available to fulfill order, 
        // *        assign order and perform updates
        let prodLines = await getProductionForOrder(order.products, order.organization, {
            started: new Date(),
        })

        // * Save products on production
        prodLines.forEach(pLine => {
            pLine.orders.push(id)
            pLine.products.push(order.products)
            
            // TODO: Update Tasks data
            

            pLine.save((err, doc) => {
                if (err) reject(err)
            })
        })
        
        let orderMapped = {
            _id:        id,
            client:     order.client,
            customer:   order.customer,
            type:       order.type,
            packages:   order.packages,
            price:      order.price,
            end:        addTimeToDate(new Date(), { w: 2 }),
            production: prod,
            produts:    order.products
        }
        

        getOrganizationById(res.locals.organization)
        .then(organization => {

            organization.orders.push(orderMapped)
            organization.production.push(id)

            organization.save((err, org) => {
                if(err) reject(err)
    
                resolve(org)
            })
        })        
    })
}

export const getOrdersByProd = (id) => {
    return new Promise((resolve, reject) => {
        // TODO: Corregir query
        ordersCollection
        .find({products:[id]})
        .toArray((err, data) => {
            if(err){
                reject(err)
            }
            resolve(data)
        })
    })
}