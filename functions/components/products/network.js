import express from 'express'
import {error, success} from '../../network/response.js'

//*Controllers
import {isValidProductObject} from './controller.js'

//*Store
import {
    insertNewProduct,
    getAllProducts
} from './store.js'

const router = express.Router()

//*Returns all the products and if requested returns all their related tasks and orders
router.get('/', (req, res) => {
    //*TODO IF THERE IS A QUERY STRING ASKING FOR SPECIFIC RESPONSE SHIULD USE OTHER CONTROLLER INSTEAD OF getAllProducts
    //*TODO Determine valid query strings for this route like: 
    //* ["?tasks (this returns all the products and the tasks related to it) "]
    //* ["?orders (this returns all the products and the orders related to it) "]
    //* ["?orders&tasks (this returns all the products and the orders related to them)"]
    
    //*Orders allways are going to be '' in this route
    //*tasks allways are going to be '' in this route
    const validQueries = ["orders", "tasks"]
    console.log(req.query)  
    getAllProducts()
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
    if(isValidProductObject(req.body)){
        //*insert to db
        insertNewProduct(req.body)
        //*promise message returned
        .then(pm => {
            success(req, res,201,pm)
        })
        .catch(err => {
            switch(err.name){
                case "MongooseError":
                    error(req, res,500, err.message, err)    
                    break;
                case "ValidationError":
                    error(req, res, 400, `The following values are invalid: ${Object.keys(err.errors)}`, err)
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

export default router