import express from 'express'
import { error, success } from '../../network/response.js'
import { yesterDay } from '../../utils/time.js'
import { getContainers } from '../container/store.js'
import { getDeliveryByDate, getPackagingForDay } from './controller.js'


const router = express.Router()

const injectContainer = async (req, res, next) => {
    req.params.container = await getContainers({"organization":res.locals.organization}).containers[0]._id

    return
}
export const dateParamParser = (string) => {
    let date = new Date()

    if(string === "orders") {
        return "statusReady"
    }

    if(string === "yesterday"){
        date = yesterDay(date)
        return date
    }

    if(string === "today"){
        return date
    }

}

router.get('/packs/:date',(req, res) => {
    getPackagingForDay(dateParamParser(req.params.date),res.locals.organization, req.query.tz)
    .then((result) => {
        success(req, res, 200, "Packages needed for specified date obtained succesfully (today default)", result)
    })
    .catch(err => {
        error(req, res, 500, "Error getting packages needed for specified date (today default)", err, err)
    })
})
router.get('/routes/:date', (req, res) => {
    getDeliveryByDate(dateParamParser(req.params.date), res.locals.organization)
    .then((result) => {
        success(req, res, 200, "Successfully obtained delivery for specified date", result)
    })
    .catch(err => error(req, res, 500, "Error gettting delivery data for specified date", err, err))
})

export default router