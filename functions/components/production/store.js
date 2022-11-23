import Organization from '../../models/organization.js'
import { mongoose } from '../../mongo.js'
import { dateToArray, nextDay } from '../../utils/time.js'

const orgModel = mongoose.model('organizations', Organization)

export const getProductionForOrder = async (products, organization, filter) => {
    return new Promise(async (resolve, reject) => {
        // * Will return the production line with available parameters if it's one
        // * IF no production line is fit to host the order, a new production line must be returned

        let totalTrays = products.map(prod => prod.trays).reduce((accTrays, trays) => accTrays + trays, 0)

        // * Obtain organization
        getOrganizationById(res.locals.organization)
        .then(async organization => {
            let availableContainers = await organization.containers.find({ available: { $gte: totalTrays } }).exec()

            if (prodLines.length == 0) {
            
            }

            return availableContainers
        })

        // * Check for production lines at same day and validate if adding is possible
        let prodLines = await getProductions({
            start:          filter.start,
            organization:   organization,
            trays:          totalTrays
        })


        // * If no production line available, create one new
        if (prodLines.length === 0) {
            // * Create new production line
            let contId = getContainerForProduction({
                trays: totalTrays   
            })

            let prodMapped = {
                orders:         [filter.order],
                container:      [],
                tasks:          [],
                activeTasks:    [],
                products: filter.products.map(prod => {
                    return {
                        _id: prod._id,
                        trays: prod.trays,
                        seedId: prod.seedId,
                        batch: prod.batch
                    }
                }),
                end: addTimeToDate(filter.started, { w: 2 })
            }

            let prodDoc = new prodModel(prodMapped)

            prodDoc.save((err, prod) => {
                if (err) reject(err)

                // * Check for updating

                resolve([prod._id])
            })
        }
        resolve(prodLines) 
    })
}

export const getProductionInContainer = async (orgId, containerId) => {
    return new Promise((resolve, reject) => {
        orgModel.findOne(
            {
                "_id":mongoose.Types.ObjectId(orgId), 
                "containers._id":mongoose.Types.ObjectId(containerId)
            },
            {
                "containers.production.$":true
            }
        )
        .then((doc) => {
            const result = doc.containers[0]?.production
            if(!result){
                reject(new Error("No result from query - getProductionInContainer controller"))
                return
            }

            resolve(result)

        })
        .catch((err) => reject(err))
    })
}

export const getPosibleStatusesForProduction = () => {
    const statuses = ["pre-soaking", "seeding", "growing", "harvestReady", "packing"]
    return statuses
}