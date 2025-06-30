import { Component, OnInit, ViewChild } from '@angular/core';
import { faArrowDown, faDownload } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/app-routes.config';
import { EditProfileDialogComponent } from 'src/app/utils/edit-profile-dialog/edit-profile-dialog.component';
import { CompleteProfileComponent } from 'src/app/components/complete-profile/complete-profile.component';
import { ViewSubscriptionDialogComponent } from 'src/app/dashboard/dialogs/view-subscription-dialog/view-subscription-dialog.component';
import { DateRange } from '@angular/material/datepicker';
import { FormBuilder, Validators } from '@angular/forms';
import { AttendanceDialogComponent } from 'src/app/utils/attendance-dialog/attendance-dialog.component';


export interface UserInfo {
  date: string,
  status: string
}

export interface DietPlan {
  mealType: string,
  foodName: string,
  quantity: string,
  notes: string
}

export interface TrackProgress {
  month: string,
  weight: string
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  UserName: any;
  emailId: any;
  phone: any;
  userId: any;
  gymName: any
  userdetails: string = 'Pranit';
  faArrowDown = faArrowDown;
  faDownload = faDownload;
  logindata: any;
  userType: any;
  username = { name: '', email: '', phone: '', id: '', userType: '', bloodGroup: '', height: '', weight: '', dob: '', fitnessGoals: '', gender: '', };
  moreCustomerInfo: any;
  showMoreProfileDetails = false;

  activeTab: any = 'none';
  isTabSelected: boolean = false;
  dietTab: boolean = false;
  trackTab: boolean = false;
  attendanceTab: boolean = false;
  newWeight: number | null = null;

  displayedColumns: string[] = ['date', 'status'];
  displayedColumnsTwo: string[] = ['mealType', 'foodName', 'quantity', 'notes'];
  displayedColumnsThree: string[] = ['month', 'weight'];
  dietPlans: { title: string; fileName: string; url: string }[] = [];

  plansData: any;
  dataSource = new MatTableDataSource<UserInfo>();
  dataSourceTwo = new MatTableDataSource<DietPlan>();
  dataSourceThree = new MatTableDataSource<TrackProgress>();

  // @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  @ViewChild('paginatorOne') paginatorOne!: MatPaginator;
  @ViewChild('paginatorTwo') paginatorTwo!: MatPaginator;
  @ViewChild('paginatorThree') paginatorThree!: MatPaginator;

  showData: any = [];
  dialogOpen: boolean = false;
  bmiForm: any;

  // heightInFt: any  ;
  // heightInInch: any; 
  // weight: any ;

  dateRange = {
    start: new Date(new Date().setDate(new Date().getDate())), // Current data
    end: new Date(new Date().setDate(new Date().getDate())),   // tomorrow
  };

  constructor(private dialog: DialogService,
    private userService: UserService,
    private matdialog: MatDialog,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.getAttendances();
    this.getDietPlan();

    this.bmiForm = this.fb.group({
      heightInFt: ['', Validators.required],
      heightInInch: ['', Validators.required],
      weight: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.userService.getPlanForUsers((response) => {
      const userData = this.userService.userRegisterData;

      if (response.success && response.data.length > 0) {
        this.dietPlans = response.data.map((item: any) => ({
          title: item.pdfname?.split('.')[0] || 'Untitled Plan',
          fileName: item.pdfname,
          url: `http://localhost:8000/fitnest/.pdf/${userData.createdByAdmin}-${encodeURIComponent(item.pdfname)}`
        }));
      } else {
        this.dietPlans = []; // No data
      }
    });


    this.dataSource.paginator = this.paginatorOne;

    this.dataSourceTwo.paginator = this.paginatorTwo;
    this.dataSourceThree.paginator = this.paginatorThree;

    this.logindata = this.userService.userDataObj;
    this.username.name = this.logindata.name;
    this.username.email = this.logindata.email;
    this.username.id = this.logindata.id;
    this.username.phone = this.logindata.phoneNumber;

    this.userService.getGymName((response) => {
      this.gymName = response.gymName;
    });

    this.userType = this.logindata.userType;

    if (this.userType === "Customer") {
      this.userService.getProfileDetails(this.logindata.id, (response) => {
        this.moreCustomerInfo = response.data;

        if (response.data.length === 0) {
          this.openCompleteProfile();
          return
        }

        this.username.bloodGroup = response.data[0].bloodGroup;
        this.username.height = response.data[0].height;
        this.username.weight = response.data[0].weight;
        this.username.fitnessGoals = response.data[0].fitnessGoals;
        this.username.gender = response.data[0].gender;
        this.username.dob = response.data[0].dob;

        this.showMoreProfileDetails = true;
      })
    }
    this.viewPurchasedPlan();
    this.checkIfPlanExpired()
    this.getUserProfile();
  }

  openPDF(url: string): void {
    window.open(url, '_blank');
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginatorOne;
    this.dataSourceTwo.paginator = this.paginatorTwo;
    this.dataSourceThree.paginator = this.paginatorThree;
  }
  downloadPDF(url: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  calculateBMI() {
    if (this.bmiForm.valid && this.bmiForm.value.heightInFt > 0 && this.bmiForm.value.heightInInch >= 0 && this.bmiForm.value.weight > 0) {
      const heightInFt = this.bmiForm.value.heightInFt;
      const heightInCm = this.bmiForm.value.heightInInch * 2.54; // Convert inches to centimeters
      const weight = this.bmiForm.value.weight;
      this
      // Convert height to meters
      const heightInMeters = (heightInFt * 0.3048) + (heightInCm / 100);

      // Calculate BMI
      const bmi = weight / (heightInMeters * heightInMeters);
      this.dialog.open('BMI Result', `Your BMI is ${bmi.toFixed(2)}`, '', false, 'Okay');
    } else {
      this.dialog.open('Error', 'Please fill in all fields correctly.', '', false, 'Okay');
    }
  }

  editProfile(): void {
    if (this.dialogOpen) {
      this.dialog.open('Attention!', 'You have just updated your details, Try again after some time.', '', false, 'Okay');
      return;
    }
    const dialogRef = this.matdialog.open(EditProfileDialogComponent, {
      width: '250px',
      data: { logindata: this.logindata, showBasicForm: true }
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result) {
        this.dialogOpen = true;
        this.logindata = result.data;
        this.username.name = this.logindata.name;
        this.username.email = this.logindata.email;
        this.username.phone = this.logindata.phoneNumber;
        this.username.id = this.logindata.id;
      }
    });
  }

  editMoreInfoProfile(): void {
    if (this.dialogOpen) {
      this.dialog.open('Attention!', 'You have just updated your details, Try again after some time.', '', false, 'Okay');
      return;
    }

    const dialogRef = this.matdialog.open(EditProfileDialogComponent, {
      width: '250px',
      data: { moreCustomerInfo: this.moreCustomerInfo, showBasicForm: false }
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result) {
        this.dialogOpen = true;
        this.moreCustomerInfo = result.data;
        this.username.bloodGroup = this.moreCustomerInfo.bloodGroup;
        this.username.height = this.moreCustomerInfo.height;
        this.username.weight = this.moreCustomerInfo.weight;
        this.username.fitnessGoals = this.moreCustomerInfo.fitnessGoals;
      }
    });
  }

  logout() {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      this.router.navigate([ROUTES.WELCOME]);
    };
  }

  goToPage(routes: any) {
    this.router.navigate([routes]);
  }

  openCompleteProfile() {
    this.showMoreProfileDetails = false;
    const dialogRef = this.matdialog.open(CompleteProfileComponent, {
      width: "500px",
      data: { userId: this.logindata.id }
    })

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.success) {

        this.username.bloodGroup = result.data.bloodGroup;
        this.username.height = result.data.height;
        this.username.weight = result.data.weight;
        this.username.fitnessGoals = result.data.fitnessGoals;
        this.username.gender = result.data.gender;
        this.username.dob = result.data.dateOfBirth;

        this.showMoreProfileDetails = true;
      }
    });
  }

  viewPurchasedPlan() {
    this.userService.viewPurchasedPlan((response) => {
      this.plansData = response.data
    })
  }

  viewPlan() {
    this.matdialog.open(ViewSubscriptionDialogComponent, {
      width: "800px",
      data: this.plansData[0]
    })
  }

  checkIfPlanExpired() {
    this.userService.postUsersPlanToExpire((res) => { })
  }



  getAttendances() {
    this.userService.getUsersAttendances((response) => {
      if (response.success) {
        this.updateTableData(response.data);
      }
    })
  }


  updateTableData(data: UserInfo[]): void {
    this.dataSource.data = data;
  }

  getDietPlan() {
    this.userService.getDietPlan((response) => {
      if (response.success) {
        this.dataSourceTwo.data = response.data;
      }
    })
  }

  getUserProfile() {
    const userId = this.logindata?.id;
    this.userService.fetchTrackUsers(userId, (response) => {

      if (response.success) {

        this.dataSourceThree.data = response.data;
      }
    })
  }

  selectedDate: Date | null = null;

  presentDates = ['2025-05-15', '2025-05-17'];
  absentDates = ['2025-05-16', '2025-05-18'];

  dateClass = (d: Date): string => {
    const dateStr = d.toISOString().split('T')[0];
    if (this.presentDates.includes(dateStr)) return 'present-date';
    if (this.absentDates.includes(dateStr)) return 'absent-date';
    return '';
  };


  selectedTab(tabName: any) {
    if (tabName == 'none') {
      this.isTabSelected = false;
      this.activeTab = 'none';
      this.dietTab = false;
      this.attendanceTab = false;
      this.trackTab = false;
    }
    else {
      this.activeTab = tabName;
      this.isTabSelected = true;
      if (tabName === 'diet') {
        this.dietTab = true;
        this.trackTab = false;
        this.attendanceTab = false;
      }
      else if (tabName === 'track') {
        this.trackTab = true;
        this.dietTab = false;
        this.attendanceTab = false;
      }
      else {
        this.attendanceTab = true;
        this.trackTab = false;
        this.dietTab = false;
      }
    }

  }


  submitWeight() {
    if (this.newWeight !== null && this.newWeight > 0) {
      const obj = {
        userId: this.username.id,
        weight: this.newWeight
      }

      this.userService.postTrackUsers(obj, (response) => {
        if (!response.success) {
          this.dialog.open('Oops', response.message, '', false, 'Okay', () => { return; })
        }
        else {
          const date = new Date();
          const monthStr = date.toLocaleDateString().toString();
          this.dataSourceThree.data = [...this.dataSourceThree.data,
          { month: monthStr, weight: obj.weight.toString() }];

        }
      })
      this.newWeight = null;
    }
  }

  getIndividualAttendance(element: any) {

    const toDate = this.dateRange.end;
    const fromDate = new Date(toDate);
    fromDate.setMonth(fromDate.getMonth() - 1);

    const formattedFromDate = fromDate.toISOString().split('T')[0];
    const formattedToDate = toDate.toISOString().split('T')[0];
    const userId = this.userService.userRegisterData.id;
    const adminId = this.userService.userRegisterData.createdByAdmin;
    this.userService.getIndividualAttendance(adminId, userId, formattedFromDate, formattedToDate, response => {

      if (response.success && response.data.length > 0) {
        // this.matdialog.open(AttendanceDialogComponent, {
        //   data: response.data,
        //   width: '500px',
        // });
      }
    });
  }

}