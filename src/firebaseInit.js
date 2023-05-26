import { initializeApp } from "@firebase/app";
import {getAuth, connectAuthEmulator} from 'firebase/auth'

const config = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID
}


const firebaseApp = initializeApp(config)

const auth = getAuth(firebaseApp)

if (process.env.REACT_APP_FIREBASE_LOCAL) {
        connectAuthEmulator(auth, "http://localhost:9099");
}

export default auth