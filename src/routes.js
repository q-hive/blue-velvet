//*Admin
// import { SecurityPhraseComponent } from "./modules/Admin/PassPhrase";
import { Dashboard } from "./modules/Admin/Dashboard/Dashboard";
import { ProductionMain } from "./modules/Admin/production/ProductionMain";

//*Employee
import { ContainerEmployeeComponent } from "./modules/Employee/Start";
import { NewProduct } from "./modules/Admin/production/NewProduct";


export const AppRoutes  = [
    // {
    //     path:"/:uid/admin",
    //     component:<SecurityPhraseComponent/>
    // },
    {
        path:"/:uid/admin/dashboard",
        component:<Dashboard/>
    },
    {
        path:"/:uid/admin/production",
        component:<ProductionMain/>
    },
    {
        path:"/:uid/admin/production/newProduct",
        component:<NewProduct/>
    },
    {
        path:"/:uid/admin/production/editProduct",
        component:<NewProduct edit={true}/>
    },
    {
        path:"/:uid/employee/dashboard",
        component:<ContainerEmployeeComponent/>
    },
]