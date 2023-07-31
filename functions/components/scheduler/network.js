import express from 'express'
import { error, success } from '../../network/response.js'
import { findSchedulersByCriteria } from './store.js'

const router = express.Router()

router.get('/', (req, res) => {
  const orgId = res.locals.organization
  const { orderId, productId } = req.query
  findSchedulersByCriteria(orgId, orderId, productId)
    .then(data => {
      success(req, res, 200, "Production schedules obtained succesfully", data)
    })
    .catch(err => {
      error(req, res, 500, err.message, err)
    })
})

export default router
