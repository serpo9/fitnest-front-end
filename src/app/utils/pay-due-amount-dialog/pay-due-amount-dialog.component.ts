import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-pay-due-amount-dialog',
  templateUrl: './pay-due-amount-dialog.component.html',
  styleUrls: ['./pay-due-amount-dialog.component.scss']
})
export class PayDueAmountDialogComponent implements OnInit {
  constructor(
    private userService : UserService,
    public dialogRef: MatDialogRef<PayDueAmountDialogComponent>,
    private dialog : DialogService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any){
       
    }
    paymentForm!: FormGroup;
    payAmount : any;

    ngOnInit(): void {
       this.paymentForm = this.fb.group({
          payAmount: [
            0,
            [
              Validators.required,
              Validators.min(2)
            ]
          ]
        });
    }
    onSubmit(): void {
    if (this.paymentForm.valid) {
      this.updateDueAmount();
    } else {
      this.paymentForm.markAllAsTouched();
    }
  }
  updateDueAmount(){
    const payAmount = this.getpayAmount();
    const postObj = {
      purchaseHistoryId : this.data.purchaseHistoryId,
      membershipPlansId : this.data.purchasedPlanData.membershipPlansId,
      userId : this.data.purchasedPlanData.userId,
      payAmount : payAmount,
      purchaseDate : this.data.purchasedPlanData.purchaseDate
    }
    this.userService.updateAmountDue(postObj,response=>{
      if(response.success){
        this.dialog.open('','Payment Successfull', '',false , 'Okay');
        this.dialogRef.close(postObj);
      }
      else this.dialog.open('Oops',`${response.message}`, '',false , 'Okay');
      
    })
  }

  getpayAmount() {
    return this.paymentForm.get('payAmount')?.value;
  }
  
get payAmountControl() {
  return this.paymentForm.get('payAmount');
}

}
