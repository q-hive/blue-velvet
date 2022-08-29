import express from 'express'
import { success, error } from '../../network/response.js'
import { createNewOrder, getAllOrders, updateOrder } from './store.js'
import {modelsValidationError} from '../../utils/errorHandler.js'

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
    getAllOrders(res.locals.organization)
    .then((orders) => {
        success(req, res, 200, "Orders obtained, succesfully", orders)
    })
    .catch(err => {
        error(req, res, 500, "Error getting orders - GENERIC ERROR", err)
    })    
})

router.get('/:id', (req, res) => {

})


router.patch('/:id', (req, res) => {
    //*Send body to controller
    console.log(req.params)
    updateOrder(res.locals.organization,req.params.id,req.body)
    .then(result => {
        success(req, res, 200, "Order updated succesfully", result)
    })
    .catch(err => {
        error(req, res, 500, "Error updating order - GENERIC ERROR", err)
    })
    //*Succcess response
    //*Catch any error
})
export default router