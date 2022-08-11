import { mongoose } from '../../mongo.js'
import { newProvider } from '../providers/store.js'
import { newSeed } from '../seeds/store.js'
import { newProduct } from '../products/store.js'
import { getOrganizationById } from '../organization/store.js'
import Organization from '../../models/organization.js'
const { ObjectId } = mongoose.Types

const orgModel = mongoose.model("organization", Organization)


export const newProduct = (orgId, contId, product) => {
    return new Promise(async (res, rej) => {

        getOrganizationById(orgId)
        .then(org => {

            let prodId = new ObjectId()
            let sId = new ObjectId()
            
            let prodMapped = {
                _id:        prodId,
                name:       product.name,
                image:      product.image,
                desc:       product.desc,
                status:     'idle',
                seed:       seedId,
                provider:   providerId,
                price:      product.price,
                parameters: product.parameters
            }

            if (product.mix !== undefined && product.mix.isMix === true) {
                prodMapped.mix = product.mix
            }

            
            let seedMapped = {
                _id:        sId,
                seedId:     product.seed.seedId,
                seedName:   product.seed.seedName,
                product:    prodId,
                batch:      product.seed.batch
            }
            
            // * Check if provider exists and update whether it exists or not
            let prov = await org.providers.findOne({ name: product.provider.name }).exec()
            if (prov !== undefined) {
                newSeed(orgId, prov._id, seedMapped)
            } else {
                newProvider(orgId, providerMapped)
                .then(provDoc => {
                    newSeed(orgId, provDoc._id, seedMapped)
                })
            }  


            // * Save product on specified container
            newProduct(orgId, contId, prodMapped)
            .then(prod => resolve(prod))
        })

    })
    
}

export const insertManyProducts = (orgId, contId, prodArray) => {
    return new Promise((resolve, reject) => {
        
        Promise.all(prodArray.map(prod => {
            return newProduct(orgId, contId, prod)
        }))
        .then(prods => resolve(prods))
        
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
    return new Promise((resolve, reject) => {
        const org = orgModel.findById(orgId)

        if(org === null || org === undefined) {
            reject("No organization found")
        }

        const product = org.containers[0].products.id(id)

        if(product === null || product === undefined) {
            reject("No product found")
        }

        product.remove()

        org.save((err) => {
            if(err) reject(err)

            resolve("Doc removed")
        })
    })
}