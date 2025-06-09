import { AllScheduledComponent } from "./pages/all-scheduled/all-scheduled.component";

// src/app/app-routes.config.ts
export const ROUTES = {
  WELCOME: '',
  HOME: 'home',
  LOGIN: 'login',
  OTP: 'otp',
  FORGOT_PASSWORD: 'forgot-password',
  PROFILE: 'profile',
  PRICE_PLAN: 'plan-details/:id',
  ACTIVE_USER: 'subscribed-users',
  ADDSCHEDULING: 'add-scheduling',
  GETINFO: 'get-info',
  YOURSESSION: 'your-session',
  JOINSCHEDULE: "all-users",
  AllSCHEDULED: "all-scheduling",
  REGISTEREDDEVICE: "registered-device",
  TRAINER: "trainer",
  SUPERADMIN: "super-admin",
  SUPERADMINPANEL: "super-admin-panel",
  ADDDEVICE: "add-device",
  GYMREGISTERTION: "gym-registration",
  TRAINEROTP: "trainer-otp",
  REGISTERCLASS: "register-classs/:id",
  USERREGISTERBYADMIN: "register-user",
  TRACKINGACTIVEUSERS: "tracking-user",
  USERSATTENDANCE: "users-attendence",
  TRAINERATTENDANCE: "trainer-attendence",
  ADMINHOME: "admin-home",
  FEEDBACK: "feedback",
  EVENTNOTIFICATION: "event-notification",
  MESSAGE: "message",
  MAIN_PROFILE: 'main-profile',
  ALLTRAINERS: 'all-trainers',
  ALLPLANS: 'all-plans',
  ADDSUBSCRIPTIONPLANS: 'add-subscription-plans',
  BUYSUBSCRIPTIONPLANS: 'buy-subscription-plans',
  ADDONSPLANS: 'add-ons-plans',
  SCHEDULEBYDAYS:'days-schedule',
  SUBSCRIPTIONREQUEST:'subscription-request',
  LEAVEMANAGEMENT: 'leave-management',
  PAYMENTHISTORY: 'payment-history',
  SALARYMANAGEMENT:'salary-management',
  ADDSTAFF:'add-staff',
  DIETPLAN:'diet-plan',
  REGISTERADMIN:'register-admin',
  RECEPTIONLOGIN:'reception-login',
  RECEPTIONHOME: 'reception-home',
  ADDUSERBYRECEPTIONIST: 'add-user-by-receptionist',
  RECEIVEDAMOUNTHISTORY: 'received-amount-history'
};

// Routes that shouldn't be accessed after login.
export const AUTHENTICATION_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.WELCOME,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.SUPERADMIN
];

//Routes user cannot access directly from browser.
export const SECURE_ROUTES_FOR_CUSTOMER = [
  ROUTES.HOME,
  ROUTES.PRICE_PLAN,
  ROUTES.GETINFO,
  ROUTES.PROFILE,
  ROUTES.FEEDBACK
];

//Routes user cannot access directly from browser.
export const SECURE_ROUTES_FOR_ADMIN = [
  ROUTES.ADDDEVICE,
  ROUTES.ADDSCHEDULING,
  ROUTES.TRAINEROTP,
  ROUTES.JOINSCHEDULE,
  ROUTES.REGISTERCLASS,
  ROUTES.ACTIVE_USER,
  ROUTES.PROFILE,
  ROUTES.USERREGISTERBYADMIN,
  ROUTES.TRACKINGACTIVEUSERS,
  ROUTES.ADMINHOME,
  ROUTES.EVENTNOTIFICATION,
  ROUTES.AllSCHEDULED,
  ROUTES.REGISTEREDDEVICE,
  ROUTES.TRAINER,
  ROUTES.USERSATTENDANCE,
  ROUTES.TRAINERATTENDANCE,
  ROUTES.MESSAGE,
  ROUTES.MAIN_PROFILE,
  ROUTES.ALLTRAINERS,
  ROUTES.ALLPLANS,
  ROUTES.ADDSUBSCRIPTIONPLANS,
  ROUTES.BUYSUBSCRIPTIONPLANS,
  ROUTES.ADDONSPLANS,
  ROUTES.SCHEDULEBYDAYS,
  ROUTES.SUBSCRIPTIONREQUEST,
  ROUTES.LEAVEMANAGEMENT,
  ROUTES.PAYMENTHISTORY,
  ROUTES.SALARYMANAGEMENT,
  ROUTES.ADDSTAFF,
  ROUTES.DIETPLAN,
  ROUTES.RECEIVEDAMOUNTHISTORY
];

export const SECURE_ROUTES_FOR_SUPER_ADMIN = [
  ROUTES.SUPERADMINPANEL,
  ROUTES.REGISTERADMIN
];


export const SECURE_ROUTES_FOR_TRAINER = [
  ROUTES.YOURSESSION,
  ROUTES.MAIN_PROFILE,
  ROUTES.ALLTRAINERS,
  ROUTES.DIETPLAN
];

export const SECURE_ROUTES_FOR_RECEPTIONIST = [
  ROUTES.RECEPTIONHOME,
  ROUTES.ADDUSERBYRECEPTIONIST
];