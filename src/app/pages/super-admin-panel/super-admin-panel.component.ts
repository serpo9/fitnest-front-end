
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user-service/user.service';
import { ROUTES } from 'src/app/app-routes.config';

export interface UserInfo {
  id: number;
  cardId: string;
  beginTime: string;
  endTime: string;
  gender: string;
  userStatus: string;
  approval: string;
}

@Component({
  selector: 'app-super-admin-panel',
  templateUrl: './super-admin-panel.component.html',
  styleUrls: ['./super-admin-panel.component.scss']
})
export class SuperAdminPanelComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  sidenavOpen: boolean = true;
  displayedColumns: string[] = ['cardId', 'beginTime', 'endTime', 'gender', 'userStatus', 'approval'];
  dataSource = new MatTableDataSource<UserInfo>([]);
  searchTerm: string = '';
  isScrolled: any;
  isNavbarVisible: any;
  dateRange = {
    start: new Date(new Date().setDate(new Date().getDate())), // 1 days before yesterday
    end: new Date(new Date().setDate(new Date().getDate())),       // Yesterday
  };
  originalDataSource: UserInfo[] | undefined;
  activeTab = true;
  cachedData: any;

  constructor(
    private router: Router,
    private matdialog: MatDialog,
    private userService: UserService,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;  // Set paginator after view is initialized
    
    this.fetchPendingAdmins();
    this.dataSource.filterPredicate = (data: UserInfo, filter: string) =>
      data.cardId.toLowerCase() === filter.toLowerCase();
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;  // Set paginator after view is initialized
  }


  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }

  fetchPendingAdmins(): void {
    this.userService.pendingAdmins(this.searchTerm, this.dateRange.start, this.dateRange.end, (response: any) => {

      if (response.success && Array.isArray(response.data)) {
        this.dataSource.data = [...response.data]; // Ensures change detection
        this.cachedData = [...response.data];
        this.dataSource.paginator = this.paginator; // Set paginator after data assignment
      }
    });
  }

  approveadmin(userId: string) {
    this.dialogService.open('Admin Approval', `Are you sure you want to approve this Admin?`, '', false, 'Confirm', (() => {
      const obj = {
        userId: userId,
        status: "active",
      }
      this.userService.approveAdmin(obj, (res) => {
        if (res) {
        }
      });
    }));
  }


  logout() {
    localStorage.removeItem('userType'); // Remove userType
    localStorage.removeItem('token');
    this.router.navigate([ROUTES.WELCOME]);

  }

  applyFilter() {
    const formattedFromDate = this.dateRange.start
      ? this.formatDate(this.dateRange.start)
      : null;
    const formattedToDate = this.dateRange.end
      ? this.formatDate(this.dateRange.end)
      : null;

    this.userService.pendingAdmins(this.searchTerm, formattedFromDate, formattedToDate, (response: any) => {

      if (response.success && Array.isArray(response.data)) {
        this.dataSource.data = [...response.data]; // Ensures change detection
        this.cachedData = [...response.data];
        this.dataSource.paginator = this.paginator; // Set paginator after data assignment
      } else {
        this.dataSource.data = []
      }
    })
  }

  formatDate(date: any): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear(); // Full year

    return `${year}-${month}-${day}`;
  }

  activeForm(planName: any) {
    if (planName === "pendingAdmin") {
      this.activeTab = true;
      this.displayedColumns = [
        'cardId', 'beginTime', 'endTime', 'gender', 'userStatus', 'approval'
      ];
      this.cachedData = [];
      this.fetchPendingAdmins();
    } else {
      this.displayedColumns = [
        'cardId', 'beginTime', 'endTime', 'gender', 'userStatus'
      ];
      this.activeTab = false;
      this.cachedData = [];
      this.fetchAllAdmin();
    }
  }

  fetchAllAdmin() {
    const formattedFromDate = this.dateRange.start
      ? this.formatDate(this.dateRange.start)
      : null;
    const formattedToDate = this.dateRange.end
      ? this.formatDate(this.dateRange.end)
      : null;
    this.userService.viewAdmins(this.searchTerm, formattedFromDate, formattedToDate, (response) => {
      this.dataSource.data = [...response.data];
    })
  }
}
