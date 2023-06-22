import { initializeApp } from "@firebase/app";
import {getAuth, connectAuthEmulator} from 'firebase/auth'
import { getStorage, ref, uploadBytes, getDownloadURL, connectStorageEmulator} from 'firebase/storage'

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
const storage = getStorage(firebaseApp)

const uploadImage = async (image, name="test") => {
    const storageRef = ref(storage, `logos/${name}`)
    await uploadBytes(storageRef, image)
    const imageURL = await getDownloadURL(storageRef)
    return imageURL
}

if (process.env.REACT_APP_FIREBASE_LOCAL) {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectStorageEmulator(storage, "127.0.0.1", 9199);
}

export { auth, storage, uploadImage}