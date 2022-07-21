import Production from '../../models/production'
import { mongoose } from '../../mongo.js'
import { getContainers } from "../container/store"


const prodModel = mongoose.model('production', Production)

export const getProductionForOrder = async (products, organization, filter) => {
    return new Promise((resolve, reject) => {
        // * Will return the production line with available parameters if it's one
        // * IF no production line is fit to host the order, a new production line must be returned

        let totalTrays = products.map(prod => prod.trays).reduce((accTrays, trays) => accTrays + trays, 0)

        // * Check for production lines at same day and validate if adding is possible
        let prodLines = await getProduction({
            started:        filter.started,
            organization:   organization,
            trays:          totalTrays
        })


        // * If no production line available, create one new
        if (prodLines.length === 0) {
            // * Create new production line
            let prodMapped = {
                orders:     filter.order,
                tasks: [],
                activeTasks: [],
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
                    s:      0,
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