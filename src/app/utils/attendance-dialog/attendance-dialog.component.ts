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
  userId : any;
  adminId : any;
  constructor(public dialogRef: MatDialogRef<AttendanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService : UserService,
    private cdr: ChangeDetectorRef) {
      this.manageDates(data);
      console.log(data , "dataa a a")
      this.userId = data[0].userId;
      this.adminId = data[0].adminId;
    }
manageDates(data: any) {
  this.presentDates = [];
  this.absentDates = [];
  this.noData = [];

  data.forEach((entry: any) => {
    const dateStr = new Date(entry.time).toDateString();
    if (entry.status === 'Present') {
      this.presentDates.push(dateStr);
    } else if (entry.status === 'Absent') {
      this.absentDates.push(dateStr);
    } else {
      this.noData.push(dateStr);
    }
  });
}
getIndividualAttendance(userId: any) {
  const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2); 
  const day = (`0${date.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};
  this.userService.getIndividualAttendance(
    this.adminId,this.userId,
    formatLocalDate(this.fromDate),
    formatLocalDate(this.toDate),
    response => {
      this.manageDates(response.data);
      this.data = response.data;

      
      if (this.calendar) {
        this.calendar.updateTodaysDate();
      }

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
