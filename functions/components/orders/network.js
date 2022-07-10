import express from 'express'
import { success, error } from '../../network/response.js'
import { createNewOrder } from './store.js'
import {modelsValidationError} from '../../utils/errorHandler.js'

const router = express.Router()

router.post('/', (req, res) => {
    console.log(req.body)

    createNewOrder(req.body)
    .then(status => {
        success(req, res, 201, 'New order created succesfully')
    })
    .catch(err => {
        switch(err.name){
            case "ValidationError":
                error(req, res, 400, modelsValidationError(err))
                break;
            default:
                error(req, res, 500, "Error saving orders", err)
                break;
        }
    })

})

export default router