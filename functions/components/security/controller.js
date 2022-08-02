import mongoose from 'mongoose'
import auth from '../../firebaseAdmin.js'
import Passphrase from '../../models/passphrase.js'

import { error } from '../../network/response.js'

export const getPassphraseByUid = (uid) => {
    return new Promise(async (resolve, reject) => {
        const passModel = mongoose.model('passphrase', Passphrase)

        passModel.findOne({uid:uid}).exec()
        .then(  (pass) => {
            resolve(pass)
        })
        .catch(err => {
            reject(err)
        })
    
    })
}
export const isAuthenticated = (req, res, next) => {


    return next()
    // * Verify request contains an ID Token.
    if (!(req.headers.authorization && req.headers.user)) {
        error(req, res, 401, "You have no authorization header")
        return
    }

    let idToken;

    if (typeof req.headers.authorization === "string") {
        // * In this case, a string token was found'.
        // * Read the ID Token from authorization header.
        idToken = req.headers.authorization;
    } else {
        // * Authorization header was not found in the proper format 
        error(req, res, "The autorización header is in wrong format")
    }


    // * Una vez obtenido el ID Token, procedemos a verificar que sea correcto mediante firebase auth
    auth.verifyIdToken(idToken)
    .then( decodedIdToken => { // * Obtenemos el decodedIDToken como resultado de una operación exitosa
        console.log('ID Token verified!');
        if (decodedIdToken.role === undefined) 
            return error(req, res, "You have no role assigned")

        res.locals = { 
            ...res.locals, 
            uid: decodedIdToken.uid, 
            role: decodedIdToken.role, 
            organization: decodedIdToken.organization 
        }

        next()
    })
    .catch( err => {
        let expired = err.errorInfo.code === "auth/id-token-expired"

        return error(
            req, res,
            expired ? 403 : 500, 
            expired ? "Your session has expired, reload the page" : "Error verifying session", 
            err
        )
    });
}

export const isAuthorized = (authorized) => {
    //*Se asume que el usuario ya esta autencitc
    return (req, res, next) => {
        return next()
        //*Desestructuramos el rol y su id de usuario de locals
        const { role, uid } = res.locals
        //*Comprobamos que realmente exista un rol y un UID válidos
        if (role !== undefined && uid !== "") {
            //*Se vuelve a verificar el id Token para obtener el id de nuevo
            auth.verifyIdToken(req.headers.authorization)
            .then(decodedId => {
                //*Si el ID es igual al id autenticado y el arreglo de autorización incluye su rol, entonces puede acceder al recurso
                if(decodedId.uid === uid && authorized.includes(role)){
                    next()
                } else{
                    error(req, res, 403, "Verification data is unconsistent.")
                }
            })
            .catch(err => error(req, res, 500, err)) 
        }

        return error(req, res, 403, "You have no access")
    }
}

export const isValidIp = (req, res, next) => {
    // * 1 - Obtain valid IP addresses from Mongo

    // * 2 - Return for valid IP
    next()
}