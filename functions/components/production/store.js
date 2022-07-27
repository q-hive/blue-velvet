import { Production } from '../../models/index.js'
import { mongoose } from '../../mongo.js'
import { dateToArray, nextDay } from '../../utils/time.js'


const prodModel = mongoose.model('production', Production)

export const getProductionForOrder = async (products, organization, filter) => {
    return new Promise((resolve, reject) => {
        // * Will return the production line with available parameters if it's one
        // * IF no production line is fit to host the order, a new production line must be returned

        let totalTrays = products.map(prod => prod.trays).reduce((accTrays, trays) => accTrays + trays, 0)

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
                container:      
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
                end: addTimeToDate(filter.started, {
                    ms:     0,
                    s:      2, // * Add only 2 weeks
                    m:      0,
                    h:      0,
                    d:      0,
                    w:      0,
                    month:  0,
                    y:      0

                })
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

export const getProductions = async (filters) => {
    let criteria = prodModel
    if (filters.start !== undefined && filters.start !== null) {
        let dt = new Date(dateToArray(filters.start))
        criteria = criteria.where({ start: { 
            $gte:   dt, 
            $lt:    nextDay(dt)
        }})
    }
    if (filters.organization !== undefined && filters.organization !== null) 
        criteria = criteria.where({ organization: filters.organization })
    if (filters.trays !== undefined && filters.trays !== null) 
        criteria = criteria.where({ available: { $gte: filters.trays } })

    return await criteria.find({})
}