import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/app-routes.config'
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service'
interface locations {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-add-devices',
  templateUrl: './add-devices.component.html',
  styleUrls: ['./add-devices.component.scss']
})
export class AddDevicesComponent {
  submissionStatus: boolean | null = null;  // true for success, false for failure
  submissionMessage: string = '';
  sidenavOpen: boolean = true;
  showNewForm = false;  // Controls which form is shown
  door1: boolean = false;
  door2: boolean = false;
  className = '';
  description = '';
  duration = '';
  time = '';
  // door1 : any;
  // door2 : any;
  selectedPlanOrSession: string = '';
  // door1: boolean = false;
  // door2: boolean = false;

  deviceIp: string = '';
  username: string = '';
  password: string = '';
  selectedPurpose: string = '';
  isScrolled = false;
  isNavbarVisible = false;

  trainerName = '';
  classType = '';
  scheduleDate = '';
  scheduleTime = '';
  userKey: string = ''; // Store the input value
  locations: locations[] = [
    { value: 'entry_gate', viewValue: 'Entry Gate' },
    { value: 'Other', viewValue: 'Other' },
  ];

  constructor(private http: HttpClient, private router: Router,
      private userService: UserService,
      private dialogService: DialogService,
  ) {}

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }


  onSubmit() {
    const selectedDoors = [];
  if (this.door1) selectedDoors.push('Door 1');
  if (this.door2) selectedDoors.push('Door 2');
    if (!this.deviceIp || !this.username || !this.password || !selectedDoors) {
      alert('Please fill out all required fields.');
      return;
    }
   const  obj={
      userId: this.userService.userDataObj.id,
      ipAddress : this.deviceIp ,
      username : this.username,
      password : this.password,
      purpose : selectedDoors  
    }
      this.userService.adddevice(obj, (res) => {
          if (!res.success) {
            this.dialogService.open('Sucess', res.message, '', false, 'Okay', (() => {
              this.router.navigate([ROUTES.ADDSCHEDULING]);
            }));
          }
          else {
            // this.resetForm()
            this.dialogService.open('Sucess', 'Device added successfully!', '', false, 'Okay');
            this.router.navigate([ROUTES.REGISTEREDDEVICE]);
          }
        });
        

    
    // Check if card exists in the local 'users' object
  }
  onPlanOrSessionChange() {
    if (this.selectedPlanOrSession === 'primary' || this.selectedPlanOrSession === 'cardio_endurance') {
      this.door1 = true;
      this.door2 = true;
    } else if (this.selectedPlanOrSession === 'basic' || this.selectedPlanOrSession === 'yoga_flexibility') {
      this.door1 = true;
      this.door2 = false;
    } else {
      this.door1 = false;
      this.door2 = false;
    }
  }
 // Handle second form submission
    onAssignSchedule() {
      alert("Schedule Assigned Successfully!");
    }
  



onCheckboxChange(selected: string) {
  if (selected === 'door1' && this.door1) {
    this.door2 = false;
  } else if (selected === 'door2' && this.door2) {
    this.door1 = false;
  }
}

  toggleForm() {
    this.showNewForm = !this.showNewForm;  // Toggle the form when the button is clicked
  }
  profile(){
    this.router.navigate([ROUTES.PROFILE]);
  }


// ✅ Add this method to reset input fields
resetForm() {
  this.deviceIp = '';
  this.username = '';
  this.password = '';
  this.selectedPurpose = '';
}


 
  

}
