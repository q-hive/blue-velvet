import { ObjectId } from 'mongodb'
import product from '../../models/product.js'
import {mongoose} from '../../mongo.js'

export const insertNewProduct = (object) => {
    return new Promise((res, rej) => {
        const productModelInstance = new mongoose.model('Product', product)
    
        object._id = new ObjectId()
        
        const productDoc = new productModelInstance(object)
    
        productDoc.save((err) => {
            if(err){
                rej(err)                
            }

            res("New product created")
        })
    })
    
}

export const insertManyProducts = (array) => {
    return new Promise((resolve, reject) => {
        const productModel = new mongoose.model('products', product)

        productModel.insertMany(array)
        .then(() => {
            resolve("Many products inserted")
        })
        .catch(err => {
            reject(err)
        })
    })
}

export const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        const productsCollection = mongoose.connection.collection('products')

        productsCollection.find({}).toArray((err, data) => {
            if(err){
                reject(err)
            }

            resolve(data)
        })
        
    })
}