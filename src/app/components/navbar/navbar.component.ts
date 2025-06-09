import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/app-routes.config';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isNavbarVisible = false;
  navActive: boolean = false;
  isScrolled = false;
  isAuthenticate = false
  
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = offset > 10;
  }

  goToPage(pagename: any) {
    this.router.navigate([pagename]);
  }
  goToPageSection() {
    if(this.isAuthenticate){

      this.router.navigate(['welcome']);
    }
    else{
      this.router.navigate(['booking']);

    }
  }
  LogOut(){
        localStorage.removeItem('userType'); // Remove userType
        localStorage.removeItem('token');
        this.router.navigate([ROUTES.WELCOME]);

  }

  toggleNavbar() {
    this.isNavbarVisible = !this.isNavbarVisible;
  }

}
