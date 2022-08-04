import { mongoose } from '../../mongo.js'
import { createProvider } from '../providers/store.js'
import { createSeed } from '../seeds/store.js'
import { getOrganizationById } from '../organization/store.js'
const { ObjectId } = mongoose.Types

const productsCollection = mongoose.connection.collection('products')

export const newProduct = (orgId, contId, product) => {
    return new Promise(async (res, rej) => {

        getOrganizationById(orgId)
        .then(organization => {

            let prodId = new ObjectId()
            let seedId = new ObjectId()
            
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
            
            // * Check if provider exists and update whether it exists or not
            let prov = await organization.providers.findOne({ name: product.provider.name }).exec()
            if (prov != undefined) {
                prov.seeds.push(seedMapped)
                prov.save((err, doc) => {
                    if (err) reject(err)
                })
            } else {
                let providerId = new ObjectId()
                let providerMapped = {
                    _id:    providerId,
                    email:  product.provider.email,
                    name:   product.provider.name,
                    seeds:  [seedId]
                }

                organization.providers.push(providerMapped)

                organization.save((err, doc) => {
                    if (err) reject(err)
                })
            }  

            // * Save product on specified container
            if (contId == undefined) {
                organization.containers.forEach(container => {
                    
                })
            }
            organization.containers.findById(contId).exec()
            .then(container => {
                container.products.push(prodMapped)

                container.save((err, doc) => {
                    if (err) reject(err)
                })
            })

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