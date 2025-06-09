import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';
import { ROUTES } from 'src/app/app-routes.config';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],

})
export class SignupComponent implements OnInit {

  condition = true

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
         const userType = "SuperAdmin"
        localStorage.setItem('userType', userType);
  }

  selectUserType() {
    this.condition = false
  }

  chooseUserType(chooseUserType: any) {
    this.router.navigate([ROUTES.LOGIN]);
    this.userService.userType = chooseUserType;
    localStorage.setItem('userType', chooseUserType);
  }


}
