import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { scheduled, throwError } from 'rxjs';
import { DialogService } from '../dialog-service/dialog.service';
import { environment } from 'src/environments/environment';
import { LoadingService } from '../loading-services/loading.service';  // Adjust path as needed

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  userid: any;

  constructor(private http: HttpClient, private dialogService: DialogService, private loadingService: LoadingService) { }
  base_url = "api/fitnest/"
  // apiurl = 'http://124.41.242.252:8000/';
  apiurl = 'http://localhost:8000/';
  public BASE_URL = this.apiurl;
  public CLINT_API_URL = this.base_url;

  public uri = {
    TOKEN: () => localStorage.getItem('token'),
    SIGNUP_URL: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}register`,
    SIGNUP_VERIFY: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}register-verify`,
    REGISTER_USER_BY_ADMIN: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}register-user-by-admin`,

    LOGIN_URL: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}login`,
    RESEND_OTP_URL: () =>
      `${this.BASE_URL}resend-otp`,
    SILENT_LOGIN_URL: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}silent-login?token=${this.uri.TOKEN()}`,
    FORGOT_PASSWORD: () =>
      `${this.BASE_URL}forgot-password`,
    VERIFY_FORGOT_PASSWORD: () =>
      `${this.BASE_URL}verify-forgot-password`,
    RESET_PASSWORD: () =>
      `${this.BASE_URL}reset-password`,
    NEW_SCHEDULING: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}new-scheduling`,
    ADD_DEVICE: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}add-device`,
    PENDING_ADMINS: (searchTerm: any, fromDate: any, toDate: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}pending-admin?searchTerm=${searchTerm}&fromDate=${fromDate}&toDate= ${toDate}`,
    UPDATE_ADMINS_STATUS: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}update-admin-status`,
    UPDATE_TRAINER_STATUS: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}update-trainer-status`,
    GET_ALL_ADMIN: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-all-admin`,
    GET_ALL_CUSTOMER: (userid: any, fromDate: any, toDate: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-active-customer/${userid}?fromDate=${fromDate}&toDate= ${toDate}`,
    GET_GYMNAME: (userid: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-gymname/${userid}`,

    GET_ALL_TRAINER: (userid: any, fromDate: any, toDate: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-active-Trainer/${userid}`,
    GET_PENDING_TRAINER: (userid: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-pending-Trainer/${userid}`,
    GET_ALL_SESSIONS: (userid: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-active-sessions/${userid}`,

    GET_ACTIVE_DEVICE: (userid: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-active-device/${userid}`,
    GET_SCHEDULES: (userid: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-Schedules/${userid}`,
    ALL_SUBSCRIPTION_PLANED: (userid: any, duration: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-subscriptionplan/${userid}?duration=${duration}`,
    GET_SESSION_PLAN: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}/add-subscription-plan`,
    GET_TRAINER_SCHEDULES: (trainerID: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}/get-trainer-schedules/${trainerID}`,
    DEVICE_ENTRY_GATE: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}/device-entry-gate`,
    GET_ALL_TRAINER_SCHEDULES: (userid: any, classname: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-all-trainer-schedules/${userid}?className=${classname}`,
    USER_PROFILE: (userId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}user-profile/${userId}`,
    GET_USER_COUNT: (adminId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}users-count/${adminId}`,
    GET_STAFF_COUNT: (adminId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}staffs-count/${adminId}`,
    POST_COMPLETE_PROFILE: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}complete-profile`,
    UPDATE_CUSTOMER_PROFILE: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}update-profile`,
    UPDATE_MORE_CUSTOMER_PROFILE_INFO: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}update-more-profile-info`,
    SEARCH_USER: (searchTerm: any, userId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}search-users/${userId}?searchTerm=${searchTerm}`,
    SEARCH_USER_BY_TYPE: (userType: any, userId: any, fromDate: any, todate: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}search-usersByType/${userId}?userType=${userType}&fromDate=${fromDate}&toDate=${todate}`,
    SEARCH_TRAINER_BY_STATUS: (userId: any, fromDate: any, todate: any, status: any, searchTerm: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}search-trainerByStatus/${userId}?status=${status}&fromDate=${fromDate}&toDate=${todate}&searchTerm=${searchTerm}`,
    APPROVE_TRAINER: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}approve-trainer`,
    ASSIGN_TRAINER: (scheduleId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}assign-trainer/${scheduleId}`,
    CREATE_MEMBERSHIP_PLAN: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}create-membership-plan`,
    CREATE_VISITOR_PLAN: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}create-visitor-plan`,
    GET_MEMBERSHIP_PLAN: (adminId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-membership-plan/${adminId}`,
    GET_VISITOR_PLAN: (adminId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-visitor-plan/${adminId}`,
    GET_ALL_PLANS: (adminId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-all-plans/${adminId}`,
    VIEW_PLANS_BY_ID: (adminId: any, membershipPlanId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}view-plans-by-id/${adminId}/${membershipPlanId}`,
    SEARCH_SCHDULES: (userId: any, searchTerm: any, fromDate: any, toDate: any, status: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}search-schedules/${userId}?searchTerm=${searchTerm}&fromDate=${fromDate}&toDate=${toDate}&status=${status}`,
    UPDATE_MEMBERSHIP_PLAN: (membershipPlanId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}update-membership-plan/${membershipPlanId}`,
    GET_ACTIVE_CUSTOMERS: (userId: any, searchTerm: any,page: any,limit: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-active-customers/${userId}?searchTerm=${searchTerm}&page=${page}&limit=${limit}`,
    GET_ACTIVE_CUSTOMER_BY_ID: (userId : any,customerId : any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-active-customers-by-id?customerId=${customerId}`,
    BUY_MEMBERSHIP_PLAN: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}buy-membership-plan`,
    VIEW_PURCHASED_PLANS: (userId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}view-purchased-plans/${userId}`,
    VIEW_SUBS_PLANS: (adminId: any, searchTerm: any, fromDate: any, toDate: any, filter: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}view-subs-plans/${adminId}?searchTerm=${searchTerm}&fromDate=${fromDate}&toDate= ${toDate}&filter=${filter}`,
    DELETE_SCHEDULE: (scheduleId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}delete-schedule/${scheduleId}`,
    EDIT_SCHEDULE: (scheduleId: any) => `
    ${this.BASE_URL}${this.CLINT_API_URL}edit-schedule/${scheduleId}`,
    ASSIGN_CLASS_TO_USER: (scheduleId: any) => `${this.BASE_URL}${this.CLINT_API_URL}assign-userToSchedule/${scheduleId}
    `,
    GET_CLASS_BY_DAYS: () => `${this.BASE_URL}${this.CLINT_API_URL}/get-scheduleByDays
    `,
    GET_TRAINERSCHDULE_BY_DAYS: () => `${this.BASE_URL}${this.CLINT_API_URL}/get-trainerScheduleByDays
    `,
    GET_USERS_CLASSES: (userId: any) => `${this.BASE_URL}${this.CLINT_API_URL}/get-userClasses/${userId}
    `,
    GET_USERS_FORNOTIFICATION: (userId: any, type: any) => `${this.BASE_URL}${this.CLINT_API_URL}users-for-notification/${userId}?type=${type}
    `,
    SEND_NOTIFICATION: () => `${this.BASE_URL}${this.CLINT_API_URL}/send-notification
    `,
    GET_TRAINER_CLASSES: (trainerId: any) => `${this.BASE_URL}${this.CLINT_API_URL}trainer-schedule/?trainerId=${trainerId}
    `,
    GET_SUBSCRIPTION_REQUEST: () => `${this.BASE_URL}${this.CLINT_API_URL}get-subscription-request
    `,
    GET_ATTENDANCE: (searchTerm: any, fromDate: any, toDate: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}device-attendance?searchTerm=${searchTerm}&fromDate=${fromDate}&toDate= ${toDate}`,

    REQUEST_SUBSCRIPTION: () => `${this.BASE_URL}${this.CLINT_API_URL}request-subscription`,

    GET_SALARY_HISTORY: (adminId: any, searchTerm: any, fromDate: any, toDate: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}salary-history/${adminId}?searchTerm=${searchTerm}&fromDate=${fromDate}&toDate= ${toDate}`,
    GET_INDIVIDUAL_SALARY_HISTORY: (userId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-individual-salary-history/?userId=${userId}`,
    GET_SUBSCRIPTON_PAYMENT_HISTORY: (adminId: any, searchTerm: any, fromDate: any, toDate: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}memberships-history/${adminId}?searchTerm=${searchTerm}&fromDate=${fromDate}&toDate= ${toDate}`,
    GET_SUBSCRIPTON_INSTALLMENT_PAYMENTS: (adminId: any, searchTerm: any, fromDate: any, toDate: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}memberships-installment-payments/${adminId}?searchTerm=${searchTerm}&fromDate=${fromDate}&toDate= ${toDate}`,
    UPDATE_SUBSCRIPTON_AMOUNT_DUE: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}update-memberships-dueAmount`,
    MEMBERSHIP_DUEAMOUNT: (userId: any,purchaseDate:any, membershipPlansId:any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}membership-dueAmount/${userId}?purchaseDate=${purchaseDate}&membershipPlansId=${membershipPlansId}`,

    GET_ACTIVE_STAFFS: (adminId: any, searchTerm: any, fromDate: any, toDate: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}active-staffs/${adminId}?searchTerm=${searchTerm}&fromDate=${fromDate}&toDate= ${toDate}`,
    GET_STAFF_WITH_SALARY: (adminId: any, searchTerm: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-staff/${adminId}?searchTerm=${searchTerm}`,
    GET_STAFF_SALARY_INFO: (userId : any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-salary-info?userId=${userId}`,
    ASSIGN_SALARY: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}assign-SalaryToStaff`,
    PAY_SALARY: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}post-salary-history`,
    REGISTER_STAFF: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}registerStaff`,

    MANAGE_LEAVE: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}manage-leave`,

    DASHBOARD_USERS_COUNT: (adminId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}dashboard-users-count/${adminId}`,
    GET_EXPIRING_USERS_PLANS: (adminId: any, searchTerm: any, fromDate: any, toDate: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}expiring-users-plans/${adminId}?searchTerm=${searchTerm}&fromDate=${fromDate}&toDate= ${toDate}`,
    POST_PLANS_EXPIRE: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}update-expired-plans`,
    CALCULATE_SALARY: (searchTerm: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}calculate-salary?searchTerm=${searchTerm}`,
    GET_USER_BY_ADMIN: (adminId: any, userId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-user-by-admin/${adminId}/${userId}`,
    UPDATE_USER_BY_ADMIN: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}update-user-by-admin`,
    DELETE_USER_BY_ADMIN: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}delete-user-by-admin`,
    FETCH_DEVICES: (adminId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-devices/${adminId}`,
    POST_TRACK: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}track-progress`,
    FETCH_TRACK_USERS: (userId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-tracking-progress/${userId}`,
    GET_USER_ATTENDANCES: (adminId: any, userId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-users-attendances/${adminId}/${userId}`,
    GET_INDIVIDUAL_ATTENDANCE: (adminId: any, userId: any, fromDate:any, toDate : any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-individual-attendance/${adminId}/${userId}?fromDate=${fromDate}&toDate=${toDate}`,
    GET_USER_TODAYS_ATTENDANCES: (adminId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-today-attendance/${adminId}`,
    GET_TODAYS_COLLECTION: (adminId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}todays-collection/${adminId}`,
    CREATE_DIET: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}create-diet`,
    VIEW_DIET: (trainerId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}view-diet/${trainerId}`,
    REGISTER_ADMIN_BY_SUPER_ADMIN: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}register-admin`,
    VIEW_ADMINS: (searchTerm: any, fromDate: any, toDate: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}view-all-admin?searchBy=${searchTerm}&fromDate=${fromDate}&toDate= ${toDate}`,
    GET_USER_PROFILE: (userId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-userprofile/${userId}`,
    GET_DIET_PLAN: (userId: any) =>
      `${this.BASE_URL}${this.CLINT_API_URL}get-dietplan/${userId}`,
    CREATE_DIET_PLAN: () =>
      `${this.BASE_URL}${this.CLINT_API_URL}create-plan`,
  }

  private loadingEnabled = false;

  activateLoading() {
    this.loadingEnabled = true;
    return this;
  }

  private showLoading() {
    if (this.loadingEnabled) {
      this.loadingService.open();
    }
  }

  private hideLoading() {
    if (this.loadingEnabled) {
      this.loadingService.close();
      // this.loading.close();
      this.loadingEnabled = false;
    }
  }

  private showNetworkIssue(retryCallback: () => void): void {
    // this.dialog.open(DialogComponent, {
    //   width: '300px',
    //   data: { message: 'Your device is not connected to the internet.', retryCallback }
    // });

  }

  get(
    url: string,
    successCallback: (data: any) => void,
    errorCallback: (error: any) => void = () => { }
  ): void {
    this.showLoading();
    this.http
      .get(url)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error && error.error instanceof ProgressEvent) {
            this.showNetworkIssue(() => {
              this.get(url, successCallback, errorCallback);
            });
          }
          return throwError(error);
        })
      )
      .subscribe({
        next: (data: any) => {
          successCallback(data);
          this.hideLoading();
        },
        error: (error: any) => {
          errorCallback(error);
          this.hideLoading();
        }
      });
  };

  post(
    url: string,
    data: any,
    successCallback: (response: any) => void,
    errorCallback: (error: any) => void = () => { }
  ): void {
    this.showLoading();
    const formData = new URLSearchParams();

    // Iterate through the data object and append each key-value pair to the formData
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    this.http
      .post(url, formData.toString(), { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error && error.error instanceof ProgressEvent) {
            // Check if the error is due to no internet connection
            this.showNetworkIssue(() => {
              this.post(url, data, successCallback, errorCallback);
            });
          }
          return throwError(error);
        })
      )
      .subscribe({
        next: (data: any) => {
          successCallback(data);
          this.hideLoading();
        },
        error: (error: any) => {
          errorCallback(error);
          this.hideLoading();
        }
      });
  }
}
