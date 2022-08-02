import React, {createContext, useEffect, useState} from 'react'
import '../firebaseInit.js'
import {getAuth,signInWithCustomToken,setPersistence, browserSessionPersistence, signOut} from 'firebase/auth'
import auth from '../firebaseInit.js'

const AuthContextProv = createContext()

const AuthContext = ({children}) => {
    const [user, setUser] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [credential, setCredential] = useState(undefined)

    const logout = () => {
        signOut(auth)
        .then(() => {
          setUser(null)
        })
        .catch(err => {
          console.log(err)
        })
    }
    
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        setUser(user)
        setLoading(false)
      })
    }, [])
    
    
    useEffect(() => {
      if(user){
        console.log("User exists")
        if(user.token !== undefined) {
          setPersistence(getAuth(), browserSessionPersistence)
          .then(() => {
            return signInWithCustomToken(getAuth(), user.token)
          })
          .then((Ucredential) => {
            console.log('User with credential, setting session persistance...')
            console.log(Ucredential)
            setCredential(() => Ucredential)
          })
          .catch((err) => {
            console.log(err)
          })
        }
      }
    },[user])
  return (
    <AuthContextProv.Provider value={{user, setUser, loading, logout}}>
        {children}
    </AuthContextProv.Provider>
  )
}

export {AuthContext, AuthContextProv}
