const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const app = initializeApp()

const auth = getAuth(app)

export default auth