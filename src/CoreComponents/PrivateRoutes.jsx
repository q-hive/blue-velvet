import React from 'react'
import useAuthContext from '../contextHooks/useAuthContext'

export const PrivateRoutes = ({children}) => {
    const {user} = useAuthContext()
    
    if(!user) {
        return (
            <div>
                NO EXISTE USUARIO
            </div>
        )
    }
  return (
    {children}
  )
}
