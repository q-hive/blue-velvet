import React, {createContext, useState} from 'react'


const AuthContextProv = createContext()

export const AuthContext = ({children}) => {
    const [user, setUser] = useState(undefined)
    
    
  return (
    <AuthContextProv.Provider value={{user}}>
        {children}
    </AuthContextProv.Provider>
  )
}
