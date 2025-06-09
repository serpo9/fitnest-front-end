import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserService } from './services/user-service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Fitnest';
  showNavbar = true;
  removePadding = false;

  showSidebar: boolean = false;

  // Define the routes where sidebar should be hidden
  private hiddenRoutes: string[] = ['', '/', 'login', 'otp', 'forgot-password', 'profile', 'home', 'get-info', 'super-admin', 'plan-details', 'reception-login'];

  constructor(private router: Router, private userService: UserService) {
     this.router.events.subscribe(() => {
    const currentRoute = this.router.url.replace('/', '');
    this.showSidebar = !this.hiddenRoutes.includes(currentRoute) && !currentRoute.startsWith('plan-details/');
  });
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Show navbar only on the home page ('/')
        this.showNavbar = event.urlAfterRedirects === '/';

        // Handle padding removal if needed for other routes
        const noPaddingRoutes = ['/sign-up', '/login', '/otp', '/forgot-password', '/welcome',];
        this.removePadding = noPaddingRoutes.includes(event.urlAfterRedirects);

        // Scroll to top on route change
        window.scrollTo(0, 0);
      });
  }


}
