import adminRouter from '../components/admin/network.js'
import {isAuthenticated, isAuthorized } from '../components/security/controller.js'

export const adminRoutes = (app) => {
    const authorized = ["admin"]
    app.use('/api/v1/admin', isAuthenticated, isAuthorized(authorized), adminRouter)
}