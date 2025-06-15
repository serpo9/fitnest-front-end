import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user-service/user.service';
import { AUTHENTICATION_ROUTES, SECURE_ROUTES_FOR_ADMIN, SECURE_ROUTES_FOR_CUSTOMER, SECURE_ROUTES_FOR_SUPER_ADMIN, SECURE_ROUTES_FOR_TRAINER, ROUTES, SECURE_ROUTES_FOR_RECEPTIONIST } from '../app-routes.config';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  private currentRoute: string | undefined;

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const currentRoute = route.routeConfig?.path;  

    // Prevent access to SUPERADM after logout
    if (currentRoute === ROUTES.SUPERADMIN && !this.userService.tokenExist()) {
      this.router.navigate([ROUTES.WELCOME]);
      return false;
    }

    // Check if the route is part of the authentication routes
    if (AUTHENTICATION_ROUTES.includes(currentRoute!)) {
      // If the user is already logged in, redirect them away from login or welcome
      if (this.userService.tokenExist()) {
        this.router.navigate([ROUTES.HOME]); // Or any other default route
        return false;
      }
      // If no login data exists, allow access to authentication routes
      return true;
    }

    // If no login data, redirect to the welcome page
    if (!this.userService.tokenExist()) {
      this.router.navigate([ROUTES.WELCOME]);
      return false;
    }

    const browserRedirected = !this.userService.loginData;
    if (browserRedirected) {
      try {
        const response: any = await new Promise((resolve, reject) => {
          this.userService.silentLogin((response) => {
            this.userService.userDataObj = response.data;
            resolve(response);
          });
        });        

        if (!response.success) {
          this.router.navigate([ROUTES.WELCOME]); // If silent login fails, go to WELCOME
          return false;
        }

        const userRole = localStorage.getItem('userType') || this.userService.userDataObj?.userType;
        return this.handleRoleBasedNavigation(userRole, currentRoute);
      } catch (error) {
        console.error('Silent login error:', error);
        this.router.navigate([ROUTES.WELCOME]);
        return false;
      }
    } else {
      return this.validateUserAccess(route);
    }
  }

  private handleRoleBasedNavigation(userRole: string, currentRoute: string | undefined): boolean {
    if (!userRole) {      
      this.router.navigate([ROUTES.WELCOME]);
      return false;
    }

    if (
      (userRole === 'Admin' && !SECURE_ROUTES_FOR_ADMIN.includes(currentRoute!)) ||
      (userRole === 'Customer' && !SECURE_ROUTES_FOR_CUSTOMER.includes(currentRoute!)) ||
      (userRole === 'Trainer' && !SECURE_ROUTES_FOR_TRAINER.includes(currentRoute!)) ||
      (userRole === 'Receptionist' && !SECURE_ROUTES_FOR_RECEPTIONIST.includes(currentRoute!)) ||
      (userRole === 'SuperAdmin' && !SECURE_ROUTES_FOR_SUPER_ADMIN.includes(currentRoute!))
    ) {
      this.redirectToDashboard(userRole);
      return false;
    }
    return true;
  }

  private validateUserAccess(route: ActivatedRouteSnapshot): boolean {
    const currentRoute = route.routeConfig?.path;
    const userRole = localStorage.getItem('userType') || this.userService.userDataObj?.userType;
    
    if (!userRole) {
      this.router.navigate([ROUTES.WELCOME]);
      return false;
    }

    const allowedRoutes = this.getAllowedRoutes(userRole);
    if (!allowedRoutes.includes(currentRoute!)) {
      this.redirectToDashboard(userRole);
      return false;
    }
    return true;
  }

  private getAllowedRoutes(userRole: string): string[] {
    switch (userRole) {
      case 'Admin':
        return SECURE_ROUTES_FOR_ADMIN;
      case 'Customer':
        return SECURE_ROUTES_FOR_CUSTOMER;
      case 'Trainer':
        return SECURE_ROUTES_FOR_TRAINER;
      case 'Receptionist':
        return SECURE_ROUTES_FOR_RECEPTIONIST;
      case 'SuperAdmin':
        return SECURE_ROUTES_FOR_SUPER_ADMIN;
      default:
        return [];
    }
  }

  private redirectToDashboard(userRole: string) {
    switch (userRole) {
      case 'Admin':
        this.router.navigate([ROUTES.ADMINHOME]);
        break;
      case 'Customer':
        this.router.navigate([ROUTES.HOME]);
        break;
      case 'Trainer':
        this.router.navigate([ROUTES.YOURSESSION]);
        break;
      case 'Receptionist':
        // this.router.navigate([ROUTES.RECEPTIONHOME]);
        this.router.navigate([ROUTES.ADMINHOME]);
        break;
      case 'SuperAdmin':
        this.router.navigate([ROUTES.SUPERADMINPANEL]);
        break;
      default:
        
        this.router.navigate([ROUTES.WELCOME]);
        break;
    }
  }
}