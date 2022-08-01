import { mongoose } from '../../mongo.js'
import { createProvider } from '../providers/store.js'
import { createSeed } from '../seeds/store.js'
import { getOrganizationById } from '../organization/store.js'
const { ObjectId } = mongoose.Types

const productsCollection = mongoose.connection.collection('products')

export const newProduct = (orgId, product) => {
    return new Promise(async (res, rej) => {

        getOrganizationById(orgId)
        .then(organization => {

            let prodId = new ObjectId()
            let seedId = new ObjectId()
            let providerId = new ObjectId()

            let prodMapped = {
                _id:        prodId,
                name:       product.name,
                image:      product.image,
                desc:       product.desc,
                status:     'idle',
                seed:       seedId,
                provider:   providerId,
                price:      product.price
            }

            
            let seedMapped = {
                _id: seedId,
                seedName: product.seed.seedName,
                product: prodId,
                batch: product.seed.batch
            }
            
            // * Check if provider exists
            let prov = await organization.providers.findOne({ name: product.provider.name }).exec()
            let providerMapped
            if (prov) {
                providerMapped = {
                    _id
                    email: product.provider.email,
                    name: product.provider.name,
                    seeds =
                }
            }

        })

    
        //*FIRST SEED NEEDS TO BE CREATED
        const seedMapped = {
            seedId:     product.seed.seedId,
            seedName:   product.seed.seedName,
            product:    productDoc._id
        } 

        //*If is a new provider, then creates it
        const providerMapped = {
            email:  product.provider.email,
            name:   product.provider.name,
            seeds: []
        }
        try {
            seed = await createSeed(seedMapped)

            providerMapped.seeds.push(seed)

            //*CREATE PROVIDER
            provider = await createProvider(providerMapped)
        }
        catch(err){
            rej(err)
        }

        console.log(productDoc)

        productDoc.seed = seed._id
        productDoc.provider = provider._id
        
        productDoc.save((err) => {
            if(err) rej(err)                


            res(productDoc)
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