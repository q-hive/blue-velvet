import express from 'express'
import { error, success } from '../../network/response.js'
import { updateProductionToNextStatus } from '../production/controller.js'
import { validateBodyNotEmpty } from '../security/secureHelpers.js'
import {getProductionWorkById, getWorkTimeByEmployee, parseProduction, setPerformance, updateOrgTasksHistory, updatePerformance, updateWorkDayForEmployee} from './controller.js'


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

router.patch('/production/:container', (req, res) => {
    const validBody = validateBodyNotEmpty(req, res)
    if(!validBody){
        const { productionModelsIds, actualStatus } = req.body
        updateProductionToNextStatus(res.locals.organization,req.params.container,productionModelsIds, actualStatus, req.query.tz, res.locals.uid)
        .then((result) => {
            success(req, res, 200, "Production updated succesfully", result)
        })
        .catch(err => {
            error(req, res, 500, "Error updating the production", err, err)
        })
    }
})
router.patch('/workday/:employeeId/:containerId', (req, res) => {
    // const validBody = validateBodyNotEmpty(req, res)
    updateWorkDayForEmployee(req, res, false)
    .then((result) => {
        success(req, res, 200, `Updated workday for employee: ${req.params.employeeId}`, result)
    })
    .catch(err => {
        error(req, res, 500, "Error updating the employee workday", err, err)
    })
    // if(!validBody){
    // }
})

router.patch('/taskHistory', (req, res) => {
    updateOrgTasksHistory(res.locals.organization, req.body)
    .then((result) => {
        updateWorkDayForEmployee(req, res, true, "achievedTime")
        .then(() => {
            success(req, res, 200, "Task history updated succesfully", result)
        })
        .catch(err => {
            error(req, res, 500, "Error updating employees workday", err, err)
        })
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





export default router
