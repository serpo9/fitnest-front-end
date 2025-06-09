import { Component, Inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";


@Component({
  selector: 'app-view-user-profile-dialog',
  templateUrl: './view-user-profile-dialog.component.html',
  styleUrls: ['./view-user-profile-dialog.component.scss']
})
export class ViewUserProfileDialogComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ViewUserProfileDialogComponent>) {

  }

  onClose() {
    this.dialogRef.close();
  }
}
