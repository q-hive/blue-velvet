import { mongoose } from '../../mongo.js'
let { ObjectId } = mongoose.Types

//*Schema
import Organization from '../../models/organization.js'
import Order from '../../models/order.js'

import { getProductionForOrder } from '../production/store.js'
import { addTimeToDate } from '../../utils/time.js'
import { getOrganizationById } from '../organization/store.js'

const orgModel = mongoose.model('organization', Organization)

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

export const getOrdersByProd = (orgId, id) => {
    return new Promise(async (resolve, reject) => {
        // TODO: Corregir query
        const org = await orgModel.findById(orgId)

        if(!org){
            return reject("No organization found")
        }

        const orders = org.orders
        
        if(!orders ||  orders.length == 0) {
            return resolve(orders)
        }

        const orderByProd = orders.products.id(id)

        resolve(orderByProd)
    })
}