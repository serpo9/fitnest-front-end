import { Component, Inject } from '@angular/core';
import { UserService } from '../services/user-service/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-user-classes-modal',
  templateUrl: './user-classes-modal.component.html',
  styleUrls: ['./user-classes-modal.component.scss']
})
export class UserClassesModalComponent {

  userClasses: any[] = [];
  showUserDialog = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserClassesModalComponent>

  ) {

  }

  ngOnInit() {
    this.getUserClasses();
  }

  getUserClasses() {
    this.userService.getUsersClasses(this.data.userId, (response) => {

    })
    this.userService.getUsersClasses(this.data.userId, (res) => {
      if (res.success) {
        this.userClasses = res.data;
        this.showUserDialog = true;
      } else {
        console.error('Failed to fetch user classes');
      }
    });
  }

  closeUserDialog() {
    this.dialogRef.close()

  }
}
