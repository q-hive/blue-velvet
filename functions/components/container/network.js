import express from 'express'
import { getContainerById, newContainer, removeContainer, updateContainerById } from './store.js'
import {success, error} from '../../network/response.js'
const router = express.Router()

//*CREATE
router.post('/', (req, res) => {
    newContainer(req.body)
    .then((result) => {
        success(req, res, 201, "Container added successfully", result)
    })
    .catch(err => {
        error(req, res, 500, "Error adding container", err, err)
    })
})

//*READ
router.get('/:id', (req, res) => {
    getContainerById(req.params.id, res.locals.organization)
    .then((orgWithContainer) => {
        success(req, res, 200, 'Container obtained succesfully', orgWithContainer.containers)
    })
    .catch((err) => {
        error(req, res, 500, 'Error getting container - GENERIC ERROR', err)
    })
})


//*UPDATE
router.patch('/config/:_id', (req, res) => {
    console.log(req.body)
    updateContainerById(res.locals.organization, req.params._id, {"query":"set", "key":"config", "value":req.body})
    .then((result) => {
        if(result.matchedCount === 1 && result.modifiedCount === 0){
            success(req, res, 204, "Container has been found, but not update was possible", result)
            return
        }
        
        success(req, res, 200, "Container updated succesfully", result)
    })
    .catch((err) => {
        error(req, res, 500, "Error updating container", err, err)
    })
})
//*UPDATE
router.patch('/:id', (req, res) => {
    updateContainerById(res.locals.organization,req.params.id, req.query)
    .then((containerUpdated) => {
        success(req, res, 200, "Container updated succesfully", containerUpdated)
    })
    .catch((err) => {
        error(req, res, 500, "Error updating container", err, err)
    })
})

//*DELETE
router.delete('/:id', (req, res) => {
    removeContainer(res.locals.organization, req.params.id)
    .then((result) => {
        success(req, res, 200, 'Container deleted succesfully', result)
    })
    .catch(err => {
        error(req, res, 500,  'Error removing container', err, err)
    })
})

export default router