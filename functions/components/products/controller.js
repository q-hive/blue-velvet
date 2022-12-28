import Product from '../../models/product.js'
import { getOrdersByProd } from '../orders/store.js'
import { getTaskByProdId } from '../tasks/store.js'
import { getAllProducts, updateProduct } from './store.js'

const hasEveryKey = (valid, current) => {
     //*Verificar que el objeto tenga todas las llaves del modelo

     //*iterate valid object if some key isnt included reject
     //*If a value is and object then iterate the object in valid and compare keys of nested object in current 
    //* if al keys are included, validate the data types (mongoose does it automatically)
    console.log(Object.keys(valid))
    if(Object.keys(valid).every(key => Object.keys(current).includes(key))){
        console.log("Has all keys")
        console.log()
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
    
        if(json.mix && json.mix.isMix === false){
            productModel = {
                "name":"",
                "status": "",
                "seed": {},
                "provider": {},
                "price":"",
                "parameters":{
                    "day":"",
                    "night":"",
                    "seedingRate":"",
                    "harvestRate":"" 
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

export const calculatePerformance = (product) => {
    if(product.mix.isMix){
        return 0
    }
    
    return (product.parameters.harvestRate / product.parameters.seedingRate) * (product.price[0].amount / product.price[0].packageSize)
}

export const relateOrdersAndTasks = (orgId) => {
    return new Promise((resolve, reject) => {
        //*ASK FOR PRODUCTS ARRAY

        const getAndRelateData = async () => {
            const products = await getAllProducts(orgId)
            if(products.length>0) {
                // products.forEach((prod) => prod.toObject())
                //* ITERATE ARRAY
                const mappedProd = products.map(async (prod) => {
                    const mutableProd = prod.toObject()
                    //*This function returns the orders, that have a different status of delivered and that includes the products we are asking for
                    //*SEARCH IN ORDERS BY PRODUCT ID
                    const orders = await getOrdersByProd(orgId, prod._id)

                    mutableProd.orders = orders.map((order) => order._id)

                    if(mutableProd.performance === undefined) {
                        mutableProd.performance = Number(calculatePerformance(mutableProd).toFixed(2))
                        await updateProduct(orgId, mutableProd)
                    }
                    
                    return {...mutableProd}
                })
                const mappedData = await Promise.all(mappedProd)

                return mappedData
            }
            resolve(products)
        }

        getAndRelateData()
        .then((data) => {
            resolve(data)
        })
        .catch(err => {
            console.log(err)
        })

    })
}

export const isLargeCicle = (totalProductionTime) => {
    return totalProductionTime > 7
}