import { Component, Inject } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-edit-user-details-dialog',
  templateUrl: './edit-user-details-dialog.component.html',
  styleUrls: ['./edit-user-details-dialog.component.scss']
})
export class EditUserDetailsDialogComponent {

  showErrorMsg = false;
  password: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private dialogRef: MatDialogRef<EditUserDetailsDialogComponent>,
    private snackbarService: SnackBarService,) {
  }

  update() {
    let obj: any = {
      userId: this.data.id,
      name: this.data.name,
      email: this.data.email,
      phoneNumber: this.data.phoneNumber
    }

    if (this.password?.trim()) {  // check if password is non-empty
      obj.password = this.password;
    }

    this.userService.updateUserByAdmin(obj, (response) => {
      if (!response.success) {
        this.showErrorMsg = true
      }

      this.dialogRef.close({ data: true });
      this.snackbarService.showSnackBar('Updated the Details', 3000);
    })
  }

  close() {
    this.dialogRef.close({ data: undefined });
  }
}
