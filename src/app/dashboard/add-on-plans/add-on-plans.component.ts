import { Component, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

export interface UserInfo {
  select: string;
  name: string;
  email: string;
  currentPlan: string;
}

@Component({
  selector: 'app-add-on-plans',
  templateUrl: './add-on-plans.component.html',
  styleUrls: ['./add-on-plans.component.scss']
})
export class AddOnPlansComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchTerm: any;
  dateRange = {
    start: null,
    // start: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days before today
    // end: new Date() // Today
    end: null // Today
  };
  sidenavOpen: boolean = true;
  displayedColumns: string[] = ['select', 'name', 'email', 'currentPlan'];
  dataSource = new MatTableDataSource<UserInfo>([]); // Users list

  selectedUsers: Set<string> = new Set();
  subscriptionPlans: any;
  selectedPlan: any;

  selectedDuration: any
  amountPaid: any;

  constructor(private userService: UserService, private dialogService: DialogService, private snackBarService: SnackBarService) {
    this.loadUsers();
    this.getAllPlans();
  }

  ngOnInit() {
    // Set the paginator after view initialization
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;  // Set paginator after view is initialized
  }

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }
  pageIndex : number = 1;
  loadUsers() {
    const pageData = {
        page : this.pageIndex,
        limit : 9
       }
    const formattedFromDate = this.dateRange.start ? this.formatDate(this.dateRange.start) : null;
    const formattedToDate = this.dateRange.end ? this.formatDate(this.dateRange.end) : null;

    this.userService.getActiveCustomers(this.searchTerm, pageData,(response) => {
      this.dataSource.data = response.data;
    })
  }

  getAllPlans() {
    this.userService.getMembershipPlan((response) => {
      if (response.success) {
        this.subscriptionPlans = response.data;

        this.selectedPlan = this.subscriptionPlans[0] // Assigning the selected plan by default to show price in the duration
        this.selectedDuration = "monthly"
        this.setAmountPaid();
      }

    })
  }

  toggleUserSelection(userId: string) {
    this.selectedUsers.has(userId) ? this.selectedUsers.delete(userId) : this.selectedUsers.add(userId);
  }


  applyFilter() {

  }

  toggleRowSelection(element: any) {
    element.selected = !element.selected; // Toggle the selected state of the clicked row
    if (element.selected) {
      this.selectedUsers.add(element.id); // Add user to selected list
    } else {
      this.selectedUsers.delete(element.id); // Remove user from selected list
    }
  }

  assignSubscription() {

    const userId = Array.from(this.selectedUsers);
    if (this.selectedUsers.size === 0 || !this.selectedPlan) {
      this.dialogService.open('Oops!', 'Please select a user.');
      return;
    }

    const obj = {
      userId: userId[0],
      membershipPlansId: this.selectedPlan.id,
      selectedDuration: this.selectedDuration,
      amountPaid: this.amountPaid,
      paymentStatus: 'true'
    }

    this.dialogService.open('Confirmation!', 'Are you sure you want to assign the plan ?', '', true, 'Yes', (() => {
      this.userService.buyMembershipPlan(obj, (response) => {
        if (!response.success) {
          this.dialogService.open(`Oops!`, `${response.message}`)
        }

        this.snackBarService.showSnackBar('Assigned subscription plan successfully!');

      })
    }))


  }

  // Function to set amountPaid based on the selected duration
  setAmountPaid() {
    if (this.selectedPlan) {
      switch (this.selectedDuration) {
        case "monthly":
          this.amountPaid = this.selectedPlan.monthlyPrice;
          break;
        case "quarterly":
          this.amountPaid = this.selectedPlan.quarterlyPrice;
          break;
        case "yearly":
          this.amountPaid = this.selectedPlan.yearlyPrice;
          break;
        default:
          this.amountPaid = null;
      }
    }

  }

  formatDate(date: any): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = String(d.getFullYear()).slice(-2); // Get last 2 digits of year

    return `${day}-${month}-${year}`;
  }
}
