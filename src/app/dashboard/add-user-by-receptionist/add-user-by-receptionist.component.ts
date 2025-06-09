import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/app-routes.config';
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-user-by-receptionist',
  templateUrl: './add-user-by-receptionist.component.html',
  styleUrls: ['./add-user-by-receptionist.component.scss']
})
export class AddUserByReceptionistComponent {
  sidenavOpen: boolean = true;

  userName: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  duration: string = '';
  email: string = '';
  showNewForm: boolean = false;
  selectedDate: string | number | Date = new Date();

  durationOptions = [
    { value: 'good', viewValue: 'Good' },
    { value: 'average', viewValue: 'Average' },
    { value: 'poor', viewValue: 'Poor' }
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

  onAssignSchedule(verifiedUser: any): void {
    const date = new Date(this.selectedDate);
    if (this.password !== this.confirmPassword) {
      this.dialogService.open('Error', 'Passwords do not match!', '', false, 'Okay');
      return;
    }


    const obj = {
      name: this.userName,
      phoneNumber: this.phone,
      email: this.email,
      password: this.password,
      cPassword: this.password,
      userType: "Customer",
      status: 'active'
    };

    this.userService.signupuserbyadmin(obj, (res) => {
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
