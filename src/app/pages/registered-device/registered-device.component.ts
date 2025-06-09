import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { ROUTES } from 'src/app/app-routes.config';

export interface UserInfo {
  name: string;
  number: string;
  email: string;
  gender: string;
  userStatus: string;
}
export interface TrainerInfo {
  id: any;
  name: string;
  number: string;
  email: string;
  specialization: string;
  status: string; // Changed from "approval" to "status"
}

export interface getTrainerSchedules {
  id: any;
  // name: string;
  // number: string;
  // email: string;
  // assignedClass: string;
  startfrom: string;
  duration: string;
  time: string;
  actions: string;
}

export interface ActiveDevice {
  ipAddress: string;
  username: string;
  password: string;
  purpose: string;
  status: string;
}
@Component({
  selector: 'app-registered-device',
  templateUrl: './registered-device.component.html',
  styleUrls: ['./registered-device.component.scss']
})
export class RegisteredDeviceComponent {

 @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  sidenavOpen: boolean = true;
  selectedFilter: string = 'Search1';
  trainerColumns: string[] = [  'assignedClass', 'startfrom', 'time', 'actions' ];
  displayedColumns: string[] = ['name', 'number', 'email', 'gender', 'userStatus'];
  deviceColumns: string[] = ['ipAddress', 'username', 'password', 'purpose', 'status'];
  trainerDetailsColumns: string[] = ['trainername', 'trainernumber', 'traineremail', 'specialization', 'status'];
  dateRange = { start: null, end: null };
  searchTerm: string = '';

  trainerDetailsDataSource = new MatTableDataSource<TrainerInfo>([]);
  dataSource = new MatTableDataSource<UserInfo>([]);
  activeDevicesData = new MatTableDataSource<ActiveDevice>([]);
  getTrainerSchedulesData = new MatTableDataSource<getTrainerSchedules>([]);

  constructor(
    private http: HttpClient,
    private router: Router,
    private matdialog: MatDialog,
    private userService: UserService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getAllActiveDevices(); // Load active devices
    this.dataSource.paginator = this.paginator;
    this.activeDevicesData.paginator = this.paginator;
    this.loadLocalStorageData();

    this.dataSource.filterPredicate = (data: UserInfo, filter: string) =>
      data.name.toLowerCase() === filter.toLowerCase();
  }

  loadLocalStorageData(): void {
    const storedData = localStorage.getItem('userList');
    if (storedData) {
      try {
        const userInfoData: UserInfo[] = JSON.parse(storedData);
        this.updateTableData(userInfoData);
      } catch (e) {
        console.error('Error parsing localStorage data:', e);
      }
    } else {
    }
  }



  getAllActiveDevices(): void {
    this.userService.getActiveDevicessession((res) => {
      if (!res.success) {
      } else {

        const formattedData: ActiveDevice[] = res.data.map((device: any) => ({
          ipAddress: device.ipAddress,
          username: device.username,
          password:  device.password, // Masked for security
          purpose: device.purpose,
          status: device.status
        }));

        this.activeDevicesData.data = formattedData;
      }
    });
  }

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }

  updateTableData(data: UserInfo[]): void {
    this.dataSource.data = data;
  }



  
}
