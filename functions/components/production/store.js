import Organization from '../../models/organization.js'
import { mongoose } from '../../mongo.js'
import { dateToArray, nextDay } from '../../utils/time.js'
import { getContainers, updateContainerById } from '../container/store.js'
import { buildOrderFromExistingOrder } from '../orders/controller.js'
import { getOrderById, insertNewOrderWithProduction, updateOrder, insertOrderAndProduction } from '../orders/store.js'
import { getAllProducts } from '../products/store.js'
import { buildProductionDataFromOrder, grouPProductionForWorkDay, updateStartHarvestDate } from './controller.js'
import { getOrganizationById } from '../organization/store.js'
import moment from 'moment-timezone'
import { getInitialStatus } from './controller.js'
let { ObjectId } = mongoose.Types

const orgModel = mongoose.model('organizations', Organization)

export const productionCycleObject = {
    "preSoaking": {
        "next": "seeding",
        "hasBackGroundTask": false,
        "requireNewDoc": true,
        "affectsCapacity": {
            "affect": false,
            "how": null
        }
    },
    // "soaking1":{
    //     "next":"soaking2",
    //     "hasBackGroundTask":true,
    //     "requireNewDoc":true,
    //     "affectsCapacity":{
    //         "affect":false,
    //         "how":null
    //     }
    // },
    // "soaking2":{
    //     "next":"seeding",
    //     "hasBackGroundTask":true,
    //     "requireNewDoc":true,
    //     "affectsCapacity":{
    //         "affect":false,
    //         "how":null
    //     }
    // },
    "harvestReady": {
        "next": "packing",
        "hasBackGroundTask": false,
        "requireNewDoc": true,
        "affectsCapacity": {
            "affect": false,
            "how": null
        }
    },
    "packing": {
        "next": "ready",
        "hasBackgroundTask": false,
        "requireNewDoc": true,
        "affectsCapacity": {
            "affect": false,
            "how": "inc"
        }
    },
    "ready": {
        "next": "delivered",
        "hasBackgroundTask": false,
        "requireNewDoc": true,
        "affectsCapacity": {
            "affect": false,
            "how": null
        }
    },
    "seeding": {
        "next": "growing",
        "hasBackGroundTask": false,
        "requireNewDoc": true,
        "affectsCapacity": {
            "affect": false,
            "how": null
        }
    },
    "growing": {
        "next": "harvestReady",
        "hasBackGroundTask": true,
        "requireNewDoc": true,
        "affectsCapacity": {
            "affect": false,
            "how": "dec"
        }
    },
}


export const getProductionInContainerByCurrentDate = async (orgId, containerId, tz) => {
    const currentDate = moment().tz(tz).format('YYYY-MM-DD');

    return new Promise((resolve, reject) => {
        orgModel.aggregate([
            {
              '$match': {
                '_id': mongoose.Types.ObjectId(orgId)
              }
            },{
              '$unwind': {
                'path': '$containers'
              }
            }, {
              '$match': {
                'containers._id': mongoose.Types.ObjectId(containerId)
              }
            }, {
              '$unwind': {
                'path': '$containers.production'
              }
            }, {
              '$addFields': {
                'startProductionDateString': {
                  '$dateToString': {
                    'format': '%Y-%m-%d', 
                    'date': '$containers.production.startProductionDate', 
                    'timezone': tz
                  }
                },
                'startHarvestDateString': {
                  '$dateToString': {
                    'format': '%Y-%m-%d', 
                    'date': '$containers.production.startHarvestDate', 
                    'timezone': tz
                  }
                }
              }
            }, {
              '$match': {
                '$or': [
                  { 'startProductionDateString': { '$eq': currentDate } },
                  { 'startHarvestDateString': { '$eq': currentDate } }
                ]
              }
            }, {
              '$replaceRoot': {
                'newRoot': '$containers.production'
              }
            }
          ])
            .then((productionForToday) => {
                if (!productionForToday) {
                    resolve([])
                    return
                }

                const maturedGrowths = filterMaturedGrowthsProdModelsIds(productionForToday, tz)
                if (maturedGrowths.length) {
                    console.log("Actualizando de GROWING a HARVESTREADY...");
                    updateManyProductionModels(orgId, containerId, maturedGrowths, 'growing', tz)
                        .then((result) => {
                            resolve(productionForToday)
                        })
                        .catch(err => {
                            reject(err)
                        })
                }else{
                    resolve(productionForToday)
                }
            })
            .catch((err) => reject(err))
    })
}

const filterMaturedGrowthsProdModelsIds = (productionModels, tz) => {
    const currentDateTime = moment().tz(tz);

    return productionModels.filter((model) => {
        if (model.ProductionStatus !== 'growing') return false;
        if (!model.startHarvestDate || !moment(model.startHarvestDate).isValid()) return false;
        const startHarvestDate = moment.tz(model.startHarvestDate,tz);

        return currentDateTime >= startHarvestDate;
    }).map((model) => model._id);
};

export const insertWorkDayProductionModel = (orgId, container, productionModel) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updateOperation = await orgModel.updateOne(
                {
                    "_id": mongoose.Types.ObjectId(orgId),
                    "containers._id": mongoose.Types.ObjectId(container)
                },
                {
                    "$set": { "containers.$.workday": { "production": productionModel } }
                }
            )
            resolve(updateOperation)
        } catch (err) {
            reject(err)
        }
    })
}

export const startBackGroundTask = (config) => {
    updateStartHarvestDate(config)
    return
}

export const getPosibleStatusesForProduction = () => {
    const statuses = Object.keys(productionCycleObject)
    return statuses
}

// Actualiza la produccion al siguiente status del que se selecciono a terminar
export const nextStatusForProduction = (productionModels, actualStatus) => {
    const cycleModel = productionCycleObject

    if (Array.isArray(productionModels)) {
        productionModels.forEach((production) => {

            const nextProductionStatus = cycleModel[actualStatus ? actualStatus : production.ProductionStatus].next

            production.ProductionStatus = nextProductionStatus
        })
    }

    return productionModels

}

export const updateOrdersInModels = async (updatedModels, orgId, container) => {
    let bodyQuery = {
        "orders": {
            "_id": {
                "paths": [{ "path": "", "value": "" }]
            },
        }
    }

    await Promise.all(
        updatedModels.map(async (productionModel) => {

            const productionDB = await getProductionByOrderId(orgId, container, productionModel.RelatedOrder)

            const indexOfModelInDB = productionDB.findIndex((model) => model._id.equals(productionModel._id))

            productionDB[indexOfModelInDB].ProductionStatus = productionModel.ProductionStatus

            const statusInProductionDB = productionDB.map((productionmodel) => productionmodel.ProductionStatus).filter((element) => element != undefined)
            console.log("Production status of the order" + productionModel.RelatedOrder + " in DB woud be:  " + statusInProductionDB)
            console.log("with the applied update")

            bodyQuery.orders[productionModel.RelatedOrder.toString()] = {
                "paths": [{ "path": "status", "value": productionModel.ProductionStatus }]
            }


            //*Status in DB must be equal (packing)i n all production models related to the order before updating status
            await updateOrder(orgId, productionModel.RelatedOrder, bodyQuery.orders[productionModel.RelatedOrder.toString()])
            //*Add order to DB of packaging

            // if(nonRepeatedStatus[0] === "packing"){
            //     await orgModel.updateOne({"_id":mongoose.Types.ObjectId(orgId), "$push":{"packaging": productionModel.RelatedOrder}})
            // }

            // if(nonRepeatedStatus[0] === "ready"){
            //     await orgModel.updateOne({"_id":mongoose.Types.ObjectId(orgId), "$push":{"dliveryReady": productionModel.RelatedOrder}})
            //     await orgModel.updateOne({"_id":mongoose.Types.ObjectId(orgId), "$pull":{"packaging": productionModel.RelatedOrder}})
            // }

        }).filter((elem) => elem != undefined)
    )



}

export const updateProduction = async (orgId, container, modifiedModels, userUID, tz) => {
    //*CHANGED TO FOR OF LOOP TO MANAGE SCOP OF ORDERUPDATED VARIABLE (BUT ITS BLOCKING THE MAIN THREAD)
    const updateOperation = modifiedModels.map(async (newmodel) => {
        const productionStatus = newmodel.ProductionStatus
        console.log("Updating production model to ->", productionStatus)
        console.log("newmodel:", newmodel)

        if (productionCycleObject[productionStatus]?.hasBackGroundTask) {
            console.log("The production status " + productionStatus + " has a background task")
            const startHarvestDate = await updateStartHarvestDate({ organization: orgId, container, production: newmodel, name: "updateForProduction", userUID, tz })
            newmodel.startHarvestDate = startHarvestDate
            console.log(`The estimated harvest day for product "${newmodel.ProductName}" is ${startHarvestDate.toISOString()}` )
        }

        const op = await orgModel.updateOne(
            {
                "_id": mongoose.Types.ObjectId(orgId),
                "containers": {
                    "$elemMatch": {
                        "_id": mongoose.Types.ObjectId(container),
                        "production": {
                            "$elemMatch": {
                                "_id": mongoose.Types.ObjectId(newmodel._id)
                            }
                        }
                    }
                }
            },
            {
                "$set": {
                    "containers.$.production.$[prod]": newmodel
                }
            },
            {
                "arrayFilters": [{ "prod._id": mongoose.Types.ObjectId(newmodel._id) }]
            }
        )

        // AJUST TRAYS CAPACITY
        if (productionStatus === 'delivered') {
            console.log("El container must be updated")
            await updateContainerById(orgId, container, { query: "add", key: "available", value: newmodel.trays })
        }


        const query = {
            orders: {
                "_id": {
                    "paths": [{ "path": "", "value": "" }]
                },
            }
        }
        query.orders[newmodel.RelatedOrder.toString()] = {
            "paths": [
                { "path": "status", "value": newmodel.ProductionStatus },
                { "path": "deliveredBy", "value": userUID }
            ]
        }

        query.orders[newmodel.RelatedOrder.toString()] = {
            paths: [
                { path: "status", value: newmodel.ProductionStatus },
                ...(newmodel.ProductionStatus === 'delivered'
                    ? [{ path: "deliveredBy", value: userUID }]
                    : [])
            ],
        };

        await updateOrder(orgId, newmodel.RelatedOrder, query.orders[newmodel.RelatedOrder.toString()], newmodel.ProductID)

        return op
    })
    const up = await Promise.all(updateOperation)

    return up
}
//*THIS FUNCTION ONLY UPDATES TO THE NEXT STATUS CORRESPONDING TO THE PRODUCTION CYCLE ACCORDING THE ACTUAL STATUS OF TASK FINISHED
export const updateManyProductionModels = (orgId, container, productionModelsIds, actualStatus, tz, userUID) => {
    return new Promise(async (resolve, reject) => {
        console.log("Updating production models in " + container + " container" + "by uid:" + userUID)
        console.log("***************");

        // GET PRODUCTION MODELS FROM DB
        let filteredProductionModels = []
        const getProduction = productionModelsIds.map(async (id) => {
            const productionModel = await orgModel.findOne({
                "_id": mongoose.Types.ObjectId(orgId),
                "containers": {
                    "$elemMatch": {
                        "_id": mongoose.Types.ObjectId(container),
                        "production": {
                            "$elemMatch": {
                                "_id": mongoose.Types.ObjectId(id)
                            }
                        }
                    }
                }
            },
                {
                    "containers.$": 1
                }
            )

            productionModel.containers.forEach((container) => {
                console.log(`Production model ${id} found`)
                filteredProductionModels.push(container.production.find((production) => production._id.equals(id)))
            })
        })
        await Promise.all(getProduction)

        // MODIFY PRODUCTION MODELS TO NEXT STATUS
        const modifiedModels = nextStatusForProduction(filteredProductionModels, actualStatus)

        try {
            // UPDATE PRODUCTION MODELS
            const updateProd = await updateProduction(orgId, container, modifiedModels, userUID, tz)

            // GROUP ORDERS BY ID WITH ALL PRODUCTION STATUS
            const groupedOrders = {};
            modifiedModels.map(({ RelatedOrder, ProductionStatus }) => {
                if (!groupedOrders[RelatedOrder]) groupedOrders[RelatedOrder] = [];
                groupedOrders[RelatedOrder].push(ProductionStatus);
            });
            // ARRAY OF ORDERS WITH THE PRODUCTION STATUS TO UPDATE (NEXT STATUS)
            const ordersWithStatus  = Object.keys(groupedOrders).map(RelatedOrder => ({
                orderId: RelatedOrder,
                nextStatus: [...new Set(groupedOrders[RelatedOrder])][0]
            }));
            console.log("ordersWithStatus:", ordersWithStatus)
            // CREATION OF CYCLIC ORDER
            try {
                ordersWithStatus.map(({orderId, nextStatus})=>{
                    createCyclicOrderAfterDelivery(orgId, modifiedModels, orderId, nextStatus, tz)
                })
            } catch (err) {
                console.log("Error creating new order from cyclic order")
                console.log(err)
            }

            resolve(updateProd)
        } catch (err) {
            reject(err)
        }
    })
}

const createCyclicOrderAfterDelivery = async (orgId, modifiedModels, orderId, nextStatus, tz) => {
    if (modifiedModels.length && nextStatus === "delivered") {
        console.log(`Cheking if order ${orderId} its cyclic`)
        const orders = await getOrderById(orgId, orderId)
        const baseOrder = orders[0]
        console.log("[baseOrder]:", baseOrder)

        if (baseOrder && baseOrder.cyclic) {
            const nextOrder = await getOrderById(orgId, baseOrder.next)
            const relatedOrder = nextOrder[0]
            console.log("[relatedOrder]:", relatedOrder)

            if (relatedOrder) {
                const allProducts = await getAllProducts(orgId);

                let org = await getOrganizationById(orgId);
                let tempId = new ObjectId();

                const relOrderIndex = org.orders.findIndex(order => order._id.equals(relatedOrder._id))
                if (relOrderIndex !== -1) {
                    org.orders[relOrderIndex].next = tempId
                }

                const newProducts = relatedOrder.products.map((prod) => {
                    const prodFound = allProducts.find((fprod) => {
                        if (typeof fprod._id === "object") return fprod._id.equals(prod._id)
                        if (typeof prod._id === "object") return prod._id.equals(fprod._id)
                        return fprod._id == prod._id
                    })
                    if (prodFound.mix.isMix) {
                        const mixStatuses = prodFound.mix.products.map((mixProd) => {
                            const strainProduct = allProducts.find((product) => product._id.equals(mixProd.strain));
                            return {
                                product: strainProduct.name,
                                status: getInitialStatus(strainProduct),
                            };
                        });

                        prod.mixStatuses = mixStatuses
                        const orderStatuses = Array.from(new Set(mixStatuses.map((prod) => prod.status)));
                        prod.status = orderStatuses.length === 1 ? orderStatuses[0] : 'mixed'
                    } else {
                        prod.status = getInitialStatus(prodFound)
                    }
                    return prod
                })

                const relatedOrderStatuses = Array.from(
                    new Set(relatedOrder.products.map((prod) => prod.status))
                );

                let tempOrder = {
                    _id: tempId,
                    organization: orgId,
                    next: null,
                    deliveredBy: null,
                    customer: relatedOrder.customer,
                    price: relatedOrder.price,
                    date: moment(relatedOrder.date).add(7, "days"),
                    address: relatedOrder.address,
                    products: newProducts,
                    status: relatedOrderStatuses.length === 1 ? relatedOrderStatuses[0] : 'production',
                    cyclic: relatedOrder.cyclic,
                    created: baseOrder.date,
                };

                await insertOrderAndProduction(org, tempOrder, allProducts, tz)

            }
        } else{
            console.log("No order found or its not cyclic")
        }
    }
}

export const getProductionByStatus = (orgId, container, status) => {
    return new Promise((resolve, reject) => {
        console.log(orgId, container)

        orgModel.aggregate(
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
                    "$match": {
                        "containers._id": mongoose.Types.ObjectId(container)
                    }
                },
                {
                    "$match": {
                        "containers.production.ProductionStatus": status
                    }
                },
                {
                    "$project": {
                        "containers": {
                            "_id": 1,
                            "production": 1
                        }
                    }
                }
            ]
        )
            .then((result) => {
                console.log(result)

                if (result.length === 0) {
                    resolve(result)
                }

                const grouppedProd = grouPProductionForWorkDay("status", result[0].containers.production, "hash")
                resolve(grouppedProd)
            })
            .catch((err) => {
                reject(err)
            })

    })
}

export const getAllProductionByFilters = (orgId, containerId, status, startDateTZFormatted, finishDateTZFormatted, tz) => {
    // Dates must have only 'YYYY-MM-DD' string format
    console.log(`Get production for status ${status} from ${startDateTZFormatted} to ${finishDateTZFormatted} on timezone ${tz}`);
    return new Promise((resolve, reject) => {

        const passiveStatus = ["preSoaking", "seeding"]
        const activeStatus = ["growing", "harvestReady", "ready", "delivered"]

        orgModel.aggregate([
            {
              $match: { _id: mongoose.Types.ObjectId(orgId) },
            },
            {
              $unwind: "$containers",
            },
            {
              $match: { "containers._id": mongoose.Types.ObjectId(containerId) },
            },
            {
              $unwind: "$containers.production",
            },
            {
              $addFields: {
                productionDate: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$containers.production.startProductionDate",
                    timezone: tz,
                  },
                },
                harvestDate: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$containers.production.startHarvestDate",
                    timezone: tz,
                  },
                },
              },
            },
            {
              $match: {
                $or: [
                  {
                    $and: [
                      { productionDate: { $gte: startDateTZFormatted, $lte: finishDateTZFormatted } },
                      { "containers.production.ProductionStatus": { $in: passiveStatus } },
                    ],
                  },
                  {
                    $and: [
                      { harvestDate: { $gte: startDateTZFormatted, $lte: finishDateTZFormatted } },
                      { "containers.production.ProductionStatus": { $in: activeStatus } }
                    ],
                  },
                ],
              },
            },
            {
              $replaceRoot: {
                newRoot: "$containers.production",
              },
            }
          ])
          .then(result => resolve(result))
          .catch(err => reject(err))
    })
}

export const getProductionByOrderId = (orgId, container, orderId) => {
    return new Promise((resolve, reject) => {
        orgModel.aggregate(
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
                    "$match": {
                        "containers._id": mongoose.Types.ObjectId(container)
                    }
                },
                {
                    "$unwind": "$containers.production"
                },
                {
                    "$match": {
                        "containers.production.RelatedOrder": mongoose.Types.ObjectId(orderId)
                    }
                },
                {
                    "$replaceRoot": {
                        "newRoot": "$containers.production"
                    }
                }
            ]
        )
            .then((result) => {
                resolve(result)
            })
            .catch((err) => {
                reject(err)
            })

    })
}

export const getProductionByProduct = (productId, orgId) => {
    return new Promise((resolve, reject) => {
        orgModel.aggregate(
            [
                {
                    "$match": {
                        "_id": new mongoose.Types.ObjectId(orgId)
                    }
                },
                {
                    "$project": {
                        "containers.production": true
                    }
                },
            ]
        )
            .then((organization) => {
                const production = []

                organization[0].containers.forEach((container) => {
                    const filteredProduction = container.production.filter((production) => new mongoose.Types.ObjectId(productId).equals(production.ProductID))

                    filteredProduction.forEach((prod) => production.push(prod))
                })

                resolve(production)
            })
            .catch(err => {
                reject(err)
            })
    })
}


export const upsertProduction = (productionArray, orgId) => {
    const updateAllElements = productionArray.map(async (productionModel) => {
        console.log(productionModel)
        const update = await orgModel.updateOne(
            {
                "_id": orgId,
            },
            {
                "$set": {
                    "containers.$[].production.$[pr]": productionModel
                }
            },
            {
                arrayFilters: [{ "pr._id": productionModel._id }],

            }
        )


        console.log(update)
        return update
    })

    return Promise.all(updateAllElements)
}

export const createSingleProductionModelProduct = (orgId, containerId, productionData) => {
    return new Promise((resolve, reject) => {
        orgModel.findOneAndUpdate(
            { _id: orgId, "containers._id": containerId },
            {
                $push: {
                    "containers.$.production": productionData,
                },
            },
            { new: true }
        )
            .exec()
            .then((org) => {
                if (org) {
                    resolve(org);
                } else {
                    reject(new Error(JSON.stringify({ message: "Organization or container not found", status: 404 })));
                }
            })
            .catch((err) => {
                reject(new Error(JSON.stringify({ message: "Error updating production", status: 500, processError: err })));
            });
    });
};

export const updateSingleProductionModelProduct = (orgId, containerId, productionData) => {
    return new Promise((resolve, reject) => {
        orgModel.findOneAndUpdate(
            {
                _id: orgId,
                "containers._id": containerId,
                "containers.production._id": productionData._id
            },
            {
                $set: {
                    "containers.$[container].production.$[production]": productionData
                }
            },
            {
                arrayFilters: [
                    { "container._id": containerId },
                    { "production._id": productionData._id }
                ],
                new: true
            }
        )
            .exec()
            .then((org) => {
                if (org) {
                    resolve(org);
                } else {
                    reject(new Error(JSON.stringify({ message: "Organization, container, or production not found", status: 404 })));
                }
            })
            .catch((err) => {
                reject(new Error(JSON.stringify({ message: "Error updating production", status: 500, processError: err })));
            });
    });
};

export const deleteSingleProductionModelProduct = (orgId, containerId, productionId) => {
    return new Promise((resolve, reject) => {
        orgModel.findOneAndUpdate(
            { _id: orgId, "containers._id": containerId },
            {
                $pull: {
                    "containers.$.production": { _id: productionId }
                },
            },
            { new: true }
        ).exec()
            .then((org) => {
                if (org) {
                    resolve(org);
                } else {
                    reject(new Error(JSON.stringify({ message: "Organization, container, or production model(s) not found", status: 404 })));
                }
            })
            .catch((err) => {
                reject(new Error(JSON.stringify({ message: "Error deleting product of production", status: 500, processError: err })));
            });
    });
}
