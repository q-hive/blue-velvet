import express from 'express'
import { success, error } from '../../network/response.js'
import { modelsValidationError } from '../../utils/errorHandler.js'
import { isValidTaskObject } from './controller.js'
import {createTask} from './store.js'

const router = express.Router()

router.post('/', (req, res) => {
    if(isValidTaskObject(req.body)){
        createTask(req.body)
        .then(() => {
            success(req, res, 200, "Task created succesfully")
        })
        .catch((err) => {
            switch(err.name){
                case "ValidationError":
                    error(req, res, 400, modelsValidationError(err))
                    break;
                case "MongooseError":
                    error(req, res, 500, "Server Error while saving", err)
                    break;
                default:
                    error(req, res, 500, "Server error", err)
                    break;
            }
        })
        return
    }
    return error(req, res, 400, "Not valid request", new Error("The provided body is invalid"))
})

export default router