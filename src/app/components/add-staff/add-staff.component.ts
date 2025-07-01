import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/app-routes.config';
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { FormBuilder, Validators } from '@angular/forms';

interface Locations {
  value: string;
  viewValue: string;
}
interface Trainer {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss']
})
export class AddStaffComponent {
  submissionStatus: boolean | null = null;
  submissionMessage: string = '';
  sidenavOpen: boolean = true;
  selectedOption: string | null = null; // Track selected option (guest or verified)

  userName: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  type: string = '';
  email: string = '';
  showNewForm: boolean = false;
  selectedDate: string | number | Date = new Date();
  minDate: Date = new Date();
  expiryDate = new Date(new Date().setDate(new Date().getDate() + 30));

  userType = [
    { value: 'Trainer', viewValue: 'Trainer' },
    { value: 'Receptionist', viewValue: 'Receptionist' },
    { value: 'Cleaner', viewValue: 'Cleaner' },
    { value: 'Weight-Picker', viewValue: 'Weight-Picker' }

  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void { }

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }
  isGuest: boolean = true; // Default to guest registration

  selectGuest() {
    this.isGuest = true;
  }

  selectVerified() {
    this.isGuest = false;
  }

  toggleForm(): void {
    this.showNewForm = !this.showNewForm;
  }

  registerStaffs(): void {

    if (this.password !== this.confirmPassword) {
      this.dialogService.open('Error', 'Passwords do not match!', '', false, 'Okay');
      return;
    }

    const obj = {
      name: this.userName,
      phoneNo: this.phone,
      email: this.email,
      password: this.password,
      cPassword: this.password,
      userType: this.type,
      status: 'active',
      expiryDate: this.expiryDate
    };

    this.userService.registerStaff(obj, (res) => {
      if (res.success) {
        this.dialogService.open('Success', res.message, '', false, 'Okay');
        this.router.navigate([ROUTES.JOINSCHEDULE]);
      } else {
        this.dialogService.open('Oops!', res.message, '', false, 'Okay');
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
