import React,{ createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ApplicationContextProv = createContext()

const ApplicationContext = ({children}) => {
    const [applicationLanguage,setApplicationLanguage] = useState(window.localStorage.getItem("language"))
    const {t, i18n} = useTranslation()

    useEffect(() => {
        if(applicationLanguage !== "" || applicationLanguage !== undefined || applicationLanguage !== null){
            setApplicationLanguage(applicationLanguage)
            i18n.changeLanguage(applicationLanguage)
            window.localStorage.setItem("language",applicationLanguage)
        }

        setApplicationLanguage("en")
    },[applicationLanguage])
    
    return (
        <ApplicationContextProv.Provider value={{applicationLanguage, setApplicationLanguage}}>
            {children}
        </ApplicationContextProv.Provider>    
    )
}

export {ApplicationContext, ApplicationContextProv}