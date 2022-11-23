import express from "express"
import { error, success } from "../../network/response.js"
import { getProductionWorkByContainerId, updateProductionByStatus } from "./controller.js"

const router = express.Router()

/**
 * @description receives the container id as a req.query and returns the following model based on the productions in container
 */
router.get('/workday', (req, res) => {
    getProductionWorkByContainerId(req,res)
    .then((production) => {
        success(req, res, 200, "Production work obtained succesfully", production)
    })
    .catch((err) => {
        error(req, res, 500, "Error getting production work - GNERIC ERROR", err, err)
    })
})


router.post('/production/:status', (req, res) => {
    console.log('REQUEST IN PRODUCTION')
    //*Update products and orders received in body based on status received in query param  
    console.log(req.params)
    
    updateProductionByStatus(req.params.status, res.locals.organization,req.body.workData.products)
    .then((result) => {
        success(req, res, 200, "Production updated succesfully", result)
    })
    .catch((err) => {
        error(req, res, 500, "Error updating products by production data", err, err)
    })
})

// router.patch('/production/taskHistory', (req, res) => {
//     console.log('REQUEST IN PRODUCTION')
//     //*Update products and orders received in body based on status received in query param  
//     updateOrgTasksHistory(res.locals.organization, req.body)
//     .then((result) => {
//         success(req, res, 200, "Task history updated succesfully", result)
//     })
//     .catch((err) => {
//         error(req, res, 500, "Error updating products by production data", err, err)
//     })
// })

//*Response with an object containing estimated times for all tasks, calculated from the total production that needs to be executed
// router.get('/time/:id', (req, res) => {
//     getWorkTimeByEmployee(req, res)
//     .then(data => {
//         success(req, res, 200, "Estimation calculated succesfully", data)
//     })
//     .catch(err => {
//         error(req, res, 500, "An error ocurred calculating times -  GENERIC ERROR", err, err)
//     })
// })


export default router