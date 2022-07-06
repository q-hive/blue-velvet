import adminRouter from '../components/admin/network.js'
import {isAuthenticated, isAuthorized } from '../components/security/controller.js'
import authRouter from '../components/security/network.js'

//*Api for request
const api = '/api/v1'

//*Api for auth
const authPath = `/auth`

export const adminRoutes = (app) => {
    const authorized = ["admin"]
    app.use(`${api}/admin`, isAuthenticated, isAuthorized(authorized), adminRouter)
}

export const authRoutes = (app) => {
    app.use(`${authPath}`, authRouter)
}