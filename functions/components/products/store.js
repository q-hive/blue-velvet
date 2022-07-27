import { ObjectId } from 'mongodb'
import { Product } from '../../models/index.js'
import {mongoose} from '../../mongo.js'

const productsCollection = mongoose.connection.collection('products')

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
        productsCollection.find({}).toArray((err, data) => {
            if(err){
                reject(err)
            }

            resolve(data)
        })
        
    })
}

export const updateProduct = (param) => {
    return new Promise((resolve, reject) => {
        const productModelInstance = new mongoose.model('Product', product)
        let update
        update = param.value
        if(param.field){
            update = {
                [param.field]:param.value
            }    
        }

        productModelInstance.findByIdAndUpdate(param.id, update , {}, (err) => {
            if(err){
                reject(err)
                return
            }
            resolve("Product updated")
        })
    })
}

export const deleteProduct = (param) => {
    return new Promise((resolve, reject) => {
        const productModelInstance = new mongoose.model('Product', product)

        productModelInstance.findByIdAndDelete(param,{} ,(err) => {
            if(err) {
                reject(err)
                return
            }

            resolve("Deleted")
        })
    })
}