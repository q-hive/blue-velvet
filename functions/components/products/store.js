import { mongoose } from '../../mongo.js'
import Product  from '../../models/product.js'
import { createProvider } from '../providers/store.js'
import { createSeed } from '../seeds/store.js'
const { ObjectId } = mongoose.Types

const productsCollection = mongoose.connection.collection('products')

export const createNewProduct = (object) => {
    return new Promise(async (res, rej) => {
        let seed
        let provider
        let productModel
        let productDoc
        productModel = mongoose.model('Product', Product)
        productDoc = new productModel(object)
    
        try {
            //*FIRST SEED NEEDS TO BE CREATED
            const seedMapped = {
                seedId:     object.seed.seedId,
                seedName:   object.seed.seedName,
                product:    productDoc._id
            } 
    
            //*If is a new provider, then creates it
            const providerMapped = {
                email:  object.provider.email,
                name:   object.provider.name,
                seeds: []
            }

            seed = await createSeed(seedMapped)

            providerMapped.seeds.push(seed)

            //*CREATE PROVIDER
            provider = await createProvider(providerMapped)
        }
        catch(err){
            rej(err)
        }

        productDoc.seed = seed._id
        productDoc.provider = provider._id
        

        productDoc.validate()
        .then(() => {
            res(productDoc)
        })
        .catch(err => {
            rej(err)
        })
    })
    
}

export const insertManyProducts = (array) => {
    return new Promise((resolve, reject) => {
        const productModel = new mongoose.model('products', Product)

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
        const productModelInstance = new mongoose.model('Product', Product)
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
        const productModelInstance = new mongoose.model('Product', Product)

        productModelInstance.findByIdAndDelete(param,{} ,(err) => {
            if(err) {
                reject(err)
                return
            }

            resolve("Deleted")
        })
    })
}