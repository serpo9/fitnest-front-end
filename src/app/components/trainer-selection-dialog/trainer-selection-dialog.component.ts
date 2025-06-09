import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { UserService } from "src/app/services/user-service/user.service";
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';


@Component({
  selector: "app-trainer-selection-dialog",
  templateUrl: "./trainer-selection-dialog.component.html",
  styleUrls: ["./trainer-selection-dialog.component.scss"],
})
export class TrainerSelectionDialogComponent {
  selectedTrainer: number | null = null;
  trainersBySpecialization: any;
  specializations: string[];

  constructor(
    public dialogRef: MatDialogRef<TrainerSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private userService: UserService,
    private snackbarService: SnackBarService,

  ) {
    this.trainersBySpecialization = data.trainersBySpecialization;
    this.specializations = Object.keys(this.trainersBySpecialization);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  assignTrainer(): void {
    let classId = this.data.classData.id;
    let obj = {
      trainerId: this.selectedTrainer,
    };
    this.userService.assignTrainer(obj,classId, (response) => {
      if (response.success) {
        if (response.success) {
          this.dialogRef.close(response);
          this.snackbarService.showSnackBar('Assigned Trainer Successfully', 3000);

        }
      }
    });
  }
}
