import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { UserService } from "src/app/services/user-service/user.service";
import { DialogService } from "src/app/services/dialog-service/dialog.service";
import { ROUTES } from "src/app/app-routes.config";
import { StatusDialogComponent } from "src/app/components/status-dialog/status-dialog.component";
import { TrainerClassesModalComponent } from "src/app/trainer-classes-modal/trainer-classes-modal.component";

export interface UserInfo {
  name: string;
  number: string;
  email: string;
  status: string;
  specialization:string;
  scheduleClass: string;
  viewScheduleClass: string;
}

@Component({
  selector: "app-trainer",
  templateUrl: "./trainer.component.html",
  styleUrls: ["./trainer.component.scss"],
})
export class TrainerComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  sidenavOpen: boolean = true;
  selectedFilter: string = "Search1";
  displayedColumns: string[] = [
    "name",
    "number",
    "email",
    "status",
    "specialization",
    "viewScheduleClass",
  ];
 

  dateRange = {
    start: '', // 7 days before today
    end: '', // Tomorrow
    // end: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
  };
  searchTerm: string = "";
  cachedData: UserInfo[] = []; // Store cached
  filteredData: UserInfo[] = []; // Store filtered data
  dataSource = new MatTableDataSource<UserInfo>([]);

  constructor(
    private http: HttpClient,
    private router: Router,
    private matdialog: MatDialog,
    private userService: UserService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    // this.getAllActiveUser();
    this.getAllTrainer();
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


  openTrainerClassesPopup(classElement: any) {
    const dialogRef = this.matdialog.open(TrainerClassesModalComponent, {
      width: '400px',
      data: classElement
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // classElement.trainer = result.trainerName;
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
  
    const dialogRef = this.matdialog.open(StatusDialogComponent, {
      width: "400px",
      data: { 
        trainerId: element.id, 
        userStatus: element.userStatus, 
        message 
      }, // ✅ Send dynamic message based on status
    });
  
    dialogRef.afterClosed().subscribe((updatedStatus) => {
      if (updatedStatus) {
        element.userStatus = updatedStatus; // ✅ Instantly update UI after status change
      }
    });
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
          specialization:user.specialization,
        }));

        this.updateTableData(formattedData);
      }
    });
  }
  getAllTrainer(): void {
    let fromDate = this.dateRange.start;
    let toDate = this.dateRange.end;

    const formattedFromDate = fromDate ? this.formatDate(fromDate) : null;
    const formattedToDate = toDate ? this.formatDate(toDate) : null;
    this.userService.getalltrainer(
      formattedFromDate,
      formattedToDate,
      (res) => {
        if (!res.success) {
        } else {
          const formattedData: UserInfo[] = res.data.map((user: any) => ({
            id: user.id,
            name: user.name,
            number: user.phoneNumber || "N/A",
            email: user.email,
            gender: user.gender || "Not Provided",
            userStatus: user.status,
            specialization:user.specialization,
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

  getAllTrainerByStatus(status: any, search: any): void {
    let fromDate = this.dateRange.start;
    let toDate = this.dateRange.end;

    let formattedFromDate = fromDate ? this.formatDate(fromDate) : null;
    let formattedToDate = toDate ? this.formatDate(toDate) : null;
    if (search) {
      formattedFromDate = null;
      formattedToDate = null;
    }
    this.userService.getallTrainerByStatus(
      formattedFromDate,
      formattedToDate,
      status,
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
            gender: user.gender || "Not Provided",
            userStatus: user.status,
            specialization:user.specialization,
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
}
