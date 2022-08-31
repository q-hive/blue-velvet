//*Admin
// import { SecurityPhraseComponent } from "./modules/Admin/PassPhrase";
import { Dashboard } from "./modules/Admin/Dashboard/Dashboard";
import { ProductionMain } from "./modules/Admin/production/ProductionMain";

//*Employee
import { ContainerEmployeeComponent } from "./modules/Employee/Start";
import { NewProduct } from "./modules/Admin/production/NewProduct";
    //TASKS
    import { TasksCardsComponent } from "./modules/Employee/Tasks/Tasks";
    import { HarvestingTask } from "./modules/Employee/Tasks/StandaloneTasks/Harvesting";
    import { PackingTask } from "./modules/Employee/Tasks/StandaloneTasks/Packing";
    import { DeliveryTask } from "./modules/Employee/Tasks/StandaloneTasks/Delivery";
    import { MaintenanceTask } from "./modules/Employee/Tasks/StandaloneTasks/Maintenance";
    import { GrowingTask } from "./modules/Employee/Tasks/StandaloneTasks/Growing";
    import {TaskTest} from "./modules/Employee/Tasks/WorkingTasks/TaskTest";

import { SalesIndex } from "./modules/Admin/Sales/SalesIndex";
import { NewOrder } from "./modules/Admin/Sales/newOrders/NewOrder";
import { NewCustomer } from "./modules/Admin/Client/NewCustomer";
import { ClientIndex } from "./modules/Admin/Client/ClientIndex";
import { EntryPoint } from "./modules/Employee/Tasks/WorkingTasks/EntryPoint";



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
        path:"/:uid/admin/sales/",
        component:<SalesIndex/>
    },
    {
        path:"/:uid/admin/sales/new",
        component:<NewOrder/>
    },
    {
        path:"/:uid/admin/client",
        component:<ClientIndex/>
    },
    {
        path:"/:uid/admin/client/NewCustomer",
        component:<NewCustomer/>
    },
    {
        path:"/:uid/employee/dashboard",
        component:<EntryPoint/>
    },
    {
        path:"/:uid/employee/dashboard/taskTest",
        component:<TaskTest/>
    },
    {
        path:"/:uid/employee/home",
        component:<ContainerEmployeeComponent/>
    },
    {
        path:"/:uid/employee/production",
        component:<ProductionMain/>
    },
    //Task Routes
    {
        path:"/:uid/employee/tasks",
        component:<TasksCardsComponent/>
    },
    {
        path:"/:uid/employee/tasks/harvesting",
        component:<HarvestingTask/>
    },
    {
        path:"/:uid/employee/tasks/packing",
        component:<PackingTask/>
    },
    {
        path:"/:uid/employee/tasks/delivery",
        component:<DeliveryTask/>
    },
    {
        path:"/:uid/employee/tasks/growing",
        component:<GrowingTask/>
    },
    {
        path:"/:uid/employee/tasks/settingup",
        component:<MaintenanceTask/>
    },
    
]