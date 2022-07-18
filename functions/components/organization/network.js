import express from 'express'
import { success, error } from '../../network/response.js'
import { getOrganizations, getOrganizationById, newOrganization } from './store.js'
import { modelsValidationError } from '../../utils/errorHandler.js'
import mongoose from 'mongoose'

var router = new express.Router()

// * CREATE
router.post('/new', (req, res) => {
    newOrganization(req.body)
    .then(cont => {
        return success(req, res, 201, 'New organization created succesfully', cont)
    })
    .catch(e => {
        if (e.name == "ValidationError") {
            return error(req, res, 400, modelsValidationError(e)) 
        }
        return error(req, res, 500, "Error saving orders", e)
    })
})

// * READ ONE
router.get('/:id', (req, res) => {
    getOrganizationById(req.params.id)
    .then(org => {
        return success(req, res, 200, 'Organization found', org)
    })
    .catch(err => {
        return error(req, res, 400, 'Exception occurrer', err)
    })
})

// * READ MANY
router.get('/', (req, res) =>{
    // ? FILTERS
    getOrganizations(req.body)
    .then(orgs => {
        return success(req, res, 200, 'Organizations found', orgs)
    })
    .catch(err => {
        return error(req, res, 400, 'Exception occurrer', err)
    })
})

// * UPDATE
router.post('/:id', (req, res) => {
    updateOrganization(req.params.id, req.body)
    .then(orgs => {
        return success(req, res, 201, 'Organization updates successfully', orgs)
    })
    .catch(err => {
        return error(req, res, 400, 'Error updating the organization info', err)
    })
})

// * DELETE
router.delete('/:id', (req, res) => {
    deleteOrganization(req.params.id)
    .then(orgs => {
        return success(req, res, 200, 'Organization deleted successfully', orgs)
    })
    .catch(err => {
        return error(req, res, 400, 'Error deleting the organization info', err)
    })
})

export default router
