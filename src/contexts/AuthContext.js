import React, {createContext, useEffect, useState} from 'react'
import '../firebaseInit.js'
import {signOut} from 'firebase/auth'
import auth from '../firebaseInit.js'
import { useNavigate } from 'react-router-dom'

import api from '../axios.js'

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
    return auth.onAuthStateChanged((u) => {
      setLoading(() => true)
      if(u){
        auth.currentUser.getIdToken()
        .then((token) => {
          setCredential(() => {
            return {
              _tokenResponse:{idToken:token}
            }
          })

          api.api.post(`/auth/refresh`, {}, {
            headers:{
              authorization: token
            }
          })
          .then((response) => {
            console.log(response.data.data)
            response.data.data.user.role = "employee"
            setUser((usr) => {
              return {...response.data.data.user}
            })
            setLoading(() => false)
          })
          .catch(err => {
            console.log("Error getting data refreshed")
          })
          
        })
        .catch((err) => {
          console.log("Error while getting token after reloading.")
          console.log(err)
        })
        return 
      }

      setLoading(() => false)
      setTimeout(() => {
        setLoading(() => false)
      }, 10000)
    })
  }, [])

  return (
    <AuthContextProv.Provider value={{user, setUser, loading, logout, credential, setCredential}}>
        {children}
    </AuthContextProv.Provider>
  )
}

export {AuthContext, AuthContextProv}
