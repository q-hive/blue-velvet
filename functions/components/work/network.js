import express from 'express'
import { error, success } from '../../network/response.js'
import {getWorkTimeByEmployee, setPerformance, updatePerformance} from './controller.js'


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


//*Response with an object containing estimated times for all tasks, calculated from the total production that needs to be executed
router.get('/time/:id', (req, res) => {
    getWorkTimeByEmployee(req, res)
    .then(data => {
        success(req, res, 200, "Estimation calculated succesfully", data)
    })
    .catch(err => {
        error(req, res, 500, "An error ocurred calculating times -  GENERIC ERROR", err, err)
    })
})

export default router
