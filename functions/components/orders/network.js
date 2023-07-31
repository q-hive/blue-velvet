import express from 'express'
import { success, error } from '../../network/response.js'
import { createNewOrder, deleteOrders, deleteOrdersDirect, getAllOrders, getFilteredOrders, getMonthlyOrders, getMonthlyOrdersByCustomer, updateOrder } from './store.js'
import {modelsValidationError} from '../../utils/errorHandler.js'
import { updateContainerById } from '../container/store.js'
import { updateAllOrders } from './controller.js'
import { organizationModel } from '../../models/organization.js'

const router = express.Router()

router.post('/', (req, res) => {
    createNewOrder(res.locals.organization,res.locals.containers.containers[0]._id,req.body, req.query)
    .then((order) => {
        success(req, res, 201, 'New order created succesfully', order)
    })
    .catch((err) => {
        error(req, res, 500, err.message ? err.message : "Error creating new order - GENERIC ERROR", err)
        
    })
})


router.get('/', (req, res) => {
    const hasFilter = Object.keys(req.query).length > 0
    let queryFunction
    queryFunction = getAllOrders
    let boolean = false
    if(hasFilter){
        queryFunction = getFilteredOrders
        //*WHEN IS A QUERY FOR FILTERED ORDERS, THE BOOLEAN VALUE MEANS TAHT WE NEED QUERY WITH PRODUCTION DATA
        boolean = true
    }
    
    queryFunction(res.locals.organization, req, boolean)
    .then((orders) => {
        success(req, res, 200, "Orders obtained, succesfully", orders)
    })
    .catch(err => {
        error(req, res, 500, "Error getting orders - GENERIC ERROR", err)
    })    
})

router.get('/:status', (req, res) => {
    getFilteredOrders(res.locals.organization, req, true)
    .then((orders) => {
        success(req, res, 200, "Orders obtained, succesfully", orders)
    })
    .catch(err => {
        error(req, res, 500, "Error getting orders - GENERIC ERROR", err)
    })    
})

router.get('/bydate/month', (req, res) => {
    getMonthlyOrders(res.locals.organization)
    .then((orders) => {
        success(req, res, 200, "Monthly orders obtained succesfully", orders)
    })
    .catch((err) => {
        error(req, res, 500, "Error getting monthly orders", err, err)
    })
})

router.get('/bydate/month/customer/:_id', (req, res) => {
    getMonthlyOrdersByCustomer(res.locals.organization, req.params._id)
    .then((orders) => {
        success(req, res, 200, "Monthly orders of customer obtained succesfully", orders)
    })
    .catch((err) => {
        error(req, res, 500, "Error getting monthly orders", err, err)
    })
})

/** 
 * @description receives a custom key value pair of query strings in order to filter the orders to be deleted
*/
router.delete('/custom/', (req, res) => {
    
    deleteOrdersDirect(req, res)
    .then((result) => {
        success(req, res, 200, "Orders deleted")
    })
    .catch(err => {
        error(req , res, 500, "Error deleting orders", err,err)
    })
    
    // getFilteredOrders(res.locals.organization, req)
    // .then(({orders}) => {
    //     deleteOrders(res.locals.organization, orders)
    //     .then((status) => {
    //         if(status === 1){
    //         }
    //     })
    // })
    // .catch((err) => {
    // })
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


router.patch('/one/:id', (req, res) => {
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

router.patch('/all', (req, res) => {
    updateAllOrders(res.locals.organization, {[`orders.$[].${req.query.field}`]:req.query.value})
    .then((result)  => {
        success(req, res, 200, "Orders in organization updated succesfully", result)
    })
    .catch(err => {
        error(req, res, 500, "Error updating all orders of organization", err)
    })
})


export default router