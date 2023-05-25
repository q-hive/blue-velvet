import React, { createContext, useEffect, useState } from "react";
import "../firebaseInit.js";
import { signOut } from "firebase/auth";
import auth from "../firebaseInit.js";
import { useNavigate } from "react-router-dom";
import api from "../axios.js";
import { useErrorHandler } from "react-error-boundary";
import { ResetTvRounded } from "@mui/icons-material";

const AuthContextProv = createContext();


const getRefreshedToken = async () => {
  let refreshedToken 

  const refresh = async () =>{
    await auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      refreshedToken = idToken
    }).catch(function(error) {
      // Handle error
      console.log("error refreshing token",error)
    });

  }

  await refresh()
  return refreshedToken

}






const AuthContext = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [credential, setCredential] = useState(undefined);
  const navigate = useNavigate();

  const handleError = useErrorHandler();

  const logout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  

  const refreshAuthToken = async () => {
    if(user){try {
      const token = await auth.currentUser.getIdToken();
      setCredential(() => ({
        _tokenResponse: { idToken: token },
      }));

      const response = await api.api.post(
        `/auth/refresh`,
        {},
        {
          headers: {
            authorization: token,
          },
        }
      );

      const { data } = response.data;
      const updatedUser = { ...data.user };
      if (!data.isAdmin) {
        updatedUser.role = "employee";
      } else {
        updatedUser.role = "admin";
      }

      setUser(() => ({ ...updatedUser }));
      setLoading(() => false);
    } catch (error) {
      handleError(error);
    }}
  };

  useEffect(() => {
    const authStateChangeHandler = async (u) => {
      setLoading(() => true);
      if (u) {
        try {
          await refreshAuthToken();
        } catch (err) {
          console.log("Error while getting token after reloading.");
          console.log(err);
        }
        return;
      }

      setLoading(() => false);
      setTimeout(() => {
        setLoading(() => false);
      }, 10000);
    };

    const idTokenChangedHandler = async () => {
      try {
        await refreshAuthToken();
      } catch (err) {
        console.log("Error while refreshing token.");
        console.log(err);
      }
    };

    const unregisterAuthObserver = auth.onAuthStateChanged(authStateChangeHandler);
    const unregisterTokenObserver = auth.onIdTokenChanged(idTokenChangedHandler);

    return () => {
      unregisterAuthObserver();
      unregisterTokenObserver();
    };
  }, []);

  return (
    <AuthContextProv.Provider
      value={{ user, setUser, loading, logout, credential, setCredential }}
    >
      {children}
    </AuthContextProv.Provider>
  );
};

export { AuthContext, AuthContextProv, getRefreshedToken };
