import express from 'express'
import { error, success } from '../../network/response.js'
import { getPackagingForDay } from './controller.js'


const router = express.Router()

router.get('/packs',(req, res) => {
    getPackagingForDay(new Date(),res.locals.organization)
    .then((result) => {
        success(req, res, 200, "Packages needed for specified date obtained succesfully (today default)", result)
    })
    .catch(err => {
        error(req, res, 500, "Error getting packages needed for specified date (today default)", err, err)
    })
})
router.get('/routes', (req, res) => {
    res.send('ok')
})

export default router