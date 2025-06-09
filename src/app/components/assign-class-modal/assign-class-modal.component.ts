import { Component, EventEmitter, Output, OnInit,Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user-service/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';


@Component({
  selector: 'app-assign-class-modal',
  templateUrl: './assign-class-modal.component.html',
  styleUrls: ['./assign-class-modal.component.scss']
})
export class AssignClassModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  classes: any[] = [];
  loading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private userService: UserService,
    private snackbarService: SnackBarService,
    private dialogRef: MatDialogRef<AssignClassModalComponent>
  ) {}

  ngOnInit() {
    this.fetchClasses();
    console.log("data from the active users ",this.data)
  }

  fetchClasses() {
      this.userService.getSchedules((res) => {
        if (!res.success) {
          console.error('Error fetching classes', );
        this.loading = false;
        } else {
          console.log(res,"response");
          this.classes = res.data;
        this.loading = false;
        }
      });
  }

  assign(classItem: any) {
    let obj ={
      userId: this.data.userId
    }
     this.userService.assignUserToClass(obj, classItem.class_id,(response)=>{
     this.dialogRef.close(response)  
     this.snackbarService.showSnackBar('Assigned class successfully', 3000);
   
})
    //  this.dialogRef.close(response)
  }
  close() {
    this.dialogRef.close();
  }

}
