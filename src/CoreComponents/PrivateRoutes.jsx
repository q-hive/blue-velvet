import React from 'react'
import useAuth from '../contextHooks/useAuthContext'

export const PrivateRoutes = (props) => {
    const {user} = useAuth()

    if(!user) {
        return (
            <div>
                NO EXISTE USUARIO, no deberias estar aqui
            </div>
        )
    }

    console.log(props)


  return (
    <>{props.children}</>
  )
}
