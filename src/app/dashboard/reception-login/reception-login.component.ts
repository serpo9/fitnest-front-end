import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { ROUTES } from 'src/app/app-routes.config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reception-login',
  templateUrl: './reception-login.component.html',
  styleUrls: ['./reception-login.component.scss']
})
export class ReceptionLoginComponent {

  condition: boolean = false;
  activeButton: string = 'login';
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
      this.router.navigate([ROUTES.RECEPTIONLOGIN])
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

  ngOnInit(): void { }


  get controls() {
    return this.form.controls;
  }


  get formControls() {
    return this.form.controls;
  }

  setActiveButton(button: string) {
    this.activeButton = button;
    this.condition = (button === 'login');
  }


  login() {
    // Trim and check if email and password are empty
    const email = this.loginEmail?.trim();
    const password = this.loginPass?.trim();
    const userType = "Receptionist"
    localStorage.setItem('userType', userType);


    if (!email || !password) {
      this.dialogService.open('Error', 'Email and password are required!', '', false, 'Okay');
      return;
    }

    // Create the login object
    const loginData = { email, password, userType };

    // Call the userService login method
    this.userService.login(loginData, (res) => {

      if (res.success) {
        // localStorage.setItem('token', res.token);
        this.router.navigate([ROUTES.RECEPTIONHOME]);
      } else {
        this.dialogService.open('Login Failed', res.message || 'Invalid credentials', '', false, 'Okay');

      }
    });
  }
}
