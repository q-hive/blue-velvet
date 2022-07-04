import express from 'express'
import { error, success } from '../../network/response.js'
import { newEmployee } from './store.js'  

const router = express.Router()

router.post('/create', (req, res) => {
    newEmployee(req.body)
    .then(result => {
        success(req, res, 201, "Employee has been created successfully", req.body)
    })
    .catch(err => {
        error(req, res, 400, "Error creating employee", err
    })   
})



export default router