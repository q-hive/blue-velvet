import express from 'express'
import { ObjectId } from 'mongodb'
import { mongoose } from '../../mongo.js'
import Product from '../../models/product.js'
import {error, success} from '../../network/response.js'
import { hasQueryString } from '../../utils/hasQuery.js'

//*Controllers
import {isValidProductObject, relateOrdersAndTasks} from './controller.js'

//*Store
import {
    createNewProduct,
    getAllProducts,
    insertManyProducts,
    updateProduct,
    deleteProduct
} from './store.js'
import { getContainerById, updateContainer } from '../container/store.js'

const router = express.Router()

//*Returns all the products and if requested returns all their related tasks and orders
router.get('/', (req, res) => {
    const validQueries = ["orders", "tasks"]
    const orgId = res.locals.organization
    //*This is true if request has some of the valid queries
    if(hasQueryString(req,validQueries)){
        //* If are all the valid queries we use the relateOrdersAndTasks 
        //* controller if not, use a normal filter in store controller
        const areAll = validQueries.every(key => Object.keys(req.query).includes(key))
        if(areAll){
            relateOrdersAndTasks(orgId)
            .then(relatedProds => {
                success(req, res, 200, "Products related with orders and tasks obtained", relatedProds)
            })
            .catch(err => {
                error(req, res, 500, "Error obteniendo ordenes y tareas a traves de los productos", err)
            })
        }
        return
    }

    getAllProducts(orgId)
    .then(data => {
        success(req, res, 200, "Request succeded", data)
    })
    .catch(err => {
        error(req, res, 500, err.message, err)
    })
})

//*separated from all route because of network performance improvement
//*! IF THE CLIENT REQUEST ALL PRODUCTS AND ITS RELATED TASKS AND ORDERS WE DONT WANT TO RECEIVE MANY REQUESTS IF THEY NEED THIS RELATION BE DONE WITH VARIOUS PRODUCTS, INSTEAD MAKE ONE REQUEST AND ASK FOR ALL THE RELATED DATA
//*returns a specific product and if requested all its related tasks and orders
router.get('/:id', (req, res) => {
    console.log(req.params)
    success(req, res, 200, "Request succeded")
})

router.post('/', (req, res) => {
    if(Array.isArray(req.body)){
        insertManyProducts(req.body)
        .then(message => {
            success(req, res,201, message)
        })
        .catch(err => {
            error(req, res, 500, "Error agregando productos a la base de datos", err)
        })
        return
    }
    
    if(isValidProductObject(req.body)){
        //*CREATE PRODUCT
        createNewProduct(req.body)
        //*promise message returned
        .then(async product => {
            //*Update container with the new products
            const update = await updateContainer(res.locals.organization, undefined, {products:product})
            success(req, res,201,update)
        })
        .catch(err => {
            switch(err.name){
                case "MongooseError":
                    error(req, res,500, err.message, err)    
                    break;
                case "ValidationError":
                    error(req, res, 400, `${err._message} in the following keys: ${Object.keys(err.errors)}`, err)
                    break;
                default:
                    error(req, res, 500, "Internal server error", err)
                    break;
            }
        })
        return
    }
    error(req, res, 400, "The data received is invalid.",new Error("Invalid data"))
})

router.patch('/', (req, res) => {
    //*TODO VALIDATE IF REQU.QUERY IS RECEIVING AN ID
    if(req.query.id !== undefined && req.query.id !== ""){
        const orgId = res.locals.organization
        const id = req.query.id
        const field = req.query.field
        const value = req.body.value

        console.log(req.query)
        
        //*TODO IF THERE IS AN ORDER RELATED TO A PRODUCT. NOTIFY CLIENT THAT MUST FIRST CANCEL THE ORDER
        //*TODO TRIGGER TASKS RELATED TO A PRODUCT CANCELLATION
        //*TODO WHEN AL THIS PROCESSES ARE COMPLETED, THEN UPDATE THE PRODUCT STATE
        //*TODO If a products is updated, then the container must be updated
        
        updateProduct(orgId,id,field,value)
        .then((result) => {
            success(req, res, 200, result)
        })
        .catch((err) => {
            error(req, res, 500, "Error updating product", err)
        })
    }
})

router.delete('/', (req, res) => {
    if(req.query.id !== undefined && req.query.id !== ""){
        const orgId = res.locals.organization
        const id = req.query.id
        deleteProduct(orgId, id)
        .then((msg) => {
            success(req, res, 200, msg)
        })
        .catch(err => {
            error(req, res, 500, "Error deleting product", err)
        })
    }
})

export default router