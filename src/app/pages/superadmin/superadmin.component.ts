import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { ROUTES } from 'src/app/app-routes.config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-superadmin',
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.scss']
})
export class SuperadminComponent {

  condition: boolean = false;
  activeButton: string = 'signup';
  form: FormGroup;
  loginForm: FormGroup;
  name: any;
  email: any;
  phone: any;
  submitted: boolean = false;
  loginEmail: any;
  loginPass: any;

  constructor(private router: Router,
    private userService: UserService,
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {

    const userType = localStorage.getItem('userType');
    if (!userType) {
      this.router.navigate([ROUTES.WELCOME])
    }

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      password: ['', [Validators.required]],
      reenterPassword: ['', [Validators.required]]

    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  
   }

  passwordMatchValidator(frm: FormGroup) {
    return frm.get('password')?.value === frm.get('cPassword')?.value
      ? null : { mismatch: true };
  }

  get controls() {
    return this.form.controls;
  }

  forgotpassword() {
    this.router.navigate([ROUTES.FORGOT_PASSWORD]);
  }

  validateName(name: string): boolean {
    // Check if name is empty
    if (!name.trim()) {
      return false; // Invalid
    }

    // Check if name length is less than 3 characters
    if (name.length < 3) {
      return false; // Invalid
    }

    return true; // Valid
  }
  get formControls() {
    return this.form.controls;
  }

  setActiveButton(button: string) {
    this.activeButton = button;
    this.condition = (button === 'login');
  }

  signUp() {

    if (this.form.valid) {
      const formValue = this.form.value;
      const obj = {
        name: formValue.name,
        phone: formValue.phone,
        email: formValue.email,
        password: formValue.password,
        cPassword: formValue.reenterPassword,
        userType: localStorage.getItem('userType')
      };

      this.userService.userRegisterData = obj
      this.userService.verificationType = "emailVerification";

      this.userService.signUp(obj, (res) => {
        if (res) {
          
          this.router.navigate([ROUTES.SUPERADMINPANEL]);
        }
      });
    } else {
      this.logValidationErrors()
      // this.dialogService.open('Details', "Check your credentials", "", false, 'Okay');
    }
  }

  onSubmit() {
    this.router.navigate([ROUTES.SUPERADMINPANEL]);
  
  }

  logValidationErrors() {
    for (const controlName in this.form.controls) {
      if (this.form.controls[controlName].invalid) {
        const controlErrors = this.form.controls[controlName].errors;
        if (controlErrors?.['required']) {
        }
        if (controlErrors?.['minlength']) {
        }
        if (controlErrors?.['email']) {
        }
        if (controlErrors?.['pattern']) {
        }
      }
    }
  }

  login() {
    // Trim and check if email and password are empty
    const email = this.loginEmail?.trim();
    const password = this.loginPass?.trim();
    const userType = "SuperAdmin"
    localStorage.setItem('userType', userType);

  
    if (!email || !password) {
      this.dialogService.open('Error', 'Email and password are required!', '', false, 'Okay');
      return;
    }
  
    // Create the login object
    const loginData = { email, password ,userType};
  
    // Call the userService login method
    this.userService.login(loginData, (res) => {

      if (res.success) {
        // localStorage.setItem('token', res.token);
        this.router.navigate([ROUTES.SUPERADMINPANEL]);
      } else {
        this.dialogService.open('Login Failed', res.message || 'Invalid credentials', '', false, 'Okay');

      }
    });
  }
}

