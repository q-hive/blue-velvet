import { mongoose } from '../../mongo.js'
import Order from '../../models/order.js'
import { getProductionForOrder } from '../production/store.js'

const orderModel = mongoose.model('orders', Order)

export const createNewOrder = (order) => {
    return new Promise((resolve, reject) => {
        // TODO: CHRIS ORDERS

        // * 1- Check for suitable production lines
        // * 2- If production line is available to fulfill order, 
        // *        assign order and perform updates
        let prod = await getProductionForOrder(order.products, order.organization, {
            started: new Date(),
            
        })
        // * Save products on production
        
        let orderMapped = {
            customer: order.customer,
            admin: order.admin,
            type: order.type,
            packages: order.packages,
            price: order.price,
            containers: order.containers,
            production: prod,
            produts: order.products
        }
        
        const orderDoc = new orderModel(orderMapped)

        orderDoc.save((err, ord) => {
            if(err) reject(err)

            updateProduction(prod, {
                $push: { orders: ord._id }
            })

            resolve("New order saved")
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