import React, {createContext, useEffect, useState} from 'react'
import '../firebaseInit.js'
import {signOut} from 'firebase/auth'
import auth from '../firebaseInit.js'
import { useNavigate } from 'react-router-dom'

import api from '../axios.js'
import { useErrorHandler } from 'react-error-boundary'

const AuthContextProv = createContext()

const AuthContext = ({children}) => {
  const [user, setUser] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [credential, setCredential] = useState(undefined)
  const navigate = useNavigate()

  const handleError = useErrorHandler();

  const logout = () => {
      signOut(auth)
      .then(() => {
        setUser(null)
        // window.localStorage.clear()
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
            if (response.data.data?.isSuperAdmin) {
              response.data.data.user.role = "superadmin"
            } else if (response.data.data.isAdmin) {
              response.data.data.user.role = "admin"
            } else {
              response.data.data.user.role = "employee"
            }

            setUser((usr) => {
              return {...response.data.data.user}
            })
            setLoading(() => false)
          }, (error)=>handleError(error))
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
