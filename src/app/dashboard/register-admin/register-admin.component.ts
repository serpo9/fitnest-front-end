import { Component } from '@angular/core';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.scss']
})
export class RegisterAdminComponent {

  userName = '';
  mail = '';
  gymName = '';
  phoneNumber = '';
  password = '';

  constructor(private dialogService: DialogService, private userService: UserService) { }

  onSubmit() {
    if (!this.userName || !this.mail || !this.gymName || !this.phoneNumber || !this.password) {
      this.dialogService.open('Oops!', 'Please fill all the feilds!');
      return;
    }

    const obj = {
      name: this.userName,
      email: this.mail,
      phoneNumber: this.phoneNumber,
      gymName: this.gymName,
      password: this.password
    };

    this.userService.registerAdminBySuperAdmin(obj, (response) => {
      if (!response.success) {
        return this.dialogService.open('Oops!', `${response.message}`);
      }

      console.log("response...", response);

      if (response.success) {
        this.dialogService.open('', 'Admin is registered successfully!', '', false, 'Okay', (() => {
          this.userName = '';
          this.mail = '';
          this.gymName = '';
          this.phoneNumber = '';
          this.password = '';
        }))
      }
    })

  }

  onlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
