import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TermsComponent } from './pages/terms/terms.component';
import { SignupComponent } from './pages/signup/signup.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { OtpComponent } from './pages/otp/otp.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PricingPlanComponent } from './pages/pricing-plan/pricing-plan.component';
import { ActiveUsersComponent } from './pages/active-users/active-users.component';
import { ClassesComponent } from './pages/classes/classes.component';
import { GetinfoComponent } from './pages/getinfo/getinfo.component';
import { YoursessionsComponent } from './pages/yoursessions/yoursessions.component';
import { JoinScheduleComponent } from './pages/join-schedule/join-schedule.component';
import { SuperadminComponent } from './pages/superadmin/superadmin.component';
import { SuperAdminPanelComponent } from './pages/super-admin-panel/super-admin-panel.component';
import { AddDevicesComponent } from './pages/add-devices/add-devices.component';
import { RegistergymComponent } from './pages/registergym/registergym.component';
import { ROUTES } from './app-routes.config';
import { AuthGuard } from './guards/auth.guard';
import { TrainerotpComponent } from './pages/trainerotp/trainerotp.component';
import { RegisterClassComponent } from './pages/register-class/register-class.component';
import { AdduserComponent } from './page/adduser/adduser.component';
import { TrackUserComponent } from './page/track-user/track-user.component'
import { AdminHomeComponent } from './page/admin-home/admin-home.component';
import { FeedbackComponent } from './page/feedback/feedback.component';
import { EventNotificationComponent } from './page/event-notification/event-notification.component';
import { AllScheduledComponent } from './pages/all-scheduled/all-scheduled.component';
import { RegisteredDeviceComponent } from './pages/registered-device/registered-device.component';
import { TrainerComponent } from './dashboard/trainer/trainer.component';
import { UsersAttendanceComponent } from './pages/users-attendance/users-attendance.component';
import { TrainerAttendanceComponent } from './pages/trainer-attendance/trainer-attendance.component';
import { MessageComponent } from './dashboard/message/message.component';
import { MainProfileComponent } from './dashboard/main-profile/main-profile.component';
import { AllPlansComponent } from './dashboard/all-plans/all-plans.component';
import { AddSubscriptionPlansComponent } from './dashboard/add-subscription-plans/add-subscription-plans.component';
import { BuySubscriptionComponent } from './dashboard/buy-subscription/buy-subscription.component';
import { AddOnPlansComponent } from './dashboard/add-on-plans/add-on-plans.component';
import { ClassSchedulebyDaysComponent } from './components/class-scheduleby-days/class-scheduleby-days.component';
import { RequestedUserComponent } from './requested-user/requested-user.component';
import { LeaveManagementComponent } from './dashboard/leave-management/leave-management.component';
import { PaymentHistoryComponent } from './dashboard/payment-history/payment-history.component';
import { SalaryManagementComponent } from './dashboard/salary-management/salary-management.component';
import { AddStaffComponent } from './components/add-staff/add-staff.component';
import { DietPlanComponent } from './dashboard/diet-plan/diet-plan.component';
import { RegisterAdminComponent } from './dashboard/register-admin/register-admin.component';
import { ReceptionLoginComponent } from './dashboard/reception-login/reception-login.component';
import { ReceptionHomeComponent } from './dashboard/reception-home/reception-home.component';
import { AddUserByReceptionistComponent } from './dashboard/add-user-by-receptionist/add-user-by-receptionist.component';
import { ReceivedAmountsComponent } from './pages/received-amounts/received-amounts.component';

const routes: Routes = [
  { path: ROUTES.WELCOME, component: SignupComponent, canActivate: [AuthGuard] },
  { path: ROUTES.HOME, component: HomeComponent, canActivate: [AuthGuard] },
  { path: ROUTES.LOGIN, component: WelcomeComponent, canActivate: [AuthGuard] },
  { path: ROUTES.OTP, component: OtpComponent },
  { path: ROUTES.ADDSCHEDULING, component: ClassesComponent, canActivate: [AuthGuard] },
  { path: ROUTES.GETINFO, component: GetinfoComponent, canActivate: [AuthGuard] },
  { path: ROUTES.PRICE_PLAN, component: PricingPlanComponent, canActivate: [AuthGuard] },
  { path: ROUTES.YOURSESSION, component: YoursessionsComponent, canActivate: [AuthGuard] },
  { path: ROUTES.SUPERADMIN, component: SuperadminComponent },
  { path: ROUTES.JOINSCHEDULE, component: JoinScheduleComponent, canActivate: [AuthGuard] },
  { path: ROUTES.SUPERADMINPANEL, component: SuperAdminPanelComponent, canActivate: [AuthGuard] },
  { path: ROUTES.ACTIVE_USER, component: ActiveUsersComponent, canActivate: [AuthGuard] },
  { path: ROUTES.GYMREGISTERTION, component: RegistergymComponent, canActivate: [AuthGuard] },
  { path: ROUTES.ADDDEVICE, component: AddDevicesComponent, canActivate: [AuthGuard] },
  { path: ROUTES.FORGOT_PASSWORD, component: ForgotPasswordComponent, canActivate: [AuthGuard] },
  { path: ROUTES.TRAINEROTP, component: TrainerotpComponent, canActivate: [AuthGuard] },
  { path: ROUTES.REGISTERCLASS, component: RegisterClassComponent, canActivate: [AuthGuard] },
  { path: ROUTES.USERREGISTERBYADMIN, component: AdduserComponent, canActivate: [AuthGuard] },
  { path: ROUTES.TRACKINGACTIVEUSERS, component: TrackUserComponent, canActivate: [AuthGuard] },
  { path: ROUTES.AllSCHEDULED, component: AllScheduledComponent, canActivate: [AuthGuard] },
  { path: ROUTES.TRAINER, component: TrainerComponent, canActivate: [AuthGuard] },
  { path: ROUTES.TRAINERATTENDANCE, component: TrainerAttendanceComponent, canActivate: [AuthGuard] },
  { path: ROUTES.USERSATTENDANCE, component: UsersAttendanceComponent, canActivate: [AuthGuard] },
  { path: ROUTES.REGISTEREDDEVICE, component: RegisteredDeviceComponent, canActivate: [AuthGuard] },
  { path: ROUTES.ADMINHOME, component: AdminHomeComponent, canActivate: [AuthGuard] },
  { path: ROUTES.PROFILE, component: ProfileComponent, canActivate: [AuthGuard] },
  { path: ROUTES.FEEDBACK, component: FeedbackComponent, canActivate: [AuthGuard] },
  { path: ROUTES.EVENTNOTIFICATION, component: EventNotificationComponent, canActivate: [AuthGuard] },
  { path: ROUTES.MESSAGE, component: MessageComponent, canActivate: [AuthGuard] },
  { path: ROUTES.MAIN_PROFILE, component: MainProfileComponent, canActivate: [AuthGuard] },
  { path: ROUTES.ALLPLANS, component: AllPlansComponent, canActivate: [AuthGuard] },
  { path: ROUTES.ADDSUBSCRIPTIONPLANS, component: AddSubscriptionPlansComponent, canActivate: [AuthGuard] },
  { path: ROUTES.BUYSUBSCRIPTIONPLANS, component: BuySubscriptionComponent, canActivate: [AuthGuard] },
  { path: ROUTES.ADDONSPLANS, component: AddOnPlansComponent, canActivate: [AuthGuard] },
  { path: ROUTES.SCHEDULEBYDAYS, component: ClassSchedulebyDaysComponent, canActivate: [AuthGuard] },
  { path: ROUTES.SUBSCRIPTIONREQUEST, component: RequestedUserComponent, canActivate: [AuthGuard] },
  { path: ROUTES.ADDSTAFF, component: AddStaffComponent, canActivate: [AuthGuard] },
  { path: ROUTES.LEAVEMANAGEMENT, component: LeaveManagementComponent, canActivate: [AuthGuard] },
  { path: ROUTES.PAYMENTHISTORY, component: PaymentHistoryComponent, canActivate: [AuthGuard] },
  { path: ROUTES.SALARYMANAGEMENT, component: SalaryManagementComponent, canActivate: [AuthGuard] },
  { path: ROUTES.DIETPLAN, component: DietPlanComponent, canActivate: [AuthGuard] },
  { path: ROUTES.REGISTERADMIN, component: RegisterAdminComponent, canActivate: [AuthGuard] },
  { path: ROUTES.RECEPTIONLOGIN, component: ReceptionLoginComponent },
  { path: ROUTES.RECEPTIONHOME, component: ReceptionHomeComponent, canActivate: [AuthGuard] },
  { path: ROUTES.ADDUSERBYRECEPTIONIST, component: AddUserByReceptionistComponent, canActivate: [AuthGuard] },
  { path: ROUTES.RECEIVEDAMOUNTHISTORY, component: ReceivedAmountsComponent, canActivate: [AuthGuard] },


  { path: "**", component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
