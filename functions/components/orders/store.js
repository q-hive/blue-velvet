import {mongoose} from '../../mongo.js'
import order from '../../models/order.js'
import { ObjectId } from 'mongodb'

const ordersCollection = mongoose.connection.collection('orders')

export const createNewOrder = (obj) => {
    return new Promise((resolve, reject) => {
        // TODO: CHRIS ORDERS
        obj._id = new ObjectId()
        obj.customer = new ObjectId()
        obj.admin = new ObjectId()
        obj.date = new Date()
        obj.containers = [new ObjectId()]
        obj.production = [new ObjectId()]

                
        obj.products = [new ObjectId("62c798da7de115dbf70e600f")]
        
        const orderModel = new mongoose.model('order', order)
        
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