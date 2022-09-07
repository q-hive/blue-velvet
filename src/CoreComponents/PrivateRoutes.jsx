import { Box, Stack } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'
import BV_Layout from './Layout'
import { CircularProgress} from '@mui/material'
import useAuth from '../contextHooks/useAuthContext'
import auth from '../firebaseInit'
import { useEffect } from 'react'


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
                  <div style={{width:"100vw", height:"100vh", display:"flex", alignItems:"center", justifyContent:"center"}}>
                    <CircularProgress/>  
                  </div>
                )
              }


            </>
        )
    }

  return (
    <>
      <BV_Layout>
        {props.children}
      </BV_Layout>
    </>
  )
}
