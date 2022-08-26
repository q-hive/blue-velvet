import express from 'express'
import { success, error } from '../../network/response.js'
import { createNewOrder } from './store.js'
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

export default router