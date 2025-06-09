import { Component,Inject } from '@angular/core';
import { UserService } from '../services/user-service/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-trainer-classes-modal',
  templateUrl: './trainer-classes-modal.component.html',
  styleUrls: ['./trainer-classes-modal.component.scss']
})
export class TrainerClassesModalComponent {
  userClasses: any[] = [];
  showUserDialog = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService:UserService,
    private dialogRef: MatDialogRef<TrainerClassesModalComponent>
  
  ){
  
  }
  
  ngOnInit() {
    this.getUserClasses();
    console.log("data from the active users ",this.data.id)
  }
  
  getUserClasses() {
    this.userService.getTrainerClasses(this.data.id,(res)=>{
      if (res.success) {
        this.userClasses = res.data;
        this.showUserDialog = true;
        console.log("this,userclasses",this.userClasses);
      } else {
        console.error('Failed to fetch user classes');
      }
    });
  }
  
  closeUserDialog() {
    this.dialogRef.close()
    
  }

}
