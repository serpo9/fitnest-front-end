import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { UserService } from "src/app/services/user-service/user.service";
import { DialogService } from "src/app/services/dialog-service/dialog.service";
import { ROUTES } from "src/app/app-routes.config";
import { AssignSalaryDialogComponent } from "src/app/components/assign-salary-dialog/assign-salary-dialog.component";
import { StatusDialogComponent } from "src/app/components/status-dialog/status-dialog.component";
import { TrainerClassesModalComponent } from "src/app/trainer-classes-modal/trainer-classes-modal.component";
import { SalaryDataDialogComponent } from "src/app/utils/salary-data-dialog/salary-data-dialog.component";

export interface UserInfo {
  name: string;
  number: string;
  email: string;
  salary: string;
  userType: string;
  effectiveFrom: string;
}

@Component({
  selector: 'app-salary-management',
  templateUrl: './salary-management.component.html',
  styleUrls: ['./salary-management.component.scss']
})
export class SalaryManagementComponent {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  sidenavOpen: boolean = true;
  selectedFilter: string = "Search1";
  displayedColumns: string[] = [
    "name",
    "number",
    "email",
    "salary",
    "type",
    "effective",
    "assign",
  ];


  dateRange = {
    start: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days before today
    end: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
  };
  searchTerm: string = "";
  cachedData: UserInfo[] = []; // Store cached
  filteredData: UserInfo[] = []; // Store filtered data
  dataSource = new MatTableDataSource<UserInfo>([]);
  activeTab = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private matdialog: MatDialog,
    private userService: UserService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    // this.getAllActiveUser();
    this.getStaff();
    this.dataSource.paginator = this.paginator;
    this.loadLocalStorageData();
    this.dataSource.filterPredicate = (data: UserInfo, filter: string) =>
      data.name.toLowerCase() === filter.toLowerCase();
  }

  loadLocalStorageData(): void {
    const storedData = localStorage.getItem("userList");
    if (storedData) {
      try {
        const userInfoData: UserInfo[] = JSON.parse(storedData);
        this.updateTableData(userInfoData);
      } catch (e) {
        console.error("Error parsing localStorage data:", e);
      }
    } else {
    }
  }

  formatDate(date: any): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear(); // Full year

    return `${year}-${month}-${day}`;
  }


  openAssignSalaryPopUp(classElement: any) {
    const dialogRef = this.matdialog.open(AssignSalaryDialogComponent, {
      width: '400px',
      data: classElement
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        classElement.salary = result.salaryAmount;
        classElement.effectiveFrom = result.effectiveFrom;
      }
    });
  }


  openStatusDialog(element: any): void {
    let message = '';

    if (element.userStatus === 'pending') {
      message = `Are you sure you want to verify  ${element.name}?`;
    } else if (element.userStatus === 'active') {
      message = `Do you want to deactivate  ${element.name}?`;
    } else if (element.userStatus === 'inactive') {
      message = `Do you want to activate  ${element.name}?`;
    }

    // const dialogRef = this.matdialog.open(StatusDialogComponent, {
    //   width: "400px",
    //   data: { 
    //     trainerId: element.id, 
    //     userStatus: element.userStatus, 
    //     message 
    //   }, // ✅ Send dynamic message based on status
    // });

    // dialogRef.afterClosed().subscribe((updatedStatus) => {
    //   if (updatedStatus) {
    //     element.userStatus = updatedStatus; // ✅ Instantly update UI after status change
    //   }
    // });
  }



  getAllActiveUser(): void {
    this.userService.getallcustomer("", "", (res) => {
      if (!res.success) {
      } else {
        const formattedData: UserInfo[] = res.data.map((user: any) => ({
          id: user.id,
          name: user.name,
          number: user.phoneNumber || "N/A",
          email: user.email,
          gender: user.gender || "Not Provided",
          userStatus: "active",
          specialization: user.specialization,
        }));
        this.updateTableData(formattedData);
      }
    });
  }
  getStaff(): void {
    let fromDate = this.dateRange.start;
    let toDate = this.dateRange.end;

    const formattedFromDate = fromDate ? this.formatDate(fromDate) : null;
    const formattedToDate = toDate ? this.formatDate(toDate) : null;

    this.userService.getStaffWithSalary(
      this.searchTerm,
      (res) => {
        if (!res.success) {
        } else {
          const formattedData: UserInfo[] = res.data.map((user: any) => ({
            id: user.id,
            name: user.name,
            number: user.phoneNumber || "N/A",
            email: user.email,
            userType: user.userType,
            salary: user.salaryAmount || "N/A",
            effectiveFrom: user.effectiveFrom || "N/A"
          }));
          if (this.cachedData.length === 0) {
            this.cachedData = formattedData;
          }
          this.filteredData = formattedData;

          this.updateTableData(formattedData);
        }
      }
    );
  }

  getAllStaffByname(search: any): void {
    let fromDate = this.dateRange.start;
    let toDate = this.dateRange.end;

    let formattedFromDate = fromDate ? this.formatDate(fromDate) : null;
    let formattedToDate = toDate ? this.formatDate(toDate) : null;
    
    if (search) {
      formattedFromDate = null;
      formattedToDate = null;
    }
    this.userService.getStaffWithSalary(
      search,
      (res) => {
        if (!res.success) {
          this.dataSource.data = [];
        } else {
          const formattedData: UserInfo[] = res.data.map((user: any) => ({
            id: user.id,
            name: user.name,
            number: user.phoneNumber || "N/A",
            email: user.email,
            userType: user.userType,
            salary: user.salaryAmount || null,
            effectiveFrom: user.effectiveFrom
          }));

          this.updateTableData(formattedData);
        }
      }
    );
  }

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }

  updateTableData(data: UserInfo[]): void {
    this.dataSource.data = data;
  }
  setActiveFilter(filter: string) {
    this.selectedFilter = filter;
  }

  approveTrainerId(userId: string) {
    this.dialogService.open(
      "Trainer Approval",
      `Are you sure you want to approve ?`,
      "",
      false,
      "Confirm",
      () => {
        const obj = {
          userId: userId,
          status: "active",
        };
        this.userService.approveAdmin(obj, (res) => {
          if (res) {
          } else {
          }
        });
      }
    );
  }

  joinClass(element: any): void {
    this.router.navigate([`register-classs`, element.id]); // Correct way to pass ID
  }

  onSearchChange() {
    if (!this.searchTerm.trim()) {
      this.resetFilters(); // Call reset when input is empty
    }
  }

  resetFilters() {
    this.updateTableData(this.cachedData); // Restore cached data
  }


  activeForm(planName: any) {
    if (planName === "assignsalary") {
      this.activeTab = true;
      this.displayedColumns = [
        "name",
        "number",
        "email",
        "salary",
        "type",
        "effective",
        "assign"
      ];
      this.cachedData=[];
      this.getStaff();
    } else {
      this.activeTab = false;
      this.displayedColumns = [
        "name",
        "number",
        "email",
        "salary",
        "type",
        "effective",
         "pay"

      ]; // <-- 'assign' excluded when activeTab is false
      this.cachedData=[];
      this.fetchSalaryOfStaffs();
    }
  }

  fetchSalaryOfStaffs() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const obj = {
      month: month,
      year: year
    }

    this.userService.calculateSalary('', obj, (response) => {
      this.updateTableData(response.data)
      this.cachedData=response.data
    })
  }

  applyFilter(searchTerm: any) {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const obj = {
      month: month,
      year: year
    }

    const searchPhoneNumber = searchTerm.trim();
    
    this.userService.calculateSalary(searchPhoneNumber, obj, (response) => {
      this.updateTableData(response.data)
    })
  }

  openSalaryDataDialog(element : any){
    const dialogRef = this.matdialog.open(SalaryDataDialogComponent,{
      data : element,
      
    })

    dialogRef.afterClosed().subscribe(result=>{
    
      if(result){
        this.dialogService.open('',`${result.message}`,'',false,'Okay');
      }
    })
  }
}
