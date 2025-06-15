import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/app-routes.config';
import { UserService } from 'src/app/services/user-service/user.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {

  sidenavOpen: boolean = false;
  gymname: any;
  //activenavlink : boolean = false;
  activelink: string = '';
  utilityDropdownOpen: any;
  sessionDropdownOpen = false;
  subscriptionDropdownOpen = false;
  deviceDropdownOpen = false;
  usersDropdownOpen = false;
  attendanceDropdownOpen = false;
  userType: any;
  trainerPlansDropdownOpen: boolean = false;

  ActiveNavLink(link: string): void {
    this.activelink = link;

  }
  constructor(private router: Router, private userService: UserService) {
    // this.userService.getGymName((response) => {
    //   this.gymname = response.gymName;
    // });


    this.userType = this.userService.userDataObj?.userType

  }
  

toggleTrainerPlansDropdown() {
  this.trainerPlansDropdownOpen = !this.trainerPlansDropdownOpen;
}

  deactivateUser() {
    this.router.navigate(['/adduser', ""]);
  }
  @Output() sidenavToggle = new EventEmitter<boolean>();

  toggleSidenav(): void {
    this.sidenavOpen = !this.sidenavOpen;

    this.sessionDropdownOpen = false;
    this.subscriptionDropdownOpen = false;
    this.deviceDropdownOpen = false;
    this.usersDropdownOpen = false;
    this.attendanceDropdownOpen = false;
    this.sidenavToggle.emit(this.sidenavOpen);
  }
  getinfo(routes: string) {
    this.sidenavOpen = true
    // this.activelink = routes;
    this.router.navigate([routes]);

  }
  logout() {
    localStorage.removeItem('userType'); // Remove userType
    localStorage.removeItem('token');
    this.router.navigate([ROUTES.WELCOME]);
  }

  profile() {
    this.router.navigate([ROUTES.MAIN_PROFILE]);
  }

  toggleUtilityDropdown(): void {
    this.utilityDropdownOpen = !this.utilityDropdownOpen;
    if (this.sidenavOpen === true) {
      return
    }
    this.sidenavOpen = !this.sidenavOpen;
  }

  toggleSessionDropdown(): void {
    this.sessionDropdownOpen = !this.sessionDropdownOpen;
    if (this.sidenavOpen === true) {
      return
    }
    this.sidenavOpen = !this.sidenavOpen;
  }
  toggleSubscriptionDropdown(): void {
    this.subscriptionDropdownOpen = !this.subscriptionDropdownOpen;
    if (this.sidenavOpen === true) {
      return
    }
    this.sidenavOpen = !this.sidenavOpen;
  }
  toggleDeviceDropdown(): void {
    this.deviceDropdownOpen = !this.deviceDropdownOpen;
    if (this.sidenavOpen === true) {
      return
    }
    this.sidenavOpen = !this.sidenavOpen;
  }
  toggleUsersDropdown(): void {
    this.usersDropdownOpen = !this.usersDropdownOpen;
    if (this.sidenavOpen === true) {
      return
    }
    this.sidenavOpen = !this.sidenavOpen;
  }
  toggleAttendanceDropdown(): void {
    this.attendanceDropdownOpen = !this.attendanceDropdownOpen;
    if (this.sidenavOpen === true) {
      return
    }
    this.sidenavOpen = !this.sidenavOpen;
  }
}
