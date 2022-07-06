import React from 'react'
//*Router
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import history from './history.js'
//*Contexts
import { AuthContext } from './contexts/AuthContext'

//*Componentes
import { Login } from './CoreComponents/Login'
import { PrivateRoutes } from './CoreComponents/PrivateRoutes'

const ContainerManagerComponent = () => {
    return (
        <div>
            Vista del ADMINISTRADOR
            PONER LA PASSPHRASE
        </div>
    )
}
const ContainerEmployeeComponent = () => {
    return (
        <div>
            Vista del empleado
        </div>
    )
}

export const App = () => {
    const privateRoutes = [
        {
            path:"/:uid/admin",
            component:<ContainerManagerComponent/>
        },
        {
            path:"/:uid/employee",
            component:<ContainerEmployeeComponent/>
        },
    ]
    
  return (
    <AuthContext>
      <Router history={history}>
            <Routes>
                <Route path="/" element={<Login/>}></Route>
                
                {privateRoutes.map((val, idx) => {
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
        </Router>
    </AuthContext>
  )
}
