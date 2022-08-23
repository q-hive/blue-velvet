import express from 'express'
import { success } from '../../network/response.js'
import { validateBodyNotEmpty } from '../security/secureHelpers.js'
import { createNewCustomer } from './store.js'

const router = express.Router()

router.get('/', (req, res) => {
    success(req, res, 200, "Customers obtained succesfully")
})

router.post('/', (req, res) => {
    if(validateBodyNotEmpty(req, res)){
        return
    }
    
    if(Array.isArray(req.body)){
        //*TODO create insert many customers function

        return
    }

    createNewCustomer(res.locals.organization, req.body)
    .then(orgDoc => {
        success(req, res, 201, "Client created succesfully", orgDoc)
    })
    .catch(err => {
        
    })
})

export default router