import express from 'express';
import { error, success } from '../../../network/response.js';
import { markInvoiceAsPayed } from './controller.js';
import { getOrganizationInvoices, updateOrganizationInvoiceByCustomer } from './store.js';

const invoicesRouter = express.Router()

invoicesRouter.post('/invoices', (req, res) => {
    console.log("TODO: IMPLEMENT THIS ROUTE")

    success(req, res, 200, "TODO: IMPLEMENT THE ROUTE")
})

invoicesRouter.get('/invoices/:customer_id', (req, res) => {
    getOrganizationInvoices(req, res)
    .then((array) => {
        success(req, res, 200, "Invoices by customer obtained succesfully", array)
    })
    .catch(err => {
        error(req, res, 500, "Error getting invoices of the organization by customer.", err, err)
    })
})
invoicesRouter.patch('/invoices/pay/all/:customer_id', (req, res) => {
    updateOrganizationInvoiceByCustomer(req, res)
    .then(result => {
        success(req, res, 200, "Invoices by customer obtained succesfully", result)
    })
    .catch(err => {
        error(req, res, 500, "Error updating invoices",err, err)
    })
})
invoicesRouter.patch('/invoices/pay/:invoice_id', (req, res) => {
    markInvoiceAsPayed(req, res)
    .then(result => {
        success(req, res, 200, "Invoices mark as payed successfully", result)
    })
    .catch(err => error(req, res, 500, "Error marking as payed the invoice", err, err))
})
// invoicesRouter.patch('/bydate/month/:customer_id')
// invoicesRouter.delete()

export default invoicesRouter