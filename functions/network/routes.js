//*Routers
import adminRouter from '../components/admin/network.js'
import authRouter from '../components/security/network.js'
import productsRouter from '../components/products/network.js'
import ordersRouter from '../components/orders/network.js'
import tasksRouter from '../components/tasks/network.js'


//*Middlewares
import {isAuthenticated, isAuthorized } from '../components/security/controller.js'

//*Api for request
const api = '/api/v1'

//*Api for auth
const authPath = `/auth`

export const adminRoutes = (app) => {
    const authorized = ["admin"]
    app.use(`${api}/admin`, isAuthenticated, isAuthorized(authorized), adminRouter)
}

export const productsRoutes = (app) => {
    const authorized = ["admin"]
    app.use(`${api}/products`, productsRouter)
}

export const ordersRoutes = (app) => {
    const authorized = ["admin"]
    app.use(`${api}/orders`, ordersRouter)

}

export const taskRoutes = (app) => {
    const authorized = ["admin"]
    app.use(`${api}/tasks`, tasksRouter)
}

export const authRoutes = (app) => {
    app.use(`${authPath}`, authRouter)
}