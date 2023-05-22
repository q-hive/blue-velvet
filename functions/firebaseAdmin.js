// * Import Mongoose
import { config } from 'dotenv';
config()

import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin'
import fs from 'fs'

// const serviceAccount = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'));

const app = admin.initializeApp({
    // credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS)
    projectId: process.env.FIREBASE_PROJECT_ID
})

const adminAuth = getAuth(app)

export default adminAuth