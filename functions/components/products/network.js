import express from 'express'
import {error, success} from '../../network/response.js'

const router = express.Router()

router.get('/', (req, res) => {
    success(req, res, 200, "Rquest succeeded", [])
})

export default router