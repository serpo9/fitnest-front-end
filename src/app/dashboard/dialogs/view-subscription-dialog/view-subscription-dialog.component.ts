import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-subscription-dialog',
  templateUrl: './view-subscription-dialog.component.html',
  styleUrls: ['./view-subscription-dialog.component.scss']
})
export class ViewSubscriptionDialogComponent {
  parsedFeatures: any;
  constructor(
    public dialogRef: MatDialogRef<ViewSubscriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    if (this.data?.features && typeof this.data.features === 'string') {
      let fixedJson = this.data.features.replace(/'/g, '"'); // Convert ' to "

      try {
        this.parsedFeatures = JSON.parse(fixedJson);
      } catch (error) {
        console.error("Error parsing features:", error);
        this.parsedFeatures = [this.data.features]; // Fallback: Treat it as a single feature
      }
    } else {
      this.parsedFeatures = Array.isArray(this.data.features) ? this.data.features : [this.data.features];
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}