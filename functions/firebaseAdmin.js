// * Import Mongoose
import { config } from 'dotenv';
config()

import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin'

const appInitMethod = process.env.NODE_ENV === 'production' ? {credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS)} : {projectId: process.env.FIREBASE_PROJECT_ID}

const app = admin.initializeApp(appInitMethod)

const adminAuth = getAuth(app)

export default adminAuth