import React, { createContext, useEffect, useState } from "react";
import "../firebaseInit.js";
import { signOut } from "firebase/auth";
import auth from "../firebaseInit.js";
import { useNavigate } from "react-router-dom";
import api from "../axios.js";
import { useErrorHandler } from "react-error-boundary";

const AuthContextProv = createContext();

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
    try {
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
    }
  };

  useEffect(() => {
    return auth.onAuthStateChanged(async (u) => {
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
    });
  }, []);

  return (
    <AuthContextProv.Provider
      value={{ user, setUser, loading, logout, credential, setCredential }}
    >
      {children}
    </AuthContextProv.Provider>
  );
};

export { AuthContext, AuthContextProv };
