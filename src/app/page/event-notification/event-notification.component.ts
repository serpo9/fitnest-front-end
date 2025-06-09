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
@Component({
  selector: 'app-event-notification',
  templateUrl: './event-notification.component.html',
  styleUrls: ['./event-notification.component.scss']
})
export class EventNotificationComponent {
 @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  sidenavOpen: boolean = true;
  selectedFilter: string = 'Search1';
  trainerColumns: string[] = [ 'name', 'number', 'email', 'assignedClass', 'startfrom','duration', 'time', 'actions' ];
  displayedColumns: string[] = ['name', 'number', 'email', 'gender', 'userStatus'];
  deviceColumns: string[] = ['ipAddress', 'username', 'password', 'purpose', 'status'];
  trainerDetailsColumns: string[] = ['trainername', 'trainernumber', 'traineremail', 'specialization', 'status'];
  dateRange = { start: null, end: null };
  searchTerm: string = '';

  dataSource = new MatTableDataSource<UserInfo>([]);

  constructor(
    private http: HttpClient,
    private router: Router,
    private matdialog: MatDialog,
    private userService: UserService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getAllActiveUser();
    this.dataSource.paginator = this.paginator;
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

  getAllActiveUser(): void {
    this.userService.getallcustomer('','',(res) => {
      if (!res.success) {
      } else {

        const formattedData: UserInfo[] = res.data.map((user: any) => ({
          id: user.id,
          name: user.name,
          number: user.phoneNumber || 'N/A',
          email: user.email,
          gender: user.gender || 'Not Provided',
          userStatus: 'active'
        }));

        this.updateTableData(formattedData);
      }
    });
  }

  

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }

  updateTableData(data: UserInfo[]): void {
    this.dataSource.data = data;
  }

  
  joinClass(element: any): void {
    this.router.navigate([`register-classs`, element.id]); // Correct way to pass ID
  }
  
  setActiveFilter(filter: string) {
    
    this.selectedFilter = filter;
  
  }

  
  approveTrainerId(userId : string){
    this.dialogService.open('Trainer Approval', `Are you sure you want to approve ?`, '', false, 'Confirm', (() => {
    const  obj = {
      userId : userId,
      status : "active",
      }
      this.userService.approveAdmin(obj, (res) => {
        if (res) {
        }
        else {
        }
      });
      
              }));
}


  
}
