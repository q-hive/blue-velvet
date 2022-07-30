import { Stack } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import useAuth from '../contextHooks/useAuthContext'
import BV_AppBar from '../modules/Admin/Dashboard/AppBar_Test'
import BV_Drawer from '../modules/Admin/Dashboard/Drawer_Test'

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
    <BV_Drawer/>
    {props.children}
    </>
  )
}
