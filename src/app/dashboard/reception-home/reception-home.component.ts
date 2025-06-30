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

export interface UserInfo {
  userid: string
  name: string;
  number: string;
  email: string;
  type: string;
  delete: string;
  joinDate: string;
  progress: string;
  postProgress: string;
}

@Component({
  selector: 'app-reception-home',
  templateUrl: './reception-home.component.html',
  styleUrls: ['./reception-home.component.scss']
})
export class ReceptionHomeComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  sidenavOpen: boolean = true;
  selectedFilter: string = 'all';
  displayedColumns: string[] = ["userid", 'name', 'number', 'type', 'email', 'joinDate', 'sendMessage', 'progress', 'postProgress'];

  dateRange: { start: Date | null; end: Date | null } = {
    start: null,
    end: null
  };
  searchTerm: string = '';
  cachedData : any = []; // Store cached 
  filteredData : any = []; // Store filtered data

  dataSource : any = new MatTableDataSource([]);


  constructor(
    private http: HttpClient,
    private router: Router,
    private matdialog: MatDialog,
    private userService: UserService,
    private dialogService: DialogService,
    private snackbarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.dateRange = {
      start: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days before today
      end: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
    };
    this.dataSource.paginator = this.paginator;
    this.activeTab('all');
    // this.dataSource.filterPredicate = (data: UserInfo, filter: string) =>
    //   data.name.toLowerCase() === filter.toLowerCase();
  }

  activeTab(tabName : any){
    if(tabName === 'all'){
      this.displayedColumns = ["userid", 'name', 'number', 'type', 'email', 'joinDate', 'sendMessage', 'progress', 'postProgress'];
      this.setActiveFilter('all');
      this.getAllActiveUser();
    }
    else if(tabName === 'expired'){
      this.displayedColumns = ['id', 'name', 'mail', 'number', 'plan', 'expireDate','renew'];
      this.setActiveFilter('expired');
      this.getExpiredUser();
    }
    else if(tabName === 'expiringSoon'){
      this.displayedColumns = ['id', 'name', 'mail', 'number', 'plan', 'expireDate','renew'];
      this.setActiveFilter('expiringSoon');
      this.getExpiringSoonUser();
    }
  }
  

  getExpiredUser(){
    this.dataSource.data = []
  }

  getExpiringSoonUser() {
    const fromDate = this.dateRange.start?.toISOString().split('T')[0];
    const toDate = this.dateRange.end?.toISOString().split('T')[0];
    const filterValue = this.searchTerm.trim();

    this.userService.getExpiringUsersPlans(filterValue, fromDate, toDate, (response) => {
      if(response.success && response.data.length > 0) {
        this.updateTableData(response.data);
      }
      else{
        this.dataSource.data = [];
       }
    })
  }

  getAllActiveUser(): void {
    const formattedFromDate = this.dateRange.start ? this.formatDate(this.dateRange.start) : null;
    const formattedToDate = this.dateRange.end ? this.formatDate(this.dateRange.end) : null;

    this.userService.getallcustomerforRecpt(formattedFromDate, formattedToDate, (res) => {
      if (!res.success) {
        this.dataSource.data = [];
      } else {
        const formattedData = res.data.map((user: any) => ({
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
        this.updateTableData(formattedData);
        // this.updateTableData(this.filteredData);
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

  updateTableData(data: any): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
  }
  setActiveFilter(filter: string) {
    this.selectedFilter = filter;
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

  exportToExcel(): void {

    const formattedFromDate = this.dateRange.start ? this.formatDate(this.dateRange.start) : null;
    const formattedToDate = this.dateRange.end ? this.formatDate(this.dateRange.end) : null;

    this.userService.getallcustomerforRecpt(formattedFromDate, formattedToDate, (res) => {
      if (!res.success) {
        return this.dialogService.open('Oops!', `${res.message}`);
      } else {
        const formattedData = res.data.map((user: any) => ({
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

    })

  }
}
