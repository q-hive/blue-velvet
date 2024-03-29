import express from 'express'
import { error, success } from '../../network/response.js'
import { updateClient } from '../client/store.js'
import { validateBodyNotEmpty } from '../security/secureHelpers.js'
import { createNewCustomer, deleteCustomer, getAllCustomers, getCustomerById } from './store.js'

const router = express.Router()

router.get('/:id', (req, res) => {
    if(req.params.id){
        getCustomerById(res.locals.organization, req.params.id)
        .then(customer => {
            success(req, res, 200, "Specufic customer obtained succesfully", customer)
        })
        .catch(err => {
            console.log(err)
            
            const errorObject = {
                message: "There was an internal problem getting customer",
                status: 500,
                processError: err.message
            }
            error(req, res, 500, "Error getting customer - GENERIC ERROR",JSON.stringify(errorObject), err)
        })
        
        
        return
    }
})

router.get('/', (req, res) => {
    getAllCustomers(res.locals.organization)
    .then(docs => {
        success(req, res, 200, "Customers obtained suiccesfully", docs)
    })
    .catch((err, processError) => {
        console.log(processError) 
        error(req, res, 500, "Error retrieving customers - GENERIC ERROR", err, processError)
    })
    
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
    .catch((err, processError) => {
        console.log(processError)
        error(req, res, 500, "Error creatiing customer - GENERIC ERROR", err, processError)
    })
})

router.delete('/:id', (req, res) => {
    deleteCustomer(res.locals.organization,req.params.id)
    .then((result) => {
        success(req, res, 200, "Customer deleted successfully", result)
    })
    .catch((err) => {
        error(req, res, 500, "GENERIC ERROR - DELETING CUSTOMER", err, err)
    })
})  


router.patch('/:id', (req, res) => {
    updateClient(req, res)
    .then(result => {
        success(req, res, 200, "Successfully updated a customer", result)
    })
    .catch(err => {
        error(req, res, 500, "There was an error updating thte customer", err, err)
    })
})
export default router