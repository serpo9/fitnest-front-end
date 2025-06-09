import { Component, OnInit, ViewChild } from '@angular/core';
import { faArrowDown, faDownload } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/app-routes.config';

@Component({
  selector: 'app-main-profile',
  templateUrl: './main-profile.component.html',
  styleUrls: ['./main-profile.component.scss']
})
export class MainProfileComponent {

  UserName: any;
  emailId: any;
  phone: any;
  userId: any;
  gymName: any
  userdetails: string = 'Pranit';
  faArrowDown = faArrowDown;
  faDownload = faDownload;
  logindata: any;
  userType: any;
  username = { name: '', email: '', phone: '', id: '', userType: '', bloodGroup: '', height: '', weight: '', dob: '', fitnessGoals: '', gender: '', };

  constructor(private dialog: DialogService, private userService: UserService, private matdialog: MatDialog, private router: Router) { }

  ngOnInit(): void {

    this.logindata = this.userService.userDataObj;
    this.username.name = this.logindata.name;
    this.username.email = this.logindata.email;
    this.username.id = this.logindata.id;
    this.username.phone = this.logindata.phoneNumber;
    this.gymName = this.logindata.gymName;
    this.userType = this.logindata.userType;
  }

  logout() {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      this.router.navigate([ROUTES.WELCOME]);
    };
  }

  goToPage(routes: any) {
    this.router.navigate([routes]);
  }
}
