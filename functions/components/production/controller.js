import { isSameDay } from "date-fns"
import { getProductById } from "../products/store.js"
import { getPosibleStatusesForProduction, getProductionInContainer, insertWorkDayProductionModel } from "./store.js"

//*Estimate date to harvest the product if it is seeded today.
export const getEstimatedHarvestDate = (estimatedtStartDate,product) => {
    try {

        const lightTime = product.parameters.day
        const darkTime = product.parameters.night
        // const estimatedProductionStartDate = new Date(orderDate).getTime() - (((((lightTime*24)*60)*60)*1000) + ((((darkTime*24)*60)*60)*1000))
        const estimatedTime = estimatedtStartDate.getTime() + (((((lightTime*24)*60)*60)*1000) + ((((darkTime*24)*60)*60)*1000))
        const estimatedDate = new Date(estimatedTime)  

        estimatedDate.setHours(4,0,0)  

        return estimatedDate
    } catch (err) {
        throw Error("Error getting estimation for harvesting date")
    }
}

export const getEstimatedStartProductionDate = (orderDate,product) => {
    console.log(product)
    try {

        const lightTime = product.parameters.day
        const darkTime = product.parameters.night
        const estimatedProductionStartDate = new Date(new Date(orderDate).getTime() - (((((lightTime*24)*60)*60)*1000) + ((((darkTime*24)*60)*60)*1000)))
        estimatedProductionStartDate.setHours(4,0,0)  

        return estimatedProductionStartDate
    } catch (err) {
        console.log(err)
        throw Error("Error getting estimation to start production date")
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
                    const mixProductStartProductionDate = getEstimatedStartProductionDate(order.date, mixFound)
                    const mixProductHarvestDate = getEstimatedHarvestDate(mixProductStartProductionDate,mixFound)
                    
                    delete mixFound.mix
                    delete mixFound.price
                    delete mprod.strain
                    mixFound.productionData = {
                        ProductName:            mixFound.name,
                        ProductionStatus:       "pre-soaking",
                        RelatedOrder:           order._id,
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

                const estimatedStartDate = getEstimatedStartProductionDate(order.date, prodFound)
                prod["productionData"] = [{
                        ProductName:            prodFound.name,
                        ProductionStatus:       "pre-soaking",
                        RelatedOrder:           order._id,
                        ProductID:              prodFound._id,
                        EstimatedStartDate:     estimatedStartDate,
                        EstimatedHarvestDate:   getEstimatedHarvestDate(estimatedStartDate, prodFound),
                        harvest:                harvest,
                        seeds:                  harvest * (prodFound.parameters.seedingRate / prodFound.parameters.harvestRate),
                        trays:                  (harvest * (prodFound.parameters.seedingRate / prodFound.parameters.harvestRate)) / prodFound.parameters.seedingRate 
                }]

            }
        }
        
    })
    
    const productionData = order.products.flatMap((prod) => {
        return prod.productionData
    })

    
    return productionData
}

export const updateProductionByStatus = (status, organization, production) => {
    return new Promise((resolve, reject) => {
        const flatOrders = production.flatMap((prodData) => prodData.productData.orders)
        const nonRepeatedOrders = Array.from(new Set(flatOrders))

        const updateOrdersbyMapping = nonRepeatedOrders.map(async (order) => {
            const result = await updateOrder(organization, order, {
                paths: [{path:"status", value:status}]
            })
            return result
        })
        
        const updateProductsByMapping = production.map(async(productionData, index) => {
            await updateProduct(organization, productionData.productData.prodId, "status", status)
            const completeProdObj = await getProductById(organization, "633b2e0cd069d81c46a18033", productionData.productData.prodId)
            return {...productionData, productData: {...productionData.productData, ...completeProdObj.parameters}}
        })



        Promise.all(updateOrdersbyMapping)
        Promise.all(updateProductsByMapping)
        .then((result) => {
            if(status === "growing"){
                console.log("Starting schedule job...")
                const growingSetup = setupGrowing(result)
                startGrowing({ organization, status:"harvestReady", production, growingSetup})
                .then((result) => {
                    resolve(result)
                })
                .catch((err) => {
                    reject(err)
                })
            }
            
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
    
}

/**
 * @param {*} array used to define the criteria for grouping using MQL as helper
 * @returns the argument object passed 
*/
export const groupBy = (array, production) => {
   const productionStatuses = getPosibleStatusesForProduction()

   let accumulatedProduction = {}
   
   //get production totals (acummulated seeds, harvest and trays based on ProductionModels) by product, grouped by the same ProductionStatus and HarvestDate
    productionStatuses.forEach((status) => {
        //*for each product name filter in production by the name
        const filteredProduction = production.filter((productionModel) => {
            return productionModel.ProductionStatus === status
        })

        const hash = {}, result = []
        // const RelatedOrders = []

        //*iterate over filtered production models and group and acumulate them by EstimatedHarvestDate using a hashtable
        for(const {EstimatedHarvestDate,ProductName,ProductID, ProductionStatus,_id,start, updated, RelatedOrder, seeds, trays, harvest} of filteredProduction){
            if(!seeds || !harvest || !trays){
                continue
            }

            // RelatedOrders.push(RelatedOrder)
            if(!hash[EstimatedHarvestDate]){
                hash[EstimatedHarvestDate] = {
                    ProductName,
                    ProductID,
                    ProductionStatus,
                    EstimatedHarvestDate,
                    seeds:0, 
                    trays:0, 
                    harvest:0,
                    modelsId:[],
                    start, 
                    updated, 
                    relatedOrders:[]
                }      

                result.push(hash[EstimatedHarvestDate])
            }

            hash[EstimatedHarvestDate].seeds +=+ seeds
            hash[EstimatedHarvestDate].harvest +=+ harvest
            hash[EstimatedHarvestDate].trays +=+ trays
            hash[EstimatedHarvestDate].modelsId.push(_id)
            hash[EstimatedHarvestDate].relatedOrders.push(RelatedOrder)
        }


        accumulatedProduction = {...accumulatedProduction, [status]:result}
    })

   return accumulatedProduction
}

export const grouPProductionForWorkDay = (production) => {
    try {
        //*THE PARAMETERS ARE NOT ACTUALLY BEING USED YET
        const grouppedProduction = groupBy(["status-eq","harvestDate-eq","productName-eq","startDate"], production)
        return grouppedProduction
    } catch (err) {
        console.log(err)
        throw new Error("Error in object analyser - groupBy")        
    }
}

const insertOrdersInProduction = (production, orders) => {
    production.orders = []

    const prodMatchedOrders = orders.filter((order) => {
        return order.productionData.find((produc) => produc.id.equals(production.prodId))
    })

    let mappedMatchedOrders = prodMatchedOrders.forEach((matchedOrder) => {
        production.orders.push(matchedOrder._id)    
    })

    return production
}


export const getProductionTotal = (req, res) => {
    return new Promise((resolve, reject) => {
        
    })
}

export const getProductionWorkByContainerId = (req,res) => {
    return new Promise((resolve, reject) => {
        getProductionInContainer(res.locals.organization, req.query.containerId)
        .then((production) => {
            
            //*If no production is returned then return empty array
            if(production.length >0){
                const productionGrouped = grouPProductionForWorkDay(production)
                resolve(productionGrouped)
                return
            }

            resolve(production)
        })
        .catch(err => {
            reject(err)
        })
    })
}

export const saveProductionForWorkDay = async (orgId, containerId, production) => {
    try {
        const insertOp = await insertWorkDayProductionModel(orgId,containerId,production)
        console.log(insertOp)
        return production
    } catch (err) {
        throw new Error(err)
    }
}
