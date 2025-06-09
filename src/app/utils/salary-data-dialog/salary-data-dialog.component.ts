import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { UserService } from 'src/app/services/user-service/user.service';

export  interface salaryTable{
date : string,
amount : string,
presentDays : string,
status : string
};

@Component({
  selector: 'app-salary-data-dialog',
  templateUrl: './salary-data-dialog.component.html',
  styleUrls: ['./salary-data-dialog.component.scss']
})

export class SalaryDataDialogComponent implements OnInit {
  @ViewChild(MatPaginator) paginator! : MatPaginator;
  constructor(private userService : UserService,
    @Inject (MAT_DIALOG_DATA) public data:any,
    public dialogRef : MatDialogRef<SalaryDataDialogComponent>,
    public dialogService : DialogService
  ){
    console.log(this.data , "dataa a a")
    if(this.data){
      this.getAssingedSalaryDetails();
      this.getSalaryHistory();
    }
  }
  salaryData : any;
  noDataInfo : any ;
  lastPaidOn : any;
  fromDate!: Date;
  toDate!: Date;

  displayedColumns : string[] = ["date", "amount", "presentDays" , "status"];
  dataSource = new MatTableDataSource<salaryTable>([]); 

  amount : number = 0;

  ngOnInit(): void {
    
  }

  getAssingedSalaryDetails(){
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const obj = {
      month: month,
      year: year
    }
    this.userService.getStaffSalaryInfo(this.data.userId,response=>{
      this.salaryData = response.data[0];
    })
  }

  getSalaryHistory(){
    
    this.userService.getIndividualSalaryHistories(this.data.userId, (response) => {
      if(response.success){
        this.lastPaidOn = response.data[0]?.createdAt;
        this.dataSource = new MatTableDataSource<salaryTable>(response.data);
      }
    })
  }

  paySalary(){
    if(!this.salaryData.salaryAmount){
      this.dialogService.open('Oops','Salary Not Assinged', '', false, 'Okay', ()=>{ this.dialogRef.close() });
    }
    else if(this.amount > 0){
      const obj = {
        userId : this.data.userId, totalPresentDays :this.data.totalPresentDays , 
         calculatedAmount : this.amount
        , month : this.data.month , year : this.data.year 
      }
      this.userService.paySalary(obj, response=>{
        console.log("response : ", response);
        this.dialogRef.close(response);
      })
    }
  }


}
