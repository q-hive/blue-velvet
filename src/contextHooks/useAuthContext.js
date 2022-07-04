import { useContext } from "react";
import { AuthContextProv } from "../contexts/AuthContext";

const useAuth = () => useContext(AuthContextProv)

export default useAuth