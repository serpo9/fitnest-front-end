import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-edit-subscription-dialog',
  templateUrl: './edit-subscription-dialog.component.html',
  styleUrls: ['./edit-subscription-dialog.component.scss']
})
export class EditSubscriptionDialogComponent {

  @ViewChild('planNameInput') nameInput!: ElementRef;
  @ViewChild('descriptionInput') emailInput!: ElementRef;
  @ViewChild('statusInput') phoneInput!: ElementRef;

  @ViewChild('monthlyPriceInput') bloodGroupInput!: ElementRef;
  @ViewChild('quarterlyPriceInput') heightInput!: ElementRef;
  @ViewChild('yearlyPriceInput') fitnessGoalsInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditSubscriptionDialogComponent>,
    private userService: UserService,
    private dialogService: DialogService,
    private snackbarService: SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    if (typeof this.data.features === 'string') {
      this.data.features = JSON.parse(this.data.features);
    }
  }

  addFeature() {
    this.data.features.push('');
  }

  removeFeature(index: number) {
    this.data.features.splice(index, 1);
  }

  onSave() {

    if (!this.data.planName || !this.data.description || !this.data.features ||
      this.data.includesPersonalTrainer === undefined || this.data.includesGroupClasses === undefined ||
      this.data.monthlyPrice === undefined || this.data.quarterlyPrice === undefined ||
      this.data.yearlyPrice === undefined || this.data.extraPersonalTrainerFee === undefined ||
      this.data.extraGroupClassFee === undefined || this.data.status === undefined) {
      this.dialogService.open('Oops!', 'All fields are required')
      return;
    }

    const obj = {
      planName: this.data.planName,
      description: this.data.description,
      features: JSON.stringify(this.data.features),
      includesPersonalTrainer: this.data.includesPersonalTrainer,
      includesGroupClasses: this.data.includesGroupClasses,
      monthlyPrice: this.data.monthlyPrice,
      quarterlyPrice: this.data.quarterlyPrice,
      yearlyPrice: this.data.yearlyPrice,
      extraPersonalTrainerFee: this.data.extraPersonalTrainerFee,
      extraGroupClassFee: this.data.extraGroupClassFee,
      status: this.data.status,
      planType: this.data.planType
    };

    this.userService.updateMembershipPlan(this.data.id, obj, (response) => {
      if (response.success) {
        this.dialogRef.close({data: response.data});
        this.snackbarService.showSnackBar('Updated the plan', 3000);
        // this.dialogService.open('', 'Updated the subscription plan successfully!');
      } else {
        console.error('Error Updating Membership Plan:', response.message);
      }
    });
  }

  close() {
    this.dialogRef.close({data: undefined});
  }

  trackByFn(index: number, item: string): number {
    return index; // Ensures Angular only updates the specific input instead of rerendering all
  }
}
