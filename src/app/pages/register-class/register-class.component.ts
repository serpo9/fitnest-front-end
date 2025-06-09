import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { ActivatedRoute } from '@angular/router';

interface Locations {
  value: string;
  viewValue: string;
}

interface Trainer {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-register-class',
  templateUrl: './register-class.component.html',
  styleUrls: ['./register-class.component.scss']
})
export class RegisterClassComponent {
  submissionStatus: boolean | null = null;
  submissionMessage: string = '';
  sidenavOpen: boolean = true;
  showNewForm = false;
  
  selectedTrainer: string = '';
  selectedSession: string = '';
  selectedPlan: string = ''; // Separate property for plan selection
  amount: number | null = null;
  gymEmployeeNo: any;
  gymAmount: any;
  showTrainerForm: boolean = true;
  selectedDate: Date = new Date();


  // Scheduling Fields
  trainerScheduleName: string = '';
  classType: string = '';
  employeeNo: string = '';
  scheduleDate: string = '';
  scheduleTime: string = '';
  className: string = '';
  maxCapacity: string = '';
  selectedPurpose: string = '';
  classId: string | null = null;
  selectsession : any;

  minDate: Date = new Date();

  locations: Locations[] = [
    { value: '1_month_plan', viewValue: '1 month plan' },
    { value: '6_month_plan', viewValue: '3 month plan' },
    { value: '6_month_plan', viewValue: '6 month plan' },
    { value: '1_year_plan', viewValue: '12 month plan' },
  ];

  planList = [
    { value: 'basic', viewValue: 'Basic Plan' },
    { value: 'primary', viewValue: 'Primary Plan' }
  ];
  trainerList: Trainer[] = [
    { value: 'Strength Training', viewValue: 'Strength Training' },
  { value: 'Cardio & Endurance ', viewValue: 'Cardio & Endurance ' },
  { value: 'Yoga & Flexibility', viewValue: 'Yoga & Flexibility' },
  { value: 'basic', viewValue: 'Basic Plan' },
  { value: 'primary', viewValue: 'Primary Plan' }

   
  ];
  restrictToNumbers(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // Prevent input if it's not a number (0-9)
    }
  }
  

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private dialogService: DialogService,
    private route: ActivatedRoute
    
  ) {}
  ngOnInit(): void {
    const date = new Date(this.selectedDate);
    // this.getallsessions()
    this.classId = this.route.snapshot.paramMap.get('id');
  }
  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }
  toggleForm(): void {
    this.showNewForm = !this.showNewForm;
  }
  onAssignSchedule(): void {

// Find the selected trainer's className (viewValue)
// const selectedTrainerObj = this.trainerList.find(trainer => trainer.value === this.selectedTrainer);
// let selectedTrainerName = selectedTrainerObj ? selectedTrainerObj.viewValue : '';
// Extract only the class name (before the first space or parenthesis)
// if (selectedTrainerName.includes('(')) {
//   selectedTrainerName = selectedTrainerName.split('(')[0].trim();
// }
  const  obj={
    userid : this.classId ,
    scheduleid: this.selectedTrainer,
    adminid : this.userService.userDataObj.id,
    amountpaid :this.amount,
    // devices : selectedTrainerName,
    employeeno :  this.employeeNo 
    }
  const  deviceobj = {
    employeeNo :  this.employeeNo ,
      name : "user"
    }
    this.userService.getsubscriptionplan(obj, (response) => {
      if (!response.success) {
        this.dialogService.open('Oops', response.message, '', false, 'Okay');
      } else {
        this.userService.deviceentrygate(deviceobj, (deviceResponse) => {
          if (deviceResponse.success) {
            this.dialogService.open('Success', deviceResponse.message, '', false, 'Okay');
          } 
          
        });
      }
    });
    
  }

  onSubmit(): void {
  }

//   getallsessions():void{
//     // here is the all admin 
//     this.userService.getallsession((res) => {
//      if (res && res.success && res.data.length > 0) {
//        const gymLocations = res.data.map((admin: any) => ({
//          value: admin.id, // Convert to lowercase and replace spaces with _
//         viewValue: `${admin.className}  (${admin.durationMonths}month) and  start from(${admin.startfrom})`,
//        }));
 
//        this.trainerList = [...this.trainerList, ...gymLocations]; // Merge gym names into locations
//      }
//    });
// }
onRegisterGym(){

}
}
