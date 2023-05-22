import { initializeApp } from "@firebase/app";
import {getAuth, connectAuthEmulator} from 'firebase/auth'

const config = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
}

const firebaseApp = initializeApp(config)

const auth = getAuth()

if (process.env.FIREBASE_LOCAL) {
        connectAuthEmulator(auth, "http://localhost:9099");
}

export default auth
