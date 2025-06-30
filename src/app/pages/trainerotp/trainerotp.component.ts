import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ROUTES } from 'src/app/app-routes.config';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';

@Component({
  selector: 'app-trainerotp',
  templateUrl: './trainerotp.component.html',
  styleUrls: ['./trainerotp.component.scss']
})
export class TrainerotpComponent {
  submissionStatus: boolean | null = null; // true for success, false for failure
  submissionMessage: string = '';
  sidenavOpen: boolean = true;
  showNewForm = false;  // Controls which form is shown
  
  otp: string = '';  // Store OTP input value
  userData: any;
  userDataotp: any;
  mailid: any;

  constructor(private http: HttpClient, private router: Router ,private userService: UserService, private dialog: DialogService ,private dialogService: DialogService,) {

    if (this.userService.verificationType == "emailVerification") {
      this.userData = this.userService.userRegisterData;
      this.mailid = this.userData.email;
    } else {
      this.userDataotp = this.userService.forgetpasswordemail;
      this.mailid = this.userDataotp.email;
    }
  }

  ngOnInit(): void {
    // Redirect to scheduling page on reload
    window.onload = () => {
      this.router.navigate([ROUTES.ADDSCHEDULING]);
    };
  }

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }

  onSubmit(): void {
    if (!this.otp) {
      alert('Please enter OTP.');
      return;
    }


    // Simulated API Call (Replace with real API endpoint)
    this.http.post('API_ENDPOINT/verify-otp', { otp: this.otp }).subscribe(
      (response: any) => {
        if (response.success) {
          alert('OTP verified successfully!');
          this.router.navigate(['/dashboard']); // Redirect on success
        } else {
          alert('Invalid OTP. Please try again.');
        }
      },
      (error) => {
        console.error("Error verifying OTP:", error);
        alert('Error verifying OTP. Please try again.');
      }
    );
  }
  verifyOTP(verificationType: any) {
    const createdByAdmin = 14
    const otp = this.otp
    
    const userType = "Trainer";
    const baseData = { otp, createdByAdmin, userType };
  
    let finalData;
  
    if (verificationType === 'emailVerification') {

      finalData = {
        ...baseData,
        name: this.userData.name,
        email: this.userData.email,
        phoneNumber: this.userData.phoneNumber,
        password: this.userData.password,
        cPassword: this.userData.cPassword,
      };
  
    } else if (verificationType === 'forgotPasswordVerification') {
      finalData = {
        ...baseData,
        email: this.userDataotp.email,
      };
    }
  
    this.userService.userRegisterData = finalData;
  
    if (finalData) {
      this.userService.signupVerify(verificationType, finalData, (response) => {
        if (response.success) {
          const route = verificationType === 'emailVerification' ? '' : ROUTES.FORGOT_PASSWORD;
          if (verificationType === 'emailVerification') {
            this.dialogService.open('Oops!', `Trainer Register successfully `, '', false, 'Okay', (() => {
              this.router.navigate([ROUTES.ADDSCHEDULING]);
            }));
            // this.router.navigate([ROUTES.ADDSCHEDULING]);
            localStorage.setItem('token', response.token);
          } else {
            this.router.navigate([ROUTES.FORGOT_PASSWORD]);
          }
          this.userService.showForgotPassEmail = false;
        }
      });
    }
  }
}
