import { Component, ViewChild } from "@angular/core";
import { UserService } from "src/app/services/user-service/user.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { DialogService } from "src/app/services/dialog-service/dialog.service";
import { SnackBarService } from "src/app/services/snack-bar/snack-bar.service";

export interface UserInfo {
  id: any;
  createdByAdmin: any;
  username: any;
  employeeNo: string;
  // select: string;
  name: string;
  email: string;
  phoneno: string;
  planStatus?: string | null;
  
}
@Component({
  selector: 'app-assigned-users',
  templateUrl: './assigned-users.component.html',
  styleUrls: ['./assigned-users.component.scss']
})
export class AssignedUsersComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
   searchTerm: string = '';
 dateRange = {
    start: null, 
    end: null, 
  };
   sidenavOpen: boolean = true;
   pdfFiles: any[] = [];
   userTypeFilter = 'active'
 
   displayedColumns: string[] = [
    // "select",
    "id",
    "username",
    "userid",
    "pdfname",
    "createdAt"
  ];
  
   dataSource = new MatTableDataSource<UserInfo>([]); // Users list
 
   selectedUsers: Set<string> = new Set();
 
   cachedData: UserInfo[] = []; // Store cached
   filteredData: UserInfo[] = []; // Store filtered data
 
   postObj: any;
   mealTypeOptions = ['breakfast', 'lunch', 'snacks', 'dinner'];
   mealType = this.mealTypeOptions[0]; // default selection
   mealTime: any;
   foodName: any;
   foodQty: any;
   notes: any;
fromDate?: string;
toDate?: string;
   userRegisterData: any;
 
   constructor(
     private userService: UserService,
     private dialogService: DialogService,
     private snackBarService: SnackBarService
   ) {
     // this.loadUsers();
   }
 
   ngOnInit() {
     // Set the paginator after view initialization
     this.dataSource.paginator = this.paginator;
     this.getSubscribedUsers()
   }
 
   ngAfterViewInit() {
     this.dataSource.paginator = this.paginator; // Set paginator after view is initialized
   }
 
   onSidenavToggle(sidenavState: boolean): void {
     this.sidenavOpen = sidenavState;
   }
 
   
   pageIndex : number = 1;
 
 
   resetFilters() {
     this.dataSource.data = this.cachedData;
   }
 
   toggleUserSelection(userId: string) {
     this.selectedUsers.has(userId)
       ? this.selectedUsers.delete(userId)
       : this.selectedUsers.add(userId);
   }
 
   onSearchChange() {
     if (!this.searchTerm.trim()) {
       this.resetFilters(); // Call reset when input is empty
     }
   }
 
 
 
   toggleRowSelection(element: any) {
     element.selected = !element.selected; // Toggle the selected state of the clicked row
     if (element.selected) {
 
       this.selectedUsers.add(element.id); // Add user to selected list
     } else {
       this.selectedUsers.delete(element.id); // Remove user from selected list
     }
   }
 
  
 
   createDiet() {
     const userId = Array.from(this.selectedUsers);
 
     if (this.selectedUsers.size === 0) {
       this.dialogService.open('Oops!', 'Please select a user.');
       return;
     }
 
     const obj = {
       userId: userId[0],
       mealType: this.mealType,
       time: this.mealTime,
       foodName: this.foodName,
       quantity: this.foodQty,
       notes: this.notes
     }
 
     // Check if any value is empty (excluding notes if optional)
     const requiredFields: (keyof typeof obj)[] = ['mealType', 'time', 'foodName', 'quantity'];
     const emptyField = requiredFields.find(field => !obj[field]);
 
     if (emptyField) {
       this.dialogService.open('Missing Field', `Please fill in the ${emptyField}.`);
       return;
     }
 
     this.userService.createDietChart(obj, (response) => {
       if (response.success) {
         this.dialogService.open('', `Diet plan has been created!`);
       }
     })
 
   }
 
   activeTab = true;
 
  
 

   
  //  formatDate(date: any): string {
  //    const d = new Date(date);
  //    const day = String(d.getDate()).padStart(2, '0');
  //    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  //    const year = d.getFullYear(); // Full year
 
  //    return `${year}-${month}-${day}`;
  //  }
getSubscribedUsers(fromDate?: string, toDate?: string): void {
  this.userService.getAssignedUsers(
    (response) => {
      if (response?.success) {
        this.updateTableData(response.data);
      }
    },
    undefined,
    this.searchTerm,
    fromDate,
    toDate,
    this.userTypeFilter
  );
}

updateTableData(data: UserInfo[]): void {
  this.dataSource.data = data;
}

// Optional utility function
formatDate(date: Date): string {
  return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
}
applyFilter(): void {
  // Format dates if needed (e.g., to 'YYYY-MM-DD')
  const fromDate = this.dateRange.start ? this.formatDate(this.dateRange.start) : undefined;
  const toDate = this.dateRange.end ? this.formatDate(this.dateRange.end) : undefined;

  this.getSubscribedUsers(fromDate, toDate);
}


 }