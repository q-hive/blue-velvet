import express from 'express'
import { error, success } from '../../network/response.js'
import {getProductionWorkById, getWorkTimeByEmployee, parseProduction, setPerformance, updatePerformance, updateProductionByStatus} from './controller.js'


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
        console.log(result)
        success(req, res, 204, "Performance updated successfully")
    })
    .catch(err => {
        error(req, res, 500, "Error updating performance", err, err)
    })
})


router.post('/production/:status', (req, res) => {
    console.log('REQUEST IN PRODUCTION')
    //*Update products and orders received in body based on status received in query param  
    updateProductionByStatus(req, res,req.body.workData.products)
    .then((result) => {
        success(req, res, 200, "Production updated succesfully", result)
    })
    .catch((err) => {
        error(req, res, 500, "Error updating products by production data", err, err)
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

/**
 * @description receives the employee id as a req.param and returns the following model based on the orders state
 */
router.get('/production/:id', (req, res) => {
    getProductionWorkById(req,res)
    .then((work) => {
        parseProduction(req,res,work)
        .then((parsedWork) => {
            success(req, res, 200, "Production work obtained succesfully", parsedWork)
        })
    })
    .catch((err) => {
        error(req, res, 500, "Error getting production work - GNERIC ERROR", err, err)
    })
})

export default router
