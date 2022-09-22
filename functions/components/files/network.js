import express from 'express';
import { success } from '../../network/response.js';
import { getFilteredOrders } from '../orders/store.js';
import {createConfigObjectFromOrder, createOrderInvoicePdf} from './controller.js'

const router = express.Router()

router.get('/order/invoice/:id', async (req, res) => {

    req.query = {key:"_id", value:req.params.id}
    
    //* GET ORDER FROM ID
    const order = await getFilteredOrders(res.locals.organization, req, false)
    if(order.length > 0) {
        order[0].products.forEach(prod => console.log(prod.packages))
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


export default router