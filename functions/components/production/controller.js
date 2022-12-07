import { calculateTimeEstimation } from "../work/controller.js"
import { getPosibleStatusesForProduction, getProductionInContainer, insertWorkDayProductionModel, productionCycleObject, updateManyProductionModels } from "./store.js"
import nodeschedule from 'node-schedule'
import { getProductById } from "../products/store.js"
import mongoose from "mongoose"


export const getTaskByStatus = async (production, orgId=undefined, container=undefined) => {
    let task = () => console.log("No task assigned")
    let executeAt = new Date()
    switch(production.ProductionStatus){
        case "soaking1":
            task = updateManyProductionModels
            executeAt = new Date(Date.now() + (6*60*60*1000))
            break;
        case "soaking2":
            task = updateManyProductionModels
            executeAt = new Date(Date.now() + (6*60*60*1000))
            break;
        case "growing":
            task = updateManyProductionModels
            if((orgId !== undefined) && (container !== undefined)){
                executeAt = await getEstimatedHarvestDate(new Date(), production.ProductID, orgId, container)
            }
            break;
    }
    return {task, executeAt}
}

export const scheduleTask = async (config) => {
    const {task, executeAt} = await getTaskByStatus(config.production, config.organization, config.container)

    config.task = task
    
    config.scheduleInDate = executeAt
    

    nodeschedule.scheduleJob(config.scheduleInDate, async function() {
        let result = ""
        try {
            result = await config.task(config.organization, config.container, [config.production._id])
        } catch (err) {
            Promise.reject(err)
        }

        return result
    })
    console.log("A scheduled task must be executed at:" + config.scheduleInDate)
}

export const setupGrowing = (workData) => {
    const growingSetup = workData.map((productionObj) => {
        const lightTime = productionObj.productData.day
        const darkTime = productionObj.productData.night
        
        const triggerHarvestTime = Date.now() + (((((lightTime*24)*60)*60)*1000) + ((((darkTime*24)*60)*60)*1000))

        console.log(`The product -> ${productionObj.productData.name} needs a total time of ${darkTime + lightTime} days to grow. scheduling monitoring task...`)
        const triggerParsedDate = new Date(triggerHarvestTime)
        triggerParsedDate.setHours(4,0,0)

        return {_id:productionObj.productData.prodId, name:productionObj.productData.name, harvest:productionObj.productData.harvest, orders:productionObj.productData.orders, date:triggerParsedDate, workData:{...productionObj}}
    })
    
    return growingSetup
}

export const startGrowing = (config) => {
    return new Promise((resolve, reject) => {
        try{
                config.growingSetup.map((products) => {
                    const scheduledTask = scheduleTask(
                        {
                            ...products,
                            scheduleInMs:products.date.getTime() - Date.now(),
                            scheduleInDate: products.date,
                            task:() => updateProductionByStatus(config.status, config.organization, config.production).then(() => console.log("Completed")).catch(() => console.log("Failed"))
                        }
                    )
                    return scheduledTask
                })
        } catch (err) {
            reject(err)
        }
    })
}

export const getInitialStatus = (product) => {
    let status = "seeding"
    if(product.parameters.day + product.parameters.night > 7){
        status = "preSoaking"
    }
    
    return status
}

/**
 * @param {*} array used to define the criteria for grouping using MQL as helper
 * @returns the argument object passed 
*/
export const groupBy = (array, production, format) => {
   const productionStatuses = getPosibleStatusesForProduction()

   let accumulatedProduction = {}
   let acumInArray = []
   
   //get production totals (acummulated seeds, harvest and trays based on ProductionModels) by product, grouped by the same ProductionStatus and HarvestDate
    productionStatuses.forEach((status) => {
        //*for each product name filter in production by the name
        const filteredProduction = production.filter((productionModel) => {
            return productionModel.ProductionStatus === status
        })

        const hashDates = {}, result = []
        // const RelatedOrders = []

        //*iterate over filtered production models and group and acumulate them by EstimatedHarvestDate using a hashtable
        for(const {EstimatedHarvestDate,EstimatedStartDate,ProductName,ProductID, ProductionStatus,_id,start, updated, RelatedOrder, seeds, trays, harvest} of filteredProduction){
            if(!seeds || !harvest || !trays){
                continue
            }

            if(!hashDates[ProductName]){
                hashDates[ProductName] = {}     
            }

            if(!hashDates[ProductName][EstimatedStartDate]){
                hashDates[ProductName][EstimatedStartDate] = {
                    ProductName,
                    ProductID,
                    ProductionStatus,
                    EstimatedStartDate,
                    EstimatedStartDate,
                    seeds:0, 
                    trays:0, 
                    harvest:0,
                    modelsId:[],
                    start, 
                    updated, 
                    relatedOrders:[]
                }

                result.push(hashDates[ProductName][EstimatedStartDate])
            }   
            
            hashDates[ProductName][EstimatedStartDate].seeds +=+ seeds
            hashDates[ProductName][EstimatedStartDate].harvest +=+ harvest
            hashDates[ProductName][EstimatedStartDate].trays +=+ trays
            hashDates[ProductName][EstimatedStartDate].modelsId.push(_id)
            hashDates[ProductName][EstimatedStartDate].relatedOrders.push(RelatedOrder)
        }

        if(format === "array"){
            acumInArray.push({[status]:result})
        }

        if(format === "hash") {
            accumulatedProduction = {...accumulatedProduction, [status]:result}
        }
        
    })

    let requiredReturn = {
        "array":acumInArray,
        "hash":accumulatedProduction
    }
    
   return requiredReturn[format]
}

export const grouPProductionForWorkDay = (production, format) => {
    try {
        //*THE PARAMETERS ARE NOT ACTUALLY BEING USED YET
        const grouppedProduction = groupBy(["status-eq","harvestDate-eq","productName-eq","startDate"], production, format)
        return grouppedProduction
    } catch (err) {
        console.log(err)
        throw new Error("Error in object analyser - groupBy")        
    }
}

//*Production workdays
export const getProductionTotal = (req, res) => {
    return new Promise((resolve, reject) => {
        
    })
}

export const getProductionWorkByContainerId = (req,res) => {
    return new Promise((resolve, reject) => {
        let requiredProductionFormat = "array"
        if(req.path === "/workday"){
            requiredProductionFormat = "hash"
        }
        getProductionInContainer(res.locals.organization, req.query.containerId)
        .then((production) => {
            
            //*If no production is returned then return empty array
            if(production.length >0){
                const productionGrouped = grouPProductionForWorkDay(production, requiredProductionFormat)
                const times  = calculateTimeEstimation(grouPProductionForWorkDay(production, "array"), true)

                times.forEach((timeTask) => {
                    if(productionGrouped[Object.keys(timeTask)[0]].length=== 0) {
                        return
                    }
                    
                    productionGrouped[Object.keys(timeTask)[0]].push({minutes:timeTask[Object.keys(timeTask)[0]].minutes})
                })
                
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

//*Build model for production control based on order packages and products parameters
export const buildProductionDataFromOrder = async (order, dbproducts) => {
    //*Add grams per size to order product packages
    const productsModified = await Promise.all(
        order.products.map(async(prod, pidx) => {
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
                    
                    const mappedMixComposition = mixProds.map(async (mprod) => {
                        
                        const mixFound = dbproducts.find((fprod) => fprod._id.equals(mprod.strain)).toObject()
                        const mixProductStartProductionDate = getEstimatedStartProductionDate(order.date, mixFound)
                        const mixProductHarvestDate = await getEstimatedHarvestDate(mixProductStartProductionDate,mixFound)
                        
                        delete mixFound.mix
                        delete mixFound.price
                        delete mprod.strain
                        mixFound.productionData = {
                            ProductName:            mixFound.name,
                            ProductionStatus:       getInitialStatus(mixFound),
                            RelatedOrder:           order._id,
                            EstimatedHarvestDate:   mixProductHarvestDate,
                            ProductID:              mixFound._id,
                            harvest:                harvest * (mprod.amount/100),
                            seeds:                  harvest * (mixFound.parameters.seedingRate/mixFound.parameters.harvestRate),
                            trays:                  (harvest * (mixFound.parameters.seedingRate/mixFound.parameters.harvestRate)) / mixFound.parameters.seedingRate
                        }
    
                        return {...mprod, ...mixFound, mix:true}
                    })
    
                    await Promise.all(mappedMixComposition)
    
                    prod.products = mappedMixComposition
                    prod.productionData = mappedMixComposition.map((productOfMix) => productOfMix.productionData)
                    
                } else {
                    prod.mix = {isMix: false}
                    //* Get seedingRate (in grams) per tray
                    prod["seedingRate"] = prodFound.parameters.seedingRate
                    //* Get harvestRate (in grams) per tray
                    prod["harvestRate"] = prodFound.parameters.harvestRate
                    const estimatedStartDate = getEstimatedStartProductionDate(order.date, prodFound)
                    const harvestDate = await getEstimatedHarvestDate(estimatedStartDate, prodFound)
                    
                    prod["productionData"] = [{
                            ProductName:            prodFound.name,
                            ProductionStatus:       getInitialStatus(prodFound),
                            RelatedOrder:           order._id,
                            ProductID:              prodFound._id,
                            EstimatedStartDate:     estimatedStartDate,
                            EstimatedHarvestDate:   harvestDate,
                            harvest:                harvest,
                            seeds:                  harvest * (prodFound.parameters.seedingRate / prodFound.parameters.harvestRate),
                            trays:                  (harvest * (prodFound.parameters.seedingRate / prodFound.parameters.harvestRate)) / prodFound.parameters.seedingRate 
                    }]
    
                }
            }
            
            return prod
        })
    )
    const productionData = order.products.flatMap((prod) => {
        return prod.productionData
    })

    return productionData
}
//*Estimate date to harvest the product if it is seeded today.
export const getEstimatedHarvestDate = async (startDate,product, orgId, container) => {
    try {
        let productRef = product
        
        if(mongoose.isObjectIdOrHexString(product)){
            const org = await getProductById(orgId, container, product)
            productRef = org
        }
        const lightTime = productRef.parameters.day
        const darkTime = productRef.parameters.night
        // const estimatedProductionStartDate = new Date(orderDate).getTime() - (((((lightTime*24)*60)*60)*1000) + ((((darkTime*24)*60)*60)*1000))
        const estimatedTime = startDate.getTime() + (((((lightTime*24)*60)*60)*1000) + ((((darkTime*24)*60)*60)*1000))
        const estimatedDate = new Date(estimatedTime)  

        estimatedDate.setHours(4,0,0)  

        return estimatedDate
    } catch (err) {
        Promise.reject(err)
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



//*Store
export const saveProductionForWorkDay = async (orgId, containerId, production) => {
    try {
        await insertWorkDayProductionModel(orgId,containerId,production)
    } catch (err) {
        throw new Error(err)
    }
}

export const updateProductionToNextStatus = (orgId,container,productionIds) => {
    return new Promise((resolve, reject) => {
        updateManyProductionModels(orgId,container,productionIds)
        .then((result) => resolve(result))
        .catch(err => reject(err))
    })
}
