import express from 'express'
import { getContainerById } from './store.js'
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

export default router