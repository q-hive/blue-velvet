import { getProductById } from "../products/store.js"

//*Estimate date to harvest the product if it is seeded today.
export const getEstimatedHarvestDate = async (product) => {
    try {

        const lightTime = product.parameters.day
        const darkTime = product.parameters.night
        const estimatedTime = Date.now() + (((((lightTime*24)*60)*60)*1000) + ((((darkTime*24)*60)*60)*1000))
        const estimatedDate = new Date(estimatedTime)  

        estimatedDate.setHours(4,0,0)  

        return estimatedDate
    } catch (err) {
        throw Error("Error getting estimation for harvesting date")
    }
}

//*Build model for production control based on order packages and products parameters
export const buildProductionDataFromOrder = (order, dbproducts) => {
    //*Add grams per size to order product packages
    order.products.forEach((prod, pidx) => {
        //*Find the product in database
        const prodFound = dbproducts.find((fprod) => fprod._id.equals(prod._id))
        prod.packages.forEach((pkg, idx) => {
            switch(pkg.size){
                case "small":
                    prod.packages[idx] = {
                        ...prod.packages[idx],
                        number:pkg.number, 
                        grams: prodFound.price[0].packageSize * pkg.number,
                    }
                    break;
                case "medium":
                    prod.packages[idx] = {
                        ...prod.packages[idx], 
                        number:pkg.number,
                        grams: prodFound.price[1].packageSize * pkg.number
                    }
                    break;
                default:
                    break;
            }
        })
        
        //*Total grams will define number of trays based on seedingRate
        const harvest = prod.packages.reduce((prev, curr) => {
            return prev + curr.grams
        },0)

        if(prodFound){
            if(prodFound.mix.isMix){
                
                prod.mix = {isMix: true}
                const mixProds = prodFound.toObject().mix.products
                
                const mappedMixComposition = mixProds.map((mprod) => {
                    
                    const mixFound = dbproducts.find((fprod) => fprod._id.equals(mprod.strain)).toObject()
                    const mixProductHarvestDate = getEstimatedHarvestDate(mixFound)
                    
                    delete mixFound.mix
                    delete mixFound.price
                    delete mprod.strain
                    mixFound.productionData = {
                        ProductName:            mixFound.name,
                        ProductionStatus:       "pre-soaking",
                        ProductionOrder:        order._id,
                        EstimatedHarvestDate:   mixProductHarvestDate,
                        ProductID:              mixFound._id,
                        harvest:                harvest * (mprod.amount/100),
                        seeds:                  harvest * (mixFound.parameters.seedingRate/mixFound.parameters.harvestRate),
                        trays:                  (harvest * (mixFound.parameters.seedingRate/mixFound.parameters.harvestRate)) / mixFound.parameters.seedingRate
                    }

                    return {...mprod, ...mixFound, mix:true}
                })

                prod.products = mappedMixComposition
                prod.productionData = mappedMixComposition.map((productOfMix) => productOfMix.productionData)
                
            } else {
                prod.mix = {isMix: false}
                //* Get seedingRate (in grams) per tray
                prod["seedingRate"] = prodFound.parameters.seedingRate
                //* Get harvestRate (in grams) per tray
                prod["harvestRate"] = prodFound.parameters.harvestRate
                prod["productionData"] = [{
                        ProductName:            prodFound.name,
                        ProductionStatus:       "pre-soaking",
                        ProductionOrder:        order._id,
                        ProductID:              prodFound._id,
                        EstimatedHarvestDate:   getEstimatedHarvestDate(prodFound)
                }]

            }
        }
        
    })
    
    const productionData = order.products.flatMap((prod) => {
        return prod.productionData
    })

    
    return productionData
}