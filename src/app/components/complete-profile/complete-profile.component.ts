import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faMultiply } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user-service/user.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss']
})
export class CompleteProfileComponent {
  fitnessForm: any;
  bloodGroups: string[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  fitnessGoal: string[] = ['Weight loose', 'Strength Training', 'Endurance', 'Gain Weight'];
  faMultiply = faMultiply;
  showFormErrLabel = false;
  userId: any;

  constructor(private fb: FormBuilder, private matDialog: MatDialog, private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CompleteProfileComponent>,
  ) {

    this.fitnessForm = this.fb.group({
      bloodGroup: ['', Validators.required],
      bodyWeight: ['', [Validators.required, Validators.min(1)]],
      height: ['', [Validators.required, Validators.min(30)]],
      fitnessGoals: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required]
    });

    this.userId = data.userId;

  }

  onSubmit() {
    if (this.fitnessForm.valid) {

      const obj = {
        userId: this.userId,
        bloodGroup: this.fitnessForm.value.bloodGroup,
        height: this.fitnessForm.value.height,
        weight: this.fitnessForm.value.bodyWeight,
        fitnessGoals: this.fitnessForm.value.fitnessGoals,
        dateOfBirth: this.fitnessForm.value.dob,
        gender: this.fitnessForm.value.gender
      }

      this.userService.completeProfile(obj, (response) => {

        if (response.success) {
          this.dialogRef.close({ success: true, data: obj });
        }

      })

    } else {
      this.showFormErrLabel = true;
    }
  }

  closeDialog() {
    this.matDialog.closeAll();
  }

}
