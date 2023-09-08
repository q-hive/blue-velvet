import { mongoose } from '../../mongo.js'
import { createProvider } from '../providers/store.js'
import { createSeed } from '../seeds/store.js'
import { getOrganizationById } from '../organization/store.js'
import Organization, { organizationModel } from '../../models/organization.js'
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
                seed:       {
                    _id:        seedId,
                    seedName:   product.seed.seedName,
                    seedId:     product.seed.seedId
                },
                provider:   {
                    _id:    provId,
                    email:  product.provider.email,
                    name:   product.provider.name
                },
                price:      product.price,
                parameters: product.parameters,
                mix:        product.mix,
                performance: (product.parameters.harvestRate/product.parameters.harvestRate)*(product.price[0].amount/product.price[0].packageSize)
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
        const organization = await organizationModel.findOne({
            "_id":mongoose.Types.ObjectId(orgId)
        },{"containers.products":true},{"lean":true})

        resolve(organization.containers[0].products)
    })
}

export const updateProduct = (req, res, orgId = undefined, mutableProd = undefined) => {
    return new Promise(async (resolve, reject) => {
        try {
            
            
            if((req === undefined || res=== undefined) && mutableProd !== undefined){
                const updateOp = await orgModel.updateOne(
                    { "_id":mongoose.Types.ObjectId(orgId) },
                    { "$set": {"containers.$[].products.$[product]": mutableProd } },
                    { "arrayFilters": [ {"product._id":mongoose.Types.ObjectId(mutableProd._id)} ] }    
                    )
                    resolve(updateOp)
                    return
            }
            
            req.body.product._id = mongoose.Types.ObjectId(req.body.product._id)
            
            const operation = await orgModel.updateOne(
                { "_id":mongoose.Types.ObjectId(res.locals.organization) },
                { "$set": {"containers.$[].products.$[product]": req.body.product } },
                { "arrayFilters": [ {"product._id":mongoose.Types.ObjectId(req.query.id)} ] }    
            )

            resolve(operation) 
        } catch (err) {
            reject(err)
        }



        // if(org === null || org === undefined) {
        //     reject("No organization found")
        // }


        // const product = org.containers[0].products.id(id)

        // if(product === null || product === undefined) {
        //     reject("No product found")
        // }

        // product[field] = value

        // org.save((err) => {
        //     if(err) reject(err)
            
        //     resolve(org)
        // })
    })
}

export const updateManyProducts = (config) => {
    return new Promise((resolve, reject) => {
        orgModel.findOneAndUpdate(
            config.filter,
            config.updateOperation,
        )
        .then((result) => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
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
    
            
            orgModel.findOneAndUpdate(
                {
                    organization
                },
                {
                    "$pull":{
                        "orders": {
                            "products":{
                                "_id":id
                            }
                        }
                    }
                }
            )
            .then(() => {
                product.remove()
    
                org.save((err) => {
                    if(err) return reject(err)
        
                    return resolve("Doc removed")
                })
            })
            .catch((err) => {
                reject(err)
            })

        })
        
    })
}

export const getProductById = (orgId, containerId,prodId) => {
    return new Promise(async(resolve, reject) => {
        try {
            const found = await orgModel.aggregate(
                [
                    {
                        "$match": {
                            "_id": mongoose.Types.ObjectId(orgId),
                        }
                    },
                    {
                        "$unwind": "$containers"
                    },
                    {
                        "$unwind": "$containers.products"
                    },
                    {
                        "$match": {
                            "containers.products._id":mongoose.Types.ObjectId(prodId)
                        }
                    },
                    {
                        "$project":{
                            "containers": {
                                "_id":1,
                                "products":1
                            }
                        }
                    }
                ]
            )
            resolve(found[0].containers.products)
        } catch (err){
            reject(err)
        }
    })
}

export const getProductRelation = (orgId, containerId, productId) => {
    return new Promise(async(resolve, reject) => {
        try {
            const found = await orgModel.aggregate([
                {
                    $match: { _id: mongoose.Types.ObjectId(orgId) }
                },
                {
                    $unwind: "$containers",
                },
                {
                    $match: { "containers._id": mongoose.Types.ObjectId(containerId) }
                },
                {
                    $addFields: {
                        targetProduct: {
                            $arrayElemAt: [{
                                $filter: {
                                    input: "$containers.products",
                                    as: "product",
                                    cond: {
                                        $eq: [ "$$product._id", mongoose.Types.ObjectId(productId) ]
                                    }
                                }
                            }, 0
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        targetProduct: 1,
                        mixesProducts: {
                            $cond: {
                                if: "$targetProduct.mix.isMix",
                                then: [],
                                else: {
                                    $filter: {
                                        input: "$containers.products",
                                        as: "product",
                                        cond: {
                                            $and: [
                                                {
                                                    $eq: [ "$$product.mix.isMix", true ]
                                                },
                                                {
                                                    $anyElementTrue: {
                                                        $map: {
                                                            input: "$$product.mix.products",
                                                            as: "productStrain",
                                                            in: {
                                                                $eq: [ "$$productStrain.strain", "$targetProduct._id" ]
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        mixesProducts: 1
                    }
                }
            ])
            resolve(found[0].mixesProducts)
        } catch (err){
            reject(err)
        }
    })
}

export const distributeMixAmount = (orgId, newMixProduct) => {
    return new Promise(async (resolve, reject) => {
        try {
            newMixProduct._id = mongoose.Types.ObjectId(newMixProduct._id)
            
            const operation = await orgModel.updateOne(
                { "_id":mongoose.Types.ObjectId(orgId) },
                { "$set": {"containers.$[].products.$[product]": newMixProduct } },
                { "arrayFilters": [ {"product._id":mongoose.Types.ObjectId(newMixProduct._id)} ] }    
            )
            resolve(operation) 
        } catch (err) {
            reject(err)
        }
    })
}

