import { importProvidersFrom, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatExpansionModule } from '@angular/material/expansion';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TermsComponent } from './pages/terms/terms.component';
import { SignupComponent } from './pages/signup/signup.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { OtpComponent } from './pages/otp/otp.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogComponent } from './utils/dialog/dialog.component';
import { PreLoaderComponent } from './utils/pre-loader/pre-loader.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';  // Import MatSelectModule
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { EditProfileDialogComponent } from './utils/edit-profile-dialog/edit-profile-dialog.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DateFormatPipe } from './utils/date-format-pipe/date-format.pipe';
import { OurplansComponent } from './pages/ourplans/ourplans.component';
import { PricingPlanComponent } from './pages/pricing-plan/pricing-plan.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { ActiveUsersComponent } from './pages/active-users/active-users.component';
import { MatIconModule } from '@angular/material/icon';
import { ClassesComponent } from './pages/classes/classes.component';
import { GetinfoComponent } from './pages/getinfo/getinfo.component';
import { YoursessionsComponent } from './pages/yoursessions/yoursessions.component';
import { JoinScheduleComponent } from './pages/join-schedule/join-schedule.component';
import { SuperadminComponent } from './pages/superadmin/superadmin.component';
import { SuperAdminPanelComponent } from './pages/super-admin-panel/super-admin-panel.component';
import { AddDevicesComponent } from './pages/add-devices/add-devices.component';
import { RegistergymComponent } from './pages/registergym/registergym.component';
import { TrainerotpComponent } from './pages/trainerotp/trainerotp.component';
import { RegisterClassComponent } from './pages/register-class/register-class.component';
import { LoadingComponent } from './utils/loading/loading.component';
import { LoadingService } from './services/loading-services/loading.service';
import { AdduserComponent } from './page/adduser/adduser.component';
import { TrackUserComponent } from './page/track-user/track-user.component';
import { AdminHomeComponent } from './page/admin-home/admin-home.component';
import { FeedbackComponent } from './page/feedback/feedback.component';
import { EventNotificationComponent } from './page/event-notification/event-notification.component';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { SubscriptionPlansComponent } from './pages/subscription-plans/subscription-plans.component';
import { AllScheduledComponent } from './pages/all-scheduled/all-scheduled.component';
import { RegisteredDeviceComponent } from './pages/registered-device/registered-device.component';
import { TrainerComponent } from './dashboard/trainer/trainer.component';
import { TrainerAttendanceComponent } from './pages/trainer-attendance/trainer-attendance.component';
import { UsersAttendanceComponent } from './pages/users-attendance/users-attendance.component';
import { MessageComponent } from './dashboard/message/message.component';
import { MainProfileComponent } from './dashboard/main-profile/main-profile.component';
import { StatusDialogComponent } from './components/status-dialog/status-dialog.component';
import { AllPlansComponent } from './dashboard/all-plans/all-plans.component';
import { AddSubscriptionPlansComponent } from './dashboard/add-subscription-plans/add-subscription-plans.component';
import { ViewSubscriptionDialogComponent } from './dashboard/dialogs/view-subscription-dialog/view-subscription-dialog.component';
import { TrainerSelectionDialogComponent } from './components/trainer-selection-dialog/trainer-selection-dialog.component';
import { EditSubscriptionDialogComponent } from './dashboard/dialogs/edit-subscription-dialog/edit-subscription-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BuySubscriptionComponent } from './dashboard/buy-subscription/buy-subscription.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AddOnPlansComponent } from './dashboard/add-on-plans/add-on-plans.component';
import { EditScheduleComponent } from './dashboard/edit-schedule/edit-schedule.component';
import { AssignClassModalComponent } from './components/assign-class-modal/assign-class-modal.component';
import { ClassSchedulebyDaysComponent } from './components/class-scheduleby-days/class-scheduleby-days.component';
import { UserClassesModalComponent } from './user-classes-modal/user-classes-modal.component';
import { TrainerClassesModalComponent } from './trainer-classes-modal/trainer-classes-modal.component';
import { RequestedUserComponent } from './requested-user/requested-user.component';
import { LeaveManagementComponent } from './dashboard/leave-management/leave-management.component';
import { PaymentHistoryComponent } from './dashboard/payment-history/payment-history.component';
import { SalaryManagementComponent } from './dashboard/salary-management/salary-management.component';
import { AssignSalaryDialogComponent } from './components/assign-salary-dialog/assign-salary-dialog.component';
import { AddStaffComponent } from './components/add-staff/add-staff.component';
import { MessageDialogueComponent } from './components/message-dialogue/message-dialogue.component';
import { EditUserDetailsDialogComponent } from './dashboard/dialogs/edit-user-details-dialog/edit-user-details-dialog.component';
import { TrackUserDialogComponent } from './dashboard/dialogs/track-user-dialog/track-user-dialog.component';
import { InvoiceDialogComponent } from './dashboard/dialogs/invoice-dialog/invoice-dialog.component';
import { PostUserProgressDialogComponent } from './dashboard/dialogs/post-user-progress-dialog/post-user-progress-dialog.component';
import { DietPlanComponent } from './dashboard/diet-plan/diet-plan.component';
import { RegisterAdminComponent } from './dashboard/register-admin/register-admin.component';
import { ReceptionLoginComponent } from './dashboard/reception-login/reception-login.component';
import { ReceptionHomeComponent } from './dashboard/reception-home/reception-home.component';
import { AddUserByReceptionistComponent } from './dashboard/add-user-by-receptionist/add-user-by-receptionist.component';
import { ViewUserProfileDialogComponent } from './dashboard/dialogs/view-user-profile-dialog/view-user-profile-dialog.component';
import { ReceivedAmountsComponent } from './pages/received-amounts/received-amounts.component';
import { PayDueAmountDialogComponent } from './utils/pay-due-amount-dialog/pay-due-amount-dialog.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AttendanceDialogComponent } from './utils/attendance-dialog/attendance-dialog.component';
import { SalaryDataDialogComponent } from './utils/salary-data-dialog/salary-data-dialog.component';
import { CreatePlanComponent } from './dashboard/create-plan/create-plan.component';
import { AssignedUsersComponent } from './pages/assigned-users/assigned-users.component';
import { ViewUserProfileComponent } from './dashboard/view-user-profile/view-user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    TermsComponent,
    SignupComponent,
    WelcomeComponent,
    OtpComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    DialogComponent,
    PreLoaderComponent,
    EditProfileDialogComponent,
    DateFormatPipe,
    OurplansComponent,
    PricingPlanComponent,
    SidebarComponent,
    ActiveUsersComponent,
    ClassesComponent,
    GetinfoComponent,
    YoursessionsComponent,
    JoinScheduleComponent,
    SuperadminComponent,
    SuperAdminPanelComponent,
    AddDevicesComponent,
    RegistergymComponent,
    TrainerotpComponent,
    RegisterClassComponent,
    LoadingComponent,
    AdduserComponent,
    TrackUserComponent,
    AdminHomeComponent,
    FeedbackComponent,
    EventNotificationComponent,
    CompleteProfileComponent,
    SubscriptionPlansComponent,
    AllScheduledComponent,
    RegisteredDeviceComponent,
    TrainerComponent,
    TrainerAttendanceComponent,
    UsersAttendanceComponent,
    MessageComponent,
    MainProfileComponent,
    StatusDialogComponent,
    AllPlansComponent,
    AddSubscriptionPlansComponent,
    ViewSubscriptionDialogComponent,
    TrainerSelectionDialogComponent,
    EditSubscriptionDialogComponent,
    BuySubscriptionComponent,
    AddOnPlansComponent,
    EditScheduleComponent,
    AssignClassModalComponent,
    ClassSchedulebyDaysComponent,
    UserClassesModalComponent,
    TrainerClassesModalComponent,
    RequestedUserComponent,
    LeaveManagementComponent,
    PaymentHistoryComponent,
    SalaryManagementComponent,
    AssignSalaryDialogComponent,
    AddStaffComponent,
    MessageDialogueComponent,
    EditUserDetailsDialogComponent,
    TrackUserDialogComponent,
    InvoiceDialogComponent,
    PostUserProgressDialogComponent,
    DietPlanComponent,
    RegisterAdminComponent,
    ReceptionLoginComponent,
    ReceptionHomeComponent,
    AddUserByReceptionistComponent,
    ViewUserProfileDialogComponent,
    ReceivedAmountsComponent,
    PayDueAmountDialogComponent,
    AttendanceDialogComponent,
    SalaryDataDialogComponent,
    CreatePlanComponent,
    AssignedUsersComponent,
    ViewUserProfileComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    CarouselModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,  // Add MatSelectModule here
    MatOptionModule,
    NgxMatMomentModule,
    HttpClientModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    MatIconModule,
    MatSnackBarModule,
    MatCheckboxModule,
     CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
    // BrowserAnimationsModule
  ],
  providers: [
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(MatNativeDateModule)

  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
