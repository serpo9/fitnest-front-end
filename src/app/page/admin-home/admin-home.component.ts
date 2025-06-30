import { Component, OnInit, ViewChild } from '@angular/core';
import { faArrowDown, faDownload } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/app-routes.config';
import { EditProfileDialogComponent } from 'src/app/utils/edit-profile-dialog/edit-profile-dialog.component';


export interface UserInfo {
  id: number | string;
  name: number;
  number: any;
  email: string;
  plan: string;
  duration: string;
  expireDate: string;
  renew : string
}

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isNavbarVisible = false;
  isScrolled = false;
  sidenavOpen: boolean = true;
  UserName: any;
  emailId: any;
  phone: any;
  userId: any;
  gymName: any
  userdetails: string = 'Pranit';
  faArrowDown = faArrowDown;
  faDownload = faDownload;
  logindata: any;
  username = { name: '', email: '', phone: '', id: '' };


  dataSource = new MatTableDataSource<UserInfo>();


  showData: any = [];
  dialogOpen: boolean = false;
  trainerCount = 0;
  customerCount = 0;
  staffCount = 0;
  subsUsersCount = 0;

  searchTerm: string = '';
  todaysPresent = 0
  todaysCollection = 0

  dateRange = {
    start: new Date(new Date().setDate(new Date().getDate() - 1 - 1)), // 1 days before yesterday
    end: new Date(new Date().setDate(new Date().getDate() - 1 + 7)),       // 7 days ahead
  };

  displayedColumns: string[] = ['id', 'name', 'mail', 'number', 'plan', 'expireDate','renew'];

  constructor(private dialog: DialogService, private userService: UserService, private matdialog: MatDialog, private router: Router) {
    // this.userService.getUsersCount((response) => {
    //   this.trainerCount = response.trainerCount;
    //   this.customerCount = response.customerCount;
    // })

    // this.userService.getStaffsCount((response) => {
    //   this.staffCount = response.staffCount;
    // })

    this.userService.getDashboardUsersCount((response) => {
      this.trainerCount = response.data.trainerCount;
      this.customerCount = response.data.customerCount;
      this.staffCount = response.data.staffCount;
      this.subsUsersCount = response.data.totalUniqueBuyers;
    })

    this.getExpiryUsers();

    this.userService.getUsersTodaysAttendances((response) => {
      if (response.success) {
        this.todaysPresent = response.count;
      }

    })

    this.userService.getTodaysCollection((response) => {  
      this.todaysCollection = response.totalAmountPaid;
    })

  }


  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;

    this.logindata = this.userService.userDataObj;
    this.username.name = this.logindata.name;
    this.username.email = this.logindata.email;
    this.username.id = this.logindata.id;
    this.username.phone = this.logindata.phoneNumber;
    this.gymName = this.logindata.gymName;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;  // Set paginator after view is initialized
  }

  onSidenavToggle(sidenavState: boolean): void {
    this.sidenavOpen = sidenavState;
  }

  openEditDialog(): void {
    if (this.dialogOpen) {
      this.dialog.open('Attention!', 'You have just updated your details, Try again after some time.', '', false, 'Okay');
      return;
    }
    const dialogRef = this.matdialog.open(EditProfileDialogComponent, {
      width: '250px',
      data: { logindata: this.logindata }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.dialogOpen = true;
        this.logindata = result.data;
        this.username.name = this.logindata.name;
        this.username.email = this.logindata.email;
        this.username.phone = this.logindata.phoneNumber;
        this.username.id = this.logindata.id;
      }
    });
  }

  profile() {
    this.router.navigate([ROUTES.PROFILE]);
  }

  logout() {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      this.router.navigate([ROUTES.LOGIN]);
    };
  }

  goToPage(routes: any) {
    this.router.navigate([routes]);
  }

  updateTableData(data: UserInfo[]): void {
    this.dataSource.data = data;
  }
  applyFilter(): void {
    const fromDate = this.dateRange.start.toISOString().split('T')[0];
    const toDate = this.dateRange.end.toISOString().split('T')[0];
    const filterValue = this.searchTerm.trim();

    this.userService.getExpiringUsersPlans(filterValue, fromDate, toDate, (response) => {
      this.updateTableData(response.data);
    })
  }


  getExpiryUsers() {
    const fromDate = this.dateRange.start.toISOString().split('T')[0];
    const toDate = this.dateRange.end.toISOString().split('T')[0];
    const filterValue = this.searchTerm.trim();

    this.userService.getExpiringUsersPlans(filterValue, fromDate, toDate, (response) => {
      this.updateTableData(response.data);
    })
  }
  navigate(element:any){
    this.userService.redirectedCustomerId = element.userId;
    this.router.navigate(['/buy-subscription-plans'])
  }
}