import auth from '../../firebaseAdmin.js'

import { error } from '../../network/response.js'
export const isAuthenticated = (req, res, next) => {
    /* 
     * Verifica que el request contenga un ID Token.
    */
    if (!(req.headers.authorization && req.headers.user)) {
        error(req, res, 401, "No tienes autorización")
        return
    }

    let idToken;

    if (typeof req.headers.authorization === "string") {
        // * En este caso se encuentra exitosamente un token en formato string'.
        // * Lee el ID Token del authorization header.
        idToken = req.headers.authorization;
    } else {
        // * No se encontró el authorization header en el formato correcto. 
        error(req, res, "El header de autorización no tiene el formato correcto")
        return
    }


    // * Una vez obtenido el ID Token, procedemos a verificar que sea correcto mediante firebase auth
    auth.verifyIdToken(idToken)
    .then( decodedIdToken => { // * Obtenemos el decodedIDToken como resultado de una operación exitosa
        console.log('ID Token verificado!');
        if (decodedIdToken.rol === undefined) {
            error(req, res, "No tienes rol")
        } else {
            res.locals = { ...res.locals, uid: decodedIdToken.uid, rol: decodedIdToken.rol }
        }
        next();
    })
    .catch( err => {
        if(err.errorInfo.code === "auth/id-token-expired"){
            console.log(err)
            error(req,res,403, "Tu sesión expiró, recarga la página", err)
            return
        }
        console.log(err)
        error(req, res,500, "Error verificando autenticación", err)
    });
}

export const isAuthorized = (authorized) => {
    //*El usuario ya está autenticado aparentemente

    return (req, res, next) => {
        //*Desestructuramos el rol y su id de usuario de locals
        const {rol, uid} = res.locals
        //*Comprobamos que realmente exista un rol y un UID válidos
        if(rol !== undefined && uid !== ""){
            //*Se vuelve a verificar el id Token para obtener el id de nuevo
            auth.verifyIdToken(req.headers.authorization)
            .then(decodedId => {
                //*Si el ID es igual al id autenticado y el arreglo de autorización incluye su rol, entonces puede acceder al recurso
                if(decodedId.uid === uid && authorized.includes(rol)){
                    next()
                } else{
                    error(req, res, 403,"No coinciden los datos de verificación.")
                }
            })
            .catch(err => {
                error(req, res,500, "Error en tu proceso de verificación, intenta más tarde", err)
            }) 
        } else {
            error(req, res, 403, "No tienes acceso")
        }
    }
}