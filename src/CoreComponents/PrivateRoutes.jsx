import { CircularProgress, Stack } from '@mui/material'
import React from 'react'
import useAuth from '../contextHooks/useAuthContext'
import BV_AppBar from './AppBar_Test'
import BV_Drawer from './Drawer_Test'
import auth from '../firebaseInit'


export const PrivateRoutes = (props) => {
    const {user, setUser, loading} = useAuth()
    if(!user) {
        return (
            <>
              {
                !auth.currentUser && !loading && (
                  <div>
                    NO EXISTE USUARIO, no deberias estar aqui
                  </div>  
                )
              }

              {
              
                loading && (
                  <CircularProgress/>  
                )
              }


            </>
        )
    }

  return (
    <>
    <BV_AppBar />
    <Stack direction={"row"} spacing={1} justifyContent="center">
      <BV_Drawer />
      {props.children}
    </Stack></>
  )
}
