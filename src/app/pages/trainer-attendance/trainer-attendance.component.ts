import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { ROUTES } from 'src/app/app-routes.config';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { AttendanceDialogComponent } from 'src/app/utils/attendance-dialog/attendance-dialog.component';
import { elementAt } from 'rxjs';


export interface UserInfo {
  name: string;
  employeeNum: string;
  date: string;
  status: string;
  viewCalender : string
}


@Component({
  selector: 'app-trainer-attendance',
  templateUrl: './trainer-attendance.component.html',
  styleUrls: ['./trainer-attendance.component.scss']
})
export class TrainerAttendanceComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) paginatorTwo!: MatPaginator;

  sidenavOpen: boolean = true;
  displayedColumns: string[] = ['employeeNum', 'name', 'date', 'status', 'viewCalender'];
  displayedColumnsTwo: string[] = ['date', 'status'];
  searchTerm: string = '';

  // dateRange = {
  //   start: new Date(new Date().setDate(new Date().getDate() - 7 - 1)), // 7 days before yesterday
  //   end: new Date(new Date().setDate(new Date().getDate())),       // Yesterday
  // };

  dateRange = {
    start: new Date(new Date().setDate(new Date().getDate())), // Current data
    end: new Date(new Date().setDate(new Date().getDate())),   // tomorrow
  };
  
  dataSource = new MatTableDataSource<UserInfo>([]);
  presentCount: any;

  showDoor1 = 'door1';
  selectedFilter: string = "Search1";
  deviceData: any[] = [];
  selectedDeviceId: number | null = null;
  filterValue: any;

  userType : any = 'Trainer';

  viewDate: Date = new Date();
  presentDates: Date[] = [];
  absentDates: Date[] = [];


  constructor(
    private http: HttpClient,
    private router: Router,
    private matdialog: MatDialog,
    private userService: UserService,
    private dialogService: DialogService,
    private snackbarService: SnackBarService,

  ) {
    this.fetchAttendanceAccordingToDevice();
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;

    // this.dataSource.filterPredicate = (data: UserInfo, filter: string) =>
    //   data.name.toLowerCase() === filter.toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;  // Set paginator after view is initialized
  }

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }

getIndividualAttendance(element: any) {
  console.log('element:', element);

  const toDate = this.dateRange.end;
  const fromDate = new Date(toDate); 
  fromDate.setMonth(fromDate.getMonth() - 1); 

  const formattedFromDate = fromDate.toISOString().split('T')[0];
  const formattedToDate = toDate.toISOString().split('T')[0];
  const adminId = this.userService.userRegisterData.id;
  this.userService.getIndividualAttendance(adminId,element.userId, formattedFromDate, formattedToDate, response => {
    console.log("response:", response);

    this.matdialog.open(AttendanceDialogComponent, {
      data: response.data,
      width: '500px',
    });
  });
}


  updateTableData(data: UserInfo[]): void {
    this.dataSource.data = data;
  }

  applyFilter(): void {
    this.filterValue = this.searchTerm.trim();

    const obj = {
      userType: this.userType,
      deviceId: this.selectedDeviceId,
    };

    this.userService.getAttendance(this.filterValue, this.dateRange.start, this.dateRange.end, obj, (response) => {

      if (!response.success) {
        this.updateTableData([]);
        return this.dialogService.open('Oops!', `${response.message}`);
      }
      this.presentCount = response.presentCount;
      this.presentCount = response.presentCount.Trainer;
      this.updateTableData(response.data);
    })
  }
  userTypeSelection(userType : any){
    this.userType = userType; 
    this.getAttendance();
  }

  getAttendance() {
    console.log("dateRange : ", this.dateRange);
    const obj = {
      userType:  this.userType,
      deviceId: this.selectedDeviceId
    };

    this.userService.getAttendance(this.filterValue, this.dateRange.start, this.dateRange.end, obj, (response) => {

      if (!response.success) {
        this.updateTableData([]);
        return this.dialogService.open('Oops!', `${response.message}`);
      }
      this.presentCount = response.presentCount;
      this.presentCount = response.presentCount.Trainer;
      this.updateTableData(response.data);
    })
  }

  searchAttendanceByDate() {

    const obj = {
      userType:  this.userType,
      deviceId: this.selectedDeviceId
    }

    this.userService.getAttendance(this.filterValue, this.dateRange.start, this.dateRange.end, obj, (response) => {
      if (!response.success) {
        return this.dialogService.open('Oops!', `${response.message}`, '', false, 'Okay');
      }

      this.updateTableData(response.data)
      this.presentCount = response.presentCount.Trainer;
      console.log("this.presentCount...", this.presentCount);

    })
  }


  fetchAttendanceAccordingToDevice() {
    this.userService.fetchDevice((response) => {
      console.log("fetchDevice..", response);
      this.deviceData = response.data;

      // Auto-select Door-1 if available
      const defaultDevice = this.deviceData.find(device => device.purpose.toLowerCase() === 'door 1');

      if (defaultDevice) {
        this.selectedDeviceId = defaultDevice.id;
        this.getAttendance();
      } else {
        this.selectedDeviceId = null;
        console.warn('No Door-1 device found');
      }
    });
  }

  selectDoor(purpose: string) {
    const matchedDevice = this.deviceData.find(device => device.purpose.toLowerCase() === purpose.toLowerCase());

    if (matchedDevice) {
      this.selectedDeviceId = matchedDevice.id;
      console.log('Selected Device ID:', matchedDevice.id);
      this.getAttendance();
    } else {
      this.selectedDeviceId = null;
      console.warn(`No device found for: ${purpose}`);
      // handle no device (maybe show a warning in UI or skip API call)
    }
  }


  getPurposeById(id: number): string | null {
    const device = this.deviceData.find(d => d.id === id);
    return device ? device.purpose : null;
  }

}
