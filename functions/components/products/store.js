import { mongoose } from '../../mongo.js'
import { createProvider } from '../providers/store.js'
import { createSeed } from '../seeds/store.js'
import { getOrganizationById } from '../organization/store.js'
import Organization from '../../models/organization.js'
const { ObjectId } = mongoose.Types

const orgModel = mongoose.model("organization", Organization)


export const newProduct = (orgId, contId, product) => {
    return new Promise((resolve, reject) => {
        getOrganizationById(orgId)
        .then(organization => {

            //* Declare and initialize object id for required fields in product model
            let prodId = new ObjectId()
            let seedId = new ObjectId()
            let provId = new ObjectId()

            let prodMapped = {
                _id:        prodId,
                name:       product.name,
                image:      product.image,
                desc:       product.desc,
                status:     product.status,
                seed:       seedId,
                provider:   provId,
                price:      product.price,
                parameters: product.parameters
            }

            
            let seedMapped = {
                _id:        prodMapped.seed,
                seedName:   product.seed.seedName,
                product:    prodMapped._id,
                batch:      product.seed.batch,
                provider:   provId,
                seedId:     product.seed.seedId
            }
            
            // * Check if provider exists and update whether it exists or not
            let prov = organization.providers.find(prov => prov.name == product.provider.name)
            if (prov != undefined) {
                prov.seeds.push(seedMapped)
                console.log(prov)
                // prov.save((err, doc) => {
                //     if (err) reject(err)
                // })
            } else {
                let providerMapped = {
                    _id:    provId,
                    email:  product.provider.email,
                    name:   product.provider.name,
                    seeds:  []
                }

                providerMapped.seeds.push(seedMapped)
                organization.providers.push(providerMapped)

            }  
            try{
                organization.containers[contId].products.push(prodMapped)
    
                organization.save((err, doc) => {
                    if (err) reject(err)
                    resolve(doc)  
                })
            } catch(err){
                reject(err)   
            }

        })

    
    })
    
}

export const createNewMix = (orgId, contId, mix) => {
    return new Promise((resolve, reject) => {
        //*TODO CREATE MIX FUNCTION
        getOrganizationById(orgId)
        .then((organization) => {
            let prodId = new ObjectId()
            
            let prodMapped = {
                _id:        prodId,
                name:       mix.name,
                image:      mix.label,//*TODO PROCESS LABEL IN ORDER TO SAVE IT
                status:     mix.status,
                price:      mix.price,
                mix:        mix.mix
            }
            //*TODO Write algorithm to calculate mix price based on its products


            try {
                organization.containers[contId].products.push(prodMapped)
                organization.save((err, doc) => {
                    if(err) reject(err)

                    resolve(doc)
                })
            } catch(err){
                reject(err)
            }
            

        })
        .catch((err) => {
            reject(err)
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