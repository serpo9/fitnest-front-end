import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
interface locations {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-registergym',
  templateUrl: './registergym.component.html',
  styleUrls: ['./registergym.component.scss']
})
export class RegistergymComponent {
submissionStatus: boolean | null = null;  // true for success, false for failure
  submissionMessage: string = '';
  sidenavOpen: boolean = true;
  amount: number | null = null; 
  showNewForm = false;  // Controls which form is shown
  
  className = '';
  description = '';
  duration = '';
  time = '';
  selectedDate:string = '';
  gymName = '';
  userName = '';
  password = '';
  devicePurpose = '';

  trainerName = '';
  classType = '';
  scheduleDate = '';
  scheduleTime = '';

  userKey: string = ''; // Store the input value
  locations: locations[] = [
    { value: 'entry_gate', viewValue: 'Entry Gate' },
    { value: 'cardio_session', viewValue: 'Cardio Session' },
    { value: 'yoga_session', viewValue: 'Yoga Session' },
    { value: 'personal_session', viewValue: 'Personal Trainer' }
  ];


  constructor(private http: HttpClient) {}

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }


  onSubmit() {
    if (!this.gymName || !this.userName || !this.password || !this.devicePurpose) {
      alert("Please fill all required fields.");
      return;
    }
  }

  
   
 // Handle second form submission
    onAssignSchedule() {
      if (!this.trainerName || !this.classType || !this.scheduleDate || !this.scheduleTime) {
        alert("Please fill all required fields.");
        return;
      }
      
      alert("Schedule Assigned Successfully!");
    }
  
  addnewUser(cardNo: string, employeeNo: string): void {
    const apiUrl = 'http://localhost:8000/api/hikvision/addNewCard';
    const payload = { cardNo, employeeNo };
  
    this.http.post(apiUrl, payload).subscribe({
      next: (response) => {
        this.submissionMessage = `Card ID ${this.userKey} added successfully!`;
        // You can handle the successful response here if needed
      },
      error: (error) => {
        console.error('API Error:', error);
  
        // Handle the error from the API call
        this.submissionStatus = false;
        if (error && error.error && error.error.message) {
          // Assuming the error has a 'message' field from the API response
          this.submissionMessage = `Error: ${error.error.message}`;
        } else {
          // If there's no specific message from the API, show a general error message
          this.submissionMessage = 'An error occurred while adding the card. Please try again.';
        }
      },
    });
  }
  toggleForm() {
    this.showNewForm = !this.showNewForm;  // Toggle the form when the button is clicked
  }

  


 
  

}
