import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';
import { AssignClassModalComponent } from 'src/app/components/assign-class-modal/assign-class-modal.component';
import { UserClassesModalComponent } from 'src/app/user-classes-modal/user-classes-modal.component';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { MessageDialogueComponent } from 'src/app/components/message-dialogue/message-dialogue.component';

export interface UserInfo {
  id: number | string;
  cardId: string
  name: number;
  number: any;
  selectedFilter: 'all';
  // employeeNo: string;
  email: string;
  plan: string;
  startdate: string;
  endDate: string;
  payamount: any;
  duration: string;
  sendMessage: string;
}

@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.scss']
})

export class ActiveUsersComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  sidenavOpen: boolean = true;
  selectedFilter: string = 'Search1';
  totalPayAmount: any;

  displayedColumns: string[] = [
    // 'employeeNo',
    "cardId",
    'name',
    'number',
    'email',
    'plan',
    'startdate',
    'endDate',
    'duration',
    'payamount',
    'sendMessage',
    'assign',
    'view',
  ];

  dateRange = {
    start: new Date(new Date().setDate(new Date().getDate())), 
    end: new Date(new Date().setDate(new Date().getDate())), 
  };

  dataSource = new MatTableDataSource<UserInfo>([]);
  searchTerm: string = '';
  originalDataSource: UserInfo[] | undefined;
  userTypeFilter = 'active'

  constructor(private http: HttpClient, private router: Router, private matdialog: MatDialog, private userService: UserService,) { }

  ngOnInit(): void {
    // this.dateRange = {
    //   start: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days before today
    //   end: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
    // };
    this.dataSource.paginator = this.paginator;

    // this.hitPostApi();
    // this.loadLocalStorageData();

    // this.CustomerSubscriptionplan('all')

    // this.dataSource.filterPredicate = (data: UserInfo, filter: string) =>
    //   data.cardId.toLowerCase() === filter.toLowerCase();

    this.getSubscribedUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;  // Set paginator after view is initialized
  }


  loadLocalStorageData(): void {
    const storedData = localStorage.getItem('userList'); // Retrieve the userList from localStorage
    if (storedData) {
      try {
        const userInfoData: UserInfo[] = JSON.parse(storedData); // Parse the data
        this.updateTableData(userInfoData); // Update the table data
      } catch (e) {
        console.error('Error parsing localStorage data:', e);
      }
    } else {
    }
  }

  openClassPopup(classElement: any) {
    const dialogRef = this.matdialog.open(AssignClassModalComponent, {
      width: '400px',
      data: classElement
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result, "result on the active member page")
        // classElement.trainer = result.trainerName;
      }
    });
  }

  openUsersClassesPopup(classElement: any) {
    const dialogRef = this.matdialog.open(UserClassesModalComponent, {
      width: '400px',
      data: classElement
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result, "result on the active member page")
        // classElement.trainer = result.trainerName;
      }
    });
  }

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }

  updateTableData(data: UserInfo[]): void {
    this.dataSource.data = data;
  }

  applyFilter(): void {
    const formattedDateRange = {
      dateFrom: this.formatDate(this.dateRange.start),
      dateTo: this.formatDate(this.dateRange.end),
    };

    const filterValue = this.searchTerm.trim();

    this.userService.viewSubsUsers(filterValue, formattedDateRange.dateFrom, formattedDateRange.dateTo, this.userTypeFilter, (response) => {
      this.updateTableData(response.data)
    })
  }

  activeOrExpiredUser(userType: any) {
    const formattedDateRange = {
      dateFrom: this.formatDate(this.dateRange.start),
      dateTo: this.formatDate(this.dateRange.end),
    };
    const filterValue = this.searchTerm.trim();
    this.userTypeFilter = userType;

    this.userService.viewSubsUsers(filterValue, formattedDateRange.dateFrom, formattedDateRange.dateTo, this.userTypeFilter, (response) => {
      this.updateTableData(response.data)
    })
  }

  CustomerSubscriptionplan(duration: any): void {
    this.selectedFilter = duration;
    this.userService.getCustomerSubscriptionplan(duration, (res) => {
      if (!res.success) {
      } else {


        const formattedData: UserInfo[] = res.data.map((Schedules: any) => ({
          id: Schedules.employee_no,
          name: Schedules.customer_name,
          number: Schedules.customer_phone || 'N/A',
          email: Schedules.customer_email,
          plan: Schedules.class_name || 'Not Provided',
          startdate: Schedules.start_date || 'Not Provided',
          time: Schedules.class_duration_hours || 'Pending',  // Ensure this matches "status" in TrainerInfo
          duration: Schedules.class_duration_months || 'Pending',  // Ensure this matches "status" in TrainerInfo
          remainingday: Schedules.class_duration_months || 'Pending',  // Ensure this matches "status" in TrainerInfo
          payamount: parseFloat(Schedules.amount_paid) || 0// Ensure this matches "status" in TrainerInfo
        }));
        // **Calculate total amount paid**
        this.totalPayAmount = formattedData.reduce((sum, user) => sum + user.payamount, 0);

        this.dataSource.data = formattedData;
        this.dataSource.paginator = this.paginator; // Assign paginator
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

  getSubscribedUsers() {
    const formattedDateRange = {
      dateFrom: this.formatDate(this.dateRange.start),
      dateTo: this.formatDate(this.dateRange.end),
    };
    this.userService.viewSubsUsers(this.searchTerm, formattedDateRange.dateFrom, formattedDateRange.dateTo,this.userTypeFilter, (response) => {
      this.updateTableData(response.data)
    })
  }

  exportToExcel(): void {

    const formattedDateRange = {
      dateFrom: this.formatDate(this.dateRange.start),
      dateTo: this.formatDate(this.dateRange.end),
    };
    this.userService.viewSubsUsers(this.searchTerm, formattedDateRange.dateFrom, formattedDateRange.dateTo, this.userTypeFilter, (response) => {

      if (!response.success) {
        return
      }


      const fileName = 'users.xlsx';

      // Create worksheet
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(response.data);

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

    })

  }

  openMessageDialogue(classElement: any) {

    this.matdialog.open(MessageDialogueComponent, {
      width: '400px',
      data: classElement
    });
  }

  

}

