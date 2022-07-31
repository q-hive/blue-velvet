import { Product } from '../../models/index.js'
import { getOrdersByProd } from '../orders/store.js'
import { getTaskByProdId } from '../tasks/store.js'
import { getAllProducts } from './store.js'

const hasEveryKey = (valid, current) => {
     //*Verificar que el objeto tenga todas las llaves del modelo

     //*iterate valid object if some key isnt included reject
     //*If a value is and object then iterate the object in valid and compare keys of nested object in current 
    //* if al keys are included, validate the data types (mongoose does it automatically)
    console.log(valid)
    console.log(current)
    if(Object.keys(valid).every(key => Object.keys(current).includes(key))){
        console.log("Has all keys")
        for (const key of Object.keys(valid)) {
            if(typeof valid[key] === "object"){
                console.log("Validating nested object")
                return hasEveryKey(valid[key], current[key])
            }
        }
        return true
    } else {
        return false
    }
}

export const isValidProductObject = (json) => {
        let productModel 
    
        productModel = {
            "name":"", 
            "price":"",
            "parameters":{
                "day":"",
                "night":"",
                "seedingRate":"",
                "harvestRate":"" 
            }
        }

        if(json.mix && json.mix.isMix === false){
            productModel = {
                "name":"", 
                "price":"",
                "mix":{
                    "isMix":"",
                }
            }
        } else if(json.mix && json.mix.isMix === true){
            productModel = {
                "name":"", 
                "price":"",
                "mix":{
                    "isMix":"",
                    "name":"",
                    "products":[]
                }
            }
        }

        return hasEveryKey(productModel, json)
}



export const relateOrdersAndTasks = async () => {
    //*ASK FOR PRODUCTS ARRAY
    const products = await getAllProducts()
    if(products.length>0) {
        //* ITERATE ARRAY
        const tasksByProducts = products.map(async (prod) => {
            //* AND SEARCH IN TASKS BY PRODUCTS
            const tasks = await getTaskByProdId(prod._id)
            //*SEARCH IN ORDERS BY PRODUCT ID
            const orders = await getOrdersByProd(prod._id)
            prod.tasks = [...tasks]
            prod.orders = [...orders]
            return prod
        })
        return Promise.all(tasksByProducts)
        .then((data) => {
            return data
        })
        .catch((err) => {
            Promise.reject(err)
        })
    }

    return products
    //? ARE TASKS REALLY RELATED TO THE PRODUCTS? no
}