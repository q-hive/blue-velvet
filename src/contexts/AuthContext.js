import React, {createContext, useEffect, useState} from 'react'
import '../firebaseInit.js'
import {getAuth,signInWithCustomToken,setPersistence, browserSessionPersistence, signOut} from 'firebase/auth'
import auth from '../firebaseInit.js'
import { useNavigate } from 'react-router-dom'

const AuthContextProv = createContext()

const AuthContext = ({children}) => {
    const [user, setUser] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [credential, setCredential] = useState(undefined)
    const navigate = useNavigate()

    const logout = () => {
        signOut(auth)
        .then(() => {
          setUser(null)
          window.localStorage.clear()
          navigate('/')
        })
        .catch(err => {
          console.log(err)
        })
    }
    
    useEffect(() => {
      auth.onAuthStateChanged(async (User) => {
        if(User && !user){
          const lastUser = JSON.parse(window.localStorage.getItem('usermeta'))
          setUser(lastUser)
          const newToken = await User.getIdToken()
          setLoading(false)
          setCredential({_tokenResponse:{idToken:newToken}})
          return
        }

        if(User && user){
          const newToken = await auth.currentUser.getIdToken()
          setLoading(false)
          setCredential({_tokenResponse:{idToken:newToken}})
          return
        }

        setLoading(false)
      })
    }, [])
  return (
    <AuthContextProv.Provider value={{user, setUser, loading, logout, credential, setCredential}}>
        {children}
    </AuthContextProv.Provider>
  )
}

export {AuthContext, AuthContextProv}
