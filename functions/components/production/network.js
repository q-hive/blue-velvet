import express from "express"
import { error, success } from "../../network/response.js"
import { getProductionWorkByContainerId, saveProductionForWorkDay, getAllProductionByOrderId, createProductionProduct, updateProductionProduct, deleteProductionProduct } from "./controller.js"
import { getProductionByStatus } from "./store.js"
import { getAllProductionByStatus } from "./controller.js"

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

router.get('/:status', (req, res) => {
    const { organization: orgId } = res.locals;
    const { _id: containerId } = res.locals.containers.containers[0];
    const { status } = req.params;
    const { startDate, finishDate, tz } = req.query;

    getAllProductionByStatus(orgId, containerId, status, startDate, finishDate, tz)
    .then(result => {
        success(req, res, 200, "Production obtained successfully", result)
    })
    .catch(err => {
        error(req, res, 500, "Error getting production", err, err)
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

router.get('/:container/:orderId', (req, res) => {
    getAllProductionByOrderId(res.locals.organization,req.params.container, req.params.orderId)
    .then((result) => {
        success(req, res, 200, "Order production getting succesfully", result)
    })
    .catch(err => {
        error(req, res, 500, "Error getting the order production", err, err)
    })
})

router.post('/:container/', (req, res) => {
    createProductionProduct(res.locals.organization,req.params.container, req.body)
        .then((result) => {
            success(req, res, 201, "Product of production model created succesfully", result)
        })
        .catch(err => {
            error(req, res, 500, "Error creating the product of production model", err, err)
        })
})

router.patch('/:container/', (req, res) => {
    updateProductionProduct(res.locals.organization,req.params.container, req.body)
        .then((result) => {
            success(req, res, 201, "Product of production model updated succesfully", result)
        })
        .catch(err => {
            error(req, res, 500, "Error updating the product of production model", err, err)
        })
})


router.delete('/:container/', (req, res) => {
    deleteProductionProduct(res.locals.organization,req.params.container, req.body)
        .then((result) => {
            success(req, res, 204, "Product of production model deleted succesfully", result)
        })
        .catch(err => {
            error(req, res, 500, "Error deleting the product of production model", err, err)
        })
})

export default router