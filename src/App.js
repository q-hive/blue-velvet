import React from 'react'
//*Router
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import history from './history.js'
//*Contexts
import { AuthContext } from './contexts/AuthContext'

//*Componentes
import { Login } from './CoreComponents/Login.'
import { PrivateRoutes } from './CoreComponents/PrivateRoutes'

export const App = () => {
    const privateRoutes = [
        {
            path:"/container",
            component:<div>Vista del contenedor</div>
        },
        {
            path:"/employee",
            component:<div>Vista del empleado</div>
        },
    ]
    
  return (
    <AuthContext>
        //* import from react-router-dom when imstalled
        <Router history={history}>
            <Routes>
                <Route path="/" element={<Login/>}></Route>
                
                //* Mapea objetos que contienen la ruta y el coponente y devuelve un componente ruta cuyo elemento es el componente private route, el cual su hijo es el componente privado
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
