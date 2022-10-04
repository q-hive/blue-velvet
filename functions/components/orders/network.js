import express from 'express'
import { success, error } from '../../network/response.js'
import { createNewOrder, deleteOrders, getAllOrders, getFilteredOrders, updateOrder } from './store.js'
import {modelsValidationError} from '../../utils/errorHandler.js'
import { updateContainer } from '../container/store.js'

const router = express.Router()

router.post('/', (req, res) => {
    createNewOrder(res.locals.organization,req.body)
    .then((order) => {
        success(req, res, 201, 'New order created succesfully', order)
    })
    .catch((err) => {
        
        error(req, res, 500, "Error creating new order - GENERIC ERROR", err)
        
    })
})

router.get('/', (req, res) => {
    getAllOrders(res.locals.organization, req)
    .then((orders) => {
        success(req, res, 200, "Orders obtained, succesfully", orders)
    })
    .catch(err => {
        error(req, res, 500, "Error getting orders - GENERIC ERROR", err)
    })    
})

router.get('/:status', (req, res) => {
    getFilteredOrders(res.locals.organization, req)
    .then((orders) => {
        success(req, res, 200, "Orders obtained, succesfully", orders)
    })
    .catch(err => {
        error(req, res, 500, "Error getting orders - GENERIC ERROR", err)
    })    
})

/** 
 * @description receives a custom key value pair of query strings in order to filter the orders to be deleted
*/
router.delete('/custom/', (req, res) => {
    getFilteredOrders(res.locals.organization, req)
    .then((orders) => {
        deleteOrders(res.locals.organization, orders)
        .then((status) => {
            success(req, res, 200, "Orders deleted")
            if(status === 1){
            }
        })
    })
    .catch((err) => {
        error(req , res, 500, "ERROR GETING THE ORDERS TO BE DELETED - GENERIC ERROR", err)
    })
})

router.delete('/:status', (req, res) => {
    getFilteredOrders(res.locals.organization, req)
    .then((orders) => {
        deleteOrders(res.locals.organization, orders)
        .then((status) => {
            success(req, res, 200, "Orders deleted")
            if(status === 1){
            }
        })
    })
    .catch((err) => {
        error(req , res, 500, "ERROR GETING THE ORDERS TO BE DELETED - GENERIC ERROR", err)
    })
})


router.patch('/:id', (req, res) => {
    if(!req.params){
        return error(req, res, 400, "No order provided")
    }
    if(typeof !req.body === "object" && !Object.keys(req.body).includes("paths")){
        const bodyError = {
            message:"The body received is invalid",
            status: 400,
        }
        return error(req, res, 400,"The body is invalid",new Error(JSON.stringify(bodyError)))
    }
    //*Send body to controller
    updateOrder(res.locals.organization,req.params.id,req.body)
    .then(result => {
        //*Succcess response
        success(req, res, 200, "Order updated succesfully", result)
    })
    .catch(err => {
        //*Catch any error
        error(req, res, 500, "Error updating order - GENERIC ERROR", err)
    })
})
export default router