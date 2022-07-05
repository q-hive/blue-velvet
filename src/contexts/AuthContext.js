import React, {createContext, useEffect, useState} from 'react'


const AuthContextProv = createContext()

const AuthContext = ({children}) => {
    const [user, setUser] = useState(undefined)
    
    useEffect(() => {
      if(user){
        console.log('Usuario con credencial')
      }
    },[user])
  return (
    <AuthContextProv.Provider value={{user, setUser}}>
        {children}
    </AuthContextProv.Provider>
  )
}

export {AuthContext, AuthContextProv}
