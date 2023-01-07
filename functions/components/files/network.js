import express from 'express';
import { organizationModel } from '../../models/organization.js';
import { error, success } from '../../network/response.js';
import { actualMonthInitialDate } from '../../utils/time.js';
import { getFilteredOrders, getMonthlyOrdersByCustomer } from '../orders/store.js';
import {createConfigObjectFromManyOrders, createConfigObjectFromOrder, createOrderInvoicePdf} from './controller.js'
import {mongoose} from '../../mongo.js'
import { groupOrdersForMonthlyInvoice } from '../orders/controller.js';


const router = express.Router()

router.get('/order/invoice/:_id', async (req, res) => {
    //* GET ORDER FROM ID
    let order = await getFilteredOrders(res.locals.organization, req, false,  {key:"_id", value:req.params._id})

    if(order && order.orders.length > 0) {
        order = order.orders
    }
    console.log("A new PDF file will be created from the following order")
    console.log(order)
    if(order.length > 0) {
        // order[0].products.forEach(prod => console.log(prod.packages))
        //*IF EXISTS THEN GENERATES CONFIG OBJECT FOR PDF FROM ORDER DATA
        const config = await createConfigObjectFromOrder(order[0])
        createOrderInvoicePdf(config)
        .then((file) => {
            success(req, res, 200, "PDF obtained succesfully", file)
        })
        .catch((err) => {
            console.log(err)
        })
        return
    }
    //*IF ORDER DOESNT EXISTS RESOLVE EMPTY RESPONSE
    success(req, res, 200, "Order not found", order)
})

router.get('/orders/invoice/bydate/month/:_id', async (req, res) => {
    let shapedOrgData
    try{
        console.log("Executing aggregation to build monthly invoice")
        shapedOrgData = await organizationModel.aggregate(
            [
                {
                    "$match": {
                        "_id":mongoose.Types.ObjectId(res.locals.organization)
                    }
                },
                {
                    "$project": {
                        "orders":{
                            "$filter":{
                                "input":"$orders",
                                "as":"order",
                                "cond": {
                                    "$and": [
                                        { "$gte":["$$order.created", new Date(actualMonthInitialDate())] },
                                        { "$lt":["$$order.created", new Date(new Date().getUTCFullYear(),new Date().getUTCMonth()+1,1)] },
                                        { "$eq":["$$order.customer", mongoose.Types.ObjectId(req.params._id)] }
                                    ]
                                }
                            }
                        },
                        "customer": {
                            "$filter":{
                                "input":"$customers",
                                "as":"customer",
                                "cond": { "$eq":["$$customer._id", mongoose.Types.ObjectId(req.params._id)] },
                            }
                        },
                        "name":true,
                        "address":true,
                        "owner":true
                    }
                },
                {
                    "$addFields":{
                        "totalIncome":{"$sum":"$orders.price"},
                        "ordersId":"$orders._id"
                    }
                },
                {
                    "$lookup":{
                        "from":"clients",
                        "localField":"owner",
                        "foreignField":"_id",
                        "as":"owner"
                    }
                }
    
            ]
        )
    } catch (err) {
        error(req, res, 500, "Error getting data for monthly invoice", err, err)
        return
    }

    console.log("Aggregation finished")
    // console.log(shapedOrgData)
    
    if(shapedOrgData[0].orders.length > 0) {
        let invoiceId = mongoose.Types.ObjectId();
        let date = new Date();

        try {
            shapedOrgData[0].invoice = {
                "date":date,
                "_id":invoiceId.toString(),
                "totalIncome":shapedOrgData[0].totalIncome,
                "customer":shapedOrgData[0].customer[0]._id,
                "orders":shapedOrgData[0].ordersId,
                "issuerOrganization": res.locals.organization
            }
            await mongoose.connection.collection("invoices").insertOne(shapedOrgData[0].invoice)
            await organizationModel.updateOne({"_id":mongoose.Types.ObjectId(res.locals.organization)},{"$push":{"invoices":{"date":date, "_id":invoiceId}}},{upsert:true})
            console.log("INVOICE METADATA ADDED TO THE ORGANIZATION")
        } catch (err) {
            error(req, res, 500, "There was an error updating the organization", err, err)
            return
        }
            
        

        console.log("PDF build start...")
        let config
        try {
            console.log("Building PDF config object")
            config = createConfigObjectFromManyOrders(shapedOrgData)
        } catch(err){
            error(req, res, 500, "Error building config object to build PDF from orders.", err, err)
            return
        }

        createOrderInvoicePdf(config)   
        .then(file => {
            success(req, res, 200, "PDF obtained succesfully", file)
        })
        .catch(err => {
            error(req, res, 500, "Error building pdf", err, err)
        })
        
    }

    console.log("Aggregation does not meet the conditions")
    error(req, res, 400, "There are no orders to invoice this month.", new Error("There are no orders to build invoice"))
})

export default router