import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { EditScheduleComponent } from 'src/app/dashboard/edit-schedule/edit-schedule.component';
import { TrainerSelectionDialogComponent } from 'src/app/components/trainer-selection-dialog/trainer-selection-dialog.component';
import { ROUTES } from 'src/app/app-routes.config';
import { duration } from 'moment';

export interface getSubscriptionRequest {
  name: any;
  email: string;
  plan: string;
  phone: string;
  buyPlan: string
}

@Component({
  selector: 'app-requested-user',
  templateUrl: './requested-user.component.html',
  styleUrls: ['./requested-user.component.scss']
})


export class RequestedUserComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  sidenavOpen: boolean = true;
  requestColumns: string[] = ["name", "email", "phone", "plan", "buyPlan"];
  dataSource = new MatTableDataSource<getSubscriptionRequest>([]); // Users list
  searchTerm: string = '';
  dateRange = {
    start: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days before today
    end: new Date(), // Today
  };
  userType: any;
  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.userType = this.userService.userRegisterData.userType;
   }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getRequestedUser();

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Set paginator after view is initialized
  }

  getRequestedUser() {
    this.userService.getSubscriptionRequest((response) => {
      if (!response.success) {

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
}
