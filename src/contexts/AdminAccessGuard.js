import { Typography } from "@mui/material";
import React from "react";
import useAuth from "../contextHooks/useAuthContext";

export const AdminAccessGuard = ({children}) => {
    const {user} = useAuth()

    if(user.role !== "admin"){
        return <Typography align="center">What are you doing here? You are not an admin.</Typography>
    }

    return (
        <>{children}</>    
    )
}