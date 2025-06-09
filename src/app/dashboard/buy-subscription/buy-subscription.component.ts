import { Component, ViewChild } from "@angular/core";
import { UserService } from "src/app/services/user-service/user.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { DialogService } from "src/app/services/dialog-service/dialog.service";
import { SnackBarService } from "src/app/services/snack-bar/snack-bar.service";
import { LoadingService } from "src/app/services/loading-services/loading.service";
import jsPDF from 'jspdf';

export interface UserInfo {
  select: string;
  employeeNo: string;
  name: string;
  email: string;
  currentPlan: string;
  expiredDate: string;
}

@Component({
  selector: "app-buy-subscription",
  templateUrl: "./buy-subscription.component.html",
  styleUrls: ["./buy-subscription.component.scss"],
})
export class BuySubscriptionComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchTerm: any;
  dateRange = {
    start: new Date(new Date().setDate(new Date().getDate())),
    end: new Date(new Date().setDate(new Date().getDate())),
  };
  sidenavOpen: boolean = true;
  displayedColumns: string[] = [
    "select",
    "employeeNo",
    "name",
    "email",
    "currentPlan",
    "expiredDate"
  ];
  dataSource = new MatTableDataSource<UserInfo>([]); // Users list

  selectedUsers: Set<string> = new Set();
  subscriptionPlans: any;
  selectedPlan: any;

  selectedDuration: any;
  planprice: any;
  monthQty = 1;

  activeTab: string = "subs-plan";
  phoneNo: any;
  name: any;
  daysQty = 1;
  email: any
  visitorAmountPaid = 0;
  admissionFee : any;
  receivedAmount : number = 0;
  visitorPlans: any;
  visitorSelectedPlan: any;
  cachedData: UserInfo[] = []; // Store cached
  filteredData: UserInfo[] = []; // Store filtered data
  
  totalAmount : any;

  postObj: any;
  redirectedCustomerId : any;
  //pagiantion
  totalRecords : number = 0;
  pageSize : number = 4;
  pageIndex : number = 0;
  cachedSearchTerm: string = '';
  isFilterOn : boolean = false;
  invoicePayload : any;
  tableData : any ;

  constructor(
    private userService: UserService,
    private dialogService: DialogService,
    private snackBarService: SnackBarService,
    private loadingService: LoadingService
  ) {
    if(this.userService.redirectedCustomerId){
      this.redirectedCustomerId = this.userService.redirectedCustomerId;
      this.loadOneUser();
    }
    else this.loadUsers();
    this.membersPlans();
    this.visitorsPlans();
  }

  ngOnInit() {
    // Set the paginator after view initialization
    this.dataSource.paginator = this.paginator;
    
  }

  loadOneUser(){
      this.userService.getActiveCustomerById(this.userService.redirectedCustomerId, (response) => {
        if(response.success){
         this.cachedData = response.data;
          this.tableData = [response.data];
          this.dataSource.data =([response.data]); 
          this.toggleRowSelection(response.data);
        }
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Set paginator after view is initialized
  }

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }
  
  loadPage(event : any){
    this.pageIndex = event.pageIndex ;
    this.pageSize = event.pageSize;
    if(this.isFilterOn){
      this.applyFilter(); 
    }
    else this.loadUsers();
  }

  loadUsers() {
    const pageData = {
        page : this.pageIndex +1,
        limit : 4
    }

    this.userService.getActiveCustomers(
      "", pageData,
      (response) => {
        if (response.success) {
          this.cachedData = response.data;
          // this.dataSource.data = response.data;
          this.totalRecords = response.totalData;
          this.tableData = response.data;
          this.dataSource = new MatTableDataSource<UserInfo>(response.data); 
        }
      }
    );
  }

  resetFilters() {
    // this.dataSource.data = this.cachedData;
    this.loadUsers();
    this.isFilterOn = false;
    this.cachedSearchTerm = '';
  }

  membersPlans() {
    this.userService.getMembershipPlan((response) => {
      if (response.success) {
        this.subscriptionPlans = response.data;
        this.selectedPlan = this.subscriptionPlans[0]; // Assigning the selected plan by default to show price in the duration
        this.selectedDuration = "monthly";
        this.setAmountPaid();
      }
    });
  }

  visitorsPlans() {
    this.userService.getVisitorPlan((response) => {
      if (response.success) {
        this.visitorPlans = response.data;

        this.visitorSelectedPlan = this.visitorPlans[0]; // Assigning the selected plan by default to show price in the duration
      }
    });
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
  
  applyFilter() {
    if(!this.isFilterOn){
      if(this.searchTerm !== this.cachedSearchTerm || this.cachedSearchTerm === ''){
        this.cachedSearchTerm = this.searchTerm;
        this.pageIndex = 0;
        this.totalRecords = 0;  
      }
      this.isFilterOn = true;
    }

     const pageData = {
        page : this.pageIndex + 1,
        limit : 4
       }

    this.userService.getActiveCustomers(
      this.searchTerm,pageData,
      (response) => {
        // this.dataSource.data = response.data;
        this.dataSource = new MatTableDataSource<UserInfo>(response.data);
        this.totalRecords = response.totalData;
        this.tableData = response.data;
      }
    );
  }

  toggleRowSelection(selectedElement: any) {
    
    this.tableData.forEach((element:any) => {
    if (element !== selectedElement) {
      element.selected = false;
      this.selectedUsers.delete(element.id);
      this.dataSource.data = this.tableData;
    }
    });
    selectedElement.selected = !selectedElement.selected;

  if (selectedElement.selected) {
     this.name = selectedElement.name;
      this.phoneNo = selectedElement.phoneNumber;
      this.email = selectedElement.email;
    this.selectedUsers.clear(); 
    this.selectedUsers.add(selectedElement.id);
  } else {
    this.selectedUsers.delete(selectedElement.id);
  }
  
  console.log("slected user :", this.selectedUsers)
}

  assignSubscription(type: any) {
    const userId = Array.from(this.selectedUsers);

    if (this.selectedUsers.size === 0 || !this.selectedPlan) {
      this.dialogService.open("Oops!", "Please select a user.");
      return;
    }

    if (this.selectedUsers.size > 1) {
      this.dialogService.open(
        "Oops!",
        "Please select only one user at a time."
      );
      return;
    }

    if (type === "subs-plan") {
      this.postObj = {
        planType: "subs-plan",
        userId: userId[0],
        name: this.name,
        phoneNo: this.phoneNo,
        membershipPlansId: this.selectedPlan.id,
        selectedDuration: this.selectedDuration,
        amountPaid: this.receivedAmount,
        monthQty: this.monthQty,
        paymentStatus: "true",
        email: this.email,
        admissionFee: this.admissionFee,
      };
    }

    if (type === "visitor-plan") {


      this.postObj = {
        name: this.name,
        phoneNo: this.phoneNo,
        email: this.email,
        planType: "visitor-plan",
        userId: userId[0],
        membershipPlansId: this.visitorSelectedPlan.id,
        visitorAmountPaid: this.visitorAmountPaid,
        daysQty: this.daysQty,
        paymentStatus: "true",
      };
    }

    this.dialogService.open(
      "Confirmation!",
      "Are you sure you want to assign the plan ?",
      "",
      true,
      "Yes",
      () => {
        this.loadingService.open();
        this.userService.buyMembershipPlan(this.postObj, (response) => {
          if (!response.success) {
            this.dialogService.open(`Oops!`, `${response.message}`);
            this.loadingService.close();
            return
          }

          if (response.success) {
             this.invoicePayload = response.invoice;
            this.loadingService.close();
            this.snackBarService.showSnackBar(
              "Assigned subscription plan successfully!"
            );

            this.generateInvoicePDF(this.invoicePayload);
          }
        });
      }
    );
  }

  // Function to set amountPaid based on the selected duration
  setAmountPaid() {
    if (this.selectedPlan) {
      switch (this.selectedDuration) {
        case "monthly":
          this.planprice = this.selectedPlan.monthlyPrice;
          this.planprice = this.monthQty * this.planprice;
          break;
        case "quarterly":
          this.planprice = this.selectedPlan.quarterlyPrice;
          this.planprice = this.monthQty * this.planprice;
          break;
        case "yearly":
          this.planprice = this.selectedPlan.yearlyPrice;
          this.planprice = this.monthQty * this.planprice;
          break;
        default:
          this.planprice = null;
      }
      this.totalAmount = this.planprice;
    }
  }
  setTotalAmount(event : Event){
    this.admissionFee = ((event.target as HTMLInputElement).value);
   
    this.totalAmount = parseFloat(this.planprice) + parseFloat(this.admissionFee);
    return this.totalAmount;
  }

generateInvoicePDF(invoice: any) {
  console.log("generate : ", invoice);
  const doc = new jsPDF();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('GYM Membership Invoice', 70, 20);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const rightX = 195; 

  doc.text(`Invoice Id: ${invoice.invoiceId}`, rightX, 30, { align: 'right' });
  doc.text(`Invoice Date: ${invoice.date}`, rightX, 37, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text('Invoice To:', 15, 40);
  doc.text(invoice.customerName, 15, 47);

  doc.line(15, 52, 195, 52);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Membership Plan', 15, 65);
  doc.text('Amount', 150, 65);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.items[0].name, 15, 75);
  doc.text(`₹${invoice.items[0].price}`, 150, 75);

  doc.setFont('helvetica', 'bold');
  doc.text('Total Amount:', 15, 90);
  doc.text(`₹${invoice.total}`, 150, 90);

  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text('Thank you for choosing our gym!', 130, 130);
  doc.text('For any queries,\ncontact us at\nsupport@gym.com', 130, 135);

  doc.save(`${invoice.invoiceId}.pdf`);
}


  formatDate(date: any): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear(); // Full year

    return `${year}-${month}-${day}`;
  }

  activatePlanTab(tabName: string) {
    this.activeTab = tabName;
  }
}
