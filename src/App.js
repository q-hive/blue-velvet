import React from 'react'
//*Router
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import history from './history.js'

//*Contexts
import { AuthContext } from './contexts/AuthContext'

//*Componentes
import { Login } from './CoreComponents/Login/Login'
import { PrivateRoutes } from './CoreComponents/PrivateRoutes'
import { AppRoutes } from './routes.js'

export const App = () => {
    
  return (
    
        
    <Router history={history}>
        <AuthContext>
            <Routes>
                <Route path="/" element={<Login/>}></Route>
                
                {AppRoutes.map((val, idx) => {
                    return (
                        <Route
                        key={idx}
                        path={val.path}
                        element={
                            <>
                                <PrivateRoutes>
                                    {val.component}
                                </PrivateRoutes>
                            
                            </>
                        }
                        >
                        </Route> 
                    )
                })}
                
            </Routes>
        </AuthContext>
    </Router>
        
  )
}
