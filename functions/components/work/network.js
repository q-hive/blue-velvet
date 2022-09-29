import express from 'express'
import { error, success } from '../../network/response.js'
import {setPerformance, updatePerformance} from './controller.js'


const router = express.Router()


router.post('/performance/:id', (req, res) => {
    setPerformance(res.locals.organization,req.params.id,req.body.performance)
    .then((result) => {
        success(req, res, 204, "Performance initialized successfully")
    })
    .catch(err => {
        error(req, res, 500, "Error updating performance", err, err)
    })
})

router.patch('/performance/:id', (req, res) => {
    updatePerformance(res.locals.organization,req.params.id,req.body.performance)
    .then((result) => {
        success(req, res, 204, "Performance updated successfully")
    })
    .catch(err => {
        error(req, res, 500, "Error updating performance", err, err)
    })
})

export default router
