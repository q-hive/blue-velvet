import express from 'express'
import { mongoose } from '../../mongo.js'

import { success, error } from '../../network/response.js'
import { getOrganizations, getOrganizationById, newOrganization, updateOrganization, deleteOrganization } from './store.js'
import { updateClient } from '../client/store.js'
import { modelsValidationError } from '../../utils/errorHandler.js'
import { newContainer } from '../container/store.js'

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

router.post('/containers/:orgId', (req, res) => {
    newContainer((res.locals.organization || req.params.orgId),req.body.container)
    .then((result) => {
        success(req, res, 201, "Container added to organization succesfully", result)
    })
    .catch(err => {
        error(req, res, 500, "Error adding container to organization",  err, err)
    })
})

// * READ ONE
router.get('/:id', (req, res) => {
    getOrganizationById(req.params.id)
    .then(org => {
        success(req, res, 200, 'Organization found', org)
    })
    .catch(err => {
        error(req, res, 400, 'Error getting organization', err, err)
    })
})

// * READ MANY
router.get('/', (req, res) =>{
    // ? FILTERS
    let filter = {}

    if(Object.entries(req.query).length !== 0){
        filter = {[`${Object.keys(req.query)[0]}`]:Object.entries(req.query)[0][1]}
    }

    getOrganizations(filter)
    .then(orgs => {
        return success(req, res, 200, 'Organizations found', orgs)
    })
    .catch(err => {
        return error(req, res, 400, 'Exception occurrer', err)
    })
})

// * UPDATE
router.put('/:id', (req, res) => {
    let orgData = req.body;
    let clientData = req
    if (Object.keys(orgData).indexOf("organization") !== -1 ) {
        orgData = orgData.organization
        delete clientData.body.organization
    }

    updateOrganization(req.params.id, orgData)
    .then(orgs => {
        updateClient(clientData, res, true)
        .then(orgs => {
            return success(req, res, 201, 'Organization and admin was updated successfully', orgs)
        })
        .catch(err => {
            return error(req, res, 400, 'Error updating the admin info', err)
        })
    })
    .catch(err => {
        return error(req, res, 400, 'Error updating the organization info', err)
    })
})

// * DELETE
router.delete('/:id', (req, res) => {
    deleteOrganization(req.params.id)
    .then(org => {
        return success(req, res, 204, 'Organization deleted successfully', org)
    })
    .catch(err => {
        return error(req, res, 400, 'Error deleting the organization info', err)
    })
})

export default router
