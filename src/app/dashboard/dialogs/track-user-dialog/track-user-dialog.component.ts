import { Component, Inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

export interface UserInfo {
  name: string;
  number: string;
  type: string;
  month: string;
  weight: string;
}

@Component({
  selector: 'app-track-user-dialog',
  templateUrl: './track-user-dialog.component.html',
  styleUrls: ['./track-user-dialog.component.scss']
})

export class TrackUserDialogComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TrackUserDialogComponent>) {
    if (data && data.length) {
      this.dataSource.data = data;
    }
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;  // Set paginator after view is initialized
  }
  
  displayedColumns: string[] = ['name', 'number', 'type', 'month', 'weight'];
  dataSource = new MatTableDataSource<UserInfo>([]);

  onClose() {
    this.dialogRef.close();
  }

}
