import { mongoose } from '../../mongo.js'
import Product  from '../../models/product.js'
import { createProvider } from '../providers/store.js'
import { createSeed } from '../seeds/store.js'
import Organization from '../../models/organization.js'
const { ObjectId } = mongoose.Types

const orgModel = mongoose.model("organization", Organization)


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

export const createNewMix = () => {
    return new Promise((resolve, reject) => {
        //*TODO CREATE MIX FUNCTION
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

export const getAllProducts = (orgId) => {
    return new Promise(async (resolve, reject) => {
        const org =  await orgModel.findById(orgId)
        if(!org){
            return reject("No organization found")
        }
        const container =  org.containers[0]
        if(!container) {
            return reject("No containers found")
        }

        const products = container.products

        if(!products){
            return reject("No products found")
        }

        resolve(products)
    })
}

export const updateProduct = (orgId, id, field, value) => {
    return new Promise(async (resolve, reject) => {
        const org = await orgModel.findById(orgId)

        if(org === null || org === undefined) {
            reject("No organization found")
        }


        const product = org.containers[0].products.id(id)

        if(product === null || product === undefined) {
            reject("No product found")
        }

        product[field] = value

        org.save((err) => {
            if(err) reject(err)
            
            resolve(org)
        })
    })
}

export const deleteProduct = (orgId, id) => {
    return new Promise(async (resolve, reject) => {
        let org 
        
        orgModel.findById(orgId, (err, organization)=> {
            if(err){
                return reject(err)
            }
            org = organization
            
            if(org === null || org === undefined) {
                return reject("No organization found")
            }
            const product = org.containers[0].products.id(id)
    
            if(product === null || product === undefined) {
                return reject("No product found")
            }
    
            product.remove()
            org.save((err) => {
                if(err) return reject(err)
    
                return resolve("Doc removed")
            })
        })
        
    })
}