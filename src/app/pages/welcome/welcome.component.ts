import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { ROUTES } from 'src/app/app-routes.config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


interface locations {
  value: string;
  viewValue: string;
}
interface locationsnew {
  value: string;
  viewValue: string;
}

@Component({
  templateUrl: './welcome.component.html',
  selector: 'app-welcome',
  styleUrls: ['./welcome.component.scss']
  
})
export class WelcomeComponent implements OnInit {
  condition: boolean = false;
  activeButton: string = 'signup';
  form: FormGroup;
  loginForm: FormGroup;
  name: any;
  email: any;
  phone: any;
  typeofuser = 'admin'; // Default user type

  submitted: boolean = false;
  loginEmail: any;
  loginPass: any;
  locations: locations[] = [
    // { value: 'entry_gate', viewValue: 'Entry Gate' },

  ];
  healthStatuses = [
    { value: 'good', viewValue: 'Good' },
    { value: 'average', viewValue: 'Average' },
    { value: 'poor', viewValue: 'Poor' }
  ];
  specializations = [
    { value: 'yoga', viewValue: 'Yoga' },
    { value: 'cardio', viewValue: 'Cardio' },
    { value: 'strength', viewValue: 'Strength Training' },
    { value: 'zumba', viewValue: 'Zumba' }
  ];
  

  constructor(private router: Router,
    private userService: UserService,
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {

   

    const userType = localStorage.getItem('userType');
    if (!userType) {
      this.router.navigate([ROUTES.WELCOME])
    }
 
    const commonControls = {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      
      password: ['', [Validators.required, Validators.minLength(6)]],
      reenterPassword: ['', [Validators.required]]
    };
    if (userType === 'Customer') {
      this.form = this.fb.group({
        ...commonControls,
        selectedGym: ['', [Validators.required]],
        healthStatus: ['', [Validators.required]],
      });
    } else if(userType === 'Admin'){
      this.form = this.fb.group({
        ...commonControls,
        gymName: ['', [Validators.required]],
       
      });
    }
    else{
      this.form = this.fb.group({
        ...commonControls,
        selectedGym: ['', [Validators.required]],
        healthStatus: ['', [Validators.required]],
        specialization: ['', [Validators.required]],
      });

    }
    

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    
    window.onload = () => {
      this.router.navigate([ROUTES.WELCOME]);
    };
    const storedUserType = localStorage.getItem('userType');
  
    if (storedUserType) {
      this.typeofuser = storedUserType;
    } else {
      console.warn("userType not found in localStorage.");
      this.typeofuser = "guest"; // Set a default value if needed
    }

    // here is the all admin 
    this.userService.getAllAdmin((res) => {
      if (res && res.success && res.data.length > 0) {
        const gymLocations = res.data.map((admin: any) => ({
          value: admin.id, // Convert to lowercase and replace spaces with _
          viewValue: admin.gymName
        }));
  
        this.locations = [...this.locations, ...gymLocations]; // Merge gym names into locations
      }
    });
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
        phoneNumber: formValue.phone,
        email: formValue.email,
        gymName: formValue.gymName,
        createdByAdmin:formValue.selectedGym,
        selectedGym: formValue.selectedGym,
        specialization: formValue.specialization,
        healthStatus: formValue.healthStatus,
        password: formValue.password,
        cPassword: formValue.reenterPassword,
        userType: this.typeofuser
      };

      if (obj.password !== obj.cPassword) {
        this.dialogService.open('Oops!', 'Password do not match!')
        return;
      }
    
      this.userService.userRegisterData = obj;
      this.userService.verificationType = "emailVerification";
  
      this.userService.signUp(obj, (res) => {
        if (res) {
          this.router.navigate([ROUTES.OTP]);
        }
      });
    } else {
      this.logValidationErrors();
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.signUp();
    } else {
      this.logValidationErrors();
    }
  }
  logValidationErrors() {
    for (const controlName in this.form.controls) {
      const controlErrors = this.form.controls[controlName].errors;
      if (controlErrors) {
        if (controlErrors['required']) {
        }
        if (controlName === 'phone' && controlErrors['pattern']) {
        }
        if (controlName === 'password' && controlErrors['minlength']) {
        }
        if (controlName === 'reenterPassword' && controlErrors['mismatch']) {
        }
      }
    }
  }

  login() {
    // Trim and check if email and password are empty
    const email = this.loginEmail?.trim();
    const password = this.loginPass?.trim();
    const userType = localStorage.getItem('userType');
    if (!email || !password) {
      this.dialogService.open('Error', 'Email and password are required!', '', false, 'Okay');
      return;
    }
  
    // Create the login object
    const loginData = { email, password , userType };
  
  
    // Call the userService login method
    this.userService.login(loginData, (res) => {
      if (res.success) {
        // localStorage.setItem('token', res.token);
        const typeofuser = localStorage.getItem('userType');
    
        // Check the user type and navigate accordingly
        if (typeofuser === 'Customer') {
          this.router.navigate([ROUTES.HOME]);
        } else if (typeofuser === 'Admin') {
         

          this.router.navigate([ROUTES.ADMINHOME]);
        } else if (typeofuser === 'Trainer') {
          this.router.navigate([ROUTES.YOURSESSION]);
        } else {
          this.dialogService.open('Login Failed', 'Unknown user type', '', false, 'Okay');
        }
      } else {
        this.dialogService.open('Login Failed', res.message || 'Invalid credentials', '', false, 'Okay');
      }
    
    });
  }

  onlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  
  
}
