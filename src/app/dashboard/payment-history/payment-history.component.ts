import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver'; import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';

export interface UserInfo {
  employeeNum: string;
  name: string;
  date: string;
  mail: string;
  phone: Number;
  type: string;
  presentDays: Number,
  amount: Number,
  admissionFee: Number
}

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent {


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  sidenavOpen: boolean = true;
  displayedColumns: string[] = ['employeeNum', 'name', 'mail', 'phone', 'type', 'date', 'amount', 'admissionFee'];
  searchTerm: string = '';
  selectedFilter = 'SubscriptionHistory';

  dateRange = {
    start: new Date(new Date().setDate(new Date().getDate())), // 1 days before yesterday
    end: new Date(new Date().setDate(new Date().getDate())),       // Yesterday
  };

  dataSource = new MatTableDataSource<UserInfo>([]);
  presentCount: any;

  totalAmount = 0;

  constructor(
    private userService: UserService,
    private dialogService: DialogService
  ) {
console.log("this.selectedFilter...", this.selectedFilter);

    if (this.selectedFilter === "SalaryHistory") {
      this.getSalaryHistory();
    } else {
      this.getSubsHistory();
    }

  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;  // Set paginator after view is initialized
  }

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }

  updateTableData(data: UserInfo[]): void {
    this.dataSource.data = data;
  }

  applyFilter(): void {
    const fromDate = this.dateRange.start.toISOString().split('T')[0];
    const toDate = this.dateRange.end.toISOString().split('T')[0];
    const filterValue = this.searchTerm.trim();

    this.userService.getSalaryHistory(filterValue, fromDate, toDate, (response) => {
      this.totalAmount = response.totalAmount;
      this.updateTableData(response.data);
    })
  }

  searchPaymentHistoryByDate() {
    const startDate = new Date(this.dateRange.start);
    const endDate = new Date(this.dateRange.end);

    // Reset the time to midnight in the local time zone
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    console.log('here at 91')

    // Get the formatted date (YYYY-MM-DD) using toLocaleDateString
    const fromDate = startDate.toLocaleDateString('en-CA'); // This format gives YYYY-MM-DD
    const toDate = endDate.toLocaleDateString('en-CA');     // This format gives YYYY-MM-DD

    const filterValue = this.searchTerm.trim();

    this.userService.getSalaryHistory(filterValue, fromDate, toDate, (response) => {
      this.totalAmount = response.totalAmount;
      this.updateTableData(response.data);
    })
  }

  getSalaryHistory() {
    // const fromDate = this.dateRange.start.toISOString().split('T')[0];
    // const toDate = this.dateRange.end.toISOString().split('T')[0];
    
    const fromDate = this.formatDate(this.dateRange.start);
    const toDate = this.formatDate(this.dateRange.end);
    const filterValue = this.searchTerm.trim();

    this.userService.getSalaryHistory(filterValue, fromDate, toDate, (response) => {
      this.updateTableData(response.data);
      this.totalAmount = response.totalAmount;
    })
  }

  getSubsHistory() {
    console.log("this.dateRange..", this.dateRange);
    // const fromDate = this.dateRange.start.toISOString().split('T')[0];
    // const toDate = this.dateRange.end.toISOString().split('T')[0];

    const fromDate = this.formatDate(this.dateRange.start);
    const toDate = this.formatDate(this.dateRange.end);
    const filterValue = this.searchTerm.trim();

    this.userService.getSubsPaymentHistory(filterValue, fromDate, toDate, (response) => {
      this.updateTableData(response.data);

      this.totalAmount = response.totalAmount;
    })
  }

  searchSubsHistoryByDate() {
    const startDate = new Date(this.dateRange.start);
    const endDate = new Date(this.dateRange.end);

    // Reset the time to midnight in the local time zone
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    console.log('here at 91')

    // Get the formatted date (YYYY-MM-DD) using toLocaleDateString
    const fromDate = startDate.toLocaleDateString('en-CA'); // This format gives YYYY-MM-DD
    const toDate = endDate.toLocaleDateString('en-CA');     // This format gives YYYY-MM-DD
    const filterValue = this.searchTerm.trim();
    this.userService.getSubsPaymentHistory(filterValue, fromDate, toDate, (response) => {
      this.totalAmount = response.totalAmount;
      this.updateTableData(response.data);
    })
  }

  applySubsFilter(): void {
    const fromDate = this.dateRange.start.toISOString().split('T')[0];
    const toDate = this.dateRange.end.toISOString().split('T')[0];
    const filterValue = this.searchTerm.trim();
    this.userService.getSubsPaymentHistory(filterValue, fromDate, toDate, (response) => {
      this.totalAmount = response.totalAmount;
      this.updateTableData(response.data);
    })
  }

  activeTable(tabName: any) {
    this.selectedFilter = tabName
    
    if (this.selectedFilter === "SalaryHistory") {
      this.getSalaryHistory();
      this.displayedColumns = ['employeeNum', 'name', 'mail', 'phone', 'type', 'date', 'amount'];
    } else {
      this.displayedColumns = ['employeeNum', 'name', 'mail', 'phone', 'type', 'date', 'amount', 'admissionFee'];
      this.getSubsHistory();
    }
    this.searchTerm = '';
  }

  exportSubsHistoryToExcel(): void {
    const fromDate = this.dateRange.start?.toISOString().split('T')[0];
    const toDate = this.dateRange.end?.toISOString().split('T')[0];
    const filterValue = this.searchTerm.trim();

    this.userService.getSubsPaymentHistory(filterValue, fromDate, toDate, (res) => {
      if (!res.success) {
        return this.dialogService.open('Oops!', `${res.message}`);
      }

      const formattedData = res.data.map((record: any) => ({
        Name: record.userName,
        Email: record.userEmail,
        Phone: record.userPhone,
        Type: record.type,
        AmountPaid: record.amountPaid,
        AdmissionFee: record.admissionFee ?? 0,
        Date: this.formatDate(record.createdAt),
      }));

      const fileName = 'subscriptionHistory.xlsx';

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);

      const workbook: XLSX.WorkBook = {
        Sheets: { 'Subscriptions': worksheet },
        SheetNames: ['Subscriptions']
      };

      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      FileSaver.saveAs(data, fileName);
    });
  }

  exportSalaryHistoryToExcel(): void {
    const fromDate = this.dateRange.start?.toISOString().split('T')[0];
    const toDate = this.dateRange.end?.toISOString().split('T')[0];
    const filterValue = this.searchTerm.trim();
  
    this.userService.getSalaryHistory(filterValue, fromDate, toDate, (res) => {
      if (!res.success) {
        return this.dialogService.open('Oops!', `${res.message}`);
      }
  
      const formattedData = res.data.map((record: any) => ({
        Name: record.userName,
        Email: record.userEmail,
        Phone: record.userPhone,
        Type: record.type,
        Month: record.month,
        Year: record.year,
        TotalPresentDays: record.totalPresentDays,
        CalculatedAmount: record.calculatedAmount,
        AmountPaid: record.amountPaid,
        Date: this.formatDate(record.createdAt),
      }));
  
      const fileName = 'salaryHistory.xlsx';
  
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
  
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Salaries': worksheet },
        SheetNames: ['Salaries']
      };
  
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
      const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      FileSaver.saveAs(data, fileName);
    });
  }
  


  formatDate(date: any): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear(); // Full year

    return `${year}-${month}-${day}`;
  }

}
