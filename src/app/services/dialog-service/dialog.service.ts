import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/utils/dialog/dialog.component';
import { EditProfileDialogComponent } from 'src/app/utils/edit-profile-dialog/edit-profile-dialog.component';
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }
  private dialogRef: MatDialogRef<DialogComponent> | null = null;

  private forceShowEnabled: boolean = false;
  

  forceShow() {
    this.forceShowEnabled = true;
    return this;
  }

  open(
    title: string,
    message: string,
    imageUrl: string | null = null,
    doubleBtn: boolean = false,
    defaultBtnText: string = 'Okay',
    onPressDefaultButton?: () => void,
    otherBtnText: string = 'Cancel',
    onPressOtherButton?: () => void,
    linkToOpen?:string,
    showStatus?: string
  ) {
    // If there is already a dialog
    if (this.showDuplicateDialgWarning(this.dialogRef)) {
      if (!this.forceShowEnabled) {
        return;

      }
      this.dialogRef?.close();
      this.forceShowEnabled = false;
    }

    this.dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title,
        message,
        imageUrl,
        doubleBtn,
        defaultBtnText,
        otherBtnText,
        onPressDefaultButton,
        onPressOtherButton,
        linkToOpen,
        showStatus
      },
    });

    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        onPressDefaultButton?.(); // Call the function if it exists
      } else {
        onPressOtherButton?.(); // Call the function if it exists
      }
      this.dialogRef = null;
    });
  }


  private showDuplicateDialgWarning(alreadyDialogExist: any) {
    if (alreadyDialogExist) {
      console.warn(
        'Duplicate Dialog Request',
        "Already showing a dialog, if you want to show a new dialog then use 'forceShow()' before calling showDialoge"
      );
    }
    return alreadyDialogExist;
  }
  openProfileEditDialog(data: any): any {
    return this.dialog.open(EditProfileDialogComponent, {
      width: '400px',
      data: data,
    }).afterClosed();
  }
  

}
