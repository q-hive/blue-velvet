//*SuperAdmin
import { SuperAdminDashboard } from "./modules/SuperAdmin/Dashboard/SuperAdminDashboard";
import { OrganizationIndex } from "./modules/SuperAdmin/Organization/OrganizationIndex";
import { NewOrganization } from "./modules/SuperAdmin/Organization/NewOrganization";
//*Admin
// import { SecurityPhraseComponent } from "./modules/Admin/PassPhrase";
import { Dashboard } from "./modules/Admin/Dashboard/Dashboard";
import { ProductionMain } from "./modules/Admin/production/ProductionMain";
import { NewProduct } from "./modules/Admin/production/NewProduct";
import { SalesIndex } from "./modules/Admin/Sales/SalesIndex";
import { NewOrder } from "./modules/Admin/Sales/newOrders/NewOrder";
import { NewCustomer } from "./modules/Admin/Client/NewCustomer";
import { ClientIndex } from "./modules/Admin/Client/ClientIndex";
import { EmployeeIndex } from "./modules/Admin/Employee/EmployeeIndex";
import { NewEmployee } from "./modules/Admin/Employee/NewEmployee";

//*Employee
import { Profile } from "./modules/Employee/EmployeeProfile";
import { EntryPoint } from "./modules/Employee/EntryPoint";
import { FullChamber } from "./modules/Employee/Tasks/FullChamber";

//*TASKS
import { TasksCardsComponent } from "./modules/Employee/Tasks/Tasks";
import { HarvestingTask } from "./modules/Employee/Tasks/StandaloneTasks/Harvesting";
import { PackingComponent, PackingTask } from "./modules/Employee/Tasks/StandaloneTasks/Packing";
import { DeliveryComponent } from "./modules/Employee/Tasks/StandaloneTasks/Delivery";
import { MaintenanceTask } from "./modules/Employee/Tasks/StandaloneTasks/Maintenance";
import { GrowingTask } from "./modules/Employee/Tasks/StandaloneTasks/Growing";
import { TaskContainer} from "./modules/Employee/Tasks/WorkingTasks/TaskContainer";
import { EditionAbstract } from "./CoreComponents/Edition/EditionAbstract";
import { TasksReview } from "./modules/Admin/Tasks/TasksReview";
import { InvoicesIndex } from "./modules/Admin/Client/invoices/InvoicesIndex";
import { ContainerTaskWrapper } from "./modules/Employee/Tasks/ContainerTasks/ContainerTaskWrapper";
import { ProductionManagementDashboard } from "./modules/Admin/production/management/ProductionManagementDashboard";




export const AppRoutes  = [
    // SUPER ADMIN ROUTES
    {
        path:"/:uid/superadmin/dashboard",
        component:<SuperAdminDashboard/>
    },
    {
        path:"/:uid/superadmin/organizations",
        component:<OrganizationIndex/>
    },
    {
        path:"/:uid/superadmin/organizations/new",
        component:<NewOrganization edit={false}/>
    },
    {
        path:"/:uid/superadmin/organizations/editOrganization",
        component:<NewOrganization edit={true}/>
    },
    // ADMIN ROUTES
    {
        path:"/:uid/admin/dashboard",
        component:<Dashboard/>
    },
    {
        path:"/:uid/admin/production",
        component:<ProductionMain/>
    },
    {
        path:"/:uid/admin/production/management/:productId",
        component:<ProductionManagementDashboard/>
    },
    {
        path:"/:uid/admin/production/newProduct",
        component:<NewProduct edit={false}/>
    },
    {
        path:"/:uid/admin/production/editProduct",
        component:<NewProduct edit={true}/>
    },
    {
        path:"/:uid/admin/tasks/review/:task",
        component:<TasksReview/>
    },
    {
        path:"/:uid/admin/edition",
        component: <EditionAbstract/>
    },
    {
        path:"/:uid/admin/sales/",
        component:<SalesIndex/>
    },
    {
        path:"/:uid/admin/sales/new",
        component:<NewOrder edit={false}/>
    },
    {
        path:"/:uid/admin/client",
        component:<ClientIndex/>
    },
    {
        path:"/:uid/:rol/invoices/:customerId",
        component:<InvoicesIndex/>
    },
    {
        path:"/:uid/admin/client/NewCustomer",
        component:<NewCustomer edit={false}/>
    },
    {
        path:"/:uid/admin/employees",   
        component:<EmployeeIndex/>
    },
    {
        path:"/:uid/admin/employees/new",   
        component:<NewEmployee edit={false}/>
    },
    {
        path:"/:uid/admin/employees/editEmployee",   
        component:<NewEmployee edit={true}/>
    },

    //EMPLOYEE ROUTES
    {
        path:"/:uid/employee/dashboard",
        component:<EntryPoint/>
    },
    {
        path:"/:uid/employee/profile",
        component:<Profile/>
    },
    {
        path:"/:uid/employee/dashboard/taskTest",
        component:<ContainerTaskWrapper/>
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
        path:"/:uid/employee/tasks/delivery",
        component:<DeliveryComponent/>
    },
    {
        path:"/:uid/employee/tasks/packing",
        component:<PackingComponent/>
    },
    {
        path:"/:uid/employee/tasks/growing",
        component:<GrowingTask/>
    },
    {
        path:"/:uid/employee/tasks/settingup",
        component:<MaintenanceTask/>
    },
    {
        path:"/:uid/employee/tasks/work",
        component:<FullChamber/>
    },
    
]