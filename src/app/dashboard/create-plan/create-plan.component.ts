import { Component } from "@angular/core";
import { UserService } from "src/app/services/user-service/user.service";
import { DialogService } from "src/app/services/dialog-service/dialog.service";
import { SnackBarService } from "src/app/services/snack-bar/snack-bar.service";

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.scss']
})


export class CreatePlanComponent {
  sidenavOpen: boolean = true;

  purposeOptions = ['Weight Loss', 'Muscle Gain', 'Maintenance', 'General Health'];
  mealTime: string = '';
  foodName: string = '';
  foodQty: string = '';
  notes: string = '';
  activeTab = true;
  purpose = this.purposeOptions[0];
  selectedFile: File | null = null;

  constructor(
    private userService: UserService,
    private dialogService: DialogService,
    private snackBarService: SnackBarService
  ) {}

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
    }
  }
  

  createDiet() {
    if (!this.purpose || !this.selectedFile) {
      this.dialogService.open('Missing Field', 'Please select a purpose and upload a PDF file.');
      return;
    }
  
    const formData = new FormData();
    formData.append('purpose', this.purpose);
    formData.append('pdf', this.selectedFile); // 'pdf' must match multer's field name
  
    // Optional: Append additional fields if needed in the future
    // formData.append('adminId', this.adminId);
    // formData.append('userId', this.userId);
  
    this.userService.createdietplan(formData, (response) => {
      console.log(response, "API response");
      if (response.success) {
        this.dialogService.open('', 'Diet plan has been created!');
        this.resetForm();
      } else {
        this.snackBarService.show('Failed to create diet plan.');
      }
    });
  }
  
  

  resetForm(): void {
    this.purpose = this.purposeOptions[0];
    this.selectedFile = null;
  }
  
}
