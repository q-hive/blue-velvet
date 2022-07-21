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
        let prodLines = await getProduction([
            started:        filter.started,
            organization:   organization
            
        ])

        if (prodLines.length === 0) {
            // * Create new production line
            let prodMapped = {
                end: addTimeToDate(filter.started, )
            }
        }

        resolve(prodLines) 
        // * If no production line available, create one new
    })
}