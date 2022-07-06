import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const config = {
    apiKey: "AIzaSyBnWcbZ9KgNZWbyC-B9VTmQwAvMWjI4gpM",
    authDomain: "greengrow-116bd.firebaseapp.com",
    projectId: "greengrow-116bd",
    storageBucket: "greengrow-116bd.appspot.com",
    messagingSenderId: "597946461875",
    appId: "1:597946461875:web:83cb86e46328d9671d4ac6"
}

const app = initializeApp({
    credential:applicationDefault()
})

const adminAuth = getAuth(app)

export default adminAuth