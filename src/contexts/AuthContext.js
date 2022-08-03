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
      auth.onAuthStateChanged(async (User) => {
        setUser(User)
        const newToken = await User.getIdToken()
        setLoading(false)
        setCredential({_tokenResponse:{idToken:newToken}})
      })
    }, [])
  return (
    <AuthContextProv.Provider value={{user, setUser, loading, logout, credential, setCredential}}>
        {children}
    </AuthContextProv.Provider>
  )
}

export {AuthContext, AuthContextProv}
