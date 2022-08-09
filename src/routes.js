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