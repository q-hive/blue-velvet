import { mongoose } from "../../../mongo.js"
import { updateInvoice, updateOrganizationInvoice } from "./store.js"

export const markInvoiceAsPayed = (req,res) => {
    return new Promise(async(resolve, reject) => {
        const organization = res.locals.organization
        const invoiceId = req.params.invoice_id

        const updateDoc = {"$set": {"invoices.$[invoice].payed":Boolean(req.query.payed)}}
        const filters = {
            "arrayFilters":[
                {
                    "invoice._id":mongoose.Types.ObjectId(invoiceId)
                }
            ]
        }

        //*FIRST UPDATE ORGANIZATION DOC
        try {
            
            
            console.log("Updating organizations invoices in organization collection")
            const orgCollectionUpdateResult = await updateOrganizationInvoice(organization,updateDoc,filters)
            

            console.log(orgCollectionUpdateResult)
            
        } catch (err) {
            console.log("Error updating organization DOCS in Collection")
            reject(err)
            return
        }

        try{
            console.log("Updating invoices collection")
            const updateInvoicesCollectionResult = await updateInvoice({"_id":invoiceId, "issuerOrganization":organization},{"$set":{"payed":Boolean(req.query.payed)}})
            console.log(updateInvoicesCollectionResult)
        } catch(err){
            reject(err)
            return
        }
        

        resolve("Invoices updated successfully")
        
    })
}