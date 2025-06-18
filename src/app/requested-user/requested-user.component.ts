import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { EditScheduleComponent } from 'src/app/dashboard/edit-schedule/edit-schedule.component';
import { TrainerSelectionDialogComponent } from 'src/app/components/trainer-selection-dialog/trainer-selection-dialog.component';
import { ROUTES } from 'src/app/app-routes.config';
import { duration } from 'moment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingService } from "src/app/services/loading-services/loading.service";
import { SnackBarService } from "src/app/services/snack-bar/snack-bar.service";


export interface getSubscriptionRequest {
  name: any;
  email: string;
  plan: string;
  phone: string;
  buyPlan: string
}
export interface getReceptionistSubscriptionRequest {
  name: any;
  email: string;
  plan: string;
  phone: string;
  amountPaid: string;
  buyPlan: string
}

@Component({
  selector: 'app-requested-user',
  templateUrl: './requested-user.component.html',
  styleUrls: ['./requested-user.component.scss']
})


export class RequestedUserComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('receptionistPaginator', { static: true }) receptionistPaginator!: MatPaginator;

  sidenavOpen: boolean = true;
  requestColumns: string[] = ["name", "email", "phone", "plan", "buyPlan"];
  receptionistColumns: string[] = ["name", "email", "phone", "plan", "amountPaid", "buyPlan"];
  dataSource = new MatTableDataSource<getSubscriptionRequest>([]); // Users list
  receptionistDataSource = new MatTableDataSource<getReceptionistSubscriptionRequest>([]); // Users list
  searchTerm: string = '';
  dateRange = {
    start: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days before today
    end: new Date(), // Today
  };
  userType: any;
  constructor(
    private userService: UserService,
    private router: Router,
    private dialogService: DialogService,
    private matDialog: MatDialog,
    private loadingService: LoadingService,
    private snackBarService: SnackBarService,
  ) {
    this.userType = this.userService.userRegisterData.userType;
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.receptionistDataSource.paginator = this.receptionistPaginator;
    this.getRequestedUser();
    this.getListOfRequestedSubByReceptionist();

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Set paginator after view is initialized
    this.receptionistDataSource.paginator = this.receptionistPaginator; // Set paginator after view is initialized
  }

  getRequestedUser() {
    this.userService.getSubscriptionRequest((response) => {
      if (!response.success) {
        this.dataSource.data = [];

      } else {
        const formattedData: getSubscriptionRequest[] = response.data.map((request: any) => ({
          userId: request.userId,
          name: request.username,
          phone: request.phoneNumber,
          email: request.email,
          plan: request.planName,
        }));
        this.dataSource.data = formattedData;
      }
    })
  }

  navigate(element: any) {
    this.userService.redirectedCustomerId = element.userId;
    this.router.navigate(['/buy-subscription-plans'])
  }

  getListOfRequestedSubByReceptionist() {
    this.userService.getSubReqListByReceptionist((response) => {

      const formattedData: getReceptionistSubscriptionRequest[] = response.data.map((request: any) => ({
        id: request.id,
        userId: request.userId,
        name: request.name,
        phone: request.phoneNo,
        email: request.email,
        plan: request.planName,
        amountPaid: request.amountPaid
      }));
      this.receptionistDataSource.data = formattedData;

    })
  }

  approve(requestedId: any) {
    this.dialogService.open('Confirmation', `Are you sure you want to approve the request no: ${requestedId}`, '', true, 'Yes', (() => {
      this.loadingService.open();
      this.userService.approveRequestedSubsByReceptionist(requestedId, (response) => {
        if (response.success) {
          this.matDialog.closeAll();
          this.loadingService.close();
          this.receptionistDataSource.data = this.receptionistDataSource.data.filter(
            (item: any) => item.id !== requestedId
          );
          this.snackBarService.showSnackBar(
            "Approved successfully!"
          );

        } else {
          this.loadingService.close();
          this.matDialog.closeAll();
          this.dialogService.open('Oops!', `${response.message}`)
        }
      })
    }),
      'No'
    )
  }
}
