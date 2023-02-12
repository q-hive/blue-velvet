import { useContext } from "react";
import { ApplicationContextProv } from "../contexts/ApplicationContext";

const useAppContext = () => useContext(ApplicationContextProv)

export default useAppContext