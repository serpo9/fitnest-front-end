import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
@Component({
  selector: 'app-edit-schedule',
  templateUrl: './edit-schedule.component.html',
  styleUrls: ['./edit-schedule.component.scss']
})
export class EditScheduleComponent {
  editedSchedule: any;


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogService: DialogService,
    private snackbarService: SnackBarService,
    public dialogRef: MatDialogRef<EditScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.editedSchedule = { ...this.data.scheduleData };

  }



  onSave() {

    if (!this.data.scheduleData.assignedClass || !this.data.scheduleData.startfrom || !this.data.scheduleData.endTime || !this.editedSchedule.capacity
    ) {
      console.error('All fields are required');
      return;
    }

    const obj = {
      className: this.editedSchedule.assignedClass,
      startfrom: this.editedSchedule.startfrom,
      capacity: this.editedSchedule.capacity,
      endTime: this.editedSchedule.endTime
    }
    this.userService.editSchedule(obj, this.data.scheduleData.id, (response) => {
      if (response.success) {

        this.dialogRef.close(this.editedSchedule);
        this.snackbarService.showSnackBar('Updated the plan', 3000);
      } else {
        console.error('Error Updating Membership Plan:', response.message);
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  trackByFn(index: number, item: string): number {
    return index; // Ensures Angular only updates the specific input instead of rerendering all
  }

  onDateChange(event: any) {
    if (event) {
      this.editedSchedule.startfrom = this.formatDate(event);
    }
  }


  formatDate(date: any): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear(); // Full year

    return `${year}-${month}-${day}`;
  }


}
