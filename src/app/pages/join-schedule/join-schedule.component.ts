import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { MessageDialogueComponent } from 'src/app/components/message-dialogue/message-dialogue.component';
import { ROUTES } from 'src/app/app-routes.config';
import { EditUserDetailsDialogComponent } from 'src/app/dashboard/dialogs/edit-user-details-dialog/edit-user-details-dialog.component';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { TrackUserDialogComponent } from 'src/app/dashboard/dialogs/track-user-dialog/track-user-dialog.component';
import { PostUserProgressDialogComponent } from 'src/app/dashboard/dialogs/post-user-progress-dialog/post-user-progress-dialog.component';
import { ViewUserProfileDialogComponent } from 'src/app/dashboard/dialogs/view-user-profile-dialog/view-user-profile-dialog.component';
import { DateRange } from '@angular/material/datepicker';


export interface UserInfo {
  id: number
  employeeNo: number
  name: string;
  number: string;
  email: string;
  type: string;
  edit: string;
  delete: string;
  joinDate: string;
  progress: string;
  postProgress: string;
  profile: string,
}

@Component({
  selector: 'app-join-schedule',
  templateUrl: './join-schedule.component.html',
  styleUrls: ['./join-schedule.component.scss']
})
export class JoinScheduleComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  sidenavOpen: boolean = true;
  selectedFilter: string = 'Search1';
  displayedColumns: string[] = ["employeeNo", 'name', 'number', 'type', 'email', 'joinDate', 'sendMessage', 'progress', 'postProgress', 'profile', 'edit', 'delete'];
  dateRange: { start: Date | null; end: Date | null } = {
    start: null,
    end: null
  };

  // dateRange = {
  //   start: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days before today
  //   end: new Date() // Today
  // };

  searchTerm: string = '';
  cachedData: UserInfo[] = []; // Store cached 
  filteredData: UserInfo[] = []; // Store filtered data

  dataSource = new MatTableDataSource<UserInfo>([]);
  userType: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private matdialog: MatDialog,
    private userService: UserService,
    private dialogService: DialogService,
    private snackbarService: SnackBarService
  ) {
    this.userType = this.userService.userRegisterData.userType;
  }

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
    const formattedFromDate = this.dateRange.start ? this.formatDate(this.dateRange.start) : null;
    const formattedToDate = this.dateRange.end ? this.formatDate(this.dateRange.end) : null;

    this.userService.getallcustomer(formattedFromDate, formattedToDate, (res) => {
      if (!res.success) {
        this.dataSource.data = [];
      } else {
        const formattedData: UserInfo[] = res.data.map((user: any) => ({
          id: user.id,
          employeeNo: user.employeeNo,
          name: user.name,
          number: user.phoneNumber || 'N/A',
          email: user.email,
          gender: user.gender || 'Not Provided',
          userStatus: 'active',
          type: user.userType,
          createdAt: user.createdAt
        }));
        if (this.cachedData.length === 0) {
          this.cachedData = formattedData;
        }
        this.filteredData = formattedData;

        this.updateTableData(this.filteredData);
      }
    });
  }

  formatDate(date: any): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear(); // Full year

    return `${year}-${month}-${day}`;
  }


  searchUsersByInputFields(searchTerm: any): void {
    this.userService.searchUser(searchTerm, (res) => {
      if (res.success) {
        const formattedData: UserInfo[] = res.data.map((user: any) => ({
          id: user.id,
          name: user.name,
          number: user.phoneNumber || 'N/A',
          email: user.email,
          gender: user.gender || 'Not Provided',
          userStatus: 'active',
          type: user.userType,
          createdAt: user.createdAt

        }));
        this.updateTableData(formattedData);
      } else {
        this.dataSource.data = [];
      }
    })
  }

  openMessageDialogue(classElement: any) {

    this.matdialog.open(MessageDialogueComponent, {
      width: '400px',
      data: classElement
    });
  }

  searchUsersByType(userType: any, fromDate: any, toDate: any): void {
    const formattedFromDate = fromDate ? this.formatDate(fromDate) : null;
    const formattedToDate = toDate ? this.formatDate(toDate) : null;
    this.searchTerm = '';
    this.userService.searchUserByType(userType, formattedFromDate, formattedToDate, (res) => {
      if (res.success) {
        const formattedData: UserInfo[] = res.data.map((user: any) => ({
          id: user.id,
          name: user.name,
          number: user.phoneNumber || 'N/A',
          email: user.email,
          gender: user.gender || 'Not Provided',
          userStatus: 'active',
          type: user.userType,
          createdAt: user.createdAt
        }));
        this.updateTableData(formattedData);
      } else {
        this.dataSource.data = [];
      }
    })
  }

  onSearchChange() {
    if (!this.searchTerm.trim()) {
      this.resetFilters(); // Call reset when input is empty
    }
  }

  resetFilters() {
    this.updateTableData(this.cachedData); // Restore cached data
  }

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }

  updateTableData(data: UserInfo[]): void {
    this.dataSource.data = data;
  }
  setActiveFilter(filter: string) {
    this.selectedFilter = filter;
  }

  approveTrainerId(userId: string) {
    this.dialogService.open('Trainer Approval', `Are you sure you want to approve ?`, '', false, 'Confirm', (() => {
      const obj = {
        userId: userId,
        status: "active",
      }
      this.userService.approveAdmin(obj, (res) => {
        if (res) {
        }
        else {
        }
      });

    }));
  }

  deleteUser(id: any) {
    this.dialogService.open('Confirmation', 'Are you sure you want to delete ?', '', true, 'Yes', (() => {

      this.userService.deleteUserByAdmin(id, (res) => {
        if (!res.success) {
          return this.snackbarService.showSnackBar('Failed to delete user!', 5000);
        }

        this.getAllActiveUser();
        this.snackbarService.showSnackBar('Deleted user successfully!', 5000);
      })

    }), 'No');
  }

  editUserDetails(userId: any) {
    this.userService.getUserByAdmin(userId, async (response) => {
      if (!response.success) {
        return this.dialogService.open('Oops!', `${response.message}`);
      }

      const mainData = await response.data;

      const dialogRef = this.matdialog.open(EditUserDetailsDialogComponent, {
        width: '500px',
        data: mainData
      })

      dialogRef.afterClosed().subscribe((result: any) => {

        if (!result.data) {
          return
        }
        this.getAllActiveUser();
      })
    })
  }

  openTrackDialogue(userId: any) {
    this.userService.fetchTrackUsers(userId, (response) => {
      if (!response.success) {
        return this.dialogService.open('Oops!', `${response.message}`)
      }

      const mainData = response.data;

      this.matdialog.open(TrackUserDialogComponent, {
        width: '800px',
        data: mainData
      })
    })
  }
  viewUserProfile(user: any) {
    this.router.navigate(['view-profile'], { state: { userData: user } });
  }

  exportToExcel(): void {

    const formattedFromDate = this.dateRange.start ? this.formatDate(this.dateRange.start) : null;
    const formattedToDate = this.dateRange.end ? this.formatDate(this.dateRange.end) : null;

    this.userService.getallcustomer(formattedFromDate, formattedToDate, (res) => {
      if (!res.success) {
        return this.dialogService.open('Oops!', `${res.message}`);
      } else {
        const formattedData: UserInfo[] = res.data.map((user: any) => ({
          id: user.id,
          name: user.name,
          number: user.phoneNumber || 'N/A',
          email: user.email,
          gender: user.gender || 'Not Provided',
          userStatus: 'active',
          type: user.userType,
          createdAt: user.createdAt
        }));
        if (this.cachedData.length === 0) {
          this.cachedData = formattedData;
        }
        this.filteredData = formattedData;


        const fileName = 'users.xlsx';

        // Create worksheet
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);

        // Create workbook and add worksheet
        const workbook: XLSX.WorkBook = {
          Sheets: { 'Users': worksheet },
          SheetNames: ['Users']
        };

        // Generate Excel buffer
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Save to file
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(data, fileName);


      }
    });
  }

  postProgress(id: any) {

    const dialogRef = this.matdialog.open(PostUserProgressDialogComponent, {
      width: '400px',
      data: id
    })

    dialogRef.afterClosed().subscribe((result: any) => {

      if (!result?.data) {
        this.dialogService.open("Oops!", `${result.message}`)
      }

    })

  }


}