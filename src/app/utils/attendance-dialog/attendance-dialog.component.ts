import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user-service/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';

@Component({
  selector: 'app-attendance-dialog',
  templateUrl: './attendance-dialog.component.html',
  styleUrls: ['./attendance-dialog.component.scss']

})
export class AttendanceDialogComponent {
  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;
  presentDates: string[] = [];
  absentDates: string[] = [];
  noData: string[] = [];

  fromDate!: Date;
  toDate!: Date;

  userId: any;
  adminId: any;

  calendarActiveDate: any = new Date();

  constructor(public dialogRef: MatDialogRef<AttendanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private cdr: ChangeDetectorRef) {

    const today = new Date();


    this.fromDate = data.fromDate;

    // Today as the toDate
    this.toDate = data.toDate;

    // 📅 Parse passed fromDate
    // Show the mat-calendar on the first day (so the current month is displayed)
    // this.calendarActiveDate = new Date(today.getFullYear(), today.getMonth(), 1);

    this.calendarActiveDate = new Date(data.fromDate); // jump to that date
    this.manageDates(data.attendance);
    this.userId = data.attendance[0].userId;
    this.adminId = data.attendance[0].adminId;

    // this.getIndividualAttendance();
  }

  ngAfterViewInit(): void {
    this.calendar.activeDate = new Date(this.fromDate); // ✅ jump
    this.cdr.detectChanges();
  }

  manageDates(data: any) {
    this.presentDates = [];
    this.absentDates = [];
    this.noData = [];

    // Fill presentDates
    data.forEach((entry: any) => {
      if (entry.status === 'Present') {
        const dateStr = new Date(entry.time).toDateString();
        this.presentDates.push(dateStr);
      }
    });

    // Use toDate as the end of the loop
    const endDate = new Date(this.toDate);
    let current = new Date(this.fromDate);

    while (current <= endDate) {
      const dateStr = current.toDateString();

      if (!this.presentDates.includes(dateStr)) {
        this.absentDates.push(dateStr); // mark red
      }

      current.setDate(current.getDate() + 1); // increment by one day
    }
  }



  getIndividualAttendance() {
    this.userService.getIndividualAttendance(
      this.adminId, this.userId,
      this.fromDate,
      this.toDate,
      response => {
        this.manageDates(response.data);
        this.data = response.data;

        if (this.calendar) {
          this.calendar.updateTodaysDate();
        }

        this.calendarActiveDate = new Date(this.fromDate);
        this.cdr.detectChanges();
      }
    );
  }



  dateClass = (date: Date) => {
    const dateStr = date.toDateString();

    if (this.presentDates.includes(dateStr)) {
      return 'present-date';
    } else if (this.absentDates.includes(dateStr)) {
      return 'absent-date';
    } else {
      return 'no-data-date'; // style this uniquely
    }
  };

}
