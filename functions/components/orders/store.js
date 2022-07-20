import {mongoose} from '../../mongo.js'
import Order from '../../models/order.js'
import { ObjectId } from 'mongodb'

const orderModel = mongoose.model('orders', Order)

export const createNewOrder = (order) => {
    return new Promise((resolve, reject) => {
        // TODO: CHRIS ORDERS
        let orderMapped = {
            customer: order.customer,
            admin: order.admin,
            type: order.type,
            packages: order.packages,
            price: order.price,
            containers: order.containers,
            production: order.production,
            produts: order.products
        }
        
        const orderDoc = new orderModel(obj)

        orderDoc.save((err) => {
            if(err) reject(err)

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