import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api-service/api.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { ROUTES } from 'src/app/app-routes.config';
import { duration } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  getActiveDevices(arg0: (res: any) => void) {
    throw new Error('Method not implemented.');
  }
  userDataObj: any;
  userType: any;
  loginData: any
  userRegisterData: any
  bookingData = false
  verificationType: any;
  myname: any
  forgetpasswordemail: any
  showForgotPassEmail = true;
  ticketID: any;
  getTicketId: any
  userIdlogin: any;

  redirectedCustomerId: any;

  constructor(private apiService: ApiService, private dialogService: DialogService, private router: Router) { }

  signUp(
    obj: any,
    onSuccess: (data: any) => void
  ) {

    this.apiService.activateLoading().post(this.apiService.uri.SIGNUP_URL(), obj, (response) => {
      if (!response.success) {
        this.dialogService.open('Oops!', `${response.message}`, '', false, 'Okay');
      } else {
        onSuccess(response.message);
      }
    }
    )
  }

  signupVerify(verificationType: 'emailVerification' | 'forgotPasswordVerification', obj: any, onSuccess: (data: any) => void) {
    if (verificationType === "emailVerification") {
      this.apiService.post(this.apiService.uri.SIGNUP_VERIFY(), obj, (response) => {
        if (!response.success) {
          this.dialogService.open('Oops!', `${response.message}`, '', false, 'Okay');
        } else {
          onSuccess(response);
          this.silentLogin(response.token);
        }
      })
    } else {
      this.verifyForgotPassword(obj, (response) => {
        if (!response.success) {
          this.dialogService.open('Oops!', `${response.message}`, '', false, 'Okay');
        } else {
          this.router.navigate([ROUTES.FORGOT_PASSWORD])
          onSuccess(response);
        }
      })
    }
  }
  signupuserbyadmin(obj: any, onSuccess: (data: any) => void) {
    let createdByAdmin;
    if (this.userRegisterData.userType === "Admin") {
      createdByAdmin = this.userRegisterData.id;
    } else {
      createdByAdmin = this.userRegisterData.createdByAdmin;
    }
    const requestData = { ...obj, createdByAdmin };
    this.apiService.post(this.apiService.uri.REGISTER_USER_BY_ADMIN(), requestData, (response) => {
      if (!response.success) {
        this.dialogService.open('Oops!', `${response.message}`, '', false, 'Okay');
      } else {
        onSuccess(response);
      }
    })
  }

  tokenExist() {
    return this.apiService.uri.TOKEN();
  }

  login(
    obj: any,
    onSuccess: (data: any) => void
  ) {
    this.apiService.activateLoading().post(this.apiService.uri.LOGIN_URL(), obj, (res) => {

      if (!res.success) {
        this.dialogService.open('Oops!', `${res.message}`, '', false, 'Okay');
      } else {


        localStorage.setItem('token', res.token);

        this.silentLogin((silentResponse) => {
          if (!silentResponse.error) {

            this.userDataObj = silentResponse.data
            onSuccess(silentResponse);
          } else {
            onSuccess({ error: true });
          }
        });

        // this.silentLogin(res.token);

      }
    })
  }

  // resend otp
  resend(
    obj: any,
    onSuccess: (Data: any) => void
  ) {
    this.apiService.post(this.apiService.uri.RESEND_OTP_URL(), obj, (res) => {
      if (!res.success) {
        this.dialogService.open('Oops!', `${res.message}`, '', false, 'Okay');
      } else {
        onSuccess(res);
      }

    })
  }

  //#Change-SilentLogin
  silentLogin(onSuccess: (responseData: any) => void) {
    this.apiService.get(
      this.apiService.uri.SILENT_LOGIN_URL(),
      (responseData) => {
        if (responseData.success) {

          this.loginData = responseData;

          this.userRegisterData = responseData.data;
          this.userDataObj = responseData.data

          onSuccess(responseData);

        } else {
          localStorage.removeItem('userType'); // Remove userType
          localStorage.removeItem('token');
          onSuccess(false)
        }
      },
      (err) => {
        onSuccess({ success: false });
      }
    );
  }
  //#End-Change-SilentLogin

  //#Forgot-password
  forgotPassword(email: any, onSuccess: (data: any) => void) {
    this.apiService.post(this.apiService.uri.FORGOT_PASSWORD(), { email: email }, (response) => {
      if (response.success) {
        onSuccess(response.message);
      } else {
        this.dialogService.open('Oops!', `${response.message}`, '', false, 'Okay');
      }
    })
  }
  //#Forgot-password 

  //# Verify-forgot-password
  verifyForgotPassword(obj: any, onSuccess: (data: any) => void) {
    this.apiService.post(this.apiService.uri.VERIFY_FORGOT_PASSWORD(), obj, (response) => {
      if (response.success) {
        onSuccess(response);
      } else {
        this.dialogService.open('Oops!', `${response.message}`, '', false, 'Okay');
      }
    })
  }
  //#end Verify-forgot-password

  //# Reset-password
  resetPassword(obj: any, onSuccess: (data: any) => void) {
    this.apiService.post(this.apiService.uri.RESET_PASSWORD(), obj, (response) => {
      if (response.success) {
        onSuccess(response);
      } else {
        this.dialogService.open('Oops!', `${response.message}`, '', false, 'Okay');
      }
    })
  }

  pendingAdmins(searchTerm: any, startDate: any, endDate: any, onSuccess: (responseData: any) => void): void {
    this.apiService.get(
      this.apiService.uri.PENDING_ADMINS(searchTerm, startDate, endDate),
      (responseData) => {
        if (responseData && responseData.success) {
          onSuccess(responseData);
        } else {
          onSuccess({ success: false, message: "Failed to fetch pending admins." });
        }
      },
      (error) => {
        console.error("Error fetching pending admins:", error);
        onSuccess({ success: false, message: "An error occurred while fetching pending admins." });
      }
    );
  }

  newschedule(obj: any, onSuccess: (data: any) => void) {
    this.apiService.post(this.apiService.uri.NEW_SCHEDULING(), obj, (response) => {
      if (response.success) {
        onSuccess(response);
      } else {
        this.dialogService.open('Oops!', `${response.message}`, '', false, 'Okay');
      }
    })
  }

  adddevice(obj: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }

    obj = {
      ...obj,
      userId: adminId
    }

    this.apiService.post(this.apiService.uri.ADD_DEVICE(), obj, (response) => {
      if (response.success) {
        onSuccess(response);
      } else {
        this.dialogService.open('Oops!', `${response.message}`, '', false, 'Okay');
      }
    })
  }
  approveAdmin(obj: any, onSuccess: (data: any) => void) {
    this.apiService.post(this.apiService.uri.UPDATE_ADMINS_STATUS(), obj, (response) => {
      if (response.success) {
        onSuccess(response);
      } else {
        this.dialogService.open('Oops!', `${response.message}`, '', false, 'Okay');
      }
    })
  }

  getAllAdmin(onSuccess: (data: any) => void) {
    this.apiService.get(
      this.apiService.uri.GET_ALL_ADMIN(),
      (response) => {
        this.loginData = response
        onSuccess(response);
      },
      (err) => {
        onSuccess({ success: false });
      }
    );
  }

  getallcustomer(fromDate: any, toDate: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }

    this.apiService.get(
      this.apiService.uri.GET_ALL_CUSTOMER(adminId, fromDate, toDate),
      (response) => {
        this.loginData = response
        onSuccess(response);
      },
      (err) => {
        onSuccess({ success: false });
      }
    );
  }

  getallcustomerforRecpt(fromDate: any, toDate: any, onSuccess: (data: any) => void) {
    const userId = this.userRegisterData.createdByAdmin;

    this.apiService.get(
      this.apiService.uri.GET_ALL_CUSTOMER(userId, fromDate, toDate),
      (response) => {
        this.loginData = response
        onSuccess(response);
      },
      (err) => {
        onSuccess({ success: false });
      }
    );
  }

  getalltrainer(fromDate: any, toDate: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }

    this.apiService.get(
      this.apiService.uri.GET_ALL_TRAINER(adminId, fromDate, toDate),
      (response) => {
        this.loginData = response
        onSuccess(response);
      },
      (err) => {
        onSuccess({ success: false });
      }
    );
  }
  getallTrainerByStatus(fromDate: any, toDate: any, status: any, searchTerm: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }


    this.apiService.get(
      this.apiService.uri.SEARCH_TRAINER_BY_STATUS(adminId, fromDate, toDate, status, searchTerm),
      (response) => {
        this.loginData = response
        onSuccess(response);
      },
      (err) => {
        onSuccess({ success: false });
      }
    );
  }

  getpendingtrainer(onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;

    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }
    this.apiService.get(
      this.apiService.uri.GET_PENDING_TRAINER(adminId),
      (response) => {
        this.loginData = response
        onSuccess(response);
      },
      (err) => {
        onSuccess({ success: false });
      }
    );
  }

  getallsession(onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;

    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }
    this.apiService.get(
      this.apiService.uri.GET_ALL_SESSIONS(adminId),
      (response) => {
        this.loginData = response
        onSuccess(response);
      },
      (err) => {
        onSuccess({ success: false });
      }
    );
  }

  getActiveDevicessession(onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;

    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }

    this.apiService.get(
      this.apiService.uri.GET_ACTIVE_DEVICE(adminId),
      (response) => {
        this.loginData = response
        onSuccess(response);
      },
      (err) => {
        onSuccess({ success: false });
      }
    );


  }

  // ADD SUBSCRIPTION PLAN 
  getsubscriptionplan(obj: any, onSuccess: (data: any) => void) {
    this.apiService.post(this.apiService.uri.GET_SESSION_PLAN(), obj, (response) => {
      if (response.success) {
        onSuccess(response);
      } else {
        this.dialogService.open('Oops!', `${response.message}`, '', false, 'Okay');
      }
    })
  }

  approveTrainer(obj: any, onSuccess: (data: any) => void) {
    this.apiService.post(this.apiService.uri.UPDATE_TRAINER_STATUS(), obj, (response) => {
      if (response.success) {
        onSuccess(response);
      } else {
        this.dialogService.open('Oops!', `${response.message}`, '', false, 'Okay');
      }
    })
  }

  assignUserToClass(obj: any, scheduleId: any, onSuccess: (data: any) => void) {
    this.apiService.post(this.apiService.uri.ASSIGN_CLASS_TO_USER(scheduleId), obj, (response) => {
      if (response.success) {
        onSuccess(response);
      } else {
        this.dialogService.open('Oops!', `${response.message}`, '', false, 'Okay');
      }
    })
  }

  getClassByDays(days: any, onSuccess: (data: any) => void) {

    let obj;

    if (this.userRegisterData.userType === "Admin") {
      obj = {
        adminId: this.userRegisterData.id,
        weekdays: days
      }
    } else {
      obj = {
        adminId: this.userRegisterData.createdByAdmin,
        weekdays: days
      }
    }


    this.apiService.post(this.apiService.uri.GET_CLASS_BY_DAYS(), obj, (response) => {
      if (response.success) {
        onSuccess(response);
      } else {
        this.dialogService.open('Oops!', `${response.message}`, '', false, 'Okay');
      }
    })
  }

  getTrainerClassByDays(days: any, onSuccess: (data: any) => void) {
    let obj = {
      trainerId: this.userRegisterData.id,
      weekdays: days
    }
    this.apiService.post(this.apiService.uri.GET_TRAINERSCHDULE_BY_DAYS(), obj, (response) => {
      if (response.success) {
        onSuccess(response);
      } else {
        this.dialogService.open('Oops!', `${response.message}`, '', false, 'Okay');
      }
    })
  }

  sendNotification(obj: any, onSuccess: (data: any) => void) {
    this.apiService.post(this.apiService.uri.SEND_NOTIFICATION(), obj, (response) => {
      if (response.success) {
        onSuccess(response);
      } else {
        this.dialogService.open('Oops!', `${response.message}`, '', false, 'Okay');
      }
    })
  }




  getSchedules(onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }
    this.apiService.get(
      this.apiService.uri.GET_SCHEDULES(adminId),
      (response) => {
        this.loginData = response
        onSuccess(response);
      },
      (err) => {
        onSuccess({ success: false });
      }
    );


  }


  getUsersClasses(userId: any, onSuccess: (data: any) => void) {
    this.apiService.get(
      this.apiService.uri.GET_USERS_CLASSES(userId),
      (response) => {
        this.loginData = response
        onSuccess(response);
      },
      (err) => {
        onSuccess({ success: false });
      }
    );


  }


  getTrainerClasses(trainerId: any, onSuccess: (data: any) => void) {
    this.apiService.get(
      this.apiService.uri.GET_TRAINER_CLASSES(trainerId),
      (response) => {
        this.loginData = response
        onSuccess(response);
      },
      (err) => {
        onSuccess({ success: false });
      }
    );


  }

  getTrainerSchedules(onSuccess: (data: any) => void) {
    let adminId = this.userRegisterData.id
    this.apiService.get(
      this.apiService.uri.GET_TRAINER_CLASSES(adminId),
      (response) => {
        this.loginData = response
        onSuccess(response);
      },
      (err) => {
        onSuccess({ success: false });
      }
    );


  }

  getUsersForNotification(type: any, onSuccess: (data: any) => void) {
    let adminId = this.userRegisterData.id;
    this.apiService.get(
      this.apiService.uri.GET_USERS_FORNOTIFICATION(adminId, type),
      (response) => {
        this.loginData = response
        onSuccess(response);
      },
      (err) => {
        onSuccess({ success: false });
      }
    );


  }

  getCustomerSubscriptionplan(duration: any, onSuccess: (data: any) => void) {
    const userId = this.userRegisterData.id
    // const duration = obj.duration
    this.apiService.get(
      this.apiService.uri.ALL_SUBSCRIPTION_PLANED(userId, duration),
      (response) => {
        this.loginData = response
        onSuccess(response);
      },
      (err) => {
        onSuccess({ success: false });
      }
    );
  }

  getTrainerSchdeules(onSuccess: (data: any) => void) {
    const userId = this.userRegisterData.id
    this.apiService.get(
      this.apiService.uri.GET_TRAINER_SCHEDULES(userId),
      (response) => {
        this.loginData = response
        onSuccess(response);
      },
      (err) => {
        onSuccess({ success: false });
      }
    );


  }

  getAllTrainerSchdeules(selectedclass: any, onSuccess: (data: any) => void) {
    const userId = this.userRegisterData.createdByAdmin
    const classname = selectedclass
    this.apiService.get(
      this.apiService.uri.GET_ALL_TRAINER_SCHEDULES(userId, classname),
      (response) => {
        this.loginData = response
        onSuccess(response);
      },
      (err) => {
        onSuccess({ success: false });
      }
    );


  }

  deviceentrygate(obj: any, onSuccess: (data: any) => void) {
    this.apiService.post(this.apiService.uri.DEVICE_ENTRY_GATE(), obj, (response) => {
      if (response.success) {
        onSuccess(response);
      } else {
        this.dialogService.open('Oops!', `${response.message}`, '', false, 'Okay');
      }
    })
  }

  getGymName(onSuccess: (data: any) => void , userIdforadmin?:string) {

    let userId = this.userRegisterData?.createdByAdmin
    if(this.userRegisterData.userType !== "Customer" && userIdforadmin) {
      userId =  this.userRegisterData?.id;
      console.log(userId , "here i got customeruserid")
  }

    this.apiService.get(
      this.apiService.uri.GET_GYMNAME(userId),
      (response) => {
        this.loginData = response
        onSuccess(response);
      },
      (err) => {
        onSuccess({ success: false });
      }
    );
  }

  getProfileDetails(userId: any, onSuccess: (data: any) => void) {
    this.apiService.get(this.apiService.uri.USER_PROFILE(userId), (response) => {
      onSuccess(response);
    })
  }

  getUsersCount(onSuccess: (data: any) => void) {
    const adminId = this.userRegisterData.id;
    this.apiService.get(this.apiService.uri.GET_USER_COUNT(adminId), (response) => {
      onSuccess(response);
    })
  }
  getStaffsCount(onSuccess: (data: any) => void) {
    const adminId = this.userRegisterData.id;
    this.apiService.get(this.apiService.uri.GET_STAFF_COUNT(adminId), (response) => {
      onSuccess(response);
    })
  }

  completeProfile(obj: any, onSuccess: (data: any) => void) {
    this.apiService.post(this.apiService.uri.POST_COMPLETE_PROFILE(), obj, (response) => {
      onSuccess(response);
    })
  }

  updateCustomerProfile(obj: any, onSuccess: (data: any) => void) {
    this.apiService.post(this.apiService.uri.UPDATE_CUSTOMER_PROFILE(), obj, (response) => {
      onSuccess(response);
    })
  }

  updateCustomerMoreProfileInfo(obj: any, onSuccess: (data: any) => void) {
    this.apiService.post(this.apiService.uri.UPDATE_MORE_CUSTOMER_PROFILE_INFO(), obj, (response) => {
      onSuccess(response);
    })
  }

  // users filter apis
  searchUser(searchTerm: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }
    this.apiService.get(this.apiService.uri.SEARCH_USER(searchTerm, adminId), (response) => {
      onSuccess(response);
    })
  }

  searchUserByType(userType: any, fromDate: any, toDate: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }
    this.apiService.get(this.apiService.uri.SEARCH_USER_BY_TYPE(userType, adminId, fromDate, toDate), (response) => {
      onSuccess(response);

    })
  }

  searchSchedules(searchTerm: any, fromDate: any, toDate: any, status: any, onSuccess: (data: any) => void) {
    const userId = this.userRegisterData.id;
    this.apiService.get(this.apiService.uri.SEARCH_SCHDULES(userId, searchTerm, fromDate, toDate, status), (response) => {
      onSuccess(response);

    })
  }

  getStaffWithSalary(searchTerm: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;

    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }
    this.apiService.get(this.apiService.uri.GET_STAFF_WITH_SALARY(adminId, searchTerm), (response) => {
      onSuccess(response);

    })
  }

  getStaffSalaryInfo(userId: any, onSuccess: (data: any) => void) {
    this.apiService.get(this.apiService.uri.GET_STAFF_SALARY_INFO(userId), (response) => {
      onSuccess(response);
    })
  }

  deleteSchedule(scheduleId: any, onSuccess: (data: any) => void) {
    this.apiService.get(this.apiService.uri.DELETE_SCHEDULE(scheduleId), (response) => {
      onSuccess(response);

    })
  }

  updateTrainerStatus(obj: any, onSuccess: (data: any) => void) {
    this.apiService.post(this.apiService.uri.APPROVE_TRAINER(), obj, (response) => {
      onSuccess(response);
    })
  }

  registerStaff(obj: any, onSuccess: (data: any) => void) {
    let insertObj = {
      ...obj,
      adminId: this.userRegisterData.id
    }
    this.apiService.post(this.apiService.uri.REGISTER_STAFF(), insertObj, (response) => {
      onSuccess(response);
    })
  }

  editSchedule(obj: any, scheduleId: any, onSuccess: (data: any) => void) {
    console.log(scheduleId, "scheduleId");
    this.apiService.post(this.apiService.uri.EDIT_SCHEDULE(scheduleId), obj, (response) => {
      onSuccess(response);
    })
  }

  assignTrainer(obj: any, scheduleId: any, onSuccess: (data: any) => void) {
    this.apiService.post(this.apiService.uri.ASSIGN_TRAINER(scheduleId), obj, (response) => {
      onSuccess(response);
    })
  }

  createMembershipPlan(obj: any, onSuccess: (data: any) => void) {
    const userId = this.userRegisterData.id;
    obj = {
      ...obj,
      userId
    }

    this.apiService.post(this.apiService.uri.CREATE_MEMBERSHIP_PLAN(), obj, (response) => {
      onSuccess(response);
    })
  }

  createVisitorPlan(obj: any, onSuccess: (data: any) => void) {
    const userId = this.userRegisterData.id;
    obj = {
      ...obj,
      userId
    }

    this.apiService.post(this.apiService.uri.CREATE_VISITOR_PLAN(), obj, (response) => {
      onSuccess(response);
    })
  }

  getMembershipPlan(onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }
    this.apiService.get(this.apiService.uri.GET_MEMBERSHIP_PLAN(adminId), (response) => {
      onSuccess(response);
    })
  }

  getVisitorPlan(onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }

    this.apiService.get(this.apiService.uri.GET_VISITOR_PLAN(adminId), (response) => {
      onSuccess(response);
    })
  }

  getAllPlans(onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }


    if (this.userRegisterData.userType === "Customer") {
      adminId = this.userRegisterData.createdByAdmin;
    }
    this.apiService.get(this.apiService.uri.GET_ALL_PLANS(adminId), (response) => {
      onSuccess(response);
    })
  }

  viewPlansById(membershipPlanId: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }

    this.apiService.get(this.apiService.uri.VIEW_PLANS_BY_ID(adminId, membershipPlanId), (response) => {
      onSuccess(response);
    })
  }

  updateMembershipPlan(membershipPlanId: any, obj: any, onSuccess: (data: any) => void) {
    this.apiService.post(this.apiService.uri.UPDATE_MEMBERSHIP_PLAN(membershipPlanId), obj, (response) => {
      onSuccess(response);
    })
  }

  requestSubscription(membershipPlanId: any, onSuccess: (data: any) => void) {
    let obj = {
      userId: this.userRegisterData.id,
      membershipPlansId: membershipPlanId,
      adminId: this.userRegisterData.createdByAdmin
    }

    this.apiService.post(this.apiService.uri.REQUEST_SUBSCRIPTION(), obj, (response) => {
      onSuccess(response);
    })
  }


  getActiveCustomers(searchTerm: any, pageData: any, onSuccess: (data: any) => void) {
    let userId;
    if (this.userRegisterData.userType === "Admin") {
      userId = this.userRegisterData.id;
    } else {
      userId = this.userRegisterData.createdByAdmin;
    }

    this.apiService.get(this.apiService.uri.GET_ACTIVE_CUSTOMERS(userId, searchTerm, pageData.page, pageData.limit), (response) => {
      onSuccess(response);
    })
  }

  getActiveCustomerById(customerId: any, onSuccess: (data: any) => void) {
    let userId;
    if (this.userRegisterData.userType === "Admin") {
      userId = this.userRegisterData.id;
    } else {
      userId = this.userRegisterData.createdByAdmin;
    }

    this.apiService.get(this.apiService.uri.GET_ACTIVE_CUSTOMER_BY_ID(userId, customerId), (response) => {
      onSuccess(response);
    })
  }

  getSubscriptionRequest(onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }
    this.apiService.get(this.apiService.uri.GET_SUBSCRIPTION_REQUEST(adminId), (response) => {
      onSuccess(response);
    })
  }

  buyMembershipPlan(obj: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }
    obj = {
      ...obj,
      adminId
    }
    this.apiService.post(this.apiService.uri.BUY_MEMBERSHIP_PLAN(), obj, (response) => {
      onSuccess(response);
    })
  }

  viewPurchasedPlan(onSuccess: (data: any) => void ,userIdforadmin?:string) { // used for candidate
    let userId = this.userRegisterData.id;
    if(this.userRegisterData.userType !== "Customer" && userIdforadmin) {
      userId = userIdforadmin;
  }

    this.apiService.get(this.apiService.uri.VIEW_PURCHASED_PLANS(userId), (response) => {
      onSuccess(response);
    })
  }

  viewSubsUsers(searchTerm: any, fromDate: any, toDate: any, userTypeFilter: any, onSuccess: (data: any) => void) {
    const adminId = this.userRegisterData.id;
    this.apiService.get(this.apiService.uri.VIEW_SUBS_PLANS(adminId, searchTerm, fromDate, toDate, userTypeFilter), (response) => {
      onSuccess(response);
    })
  }

  getAttendance(searchTerm: any, fromDate: any, toDate: any, obj: any, onSuccess: (data: any) => void) {
    const adminId = this.userRegisterData.id;
    obj = {
      ...obj,
      adminId
    }

    this.apiService.post(this.apiService.uri.GET_ATTENDANCE(searchTerm, fromDate, toDate), obj, (response) => {
      onSuccess(response);
    })
  }


  assignSalary(obj: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }
    obj = {
      ...obj,
      adminId
    }
    this.apiService.post(this.apiService.uri.ASSIGN_SALARY(), obj, (response) => {
      onSuccess(response);
    })
  }

  paySalary(obj: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }

    obj = {
      ...obj,
      adminId
    }
    this.apiService.post(this.apiService.uri.PAY_SALARY(), obj, (response) => {
      onSuccess(response);
    })
  }

  getSalaryHistory(searchTerm: any, fromDate: any, toDate: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }
    this.apiService.get(this.apiService.uri.GET_SALARY_HISTORY(adminId, searchTerm, fromDate, toDate), (response) => {
      onSuccess(response);
    })
  }

  getIndividualSalaryHistories(userId: any, onSuccess: (data: any) => void) {
    this.apiService.get(this.apiService.uri.GET_INDIVIDUAL_SALARY_HISTORY(userId), (response) => {
      onSuccess(response);
    })
  }
  getSubsPaymentHistory(searchTerm: any, fromDate: any, toDate: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }
    this.apiService.get(this.apiService.uri.GET_SUBSCRIPTON_PAYMENT_HISTORY(adminId, searchTerm, fromDate, toDate), (response) => {
      onSuccess(response);
    })
  }

  getSubsAmountReceived(searchTerm: any, fromDate: any, toDate: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }
    this.apiService.get(this.apiService.uri.GET_SUBSCRIPTON_INSTALLMENT_PAYMENTS(adminId, searchTerm, fromDate, toDate), (response) => {
      onSuccess(response);
    })
  }
  updateAmountDue(postObj: any, onSuccess: (data: any) => void) {

    this.apiService.post(this.apiService.uri.UPDATE_SUBSCRIPTON_AMOUNT_DUE(), postObj, (response) => {
      onSuccess(response);
    })
  }
  getDueAmount(userId: any, purchaseDate: any, membershipPlansId: any, onSuccess: (data: any) => void) {

    this.apiService.get(this.apiService.uri.MEMBERSHIP_DUEAMOUNT(userId, purchaseDate, membershipPlansId), (response) => {
      onSuccess(response);
    })
  }

  getActiveStaffs(searchTerm: any, fromDate: any, toDate: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }
    this.apiService.get(this.apiService.uri.GET_ACTIVE_STAFFS(adminId, searchTerm, fromDate, toDate), (response) => {
      onSuccess(response);
    })
  }

  manageLeave(obj: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }
    const finalObj = {
      ...obj,
      adminId
    }
    this.apiService.post(this.apiService.uri.MANAGE_LEAVE(), finalObj, (response) => {
      onSuccess(response);
    })
  }

  getDashboardUsersCount(onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;

    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }
    this.apiService.get(this.apiService.uri.DASHBOARD_USERS_COUNT(adminId), (response) => {
      onSuccess(response);
    })
  }

  getExpiringUsersPlans(searchTerm: any, fromDate: any, toDate: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }

    this.apiService.get(this.apiService.uri.GET_EXPIRING_USERS_PLANS(adminId, searchTerm, fromDate, toDate), (response) => {
      onSuccess(response);
    })
  }

  postUsersPlanToExpire(onSuccess: (data: any) => void) {
    const userId = this.userRegisterData.id;
    this.apiService.post(this.apiService.uri.POST_PLANS_EXPIRE(), { userId }, (response) => {
      onSuccess(response);
    })
  }

  calculateSalary(searchTerm: any, obj: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }

    const finalObj = {
      ...obj,
      adminId
    }
    this.apiService.post(this.apiService.uri.CALCULATE_SALARY(searchTerm), finalObj, (response) => {
      onSuccess(response);
    })
  }

  getUserByAdmin(userId: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }

    this.apiService.get(this.apiService.uri.GET_USER_BY_ADMIN(adminId, userId), (response) => {
      onSuccess(response);
    })
  }

  updateUserByAdmin(obj: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }
    const finalObj = {
      ...obj,
      adminId
    }

    this.apiService.post(this.apiService.uri.UPDATE_USER_BY_ADMIN(), finalObj, (response) => {
      onSuccess(response);
    })
  }

  deleteUserByAdmin(userId: any, onSuccess: (data: any) => void) {
    const obj = {
      userId: userId
    }
    this.apiService.post(this.apiService.uri.DELETE_USER_BY_ADMIN(), obj, (response) => {
      onSuccess(response);
    })
  }

  fetchDevice(onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }
    this.apiService.get(this.apiService.uri.FETCH_DEVICES(adminId), (response) => {
      onSuccess(response);
    })
  }

  postTrackUsers(obj: any, onSuccess: (data: any) => void , userIdforadmin?: string) {
   
    this.apiService.post(this.apiService.uri.POST_TRACK(), obj, (response) => {
      onSuccess(response);
    })
  }

  fetchTrackUsers(userId: any, onSuccess: (data: any) => void , userIdforadmin?: string) {
    if(this.userRegisterData.userType !== "Customer" && userIdforadmin) {
      userId = userIdforadmin;
  }
    this.apiService.get(this.apiService.uri.FETCH_TRACK_USERS(userId), (response) => {
      onSuccess(response);
    })
  }

  getUsersAttendances(onSuccess: (data: any) => void , userIdforadmin?: string) {
    console.log(userIdforadmin , "here user id for admin we got ")
    let userId = this.userRegisterData.id;
    const adminId = this.userRegisterData?.createdByAdmin
    if(this.userRegisterData.userType !== "Customer" && userIdforadmin) {
        userId = userIdforadmin;
    }
    this.apiService.get(this.apiService.uri.GET_USER_ATTENDANCES(adminId, userId), (response) => {
      onSuccess(response);
    })
  }

  getIndividualAttendance(adminId: any, userId: any, fromDate: any, toDate: any, onSuccess: (data: any) => void) {
    // const adminId = this.userRegisterData.createdByAdmin;
    this.apiService.get(this.apiService.uri.GET_INDIVIDUAL_ATTENDANCE(adminId, userId, fromDate, toDate), (response) => {
      onSuccess(response);
    })
  }

  getUsersTodaysAttendances(onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }

    this.apiService.get(this.apiService.uri.GET_USER_TODAYS_ATTENDANCES(adminId), (response) => {
      onSuccess(response);
    })
  }

  getTodaysCollection(onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }

    this.apiService.get(this.apiService.uri.GET_TODAYS_COLLECTION(adminId), (response) => {
      onSuccess(response);
    })
  }

  createDietChart(obj: any, onSuccess: (data: any) => void) {

    if (this.userRegisterData.userType === "Admin") {
      obj.adminId = this.userRegisterData.id;
    } else {
      obj.adminId = this.userRegisterData.createdByAdmin;
      obj.trainerId = this.userRegisterData.id;
    }

    this.apiService.post(this.apiService.uri.CREATE_DIET(), obj, (response) => {
      onSuccess(response);
    })
  }

  viewDiet(onSuccess: (data: any) => void) {
    let trainerId = this.userRegisterData.id;
    this.apiService.get(this.apiService.uri.VIEW_DIET(trainerId), (response) => {
      onSuccess(response);
    })
  }

  registerAdminBySuperAdmin(obj: any, onSuccess: (data: any) => void) {
    this.apiService.post(this.apiService.uri.REGISTER_ADMIN_BY_SUPER_ADMIN(), obj, (response) => {
      onSuccess(response);
    })
  }

  viewAdmins(searchTerm: any, fromDate: any, toDate: any, onSuccess: (data: any) => void) {
    this.apiService.get(this.apiService.uri.VIEW_ADMINS(searchTerm, fromDate, toDate), (response) => {
      onSuccess(response);
    })
  }

  getUserProfile(userId: any, onSuccess: (data: any) => void) {
    this.apiService.get(this.apiService.uri.GET_USER_PROFILE(userId), (response) => {
      onSuccess(response);
    })
  }

  getDietPlan(onSuccess: (data: any) => void , userIdforadmin?:string) {
   
    let userId = this.userRegisterData.id;
    if(this.userRegisterData.userType !== "Customer" && userIdforadmin)
      {
      userId = userIdforadmin;

    }
    this.apiService.get(this.apiService.uri.GET_DIET_PLAN(userId), (response) => {
      onSuccess(response);
    })
  }

  createdietplan(obj: any, onSuccess: (data: any) => void, p0: (error: any) => void) {
    console.log(obj, "here is the reponse we got ")
    this.apiService.post(this.apiService.uri.CREATE_DIET_PLAN(), obj, (response) => {
      onSuccess(response);
    })
  }
  uploadPlan(formData: FormData, onSuccess: (data: any) => void) {
    const url = this.apiService.uri.UPLOADDIETPLAN('dietplan', 1);
    this.apiService.post(url, formData, (response) => {
      onSuccess(response);
    });
  }

  getplanspdf(onSuccess: (data: any) => void) {
    const user = this.userRegisterData;
    let id: number;
  
    if (user.userType === 'Admin') {
      id = user.id;
    } else if (user.userType === 'Trainer') {
      id = user.createdByAdmin;
    } else {
      console.error('Unknown userType');
      return;
    }
  
    this.apiService.get(this.apiService.uri.GET_PDF_FILES(id), (response) => {
      onSuccess(response);
    });
  }
  


  sendReqForApproval(obj: any, onSuccess: (data: any) => void) {
    let adminId;
    if (this.userRegisterData.userType === "Admin") {
      adminId = this.userRegisterData.id;
    } else {
      adminId = this.userRegisterData.createdByAdmin;
    }

    obj = {
      ...obj,
      adminId: adminId
    }
    this.apiService.post(this.apiService.uri.SEND_REQUEST_FOR_APPROVAL(), obj, (response) => {
      onSuccess(response);
    })
  }

  getSubReqListByReceptionist(onSuccess: (data: any) => void) {
    let adminId = this.userRegisterData.id;
    this.apiService.get(this.apiService.uri.GET_SUBS_APPROVAL_LIST(adminId), (response) => {
      onSuccess(response);
    })
  }

  approveRequestedSubsByReceptionist(requestedId: any, onSuccess: (data: any) => void) {
    let adminId = this.userRegisterData.id;
    const obj = {
      requestId: requestedId,
      requestAdminId: adminId
    }
    this.apiService.post(this.apiService.uri.APPROVE_REQUESTED_SUB_BY_RECEPTIONIST(), obj, (response) => {
      onSuccess(response);
    })
  }


  assignPlanToUsers(payload: any, onSuccess: (data: any) => void) {
    this.apiService.post(this.apiService.uri.ASSIGN_PLAN_TO_USERS(), payload, (response) => {
      onSuccess(response);
    });
  }

  // getPlanForUsers(getdata: any, onSuccess: (data: any) => void): void {
  //   this.apiService.get(this.apiService.uri.GET_PLAN_FOR_USERS(), getdata, (response) => {
  //     onSuccess(response);
  //   });
  // }

  getPlanForUsers(onSuccess: (data: any) => void ,userId?: string) {
    let useremailID = this.userRegisterData.id;
    if(this.userRegisterData.userType !== "Customer" && userId)
      {
      useremailID = userId;

    }
    this.apiService.get(this.apiService.uri.GET_PLAN_FOR_USERS(useremailID), (response) => {
      onSuccess(response);
    })
  }

  getAssignedUsers(onSuccess: (data: any) => void ,userId?: string) {
    let adminId = this.userRegisterData.id;
  
    this.apiService.get(this.apiService.uri.GET_ASSIGNED_USERS(adminId), (response) => {
      onSuccess(response);
    })
  }
  
  
  
}
