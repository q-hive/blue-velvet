import express from 'express'
import { success, error } from '../../network/response.js'
import { genPassphrase } from '../admin/helper.js'

var router = new express.Router()

router.get('/', (req, res) => {
    return success(req, res, 200, "Passphrase generated", {
        "passphrase": genPassphrase(50)
    })
})

export default router
