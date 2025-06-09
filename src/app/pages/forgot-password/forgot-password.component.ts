import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';
import { ROUTES } from 'src/app/app-routes.config';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  condition = true
  mailid = "lcschauff@gmail.com"
  email: any;
  newPassword: any;
  newCpassword: any;

  constructor(private router: Router, private userService: UserService, private dialogService: DialogService) { }
  userData: any;
  ngOnInit(): void {
    this.condition = this.userService.showForgotPassEmail
  }

  verifyForgotPassEmail() {
    const obj = {
      email: this.email,
      userType: localStorage.getItem('userType')
    };
    
    this.userService.forgotPassword(this.email, (data) => {
      if (data) {
        this.userService.verificationType = 'forgotPasswordVerification';
        this.userService.forgetpasswordemail = obj
        this.router.navigate([ROUTES.OTP]);
        this.condition = false
      }
    })
  }

  resetPassword() {
    this.userData = this.userService.userRegisterData;
    const obj = {
      email: this.userData.email,
      newPassword: this.newPassword,
      newCpassword: this.newCpassword
    }
    this.userService.resetPassword(obj, (response) => {
      if (response.success) {
        localStorage.setItem('token', response.token)
        this.dialogService.open('Update!', 'Your Password has been udpated successfully', '', false, 'Okay', (() => {
          this.router.navigate(['']);
        }));
      } else {
        this.dialogService.open('Oops!', 'Please try after some times..', '', false, 'Okay', (() => {
          this.router.navigate([ROUTES.WELCOME]);
        }));
      }
    })
  }

  goToLogin() {
    this.router.navigate([ROUTES.LOGIN]);
  }
}
