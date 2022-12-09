import express from 'express'
import { error, success } from '../../network/response.js'
import { yesterDay } from '../../utils/time.js'
import { getContainers } from '../container/store.js'
import { getPackagingForDay } from './controller.js'


const router = express.Router()

const injectContainer = async (req, res, next) => {
    req.params.container = await getContainers({"organization":res.locals.organization}).containers[0]._id

    return
}

router.get('/packs/:date',(req, res) => {
    const dateParamParser = (string) => {
        let date = new Date()

        if(string === "orders") {
            return "all"
        }

        if(string === "yesterday"){
            date = yesterDay(date)
            return date
        }

        if(string === "today"){
            return date
        }

    }
    
    getPackagingForDay(dateParamParser(req.params.date),res.locals.organization)
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