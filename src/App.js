import React, { useEffect } from 'react'

//*Router
import {BrowserRouter as Router, Routes, Route, Navigate, } from 'react-router-dom'
import history from './history.js'

import {ErrorBoundary} from 'react-error-boundary'

//*Contexts
import { AuthContext } from './contexts/AuthContext'

//*Componentes
import { Login } from './CoreComponents/Login/Login'
import { PrivateRoutes } from './CoreComponents/PrivateRoutes'
import { AppRoutes } from './routes.js'
import { WorkingContextWrapper } from './contexts/EmployeeContext.js'
import { ErrorPage } from './CoreComponents/ErrorPage.jsx'

export const App = () => {

  return (
    <Router history={history}>
        <ErrorBoundary FallbackComponent={ErrorPage}>
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
                                    {
                                        val.path.split('/').includes('employee')
                                        ?
                                        
                                        <WorkingContextWrapper>
                                            {val.component}
                                        </WorkingContextWrapper>
                                        :
                                        val.component
                                        
                                    }
                                </PrivateRoutes>
                            
                            </>
                        }
                        >
                        </Route> 
                    )
                })}
                
            </Routes>
        </AuthContext>
    </ErrorBoundary>
    </Router>
        
  )
}
