import { mongoose } from '../../mongo.js'
import { newProvider } from '../providers/store.js'
import { newSeed } from '../seeds/store.js'
import { getOrganizationById } from '../organization/store.js'
import Organization from '../../models/organization.js'
const { ObjectId } = mongoose.Types

const orgModel = mongoose.model("organization", Organization)


// * New produdct with new provider
export const newProduct = (orgId, contId, product) => {
    return new Promise((resolve, reject) => {
        getOrganizationById(orgId)
        .then(org => {
            // * Check for existing provider
            getProviderByName(product.provider.name).then(prov => {
                //* Declare and initialize object id for required fields in product model
                let prodId = new ObjectId()
                let seedId = new ObjectId()
                let provId

                if (prov !== undefined) {
                    // * Provider was found
                    provId = prov._id
                } else {
                    provId = new ObjectId()
                    let providerMapped = {
                        _id:    provId,
                        email:  product.provider.email,
                        name:   product.provider.name,
                        seeds:  []
                    }
                    newProvider(orgId, providerMapped)
                }
    
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
    
                if (product.mix !== undefined && product.mix.isMix === true) 
                    prodMapped.mix = product.mix
    
                let seedMapped = {
                    _id:        prodMapped.seed,
                    seedName:   product.seed.seedName,
                    product:    prodMapped._id,
                    batch:      product.seed.batch,
                    provider:   provId,
                    seedId:     product.seed.seedId
                }
    
                // * Check if provider exists and update whether it exists or not
                if (prov !== undefined) {
                    // * Provider was found
                    seedMapped.provider = provId
                    newSeed(orgId, provId, seedMapped)
                } else {
                    let providerMapped = {
                        _id:    provId,
                        email:  product.provider.email,
                        name:   product.provider.name,
                        seeds:  []
                    }
                    newProvider(orgId, providerMapped)
                    newSeed(orgId, provId, seedMapped)
    
                }  
    
                // * Save product on specified container and save
                org.containers[contId].products.push(prodMapped)
                org.save((err, doc) => {
                    if (err) reject(err)
                    resolve(doc)  
                })
            })            
        })
    })
}


export const createNewMix = () => {
    return new Promise((resolve, reject) => {
        //*TODO CREATE MIX FUNCTION
    })
}

export const insertManyProducts = (orgId, contId, prodArray) => {
    return new Promise((resolve, reject) => {
        
        Promise.all(prodArray.map(prod => {
            return new Promise((reject, resolve) => {
                newProduct(orgId, contId, prod)
                .then(prod => resolve(prod))
                .catch(err => reject(err))
            })
        }))
        .then(prods => resolve(prods))
        .catch(err => reject(err))
    })
}

export const getAllProductsByOrg = (orgId) => {
    return new Promise(async (resolve, reject) => {
        getOrganizationById(orgId)
        .then(org => {
            let products = {}
            org.containers.forEach(cont => {
                products[cont._id] = cont.products
            })
            if(!org){
                return reject("No organization found")
            }
            if(org.containers.length == 0) {
                return reject("No containers found")
            }

            if(!products){
                return reject("No products found")
            }

            resolve(products)
        })
        const org =  await orgModel.findById(orgId)
        
    })
}

export const getAllProductsByCont = (orgId, contId) => {
    return new Promise(async (resolve, reject) => {
        getOrganizationById(orgId)
        .then(org => {

            if(!org){
                return reject("No organization found")
            }
            
            org.containers.findOneById(contId).exec()
            .then(cont => {
                if(cont.products.length == 0) reject("No products found")
                resolve(products)
            })
        })

    })
}


export const updateProduct = (orgId, contId, prodId, edit) => {
    return new Promise(async (resolve, reject) => {

        getOrganizationById(orgId)
        .then(org => {
            org.containers.findOneBy
        })
        
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