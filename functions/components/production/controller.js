import moment from "moment-timezone"
import { buildTaskFromProductionAccumulated, calculateTimeEstimation } from "../work/controller.js"
import {
    getPosibleStatusesForProduction,
    getProductionByProduct,
    getProductionInContainerByCurrentDate,
    insertWorkDayProductionModel,
    productionCycleObject,
    updateManyProductionModels,
    getProductionByOrderId,
    upsertProduction,
    createSingleProductionModelProduct,
    updateSingleProductionModelProduct,
    deleteSingleProductionModelProduct
} from "./store.js"
import { getAllProducts, getProductById } from "../products/store.js"
import mongoose from "mongoose"
import { getOrderById } from "../orders/store.js"
import { buildPackagesFromOrders } from "../delivery/controller.js"
import { isLargeCicle } from "../products/controller.js"
import { getContainerById, updateContainerById } from "../container/store.js"


export const updateStartHarvestDate = async (config) => {
    const { production, organization, container, tz } = config
    let executeAt = "";

    switch (production.ProductionStatus) {
        case "soaking1":
        case "soaking2":
            executeAt = new Date(Date.now() + (6 * 60 * 60 * 1000))
            break;
        case "growing":
            if ((organization !== undefined) && (container !== undefined)) {
                executeAt = await getEstimatedHarvestDate(moment.tz(tz), production.ProductID, organization, container, tz)
            }
            break;
    }
    return executeAt
}

// export const setupGrowing = (workData) => {
//     const growingSetup = workData.map((productionObj) => {
//         const lightTime = productionObj.productData.day
//         const darkTime = productionObj.productData.night

//         const triggerHarvestTime = Date.now() + (((((lightTime*24)*60)*60)*1000) + ((((darkTime*24)*60)*60)*1000))

//         console.log(`The product -> ${productionObj.productData.name} needs a total time of ${darkTime + lightTime} days to grow. scheduling monitoring task...`)
//         const triggerParsedDate = new Date(triggerHarvestTime)
//         triggerParsedDate.setHours(4,0,0)

//         return {_id:productionObj.productData.prodId, name:productionObj.productData.name, harvest:productionObj.productData.harvest, orders:productionObj.productData.orders, date:triggerParsedDate, workData:{...productionObj}}
//     })

//     return growingSetup
// }

// export const startGrowing = (config) => {
//     return new Promise((resolve, reject) => {
//         try{
//                 config.growingSetup.map((products) => {
//                     const scheduledTask = scheduleTask(
//                         {
//                             ...products,
//                             scheduleInMs:products.date.getTime() - Date.now(),
//                             scheduleInDate: products.date,
//                             task:() => updateProductionByStatus(config.status, config.organization, config.production).then(() => console.log("Completed")).catch(() => console.log("Failed"))
//                         }
//                     )
//                     return scheduledTask
//                 })
//         } catch (err) {
//             reject(err)
//         }
//     })
// }

export const getInitialStatus = (product) => {
    return isLargeCicle(product.parameters.day + product.parameters.night)
        ? "preSoaking"
        : "seeding";
}

/**
 * @param {*} array used to define the criteria for grouping using MQL as helper
 * @returns the argument object passed 
*/
export const groupBy = (criteria, production, format, includeOrders = false, includeAllProducts = false, products = undefined) => {
    const productionStatuses = getPosibleStatusesForProduction()

    let accumulatedProduction = {}
    let acumInArray = []
    let orders = []
    //get production totals (acummulated seeds, harvest and trays based on ProductionModels) by product, grouped by the same ProductionStatus and HarvestDate
    productionStatuses.forEach((status) => {
        //*for each product name filter i n production by the name
        const filteredProduction = production.filter((productionModel) => {
            return productionModel.ProductionStatus === status
        })

        const hashDates = {}, result = []
        // const RelatedOrders = []
        if (!includeAllProducts && !products) {
            //*iterate over filtered production models and group and acumulate them by EstimatedHarvestDate using a hashtable
            for (const { EstimatedHarvestDate, EstimatedStartDate, ProductName, ProductID, ProductionStatus, _id, start, updated, RelatedOrder, seeds, trays, dryracks, harvest } of filteredProduction) {
                if (!seeds || !harvest || !trays) {
                    continue
                }




                if (!hashDates[ProductName]) {
                    hashDates[ProductName] = {}
                }

                if (criteria === "status") {
                    if (ProductionStatus === "growing") {
                        //*Ignore production status growing for production workday frontend
                        continue
                    }
                    if (ProductionStatus === "onDelivery") {
                        //*Ignore production status growing for production workday frontend
                        continue
                    }

                    if (!hashDates[ProductName][ProductionStatus]) {
                        hashDates[ProductName][ProductionStatus] = {
                            ProductName,
                            ProductID,
                            ProductionStatus,
                            EstimatedStartDate,
                            EstimatedHarvestDate,
                            seeds: 0,
                            trays: 0,
                            harvest: 0,
                            dryracks: 0,
                            modelsId: [],
                            start,
                            updated,
                            relatedOrders: []
                        }

                        result.push(hashDates[ProductName][ProductionStatus])
                    }
                    if (hashDates[ProductName][ProductionStatus]) {
                        hashDates[ProductName][ProductionStatus].seeds += + seeds
                        hashDates[ProductName][ProductionStatus].harvest += + harvest
                        hashDates[ProductName][ProductionStatus].trays += + trays
                        hashDates[ProductName][ProductionStatus].dryracks += + dryracks
                        hashDates[ProductName][ProductionStatus].modelsId.push(_id)
                        hashDates[ProductName][ProductionStatus].relatedOrders.push(RelatedOrder)
                        orders.push(RelatedOrder)
                    }
                }

                if (criteria === "startDate") {

                    if (!hashDates[ProductName][EstimatedStartDate]) {
                        hashDates[ProductName][EstimatedStartDate] = {
                            ProductName,
                            ProductID,
                            ProductionStatus,
                            EstimatedStartDate,
                            EstimatedStartDate,
                            seeds: 0,
                            trays: 0,
                            harvest: 0,
                            dryracks: 0,
                            modelsId: [],
                            start,
                            updated,
                            relatedOrders: []
                        }

                        result.push(hashDates[ProductName][EstimatedStartDate])
                    }
                    if (hashDates[ProductName][EstimatedStartDate]) {
                        hashDates[ProductName][EstimatedStartDate].seeds += + seeds
                        hashDates[ProductName][EstimatedStartDate].harvest += + harvest
                        hashDates[ProductName][EstimatedStartDate].trays += + trays
                        hashDates[ProductName][EstimatedStartDate].dryracks += + dryracks
                        hashDates[ProductName][EstimatedStartDate].modelsId.push(_id)
                        hashDates[ProductName][EstimatedStartDate].relatedOrders.push(RelatedOrder)
                        orders.push(RelatedOrder)
                    }
                }



            }

            if (format === "array") {
                acumInArray.push({ [status]: result })
            }

            if (format === "hash") {
                accumulatedProduction = { ...accumulatedProduction, [status]: result }
            }
        }

        if (includeAllProducts && products !== undefined && products.length > 0) {
            //*BUILD HASH TABLE WITH PRODUCTNAMES AS KEYS AND PROPERTY OF STATUS WICH HAS A VALUE OF OBJECT BASED ON PRODUCTION MODELS
            products.forEach((product) => {
                if (!hashDates[product.name]) {
                    hashDates[product.name] = {}
                }
                if (!hashDates[product.name][status]) {
                    //*If status === "preSoaking" check only for products that are large cycle products and that are not mixes
                    let totalDays = !product.mix.isMix ? product.parameters.night + product.parameters.day : 0

                    if (status === "preSoaking" && !isLargeCicle(totalDays)) {
                        return
                    }

                    if (status === "seeding" && product.mix.isMix) {
                        return
                    }


                    hashDates[product.name][status] = {
                        ProductName: product.name,
                        ProductID: product._id,
                        RelatedMix: { isForMix: false },
                        ProductionStatus: status,
                        EstimatedStartDate: new Date(),
                        EstimatedHarvestDate: new Date(),
                        seeds: 0,
                        trays: 0,
                        harvest: 0,
                        dryracks: 0,
                        modelsId: [],
                        relatedOrders: [],
                        modelsToHarvestMix: [],
                        isMixModel: product.mix.isMix
                    }

                    result.push(hashDates[product.name][status])
                }
            })

            products.forEach((product) => {
                const productInProduction = filteredProduction.filter((productionModel) => productionModel.ProductID.toString() == product._id.toString())

                if (productInProduction.length > 0) {
                    for (const { EstimatedHarvestDate, EstimatedStartDate, ProductName, RelatedMix, ProductID, ProductionStatus, _id, start, updated, RelatedOrder, seeds, trays, dryracks, harvest } of productInProduction) {
                        let extractFromMixDryRacks = 0;
                        if (status === "harvestReady" && RelatedMix.isForMix) {

                            const alreadyExistsInModels = hashDates[RelatedMix.mixName][status].modelsToHarvestMix.find((model) => model.ProductName === ProductName)


                            if (!alreadyExistsInModels) {
                                hashDates[RelatedMix.mixName][status].modelsToHarvestMix.push({ ProductName, seeds, trays, dryracks, harvest })
                                extractFromMixDryRacks = dryracks;
                                // continue
                            }

                            if (alreadyExistsInModels) {
                                hashDates[RelatedMix.mixName][status].modelsToHarvestMix.forEach((model, idx) => {
                                    if (model.ProductName === ProductName) {
                                        model.dryracks += + dryracks
                                        model.seeds += + seeds
                                        model.trays += + trays
                                        model.harvest += + harvest
                                        extractFromMixDryRacks += + model.dryracks;
                                    }
                                })
                            }
                            hashDates[RelatedMix.mixName][status].modelsId.push(_id)
                            hashDates[RelatedMix.mixName][status].relatedOrders.push(RelatedOrder)
                            // if(RelatedMix.mixName === "PowerMix"){
                            //     hashDates[ProductName][ProductionStatus].trays +=+ trays
                            // } 
                            continue
                        }

                        if (hashDates[ProductName][ProductionStatus]) {
                            hashDates[ProductName][ProductionStatus].RelatedMix = RelatedMix;
                            hashDates[ProductName][ProductionStatus].seeds += + seeds
                            hashDates[ProductName][ProductionStatus].trays += + trays
                            hashDates[ProductName][ProductionStatus].harvest += + harvest
                            hashDates[ProductName][ProductionStatus].dryracks += + dryracks
                            hashDates[ProductName][ProductionStatus].modelsId.push(_id)
                            hashDates[ProductName][ProductionStatus].relatedOrders.push(RelatedOrder)
                            hashDates[ProductName][ProductionStatus].dryracks = hashDates[ProductName][ProductionStatus].dryracks;
                            console.log(`${ProductName} single strain dry racks: ${hashDates[ProductName][ProductionStatus].dryracks}`)
                        }


                        orders.push(RelatedOrder)
                    }
                }
            })


            if (format === "array") {
                acumInArray.push({ [status]: result })
            }

            if (format === "hash") {
                accumulatedProduction = { ...accumulatedProduction, [status]: result }
            }
        }
    })

    let requiredReturn = {
        "array": acumInArray,
        "hash": accumulatedProduction,
        "orders": orders
    }

    if (includeOrders) {
        if (Array.isArray(requiredReturn[format])) {
            requiredReturn[format].push({ "orders": requiredReturn["orders"] })
        }

        if (typeof requiredReturn[format] === "object" && !Array.isArray(requiredReturn["orders"])) {
            requiredReturn[format].orders = requiredReturn["orders"]
        }
    }


    return requiredReturn[format]
}

export const grouPProductionForWorkDay = (criteria, production, format, includePackages, includeAllProducts = false, products = undefined) => {
    try {
        //*THE PARAMETERS ARE NOT ACTUALLY BEING USED YET
        const grouppedProduction = groupBy(criteria, production, format, includePackages, includeAllProducts, products)

        if (includePackages) {
            if (format === "hash") {
                grouppedProduction.packages = packages
            }
        }


        return grouppedProduction
    } catch (err) {
        console.log(err)
        throw new Error("Error in object analyser - groupBy")
    }
}
export const grouPProductionForAnalytics = (criteria, production, format) => {
    try {
        let workDayObj = {
        }



        const tasks = production.map((objTask) => {
            const task = Object.keys(objTask)[0]

            const taskBuildedFromProductionData = buildTaskFromProductionAccumulated(task, objTask[task])

            return taskBuildedFromProductionData
        })

        if (format == "hash") {
            tasks.forEach((task) => {
                const key = Object.keys(task)[0]

                workDayObj[key] = task[key]
            })

            return workDayObj
        }
        return tasks
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

export const getAllProductionByOrderId = (orgId, containerId, orderId) => {
    return new Promise((resolve, reject) => {
        getProductionByOrderId(orgId, containerId, orderId)
            .then((production) => {
                resolve(production);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const createProductionProduct = async (orgId, containerId, productionData) => {
    const order = await getOrderById(orgId, productionData.orderId)
    const container = await getContainerById(orgId, containerId)

    const newProductionData = await buildProductionProductData(
        productionData.prod,
        order[0],
        productionData.dbproducts,
        productionData.overHeadParam,
        container.containers[0]
    )

    return new Promise((resolve, reject) => {

        createSingleProductionModelProduct(orgId, containerId, newProductionData.productionData[0])
            .then((production) => {
                resolve(production);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const updateProductionProduct = (orgId, containerId, productionData) => {
    return new Promise((resolve, reject) => {
        updateSingleProductionModelProduct(orgId, containerId, productionData)
            .then((production) => {
                resolve(production);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const deleteProductionProduct = (orgId, containerId, productionData) => {
    return new Promise((resolve, reject) => {
        console.log(productionData)
        deleteSingleProductionModelProduct(orgId, containerId, productionData[0]._id)
            .then((production) => {
                resolve(production);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getProductionWorkByContainerId = (req, res, criteria) => {
    // Poner todo en workData, poner produccion en cada status
    return new Promise(async (resolve, reject) => {
        let requiredProductionFormat = "array"
        if (req.path === "/workday") {
            requiredProductionFormat = "hash"
        }

        if (criteria === "workday") {
            const products = await getAllProducts(res.locals.organization)

            const productionInContainer = await getProductionInContainerByCurrentDate(res.locals.organization, req.query.containerId, req.query.tz)

            // Create a production model for each possible status per product
            const productionStatuses = getPosibleStatusesForProduction()
            let productionInAllStatuses = []

            productionInContainer.forEach(productionModel => {
                // If it has delivered status, it should no longer be in the workday
                if (productionModel.ProductionStatus === "delivered") return;

                const dbProduct = products.find(dbProd => dbProd._id.toString() === productionModel.ProductID.toString())
                const isLongCycle = dbProduct && (dbProduct.parameters.day + dbProduct.parameters.night) > 10;

                // If it is passive status, it is only shown once, if it is active status, the production model is shown in all active statuses
                if (productionModel.ProductionStatus === "seeding" || productionModel.ProductionStatus === "preSoaking" || productionModel.ProductionStatus === "growing") {
                    productionInAllStatuses.push(productionModel)
                } else {
                    productionStatuses.forEach(status => {
                        // Validation for products that require PreSoaking
                        if (!isLongCycle && status === 'preSoaking') return;
                        if (status === 'seeding' || status === 'preSoaking') return;
                        let newProductionModel = JSON.parse(JSON.stringify(productionModel));
                        newProductionModel.ProductionStatus = status;
                        productionInAllStatuses.push(newProductionModel);
                    });
                }
            });

            const productionGroupped = grouPProductionForWorkDay("status", productionInAllStatuses, requiredProductionFormat, false, true, products)

            resolve(productionGroupped)
            return
        }

        if (criteria === "employee") {
            const productionInContainer = await getProductionInContainerByCurrentDate(res.locals.organization, req.query.containerId, req.query.tz)

            const productionGroupped = grouPProductionForWorkDay("status", productionInContainer, requiredProductionFormat, false)

            resolve(productionGroupped)
            return
        }

        getProductionInContainerByCurrentDate(res.locals.organization, req.query.containerId, req.query.tz)
            .then((production) => {

                //*If no production is returned then return empty array
                if (production.length > 0 && criteria === "tasks") {
                    const productionGrouped = grouPProductionForWorkDay("status", production, requiredProductionFormat, false)
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

export const setDryRacksByHarvest = (trays, name) => {
    if (name === "PowerMix") {
        return trays
    }

    return trays * 0.5
}

export const calculateTrays = (harvestGrams, parameters) => {
    const { overhead, harvestRate, seedingRate, day, night } = parameters;

    const strainHarvest = harvestGrams * (1 + overhead / 100);
    const totalSeeds = harvestGrams / (harvestRate / seedingRate);
    const totalTrays = Math.ceil(totalSeeds / seedingRate);
    const totalProductionDays = day + night
    const dryracks = isLargeCicle(totalProductionDays) ? totalTrays : totalTrays * 0.5

    return {
        strainHarvest,
        totalSeeds,
        totalTrays: totalTrays < 1 ? 1 : totalTrays,
        dryracks: dryracks < 1 ? 1 : dryracks
    };
};

export const buildProductionProductData = async (prod, order, dbproducts, overHeadParam, container) => {
    const prodFound = dbproducts.find((fprod) => {
        if (typeof fprod._id === "object") return fprod._id.equals(prod._id)
        if (typeof prod._id === "object") return prod._id.equals(fprod._id)
        return fprod._id == prod._id
    })

    prod.packages.forEach((pkg, idx) => {
        const packageSizeIndex = {
            "medium": 1,
            "large": 2,
        }[pkg.size] || 0; // "small" default

        prod.packages[idx] = {
            ...pkg,
            grams: prodFound.price[packageSizeIndex].packageSize * pkg.number,
        };
    });

    //*Total grams will define number of trays based on seedingRate and add overhead config from global overhead
    const harvest = prod.packages.reduce((prev, curr) => prev + curr.grams, 0) * (1 + overHeadParam);

    if (prodFound) {
        if (prodFound.mix.isMix) {

            prod.mix = { isMix: true }
            const mixProds = prodFound.mix.products
            const mappedMixComposition = mixProds.map(async (mprod) => {

                const mixFound = dbproducts.find((fprod) => fprod._id.equals(mprod.strain))

                const mixProductStartProductionDate = getEstimatedStartProductionDate(order.date, mixFound)
                const mixProductHarvestDate = await getEstimatedHarvestDate(mixProductStartProductionDate, mixFound)

                console.group()
                console.log("Building production models for MIX: " + prodFound.name + " strains")
                console.log(`Is required a total harvest for the order of: ${harvest}`)

                const strharvest = Number((harvest * (mprod.amount / 100)).toFixed(2)) * (1 + (mixFound.parameters.overhead / 100))
                const seeds = strharvest / (mixFound.parameters.harvestRate / mixFound.parameters.seedingRate)
                const trays = Math.ceil(seeds / mixFound.parameters.seedingRate)
                const totalProductionDays = mixFound.parameters.day + mixFound.parameters.night
                const mixStrainStatus = prod.mixStatuses.find((status) => status.product === mixFound.name).name
                const dryracks = isLargeCicle(totalProductionDays) ? trays : setDryRacksByHarvest(trays, prodFound.name)


                console.log(seeds + " seeds")
                console.log(trays + " trays")
                console.log(strharvest + " harvest")
                console.groupEnd()


                // delete mixFound.mix
                delete mixFound.price
                delete mprod.strain


                mixFound.productionData = {
                    ProductName: mixFound.name,
                    RelatedMix: { isForMix: true, mixName: prodFound.name },
                    ProductionStatus: mixStrainStatus ? mixStrainStatus : getInitialStatus(mixFound),
                    RelatedOrder: order._id,
                    EstimatedHarvestDate: mixProductHarvestDate,
                    EstimatedStartDate: mixProductStartProductionDate,
                    ProductID: mixFound._id,
                    harvest: strharvest,
                    seeds: seeds,
                    trays: trays < 1 ? 1 : trays,
                    dryracks: dryracks < 1 ? 1 : dryracks,
                }

                if (mixStrainStatus === "harvestReady" || mixStrainStatus === "growing") {
                    console.log("El container must be updated")
                    await updateContainerById(order.organization, container._id, { query: "add", key: "available", value: -trays })
                }

                return { ...mprod, ...mixFound, mix: true }
            })

            await Promise.all(mappedMixComposition)
                .then((mappedMIx) => {
                    prod.products = mappedMIx
                    prod.productionData = mappedMIx.map((productOfMix) => {
                        return productOfMix.productionData
                    })

                    console.log(prod.productionData)
                })
                .catch(err => {
                    Promise.reject("Error mapping mix products to add production data")
                    console.log(err)
                })



        } else {
            prod.mix = { isMix: false }
            //* Get seedingRate and harvestRate (in grams) per tray
            prod["seedingRate"] = prodFound.parameters.seedingRate
            prod["harvestRate"] = prodFound.parameters.harvestRate
            const estimatedStartDate = getEstimatedStartProductionDate(order.date, prodFound)
            const harvestDate = await getEstimatedHarvestDate(estimatedStartDate, prodFound)

            const { strainHarvest, totalSeeds, totalTrays, dryracks } = calculateTrays(harvest, prodFound.parameters);

            prod["productionData"] = [{
                ProductName: prodFound.name,
                ProductionStatus: prod.status || getInitialStatus(prodFound),
                RelatedMix: { isForMix: false },
                RelatedOrder: order._id,
                ProductID: prodFound._id,
                EstimatedStartDate: estimatedStartDate,
                EstimatedHarvestDate: harvestDate,
                harvest: strainHarvest,
                seeds: totalSeeds,
                trays: totalTrays,
                dryracks: dryracks
            }]

            if (["harvestReady", "growing"].includes(prod.status)) {
                console.log("El container must be updated")
                await updateContainerById(order.organization, container._id, { query: "add", key: "available", value: -totalTrays })
            }
        }
    }
    return prod
}

//*Build model for production control based on order packages and products parameters
export const buildProductionDataFromOrder = async (order, dbproducts, overHeadParam = 0, container) => {
    //*Add grams per size to order product packages
    console.log("Order received in production controller")
    try {
        await Promise.all(
            order.products.map(async (prod, pidx) => {
                await buildProductionProductData(prod, order, dbproducts, overHeadParam, container)
            })
        )
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
    const productionData = order.products.flatMap((prod) => {
        return prod.productionData
    })

    return productionData
}
//*Estimate date to harvest the product if it is seeded today.
export const getEstimatedHarvestDate = async (startDate, product, orgId, container, tz) => {
    try {
        const productRef = mongoose.isObjectIdOrHexString(product)
            ? await getProductById(orgId, container, product)
            : product;

        const { day: lightTime, night: darkTime } = productRef.parameters;

        const estimatedDate = moment.tz(startDate, tz).clone().add(lightTime + darkTime, 'days');

        return estimatedDate
    } catch (err) {
        return Promise.reject(err)
    }
}

export const getEstimatedStartProductionDate = (orderDate, product) => {
    try {

        const lightTime = product.parameters.day
        const darkTime = product.parameters.night
        const estimatedProductionStartDate = new Date(new Date(orderDate).getTime() - (((((lightTime * 24) * 60) * 60) * 1000) + ((((darkTime * 24) * 60) * 60) * 1000)))
        estimatedProductionStartDate.setHours(0, 0, 0)

        return estimatedProductionStartDate
    } catch (err) {
        console.log(err)
        throw Error("Error getting estimation to start production date")
    }
}

//*Store
export const saveProductionForWorkDay = async (orgId, containerId, production) => {
    try {
        await insertWorkDayProductionModel(orgId, containerId, production)
    } catch (err) {
        throw new Error(err)
    }
}

export const updateProductionToNextStatus = (orgId, container, productionModelsIds, actualStatus, tz, userUID) => {
    return new Promise((resolve, reject) => {
        updateManyProductionModels(orgId, container, productionModelsIds, actualStatus, tz, userUID)
            .then((result) => resolve(result))
            .catch(err => reject(err))
    })
}

export const updateProductionBasedOnProductUpdate = async (updateConfigModel, productId, orgId) => {
    const productionKeys = Object.keys(updateConfigModel).filter((key) => key !== null)

    let production
    let products
    try {
        production = await getProductionByProduct(productId, orgId)
        products = await getAllProducts(orgId)
        //*GET THE PRODUCTION RELATED TO THE PRODUCT
    } catch (err) {
        throw new Error(err)
    }

    const newProductionModels = await Promise.all(production.map(async (productionModel) => {
        //*rebuild production data from order id
        const order = await getOrderById(orgId, productionModel.RelatedOrder)

        if (order.length === 1) {
            //*PRODUCTS FROM DATABASE MUST HAS BEEN ALREADY UPDATED
            const newProduction = await buildProductionDataFromOrder(order[0], products)
            newProduction.forEach((newModel, idx) => newProduction[idx]._id = productionModel._id)

            //*RETURN ONLY THE PRODUCTION FROM ORDER THAT IS THE SAME AS THE PRODUCTION WE ARE TRYING TO UPDATE
            return newProduction.filter((newProd) => newProd.ProductName === productionModel.ProductName)
        }

        return production

    }))

    upsertProduction(newProductionModels.flat(), orgId)
        .then((result) => {
            return result
        })
        .catch((err) => {
            throw new Error(err)
        })
}
