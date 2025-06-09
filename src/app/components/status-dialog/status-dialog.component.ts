import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user-service/user.service';
@Component({
  selector: 'app-status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.scss'],
})
export class StatusDialogComponent {
  updatedStatus: string = '';

  constructor(
    public dialogRef: MatDialogRef<StatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private userService: UserService,
  ) {
  }
  


  ngOnInit(): void {
  }
  

  closeDialog(): void {
    this.dialogRef.close();
  }

  changeStatus(userStatus:any): void {
    const newStatus = 'Approved'; // New status
   let obj ={
      trainerId:this.data.trainerId,
      status:userStatus
    }

    

    this.userService.updateTrainerStatus(obj, (response) => {
      if (response.success) {
        if (response.success) {
          this.dialogRef.close( response.status);
        }
      }
    })


  }
}
