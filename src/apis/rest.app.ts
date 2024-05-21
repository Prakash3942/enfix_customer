import feathers from "@feathersjs/feathers";
import auth, {
  AuthenticationClient,
  AuthenticationClientOptions,
} from "@feathersjs/authentication-client";
import { CookieStorage } from "cookie-storage";
import rest from "@feathersjs/rest-client";
import Axios from "axios";
import { ApiRoutes } from "../routes/api_routes";

/**
 * CookieStorage
 * @type {CookieStorage}
 */

export const cookieStorage = new CookieStorage();

const restClient = rest(process.env.baseUrl);

// const socketClient = io(process.env.baseUrl);

export const authCookieName = process.env.cookieName ?? "cookie";
export const loginTime = "login-time";

/**
 * Feathers application
 */

export const restApp = feathers();

restApp.configure(restClient.axios(Axios));

// restApp.configure(socketio(socketClient, {}));
// feathers().configure(socketio(socketClient, {}))

class MyAuthenticationClient extends AuthenticationClient {
  getFromLocation(location: Location) {
    // Do custom location things here
    return super.getFromLocation(location);
  }
}

const options: AuthenticationClientOptions = {
  path: ApiRoutes.authentication,
  storageKey: authCookieName,
  storage: cookieStorage,
  header: "authorization",
  scheme: "Bearer",
  locationKey: authCookieName,
  locationErrorKey: "error",
  jwtStrategy: "jwt",
  Authentication: MyAuthenticationClient,
};
restApp.configure(auth(options));

export default restApp;

export const authenticationService = restApp.service(ApiRoutes.authentication);
export const forogotPasswordService = restApp.service(ApiRoutes.forgotPassword);
export const resetPasswordService = restApp.service(ApiRoutes.resetPassword);
export const getAllIventoryItemService = restApp.service(ApiRoutes.getAllIventoryItem);
export const addInventoryStockItemService = restApp.service(ApiRoutes.addInventoryStockItem);
export const staffService = restApp.service(ApiRoutes.staff);
export const uploadService = restApp.service(ApiRoutes.upload);
export const getAllInventoryTransactionService = restApp.service(ApiRoutes.getAllInventoryTransaction);
export const machineService = restApp.service(ApiRoutes.machine);
export const machineTypeService = restApp.service(ApiRoutes.machineType);
export const getAllAttachmentService = restApp.service(ApiRoutes.getAllAttachment);
export const getAllMaintenanceShedulesService = restApp.service(ApiRoutes.getAllMaintenanceShedules);
export const getAllTodaySchedulesService = restApp.service(ApiRoutes.getAllTodaySchedules);
export const getJobDetailsService = restApp.service(ApiRoutes.getJobDetails);
export const getAllUpComingSchedulesService = restApp.service(ApiRoutes.getAllUpComingSchedules);
export const getRequiredItemScheduleService = restApp.service(ApiRoutes.getRequiredItemSchedule);
export const getAllCustomerPermission = restApp.service(ApiRoutes.getAllCustomerPermission);
export const getAllPlansMaster = restApp.service(ApiRoutes.getAllPlans);
export const dashboardService = restApp.service(ApiRoutes.dashboard);
export const CustomerSubscriptionService = restApp.service(ApiRoutes.customerSubscription);
export const AttendanceHistoryService = restApp.service(ApiRoutes.attendanceHistory);
export const AttendanceReportService = restApp.service(ApiRoutes.attendanceReport);
export const MaintenanceAttachmentService = restApp.service(ApiRoutes.maintenanceAttachment);
export const MaintenanceProductService = restApp.service(ApiRoutes.maintenanceProduct);
export const InventoryItemManagementService = restApp.service(ApiRoutes.inventoryItemManagement);
export const MaintenanceAssigneeService = restApp.service(ApiRoutes.maintenanceAssignee);
export const InventoryRequestService = restApp.service(ApiRoutes.inventoryRequest);
export const LogService = restApp.service(ApiRoutes.log);
export const exportEmployeeService = restApp.service(ApiRoutes.exportEmployee);
export const exportSubscriptionService = restApp.service(ApiRoutes.exportSubscription);
export const exportInvoiceDataService = restApp.service(ApiRoutes.exportInvoiceData);
export const exportCustomerAttendanceService = restApp.service(ApiRoutes.exportCustomerAttendance);
export const exportMachineLogService = restApp.service(ApiRoutes.exportMachineLog);
export const customLogService = restApp.service(ApiRoutes.customLog);
export const exportMachineService = restApp.service(ApiRoutes.exportMachine);
export const exportTodayScheduleService = restApp.service(ApiRoutes.exportTodaySchedule);
export const exportUpcomingScheduleService = restApp.service(ApiRoutes.exportUpcomingSchedule);
export const exportInventoryService = restApp.service(ApiRoutes.exportInventory);
export const pendingSubscriptionService = restApp.service(ApiRoutes.pendingSubscription);
export const renewSubscriptionService = restApp.service(ApiRoutes.renewSubscription);
export const downloadInvoiceService = restApp.service(ApiRoutes.downloadInvoice);
export const GeoFencingService = restApp.service(ApiRoutes.geoFencing);
// downloadInvoice


















