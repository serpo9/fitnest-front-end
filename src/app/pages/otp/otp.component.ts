import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { ROUTES } from 'src/app/app-routes.config';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {
  condition: boolean = true
  mailid: any;
  remainingTime: number = 60;
  showTime: boolean = false;
  flag: boolean = false;

  otpone: string = '';
  otptwo: string = '';
  otpthree: string = '';
  otpfour: string = '';
  otpfive: string = '';
  otpsix: string = '';
  userData: any;
  userDataotp: any
  showEmailVerifyBtn = true;
  showForgotPassVerifyBtn = false;
  otp: any;

  constructor(private router: Router, private userService: UserService, private dialog: DialogService , private cdRef: ChangeDetectorRef,private dialogService: DialogService,) {

    if (this.userService.verificationType == "emailVerification") {
      this.userData = this.userService.userRegisterData;
      this.mailid = this.userData.email;
      // this.userData = this.userService.forgetpasswordemail;
    } else {
      this.userDataotp = this.userService.forgetpasswordemail;
      this.mailid = this.userDataotp.email;
    }
  }

  ngOnInit(): void {
    // If reloaded then route to LOGIN PAGE
    window.onload = () => {
      this.router.navigate([ROUTES.LOGIN]);
    };
    this.startTimer()

    if (this.userService.verificationType == 'forgotPasswordVerification') {
      this.showForgotPassVerifyBtn = true;
      this.showEmailVerifyBtn = false;
    } else {
      this.showForgotPassVerifyBtn = false;
      this.showEmailVerifyBtn = true;
    }
  }

  startTimer() {
    const countdownInterval = setInterval(() => {
      this.remainingTime -= 1;
      this.showTime = true;
      if (this.remainingTime === 0) {
        this.flag = true;
        this.showTime = false;
        clearInterval(countdownInterval);
      }
    }, 2000); // Update the countdown every second
  }

  onPasteEvent(index: number, event: ClipboardEvent): void {
    const pastedData = event.clipboardData?.getData('text') || '';
    if (!pastedData) {
      return;
    }

    const pastedDigits = pastedData.split('').filter(char => !isNaN(Number(char)));
    if (pastedDigits.length === 0) {
      return;
    }

    let currentIndex = index;
    pastedDigits.forEach((digit) => {
      const inputElement = this.getCodeBoxElement(currentIndex);
      if (inputElement) {
        inputElement.value = digit;

        // Manually update the model using NgModel if you have access to it
        if (currentIndex === 1) {
          this.otpone = digit;
        } else if (currentIndex === 2) {
          this.otptwo = digit;
        } else if (currentIndex === 3) {
          this.otpthree = digit;
        } else if (currentIndex === 4) {
          this.otpfour = digit;
        } else if (currentIndex === 5) {
          this.otpfive = digit;
        } else if (currentIndex === 6) {
          this.otpsix = digit;
        }

        if (currentIndex !== 6) {
          currentIndex++;
          const nextInputElement = this.getCodeBoxElement(currentIndex);
          if (nextInputElement) {
            nextInputElement.focus();
          }
        }
      }
    });

    // Trigger change detection to ensure the model is updated
    this.cdRef.detectChanges();

    // event.preventDefault();
  }
  
  
  
  onKeyUpEvent(index: number, event: KeyboardEvent): void {
    const eventCode = event.which || event.keyCode;
    const inputElement = this.getCodeBoxElement(index);
  
    // Move focus to the next input when a number is entered
    if (inputElement && inputElement.value.length === 1 && index !== 6) {
      const nextInputElement = this.getCodeBoxElement(index + 1);
      if (nextInputElement) {
        nextInputElement.focus();
      }
    }
  
    // Handle backspace to move focus to the previous input
    if (eventCode === 8 && index > 1 && inputElement && inputElement.value.length === 0) {
      const prevInputElement = this.getCodeBoxElement(index - 1);
      if (prevInputElement) {
        prevInputElement.focus();
      }
    }
  }
  
  onInputEvent(index: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
  
    // Only allow one digit in each input
    if (value.length > 1) {
      inputElement.value = value.slice(0, 1);
    }
  
    // Automatically move to the next input if a digit is entered
    if (value.length === 1 && index !== 6) {
      const nextInputElement = this.getCodeBoxElement(index + 1);
      if (nextInputElement) {
        nextInputElement.focus();
      }
    }
  }
  
  onFocusEvent(index: number): void {
    for (let item = 1; item < index; item++) {
      const currentElement = this.getCodeBoxElement(item);
      if (currentElement && !currentElement.value) {
        currentElement.focus();
        break;
      }
    }
  }
  
  getCodeBoxElement(index: number): HTMLInputElement | null {
    return document.getElementById(`codeBox${index}`) as HTMLInputElement;
  }
  
  verifyOTP(verificationType: any) {
    const otp = [
      this.otpone,
      this.otptwo,
      this.otpthree,
      this.otpfour,
      this.otpfive,
      this.otpsix
    ].join('').substring(0, 6);;
    
  
    const userType =  localStorage.getItem('userType');;
    const baseData = { otp, userType };
  
    let finalData;
   
  
    if (verificationType === 'emailVerification') {

      finalData = {
        ...baseData,
        name: this.userData.name,
        email: this.userData.email,
        phoneNumber: this.userData.phoneNumber,
        specialization: this.userData.specialization,
        ...(userType === "Admin" && { gymName: this.userData.gymName || "Null" }),
        ...(userType === "Trainer" && { createdByAdmin: this.userData.createdByAdmin || "Null" }),
        ...(userType === "Customer" && { createdByAdmin: this.userData.createdByAdmin || "Null" }),
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
            const userType = localStorage.getItem('userType');
            if(userType === 'Admin')
            this.dialogService.open('Yeah!', `Request have been  successfully sent. Wait for the verification by the Superadmin`, '', false, 'Okay', (() => {
              localStorage.removeItem('userType'); // Remove userType
              localStorage.removeItem('token'); // Remove token (replace with actual token key)
              
              this.router.navigate([ROUTES.WELCOME]);
            }));
           else if(userType === 'Trainer')
              this.dialogService.open('Yeah!', `Request have been  successfully sent. Wait for the verification by the Admin`, '', false, 'Okay', (() => {
                localStorage.removeItem('userType'); // Remove userType
                localStorage.removeItem('token');
                this.router.navigate([ROUTES.WELCOME]);
              }));
              else if(userType === 'Customer'){
                localStorage.setItem('token', response.token);
                this.router.navigate([ROUTES.HOME]);
              }                
            else{
              this.router.navigate([ROUTES.HOME]);
              localStorage.setItem('token', response.token);
            }
            // this.router.navigate([ROUTES.ADDSCHEDULING]);
          } else {
            this.router.navigate([ROUTES.FORGOT_PASSWORD]);
          }
          this.userService.showForgotPassEmail = false;
        }
        else{
          this.dialogService.open('oops!', response.message, '', false, 'Okay', (() => {
           
          }));

        }
      });
    }
    
  }
  

  // resendOTP() {
  //   this.remainingTime = 60; // Reset the timer after resending
  //   this.startTimer();
  //   let obj;
  //   if (this.userService.verificationType == "emailVerification") {
  //     obj = {
  //       email: this.userData.email
  //     }
  //   } else {
  //     obj = {
  //       email: this.userDataotp.email
  //     }
  //   }
  //   this.userService.resend(obj, (res) => {
  //     if (res.success) {
  //     }
  //   })
  // }

}
