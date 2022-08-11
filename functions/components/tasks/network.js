import express, { response } from 'express'
import { success, error } from '../../network/response.js'
import { modelsValidationError } from '../../utils/errorHandler.js'
import { isValidTaskObject } from './controller.js'
import {createTask, insertManyTasks} from './store.js'

const router = express.Router()

router.post('/details', (req, res) => {
    if(Array.isArray(req.body)){
        //*Si es un arreglo es para popular base de datos
        //*controlador insert many
    
        insertManyTasks(req.body.tasksDetails)
        .then(message => {
            response(req, res, 201, message)
        })
        .catch(err => {
            //*CASTEAR ERRORES ESTOY HASTA LA MADRE DE NO GESTIONAR COMPLETOS LOS ERRORES
        })
    }
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

export default router