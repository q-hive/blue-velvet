import express, { response } from 'express'
import { success, error } from '../../network/response.js'
import { modelsValidationError } from '../../utils/errorHandler.js'
import { getOrganizationTaskHsitory, isValidTaskObject } from './controller.js'
import {createTask, insertManyTasks} from './store.js'

const router = express.Router()

router.post('/details', (req, res) => {
    console.log(Array.isArray(req.body.tasksDetails))
    
    if(req.body && Array.isArray(req.body.tasksDetails)){
        insertManyTasks(req.body.tasksDetails)
        .then(message => {
            success(req, res, 201, message)
        })
        .catch(err => {
            error(req, res, 500,"Something went wrong" ,err)
        })

        return
    }

    error(req, res, 400, "Not correct format provided")
})

router.post('/', (req, res) => {
    if(Array.isArray(req.body)){
       //*Si es un arreglo son multiples tasks y son para asignarse
       //*enviar arreglo a controlador de crear multiples tasks
       
    }
    
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

router.get('/history/', (req, res) => {
    getOrganizationTaskHsitory(req, res, req.query.date, req.query.endDate)
    .then((data) => {
        return success(req, res, 200, "Tasks history obtained succesfully", data)
    })
    .catch((err) => {
        return error(req, res, 500, "Error getting tasks history", err, err)
    })
})

export default router