import { Box, Stack } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'
import useAuth from '../contextHooks/useAuthContext'
import BV_Layout from './Layout'

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
      <BV_Layout>
        {props.children}
      </BV_Layout>
    </>
  )
}
