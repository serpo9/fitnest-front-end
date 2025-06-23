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
  select: string;
  name: string;
  email: string;
  phoneno: string;
  planStatus?: string | null;
  
}


@Component({
  selector: 'app-diet-plan',
  templateUrl: './diet-plan.component.html',
  styleUrls: ['./diet-plan.component.scss']
})
export class DietPlanComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchTerm: string = '';
  dateRange = {
    // start: new Date(new Date().setDate(new Date().getDate())), 
    start: null, 
    end: null, 
  };
  sidenavOpen: boolean = true;
  pdfFiles: any[] = [];
  userTypeFilter = 'active'

  
  displayedColumns: string[] = [
    "select",
    "employeeNo",
    "name",
    "email",
    "phoneno",
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
    this.viewdietplans()
    this.getSubscribedUsers()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Set paginator after view is initialized
  }

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }

  
  pageIndex : number = 1;
  loadUsers() {
    const pageData = {
        page : this.pageIndex,
        limit : 7
       }
    const formattedFromDate = this.dateRange.start
      ? this.formatDate(this.dateRange.start)
      : null;
    const formattedToDate = this.dateRange.end
      ? this.formatDate(this.dateRange.end)
      : null;

      console.log("formattedFromDate...", formattedFromDate);
      
      console.log("formattedToDate...", formattedToDate);
      

    this.userService.getActiveCustomers(
      "", pageData,
      (response) => {
        if (response.success) {
          if (this.cachedData?.length === 0) {
            this.cachedData = response.data;
          }
          this.updateTableData(response.data)
        }
      }
    );
  }

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

  // applyFilter() {
  //   const pageData = {
  //       page : this.pageIndex,
  //       limit : 7
  //      }
  //   const formattedFromDate = this.dateRange.start
  //     ? this.formatDate(this.dateRange.start)
  //     : null;
  //   const formattedToDate = this.dateRange.end
  //     ? this.formatDate(this.dateRange.end)
  //     : null;
  //   this.userService.getActiveCustomers(
  //     this.searchTerm,pageData,
  //     (response) => {
  //       this.dataSource.data = response.data;
  //     }
  //   );
  // }

  toggleRowSelection(element: any) {
    element.selected = !element.selected; // Toggle the selected state of the clicked row
    if (element.selected) {

      this.selectedUsers.add(element.id); // Add user to selected list
    } else {
      this.selectedUsers.delete(element.id); // Remove user from selected list
    }
  }

  // formatDate(date: any): string {
  //   const d = new Date(date);
  //   const day = String(d.getDate()).padStart(2, "0");
  //   const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  //   const year = String(d.getFullYear()).slice(-2); // Get last 2 digits of year

  //   return `${day}-${month}-${year}`;
  // }

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

  activeForm(planName: any) {
    if (planName === "createDiet") {
      this.activeTab = true;
      this.displayedColumns = [
        "select",
        "employeeNo",
        "name",
        "email",
        "phoneno",
      ];
      this.cachedData = [];
      this.loadUsers();

    } else {
      this.activeTab = false;
      this.displayedColumns = [
        "employeeNo",
        "name",
        "email",
        "phoneno",
        "mealType",
        "quantity",
        "time",
        "notes"
      ]; // <-- 'assign' excluded when activeTab is false
      this.cachedData = [];
      this.viewDiet();
    }
  }

  viewDiet() {
    this.userService.viewDiet((response) => {
      console.log("response..", response);

      if (!response.success) {
        return this.dialogService.open('Oops!', `${response.message}`);
      }

      this.updateTableData(response.data);
    })
  }
  viewdietplans() {
    this.userService.getplanspdf((response) => {
      if (!response.error && response.data) {
        this.pdfFiles = response.data.map((file: any) => ({
          ...file,
          name: file.name.replace(/^\d+-/, '')  // Removes "1-" or any digits followed by "-"
        }));
      }
      console.log(this.pdfFiles, "Cleaned PDF file names");
    });
  }
  
  openPDF(url: string): void {
    const fullUrl = `http://localhost:8000${url}`;
    window.open(fullUrl, '_blank');
  }

  // sendSelectedPDFs(){
  //   console.log("hi ")
  // }


  // sendSelectedPDFs(): void {
  //   // Get selected users from the dataSource
  //   const selectedUsers = this.dataSource.data.filter((user: any) => user.selected);
  
  //   // Get selected PDFs from the pdfFiles array
  //   const selectedPDFs = this.pdfFiles.filter((pdf: any) => pdf.selected);
  //   // Log both to console
  //   console.log('Selected Users:', selectedUsers);
  //   console.log('Selected PDFs:', selectedPDFs);

  // }
  sendSelectedPDFs(): void {
    const selectedUsers = this.dataSource.data.filter((user: any) => user.selected);
    console.log(selectedUsers ,"here i got response ")
    const selectedPDFs = this.pdfFiles.filter((pdf: any) => pdf.selected);
  
    // Just send first PDF and first user (for now)
    if (selectedUsers.length === 0 || selectedPDFs.length === 0) {
      //  alert('Please select a user and PDF');
       return  this.dialogService.open('Oops!', `Please select a user and PDF`);
    }
    
    const selectedUser = selectedUsers[0];
    const selectedPDF = selectedPDFs[0];
    const formattedPdfName = selectedPDF.name.replace(/\s+/g, '-');
  
    this.userService.assignPlanToUsers({
      trainerId: selectedUser.id,
      adminId: selectedUser.createdByAdmin,
      username: selectedUser.name,
      userid: selectedUser.id,
      pdfname: formattedPdfName
    }, (response: any) => {
      if(!response.success){
        this.dialogService.open('Oops!', response.message);
      }
      else{
        this.dialogService.open('Yeah!', response.message);
      }
    });
  }
  
  formatDate(date: any): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear(); // Full year

    return `${year}-${month}-${day}`;
  }

  getSubscribedUsers() {
    const formattedDateRange = {
      dateFrom: null,
      dateTo: null,
    };
    
    const filterValue = this.searchTerm?.trim() || '';
  
    this.userService.viewSubsUsers(
      filterValue,
      formattedDateRange.dateFrom,
      formattedDateRange.dateTo,
      this.userTypeFilter,
      (response) => {
        this.updateTableData(response.data);
      }
    );
  }
  applyFilter(): void {
    this.getSubscribedUsers()
  
  }
  selectSinglePDF(selectedPdf: any) {
    this.pdfFiles.forEach(pdf => {
      pdf.selected = (pdf === selectedPdf);
    });
  }
  

    updateTableData(data: UserInfo[]): void {
      this.dataSource.data = data;
    }
  
  
  
}
