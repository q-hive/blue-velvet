//*Admin
import { SecurityPhraseComponent } from "./modules/Admin/PassPhrase";
import { Dashboard } from "./modules/Admin/Dashboard/Dashboard";
import { ProductionMain } from "./modules/Admin/production/ProductionMain";

//*Employee
import { ContainerEmployeeComponent } from "./modules/Employee/Start";


export const AppRoutes  = [
    {
        path:"/:uid/admin",
        component:<SecurityPhraseComponent/>
    },
    {
        path:"/:uid/admin/dashboard",
        component:<Dashboard/>
    },
    {
        path:"/:uid/admin/production",
        component:<ProductionMain/>
    },
    {
        path:"/:uid/employee",
        component:<ContainerEmployeeComponent/>
    },
]