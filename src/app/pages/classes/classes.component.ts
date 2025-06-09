import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/app-routes.config'
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';


interface Locations {
  value: string;
  viewValue: string;
}
interface trainer {
  value: string;
  viewValue: string;
}
interface devicepurpose {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent {
  submissionStatus: boolean | null = null;
  submissionMessage: string = '';
  sidenavOpen: boolean = true;
  showNewForm = false;
  selectedDevicePurpose: string = ''; // Add this
  selectedTrainer: string = '';
  trainerName: string = '';
  description: string = '';
  startTime:string='';
  duration: string = '';
  time: string = '';
  maxCapacity: string = '';
  selectedPurpose: string = '';
  trainerScheduleName: string = '';
  classType: string = '';
  scheduleDate: string = '';
  scheduleTime: string = '';
  className: string = '';
  selectedDate:string = '';
  capacity :string='';
  dateRange = {
    start: null,
    end: null
  };
  endTime:string='';

  

  minDate: Date = new Date();
  selectedOption: string = '';


  days = [
    { name: 'Sunday', selected: false },
    { name: 'Monday', selected: false },
    { name: 'Tuesday', selected: false },
    { name: 'Wednesday', selected: false },
    { name: 'Thursday', selected: false },
    { name: 'Friday', selected: false },
    { name: 'Saturday', selected: false }
  ];

  
  durationOptions = [
    { value: '1', viewValue: '1 Month' },
    { value: '3', viewValue: '3 Months' },
    { value: '6', viewValue: '6 Months' },
    { value: '12', viewValue: '12 Months' }
  ];

  locations: Locations[] = [
    { value: 'cardio_session', viewValue: 'Cardio Session' },
    { value: 'yoga_session', viewValue: 'Yoga Session' },
    { value: 'personal_session', viewValue: 'Personal Trainer' }
  ];
  devicepurpose: devicepurpose[] = [
    { value: 'entry_gate', viewValue: 'Entry Gate' },
    { value: 'Both', viewValue: 'Both' },
  ];

  trainerList: trainer[]  = [
   
  ];

  constructor(private http: HttpClient, private router: Router,
    private userService: UserService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private snackbarService: SnackBarService,

  ) {}
  ngOnInit(): void {
    this.getalltrainer()
  }

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }

  toggleForm(): void {
    this.showNewForm = !this.showNewForm;
  }


  selectedDays: string[] = [];

  selectAllDays() {
    this.selectedDays = this.days.map(day => day.name);
  }
  
  areAllDaysSelected(): boolean {
    return this.selectedDays.length === this.days.length;
  }
  
  toggleAllSelection() {
    if (this.areAllDaysSelected()) {
      this.selectedDays = [];
    } else {
      this.selectAllDays();
    }
  }


  

  // Assign Schedule Submission
  onAssignSchedule(): void {
    if (
      !this.className ||
      !this.capacity ||
      !this.startTime ||
      !this.endTime ||
      !this.selectedDays ||
      this.selectedDays.length === 0
    ) {
      this.dialogService.open('Validation Error', 'Please fill all fields.', '', false, 'Okay');
      return;
    }
    const [startHour, startMin] = this.startTime.split(':').map(Number);
    const [endHour, endMin] = this.endTime.split(':').map(Number);
    const startTotal = startHour * 60 + startMin;
    const endTotal = endHour * 60 + endMin;

  if (endTotal <= startTotal) {
    this.dialogService.open('Validation Error', 'End time must be greater than start time.', '', false, 'Okay');
    return;
  }

    const obj =  {
      adminId:this.userService.userRegisterData.id,
      className: this.className,
      capacity:this.capacity,
      startTime:this.startTime,
      endTime:this.endTime,
      days:JSON.stringify(this.selectedDays),
    };
    this.userService.newschedule(obj, (res) => {
      if (res.success) {
          this.className=''
          this.capacity =''
          this.startTime = ''
          this.endTime =''
          this.snackbarService.showSnackBar('Successfully created', 3000, ['snackbar-success']);
          this.router.navigate([ROUTES.AllSCHEDULED]);
      }
      else {
        this.dialogService.open('opps!',res.message, '', false, 'Okay');
      }
    });

  }
  getalltrainer():void{
     // here is the all admin 
     this.userService.getalltrainer('','',(res) => {
      if (res && res.success && res.data.length > 0) {
        const gymLocations = res.data.map((admin: any) => ({
          value: admin.id, // Convert to lowercase and replace spaces with _
         viewValue: `${admin.name} (${admin.specialization})`
        }));
  
        this.trainerList = [...this.trainerList, ...gymLocations]; // Merge gym names into locations
      }
    });
}
logDateRange() {
  // Ensure date range has both start and end dates
  if (!this.dateRange?.start || !this.dateRange?.end) {
    console.error('Date range is incomplete.');
    return;
  }

  // Format the dates for the API body
  const formattedDateRange = {
    dateFrom: this.formatDate(this.dateRange.start),
    dateTo: this.formatDate(this.dateRange.end),
  };

  // API URL
  const apiUrl = 'http://localhost:8000/api/hikvision/getdata';

  // Make the POST request
  this.http.post<any>(apiUrl, formattedDateRange).subscribe(
    (response) => {
    },
    (error) => {
      console.error('API Error:', error);
    }
  );
}


getFormattedTime(time: string): string {
  if (!time) return '';
  const [hourStr, minuteStr] = time.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12 || 12; // Convert 0 to 12, 13 to 1, etc.

  return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

 // Helper function to format dates as 'YYYY-MM-DD'
 formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
  
}
