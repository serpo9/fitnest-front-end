import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { ROUTES } from 'src/app/app-routes.config';
import { ViewSubscriptionDialogComponent } from '../dialogs/view-subscription-dialog/view-subscription-dialog.component';
import { EditSubscriptionDialogComponent } from '../dialogs/edit-subscription-dialog/edit-subscription-dialog.component';

export interface UserInfo {
  planName: string;
  description: string;
  monthlyPrice: string;
  quarterlyPrice: string;
  yearlyPrice: string;
  view: string;
  edit: string;
  status: string;
  planType: string;
}

@Component({
  selector: 'app-all-plans',
  templateUrl: './all-plans.component.html',
  styleUrls: ['./all-plans.component.scss']
})
export class AllPlansComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  sidenavOpen: boolean = true;
  selectedFilter: string = 'Search1';
  searchTerm: string = '';
  displayedColumns: string[] = ['planName', 'description', 'status', 'planType', 'monthlyPrice', 'quarterlyPrice', 'yearlyPrice', 'view', 'edit'];

  dataSource = new MatTableDataSource<UserInfo>([]);


  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private dialogService: DialogService,
    private matDialog: MatDialog
  ) {

    // this.userService.getAllPlans((response) => {
    //   if (response.success) {
    //     this.dataSource.data = response.data;
    //   }
    // })
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getAllMembershipPlans();

    this.dataSource.filterPredicate = (data: UserInfo, filter: string) =>
      data.planName.toLowerCase() === filter.toLowerCase();
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;  // Set paginator after view is initialized
  }

  getAllMembershipPlans(): void {

    this.userService.getAllPlans((res) => {
      const formattedData: UserInfo[] = res.data.map((plan: any) => ({
        id: plan.id,
        planName: plan.planName,
        description: plan.description,
        features: plan.features,
        extraGroupClassFee: plan.extraGroupClassFee,
        extraPersonalTrainerFee: plan.extraPersonalTrainerFee,
        includesGroupClasses: plan.includesGroupClasses,
        includesPersonalTrainer: plan.includesPersonalTrainer,
        monthlyPrice: plan.monthlyPrice,
        quarterlyPrice: plan.quarterlyPrice,
        yearlyPrice: plan.yearlyPrice,
        status: plan.status,
        planType: plan.planType
      }));
      this.updateTableData(formattedData);
    });

  }

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }

  updateTableData(data: UserInfo[]): void {
    this.dataSource.data = data;
  }

  applyFilter(): void {

  }

  setActiveFilter(filter: string) {
    this.selectedFilter = filter;
  }

  goToPage(routeUrl: any) {
    this.router.navigate([routeUrl])
  }

  viewPlan(id: any) {
    this.userService.viewPlansById(id, async (response) => {

      const mainData = await response.data[0];

      this.matDialog.open(ViewSubscriptionDialogComponent, {
        width: '800px',
        data: mainData
      })
    })
  }

  editPlan(id: any) {
    this.userService.viewPlansById(id, (response) => {
      if (response.success) {
        const dialogRef = this.matDialog.open(EditSubscriptionDialogComponent, {
          width: '800px',
          data: response.data[0]
        })

        dialogRef.afterClosed().subscribe((result: any) => {
          if (!result.data) {
            return
          }
          this.updateTableData(result.data);
        })
      }

    })
  }

}
