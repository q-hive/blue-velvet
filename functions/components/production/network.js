import express from "express"
import { error, success } from "../../network/response.js"
import { getProductionWorkByContainerId, saveProductionForWorkDay } from "./controller.js"
import { getProductionByStatus } from "./store.js"

const router = express.Router()

/**
 * @description receives the container id as a req.query and returns the following model based on the productions in container
 */
router.get('/workday', (req, res) => {
    getProductionWorkByContainerId(req,res,"workday")
    .then((production) => {
        success(req, res, 200, "Production work obtained succesfully", production)
    })
    .catch((err) => {
        error(req, res, 500, "Error getting production work - GNERIC ERROR", err, err)
    })
})

router.get('/byTask', (req, res) => {
    getProductionWorkByContainerId(req,res,"tasks")
    .then((production) => {
        success(req, res, 200, "Production work obtained succesfully", production)
    })
    .catch((err) => {
        error(req, res, 500, "Error getting production work - GNERIC ERROR", err, err)
    })
})

router.get('/status/:status', (req, res) => {
    getProductionByStatus(res.locals.organization, req.query.containerId, req.params.status)
    .then(result => {
        success(req, res, 200, "Production obtained successfully", result[req.params.status])
    })
    .catch(err => {
        error(req, res, 500, "Error getting production", err, err)
    })
})

router.post('/workday/:containerId', (req, res) => {
    saveProductionForWorkDay(res.locals.organization, req.params.containerId, req.body)
    .then((production) => {
        success(req, res, 201, "Production for workday saved succesfully")
    })
    .catch((err) => {
        error(req, res, 500, "Error saving production for Workday", err, err)
    })
})

export default router