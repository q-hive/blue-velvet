import React, {createContext, useEffect, useState} from 'react'
import '../firebaseInit.js'
import {setPersistence, browserSessionPersistence} from 'firebase/auth'

const AuthContextProv = createContext()

const AuthContext = ({children}) => {
    const [user, setUser] = useState(undefined)
    
    useEffect(() => {
      if(user){
        console.log('User with credential, setting session persistance...')

        console.log(user)
      }
    },[user])
  return (
    <AuthContextProv.Provider value={{user, setUser}}>
        {children}
    </AuthContextProv.Provider>
  )
}

export {AuthContext, AuthContextProv}
