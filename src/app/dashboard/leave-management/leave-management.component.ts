import { Component, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { Router } from '@angular/router';

export interface UserInfo {
  select: string;
  employeeNo: string;
  name: string;
  email: string;
  phone: string;
  type: string;
}

@Component({
  selector: 'app-leave-management',
  templateUrl: './leave-management.component.html',
  styleUrls: ['./leave-management.component.scss']
})
export class LeaveManagementComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchTerm: string = '';
  dateRange = {
    start: "null",
    end: "null" // Today
  };
  sidenavOpen: boolean = true;
  displayedColumns: string[] = ['select', 'employeeNo', 'name', 'email', 'phone', 'type'];
  dataSource = new MatTableDataSource<UserInfo>([]); // Users list

  selectedUsers: Set<string> = new Set();
  leaveTypes = [{ holiday: 'Public-holiday' }, { holiday: 'Private-holiday' }];
  selectedHoliday: any;

  dayQty = 1;
  leaveDate: any;
  selectedDates: Date[] = [];

  activeTab = true;

  constructor(private userService: UserService, private dialogService: DialogService, private snackBarService: SnackBarService, private router: Router) {
    this.activeStaffs();
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }

  applyFilter() {
    const formattedFromDate = this.dateRange.start ? this.formatDate(this.dateRange.start) : null;
    const formattedToDate = this.dateRange.end ? this.formatDate(this.dateRange.end) : null;

    const filterValue = this.searchTerm.trim();

    if (this.activeTab) {
      this.userService.getActiveStaffs(filterValue, formattedFromDate, formattedToDate, (response) => {
        this.updateTableData(response.data);
      })
    } else {
      this.userService.leaveDetails(filterValue, formattedFromDate, formattedToDate, (response) => {
        this.updateTableData(response.data);
      })
    }
  }

  toggleRowSelection(element: any) {
    element.selected = !element.selected; // Toggle the selected state of the clicked row
    if (element.selected) {
      this.selectedUsers.add(element.id); // Add user to selected list
    } else {
      this.selectedUsers.delete(element.id); // Remove user from selected list
    }
  }

  activeStaffs() {
    const formattedFromDate = this.dateRange.start ? this.formatDate(this.dateRange.start) : null;
    const formattedToDate = this.dateRange.end ? this.formatDate(this.dateRange.end) : null;

    const filterValue = this.searchTerm.trim();

    this.userService.getActiveStaffs(filterValue, formattedFromDate, formattedToDate, (response) => {
      this.updateTableData(response.data);
    })
  }

  updateTableData(data: UserInfo[]): void {
    this.dataSource.data = data;
  }


  dateClass = (d: Date): string => {
    const time = d.setHours(0, 0, 0, 0);
    return this.selectedDates.some(date => date.setHours(0, 0, 0, 0) === time)
      ? 'selected-date'
      : '';
  }

  toggleDate(date: Date) {
    const index = this.selectedDates.findIndex(
      d => d.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0)
    );
    if (index >= 0) {
      this.selectedDates.splice(index, 1); // Deselect
    } else {
      this.selectedDates.push(date); // Add new
    }
  }

  removeDate(date: Date) {
    this.selectedDates = this.selectedDates.filter(
      d => d.setHours(0, 0, 0, 0) !== date.setHours(0, 0, 0, 0)
    );
  }

  approveLeave() {

    const userId = Array.from(this.selectedUsers);

    if (this.selectedUsers.size === 0) {
      this.dialogService.open('Oops!', 'Please select a user.');
      return;
    }

    if (this.selectedUsers.size > 1) {
      this.dialogService.open('Oops!', 'Please select only one user at a time.');
      return;
    }

    if (!this.leaveTypes || this.selectedDates.length === 0 || !this.dayQty) {
      this.dialogService.open('Oops!', 'Please Check all the fields!');
      return
    }

    const formattedDates = this.selectedDates.map(date => date.toISOString().split('T')[0]);

    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    let obj = {
      userId: userId[0],
      month: month,
      year: year,
      leaveDate: JSON.stringify(formattedDates),
    }

    let addingObj;
    if (this.selectedHoliday?.holiday === "Public-holiday") {
      addingObj = {
        ...obj,
        publicHolidays: this.dayQty,
        privateOffDays: 0
      }
    } else {
      addingObj = {
        ...obj,
        publicHolidays: 0,
        privateOffDays: this.dayQty
      }
    }

    this.userService.manageLeave(addingObj, (response) => {
      if (response.success) {
        this.dialogService.open('Congratulations', 'Leave permission has been approved!', '', false, 'Okay', (() => {
          this.router.navigate(['/all-users']);
        }))
      }

    })
  }

  activeForm(planName: any) {
    if (planName === "assignLeave") {
      this.activeTab = true;
      this.displayedColumns = [
        'select', 'employeeNo', 'name', 'email', 'phone', 'type'
      ];
      this.activeStaffs();
    } else {
      this.activeTab = false;
      this.displayedColumns = [
        'employeeNo', 'name', 'email', 'phone', 'type', 'leaveDate', 'leaveType'
      ];
      this.leaveDetails();
    }
  }


  leaveDetails() {

    const formattedFromDate = this.dateRange.start ? this.formatDate(this.dateRange.start) : "null";
    const formattedToDate = this.dateRange.end ? this.formatDate(this.dateRange.end) : "null";

    console.log("formattedToDate...", this.formatDate(this.dateRange.start));

    const filterValue = this.searchTerm.trim();

    this.userService.leaveDetails(filterValue, formattedFromDate, formattedToDate, (response) => {
      this.updateTableData(response.data);
    })
  }

  formatDate(date: any): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear(); // Full year

    return `${year}-${month}-${day}`;
  }

  onSearchChange() {
    if (!this.searchTerm.trim()) {
      if (this.activeTab) {
        this.activeStaffs();
      } else {
        this.leaveDetails();
      }
    }
  }


}