export const ApiRoutes = {
  //authentication
  authentication: "/v1/authenticate",
  forgotPassword: "/v1/forgot-password",
  resetPassword: "/v1/reset-password",

  //manage inventory
  getAllIventoryItem: "/v1/inventory-item-management",
  addInventoryStockItem: "/v1/add-inventory-stock",

  //manage staff
  staff: "/v1/customer-employee-management",

  //manage machine
  machine: "/v1/machine",
  machineType: "/v1/master-machine-type",


  //upload
  upload: "/v1/upload",
  //Transaction inventory management
  getAllInventoryTransaction: "/v1/inventory-transaction-management",

  // all files
  getAllAttachment: "/v1/machine-attachment",

  // maintenance-shedule
  getAllMaintenanceShedules: "/v1/maintenance-schedule-management",

  // Today Schedule
  getAllTodaySchedules: "/v1/maintenance/today-schedules",
  getJobDetails: "/v1/maintenance/manage-task",

  // Upcoming Schedule
  getAllUpComingSchedules: "/v1/maintenance/upcoming-schedules",

  //Maintenance product
  getRequiredItemSchedule: "/v1/maintenance-product",

  getAllCustomerPermission: "/v1/customer-permission",

  getAllPlans: "/v1/plan-master",

  // Dashboard Api
  dashboard: "/v1/dashboard/customer/dashboard-stats",

  customerSubscription: "/v1/customer-subscription",
  attendanceHistory: "/v1/attendance/get-attendance-history",
  attendanceReport: "/v1/attendance/attendance-report",
  machineAttachment: "/v1/machine-attachment",
  maintenanceAttachment: "/v1/maintenance-attachment",
  maintenanceProduct: "/v1/maintenance-product",
  inventoryItemManagement: "/v1/inventory-item-management",
  maintenanceAssignee: "/v1/maintenance-assignee-management",
  inventoryRequest: "/v1/inventory-request",

  // manage machine schedule log
  log: "/v1/maintenance/completed-schedules",

  // export employee
  exportEmployee: "/v1/export/customer-employee-export",

  // export employee subscription
  exportSubscription: "/v1/export/customer-employee-subscription-export",

  // export invoice data
  exportInvoiceData: "/v1/export/customer-transaction-export",

  // customer employee attendance export
  exportCustomerAttendance: "/v1/export/customer-employee-attendance-export",

  // export machine log
  exportMachineLog: "/v1/export/machine-log-export",

  // custom log
  customLog: "/v1/maintenance/add-custom-task",

  // export machine
  exportMachine: "/v1/export/machine-export",

  // export today schedule
  exportTodaySchedule: "/v1/export/today-schedule-export",

  // export upcomming schedule
  exportUpcomingSchedule: "/v1/export/upcoming-schedule-export",

  // export inventory transaction
  exportInventory: "/v1/export/inventory-transaction-export",

  // pending subscription
  pendingSubscription: "/v1/pending-subscriptions",

  // renew subscription
  renewSubscription: "/v1/renew-subscription",

  // download invoice data
  downloadInvoice: "/v1/download-invoice",

  // geofencing
  geoFencing: "/v1/manage-customer"

};
