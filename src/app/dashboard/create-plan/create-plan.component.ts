import { Component } from "@angular/core";
import { UserService } from "src/app/services/user-service/user.service";
import { DialogService } from "src/app/services/dialog-service/dialog.service";
import { SnackBarService } from "src/app/services/snack-bar/snack-bar.service";
import { HttpParams } from "@angular/common/http";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.scss']
})
export class CreatePlanComponent {
  sidenavOpen: boolean = true;

  purposeOptions = ['Weight Loss', 'Muscle Gain', 'Maintenance', 'General Health'];
  workoutPurposeOptions = [
    'Strength Training',
    'Cardio Endurance',
    'Flexibility & Mobility',
    'Fat Burn',
    'Bodybuilding',
    'Rehabilitation',
    'General Fitness'
  ];
  workoutPurpose: string = '';
  mealTime: string = '';
  foodName: string = '';
  foodQty: string = '';
  notes: string = '';
  purpose: string = '';
  activeTab = true;
  // purpose = this.purposeOptions[0];
  selectedFile: File | null = null;
  trainerId: any;


  constructor(
    private userService: UserService,
    private dialogService: DialogService,
    private snackBarService: SnackBarService,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    // This is where you'd typically get the trainerId
    this.trainerId = localStorage.getItem('trainerId') || 'defaultTrainer'; // Provide a fallback
  }

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }
  // Method to capture the selected file from the input
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const trainerId = this.userService.userRegisterData.id;
     const planpurpose = this.purpose
    // this.purpose = 'weightloss'; // <-- set or bind dynamically based on your form
  
    if (file && file.type === 'application/pdf') {
      const customFileName = `${trainerId}-${planpurpose}.pdf`;
  
      // Create a new file with the custom name
      const renamedFile = new File([file], customFileName, { type: file.type });
  
      this.selectedFile = renamedFile;
      console.log('Renamed file:', this.selectedFile.name);
    } else {
      alert('Only PDF files are allowed.');
      event.target.value = null;
    }
  }
  
  uploadResume(): void {
    if (!this.selectedFile) {
      alert('Please select a PDF file first.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
  
    this.http.post('http://localhost:8000/api/fitnest/upload-pdf', formData).subscribe({
      next: (response: any) => {
        this.dialogService.open('Yeah!', 'File uploaded successfully!');
        console.log(response);
        this.selectedFile = null;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.error.message || 'Upload failed.');
        console.error('Upload error:', error);
      }
    });
  }
  
  
  

  createDiet() {
    if (!this.purpose || !this.selectedFile) {
      this.dialogService.open('Missing Field', 'Please select a purpose and upload a PDF file.');
      return;
    }
  
    const formData = new FormData();
    formData.append('purpose', this.purpose);
    formData.append('pdf', this.selectedFile);
  
    this.userService.createDietChart(formData, (response) => {
      if (response.success) {
        this.dialogService.open('', 'Diet plan has been created!');
        this.resetForm();
      } else {
        this.snackBarService.show('Failed to create diet plan.');
      }
    });
  }
  
  uploadPdfAndCreateDiet(): void {
    if (!this.selectedFile) {
      this.dialogService.open('No File', 'Please select a PDF file to upload.');
      return;
    }
  
    if (!this.trainerId) {
      this.snackBarService.show('Trainer ID is missing. Cannot upload file.');
      return;
    }
  
    // Prepare FormData and append 'file' (as required by backend)
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
  
    // Call the service method
    this.userService.uploadPlan(formData,
      (response) => {
        console.log('PDF uploaded successfully:', response);
        this.dialogService.open('Success', 'PDF file uploaded!');
        this.selectedFile = null;
  
        // Reset the file input
        const fileInput = document.getElementById('pdfFileInput') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      },
   
    );
  }
  

  

resetForm(): void {
  this.purpose = this.purposeOptions[0];
  this.selectedFile = null;
}

}
