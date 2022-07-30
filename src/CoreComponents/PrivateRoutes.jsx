import { Stack } from '@mui/material'
import React from 'react'
import useAuth from '../contextHooks/useAuthContext'
import BV_AppBar from './AppBar_Test'
import BV_Drawer from './Drawer_Test'

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
    <>
    <BV_AppBar />
    <Stack direction={"row"} spacing={1} justifyContent="center">
      <BV_Drawer />
      {props.children}
    </Stack></>
  )
}
