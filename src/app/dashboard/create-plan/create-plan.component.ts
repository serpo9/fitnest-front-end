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
    base_url = "api/fitnest/"

  purposeOptions = ['Weight Loss', 'Muscle Gain', 'Maintenance', 'General Health'];
  mealTime: string = '';
  foodName: string = '';
  foodQty: string = '';
  notes: string = '';
  activeTab = true;
  purpose = this.purposeOptions[0];

  selectedFile: any;

  adminId: string | null = null;
  userId: string | null = null;
  trainerId: any;


  constructor(
    private userService: UserService,
    private dialogService: DialogService,
    private snackBarService: SnackBarService
  ) {}


  ngOnInit(): void {
    // You can adjust how these values are assigned
    this.adminId = localStorage.getItem('adminId');
    this.userId = localStorage.getItem('userId');
    this.trainerId = localStorage.getItem('trainerId');
  }

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }



  
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    console.log(file , "here i got pdf file ")
    
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      console.log( this.selectedFile , "here i got the response  ")
  
      const formData = new FormData();
      formData.append('file', this.selectedFile); // Make sure backend expects 'file' key
  
      this.userService.uploadPlan(formData, (response) => {
        console.log("API response:", response);
  
        if (response.success) {
          this.dialogService.open('', 'Diet plan has been created!');
          this.resetForm();
        } else {
          this.snackBarService.show('Failed to create diet plan.');
        }
  
        console.log(this.selectedFile, "→ PDF file uploaded");
      });
  
    } else {
      this.snackBarService.show('Please select a valid PDF file.');
      this.selectedFile = null;
    }
  }
  
  

  createDiet(): void {
    // Correct assignment using semicolons
    this.adminId = this.userService.userRegisterData.createdByAdmin || 2;
    this.trainerId = this.userService.userRegisterData.id;
    console.log("Form inputs:", {
      adminId: this.adminId,
      trainerId: this.trainerId,
      purpose: this.purpose,
      selectedFile: this.selectedFile
    });
  
    if (!this.adminId || !this.trainerId || !this.purpose || !this.selectedFile) {
      this.dialogService.open('Missing Field', 'Please fill all required fields and upload a PDF.');
      return;
    }
  
    const formData = new FormData();
    formData.append('adminId', this.adminId);
    formData.append('trainerId', this.trainerId);
    formData.append('purpose', this.purpose);
    formData.append('pdf', this.selectedFile);

    console.log(this.selectedFile , "here is t")
    // Convert FormData to plain object for console logging
    const debugObject: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      debugObject[key] = value;
    });
    console.log("FormData being sent to backend:", debugObject);
    this.userService.createdietplan(debugObject, (response) => {
      console.log("API response:", response);
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
