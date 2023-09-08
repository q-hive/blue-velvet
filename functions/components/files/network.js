import express from 'express';
import moment from 'moment-timezone';
import { organizationModel } from '../../models/organization.js';
import { error, success } from '../../network/response.js';
import { actualMonthInitialDate } from '../../utils/time.js';
import { getFilteredOrders, getMonthlyOrdersByCustomer } from '../orders/store.js';
import {createConfigObjectFromManyOrders, createConfigObjectFromOrder, createOrderInvoicePdf} from './controller.js'
import {mongoose} from '../../mongo.js'
import { groupOrdersForMonthlyInvoice } from '../orders/controller.js';
import fs from 'fs';
import { pdfBuildPath } from './pdfManager.js';


const router = express.Router()

router.get('/order/invoice/:_id', async (req, res) => {
    //* GET ORDER FROM ID
    let orgQuery;
    try {
        orgQuery = await organizationModel.findOne(
            {
                "_id":mongoose.Types.ObjectId(res.locals.organization)
            },
            {
                "orders": {
                    "$filter":{
                        "input":"$orders",
                        "as":"order",
                        "cond":{
                            "$eq":["$$order._id", mongoose.Types.ObjectId(req.params._id)]
                        }
                    }
                }
            }
        )
    } catch (err) {
        error(req, res, 500, "Error getting organization filtered orders", err, err)
        return;
    }
    let order; 
    console.log(orgQuery)
    if(orgQuery && orgQuery.orders.length > 0) {
        order = orgQuery.orders
    }
    console.log("A new PDF file will be created from the following order")
    console.log(order)
    if(order.length > 0) {
        // order[0].products.forEach(prod => console.log(prod.packages))
        //*IF EXISTS THEN GENERATES CONFIG OBJECT FOR PDF FROM ORDER DATA
        const config = await createConfigObjectFromOrder(order[0])
        createOrderInvoicePdf(config)
        .then((file) => {
            const fl = fs.createReadStream(pdfBuildPath)
            const stat = fs.statSync(pdfBuildPath)
            res.setHeader('Content-Length', stat.size)
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', 'attachment; filename=order.pdf')
            fl.pipe(res)
            success(req, res, 200, "PDF obtained succesfully", file)
        })
        .catch((err) => {
            console.log(err)
            error(req, res, 500, "Error downloading order invoice", err, err)
        })
        return
    }
    //*IF ORDER DOESNT EXISTS RESOLVE EMPTY RESPONSE
    success(req, res, 200, "Order not found", order)
})

router.get('/orders/invoice/bydate/month/:_id', async (req, res) => {
    const tz = req.query.tz
    const orgId = res.locals.organization
    const customerId = req.params._id
    const actualDate = moment.tz(tz);
    const startOfMonth = actualDate.clone().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = actualDate.clone().endOf('month').format('YYYY-MM-DD');

    let shapedOrgData
    try{
        console.log("Executing aggregation to build monthly invoice")
        shapedOrgData = await organizationModel.aggregate([
            {
                "$match": {
                    "_id": mongoose.Types.ObjectId(orgId)
                },
            },
            {
                "$addFields": {
                    "orders": {
                        "$map": {
                            "input": "$orders",
                            "as": "order",
                            "in": {
                                "$mergeObjects": [
                                    "$$order",
                                    {
                                        "createdDate": {
                                            "$dateToString": {
                                                "format": "%Y-%m-%d",
                                                "date": "$$order.created",
                                                "timezone": tz,
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                    "containerName": {
                        "$arrayElemAt": ["$containers.name", 0],
                    }
                },
            },
            {
                "$project": {
                    "orders": {
                        "$filter": {
                            "input": "$orders",
                            "as": "order",
                            "cond": {
                                "$and": [
                                    {
                                        "$eq": ["$$order.customer", mongoose.Types.ObjectId(customerId)]
                                    },
                                    {
                                        "$gte": ["$$order.createdDate", startOfMonth],
                                    },
                                    {
                                        "$lte": ["$$order.createdDate", endOfMonth],
                                    },
                                ],
                            },
                        },
                    },
                    "customer": {
                        "$filter": {
                            "input": "$customers",
                            "as": "customer",
                            "cond": {
                                "$eq": ["$$customer._id", mongoose.Types.ObjectId(customerId)],
                            },
                        },
                    },
                    "name": true,
                    "image": true,
                    "containerName": true,
                    "address": true,
                    "owner": true,
                }
            },
            {
                "$addFields": {
                    "totalIncome": {
                        "$sum": "$orders.price",
                    },
                    "ordersId": "$orders._id",
                },
            },
            {
                "$lookup": {
                    "from": "clients",
                    "localField": "owner",
                    "foreignField": "_id",
                    "as": "owner",
                },
            }
        ])
    } catch (err) {
        error(req, res, 500, "Error getting data for monthly invoice", err, err)
        return
    }

    console.log("Aggregation finished")
    // console.log(shapedOrgData)
    
    if(shapedOrgData[0].orders.length > 0) {
        let invoiceId = mongoose.Types.ObjectId();
        let date = moment.tz(tz).toDate();

        try {
            shapedOrgData[0].invoice = {
                "date":date,
                "_id":invoiceId.toString(),
                "totalIncome":shapedOrgData[0].totalIncome,
                "customer":shapedOrgData[0].customer[0]._id,
                "orders":shapedOrgData[0].ordersId,
                "issuerOrganization": orgId,
                "payed":false
            }
            await mongoose.connection.collection("invoices").insertOne(shapedOrgData[0].invoice)
            await organizationModel.updateOne(
                {
                    "_id": mongoose.Types.ObjectId(orgId)
                },
                {
                    "$push": {
                        "invoices": {
                            "_id": invoiceId,
                            "date": date,
                            "payed": false
                        }
                    }
                },
                {
                    upsert: true
                }
            )
            console.log("INVOICE METADATA ADDED TO THE ORGANIZATION")
        } catch (err) {
            error(req, res, 500, "There was an error updating the organization", err, err)
            return
        }

        console.log("PDF build start...")
        let config
        try {
            console.log("Building PDF config object")
            config = createConfigObjectFromManyOrders(shapedOrgData, date, invoiceId)
        } catch(err){
            error(req, res, 500, "Error building config object to build PDF from orders.", err, err)
            return
        }

        createOrderInvoicePdf(config)   
        .then(file => {
            const fl = fs.createReadStream(pdfBuildPath)
            const stat = fs.statSync(pdfBuildPath)
            res.setHeader('Content-Length', stat.size)
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', 'attachment; filename=order.pdf')
            fl.pipe(res)
            success(req, res, 200, "PDF obtained succesfully", file)
        })
        .catch(err => {
            error(req, res, 500, "Error building pdf", err, err)
        })
        return
    }

    console.log("Aggregation does not meet the conditions")
    error(req, res, 400, "There are no orders to invoice this month.", new Error("There are no orders to build invoice"))
})

export default router