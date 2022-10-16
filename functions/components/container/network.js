import express from 'express'
import { getContainerById, updateContainerById } from './store.js'
import {success, error} from '../../network/response.js'
const router = express.Router()

router.get('/:id', (req, res) => {
    getContainerById(req.params.id, res.locals.organization)
    .then((orgWithContainer) => {
        success(req, res, 200, 'Container obtained succesfully', orgWithContainer.containers)
    })
    .catch((err) => {
        error(req, res, 500, 'Error getting container - GENERIC ERROR', err)
    })
})

router.patch('/:id', (req, res) => {
    updateContainerById(res.locals.organization,req.params.id, req.query)
    .then((containerUpdated) => {
        success(req, res, 200, "Container updated succesfully", containerUpdated)
    })
    .catch((err) => {
        error(req, res, 500, "Error updating container", err, err)
    })
})

export default router