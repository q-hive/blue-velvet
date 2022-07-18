// * Import Mongoose
import { config } from 'dotenv'
config()

import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin'
import fs from 'fs'
var serviceAccount = JSON.parse(fs.readFileSync(process.env.PATH_TO_GOOGLE_CREDETNTIALS, 'utf8'));

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const adminAuth = getAuth(app)

export default adminAuth