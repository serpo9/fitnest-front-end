import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver'; import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { PayDueAmountDialogComponent } from 'src/app/utils/pay-due-amount-dialog/pay-due-amount-dialog.component';

export interface UserInfo {
  employeeNum: string;
  name: string;
  date: string;
  mail: string;
  phone: Number;
  type: string;
  presentDays: Number,
  amount: Number
}
@Component({
  selector: 'app-received-amounts',
  templateUrl: './received-amounts.component.html',
  styleUrls: ['./received-amounts.component.scss']
})
export class ReceivedAmountsComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  sidenavOpen: boolean = true;
  displayedColumns: string[] = ['employeeNum', 'name', 'mail', 'phone', 'type', 'date', 'amount','dueAmount'];
  searchTerm: string = '';
  selectedFilter = 'SalaryHistory';

  dateRange = {
    start: new Date(new Date().setDate(new Date().getDate())), // 1 days before yesterday
    end: new Date(new Date().setDate(new Date().getDate())),       // Yesterday
  };

  dataSource = new MatTableDataSource<UserInfo>([]);
  presentCount: any;

  totalAmount = 0;

  constructor(
    private userService: UserService,
    private dialogService: DialogService,
    private matDialog : MatDialog
  ) {

   
      this.getSubsAmountReceived();
    

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
    this.getInstallmentAmountDetails(fromDate, toDate, filterValue);
    
  }

  searchPaymentHistoryByDate() {
    const startDate = new Date(this.dateRange.start);
    const endDate = new Date(this.dateRange.end);

    // Reset the time to midnight in the local time zone
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    // Get the formatted date (YYYY-MM-DD) using toLocaleDateString
    const fromDate = startDate.toLocaleDateString('en-CA'); // This format gives YYYY-MM-DD
    const toDate = endDate.toLocaleDateString('en-CA');     // This format gives YYYY-MM-DD

    const filterValue = this.searchTerm.trim();
    this.getInstallmentAmountDetails(fromDate, toDate, filterValue);
    
  }

  receivedAmountData : any;
  getSubsAmountReceived() {
    const fromDate = this.dateRange.start.toISOString().split('T')[0];
    const toDate = this.dateRange.end.toISOString().split('T')[0];
    const filterValue = this.searchTerm.trim();
    this.getInstallmentAmountDetails(fromDate, toDate, filterValue);
    
  }

  getInstallmentAmountDetails(fromDate:any,toDate : any,filterValue: any){
    this.userService.getSubsAmountReceived(filterValue, fromDate, toDate, (response) => {
      this.updateTableData(response.data);
      this.receivedAmountData = response.data[0];
      this.totalAmount = response.totalAmount;
    })
  }

  searchSubsHistoryByDate() {
    const fromDate = this.dateRange.start.toISOString().split('T')[0];
    const toDate = this.dateRange.end.toISOString().split('T')[0];
    const filterValue = this.searchTerm.trim();
    this.getInstallmentAmountDetails(fromDate, toDate, filterValue);
    
  }

  applySubsFilter(): void {
    const fromDate = this.dateRange.start.toISOString().split('T')[0];
    const toDate = this.dateRange.end.toISOString().split('T')[0];
    const filterValue = this.searchTerm.trim();
    this.getInstallmentAmountDetails(fromDate, toDate, filterValue);
    
  }
  getDueAmount(data : any){
    this.userService.getDueAmount(data.userId,data.purchaseDate, data.membershipPlansId,response=>{
      if(response && response.data){
        let modalData = response.data;
        modalData = { ...modalData, purchaseHistoryId: this.receivedAmountData.purchaseHistoryId };
        this.openPayModal(modalData);
      }
      else {
        this.dialogService.open('Oops', `${response.message}`,'',false,'Okay');
      }
    })
  }

  openPayModal(data : any){
    const dialogRef = this.matDialog.open(PayDueAmountDialogComponent, {
          data: data
        });

        dialogRef.afterClosed().subscribe(res=>{
         if(res){
           this.dataSource.data.forEach((item:any)=>{
            if(item.userId == res.userId && item.purchaseHistoryId == res.purchaseHistoryId){
              item.amountPaid = parseFloat(item.amountPaid)+parseFloat(res.payAmount);
              return ;
            }
          })
         }
        })
  }

  exportSubsHistoryToExcel(): void {
    const fromDate = this.dateRange.start?.toISOString().split('T')[0];
    const toDate = this.dateRange.end?.toISOString().split('T')[0];
    const filterValue = this.searchTerm.trim();

    this.userService.getSubsAmountReceived(filterValue, fromDate, toDate, (res) => {
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

  formatDate(date: any): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear(); // Full year

    return `${year}-${month}-${day}`;
  }
}
