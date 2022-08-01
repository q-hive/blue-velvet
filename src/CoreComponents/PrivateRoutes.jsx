import { Stack } from '@mui/material'
import { Container } from '@mui/system'
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
    <Stack direction={"row"} justifyContent="center">
      <BV_Drawer />
      <Container>
        {props.children}
      </Container>
      </Stack></>
  )
}
