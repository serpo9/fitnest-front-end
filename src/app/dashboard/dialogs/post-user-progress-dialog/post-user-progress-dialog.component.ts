import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-post-user-progress-dialog',
  templateUrl: './post-user-progress-dialog.component.html',
  styleUrls: ['./post-user-progress-dialog.component.scss']
})
export class PostUserProgressDialogComponent {
  weight = 0

  constructor(
    public dialogRef: MatDialogRef<PostUserProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService
  ) {
  }

  onClose() {
    this.dialogRef.close();
  }

  postTrack() {
    const obj = {
      userId: this.data,
      weight: this.weight
    }

    this.userService.postTrackUsers(obj, (response) => {
      if (!response.success) {
        this.dialogRef.close({ data: false, message: response.message });
        return
      }

      this.dialogRef.close({ data: true });
    })
  }
}
