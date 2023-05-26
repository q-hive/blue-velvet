import { useContext } from "react";
import { WorkingContext } from "../contexts/EmployeeContext";

const useWorkingContext = () => useContext(WorkingContext)

export default useWorkingContext