//*Routers
import adminRouter from '../components/admin/network.js'
import authRouter from '../components/security/network.js'
import productsRouter from '../components/products/network.js'
import ordersRouter from '../components/orders/network.js'
import tasksRouter from '../components/tasks/network.js'
import organizationRouter from '../components/organization/network.js'
import productionRouter from '../components/production/network.js'
import passphraseRouter from '../components/passphrase/network.js'
import customersRouter from '../components/customer/network.js'
import filesRouter from '../components/files/network.js'
import workRouter from '../components/work/network.js'
import employeesRouter from '../components/employees/network.js'
import containerRouter from '../components/container/network.js'


//*Middlewares
import { isAuthenticated, isAuthorized } from '../components/security/controller.js'

//*Api for request
const apiV1 = '/api/v1'

//*Api for auth
const authPath = `/auth`

/**
 * @description route functions that process requests for the organization data
 * @param {*} app 
 */
export const organizationRoutes = (app) => {
    const authorized = ["admin"]
    app.use(`${apiV1}/organizations`, isAuthenticated, isAuthorized(authorized), organizationRouter)
}
export const containerRoutes = (app) => {
    const authorized = ["admin"]
    app.use(`${apiV1}/container`, isAuthenticated, isAuthorized(authorized), containerRouter)
}
export const productsRoutes = (app) => {
    const authorized = ["admin"]
    app.use(`${apiV1}/products`, isAuthenticated, isAuthorized(authorized),productsRouter)
}
export const ordersRoutes = (app) => {
    const authorized = ["admin"]
    app.use(`${apiV1}/orders`, isAuthenticated, isAuthorized(authorized), ordersRouter)

}
export const customerRoutes = (app) => {
    const authorized = ["admin"]
    app.use(`${apiV1}/customers`, isAuthenticated, isAuthorized(authorized), customersRouter)

}
export const taskRoutes = (app) => {
    const authorized = ["admin", "employee"]
    app.use(`${apiV1}/tasks`, isAuthenticated, isAuthorized(authorized), tasksRouter)
}
export const workRoutes = (app) => {
    const authorized = ["admin", "employee"]
    app.use(`${apiV1}/work`, isAuthenticated, isAuthorized(authorized), workRouter)
}
export const productionRoutes = (app) => {
    const authorized = ["admin", "employee"]
    app.use(`${apiV1}/production`,  isAuthenticated, isAuthorized(authorized), productionRouter)
}

export const adminRoutes = (app) => {
    const authorized = ["admin"]
    app.use(`${apiV1}/admin`, isAuthenticated, isAuthorized(authorized), adminRouter)
}
export const employeesRoutes = (app) => {
    const authorized = ["admin"]
    app.use(`${apiV1}/employees`, isAuthenticated, isAuthorized(authorized), employeesRouter)
}


export const authRoutes = (app) => {
    app.use(`${authPath}`, authRouter)
}

export const passphraseRoutes = (app) => {
    app.use(`${apiV1}/passphrase`, passphraseRouter)
}

export const filesApi = (app) =>  {
    const authorized = ["admin"]
    
    app.use(`${apiV1}/files`, isAuthenticated, isAuthorized(authorized),filesRouter)
}