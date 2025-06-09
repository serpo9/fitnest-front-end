import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user-service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';



@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss']
})
export class EditProfileDialogComponent {
  @ViewChild('nameInput') nameInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('phoneInput') phoneInput!: ElementRef;

  @ViewChild('bloodGroupInput') bloodGroupInput!: ElementRef;
  @ViewChild('heightInput') heightInput!: ElementRef;
  @ViewChild('fitnessGoalsInput') fitnessGoalsInput!: ElementRef;
  @ViewChild('weightInput') weightInput!: ElementRef;

  profileForm: FormGroup;
  logindata: any = {};
  moreCustomerInfo: any;
  fitnessGoal: string[] = ['Weight loose', 'Strength Training', 'Endurance', 'Gain Weight'];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProfileDialogComponent>,
    private userService: UserService,
    private dialog: DialogService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.logindata = data.logindata;
    this.moreCustomerInfo = data?.moreCustomerInfo?.[0];


    // this.logindata.name = this.logindata.name
    // this.logindata.email = this.logindata.email
    // this.logindata.phone = this.logindata.phone
    // this.logindata = data.logindata.data
    this.profileForm = this.fb.group({
      name: [data, Validators.required],
      email: [data, [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
  }

  // onSave(): void {
  //   this.logindata.name = this.nameInput.nativeElement.value;
  //   this.logindata.email = this.emailInput.nativeElement.value;
  //   this.logindata.phone = this.phoneInput.nativeElement.value;
  //   console.log(this.logindata.name ,this.logindata.email,this.logindata.phone ,"here is the data which is going to ere")
  //   this.dialogRef.close({ data: this.logindata });
  //  const obj = {
  //   name :this.logindata.name,
  //   email :this.logindata.email,
  //   phone :this.logindata.phone
  //   }
  //   this.userService.updateProfile(obj,(response)=>{
  //     console.log(response)
  //   })
  // }

  onSave(): void {
    // Extracting values from input fields
    this.logindata.name = this.nameInput.nativeElement.value;
    this.logindata.email = this.emailInput.nativeElement.value;
    this.logindata.phoneNumber = this.phoneInput.nativeElement.value;

    // Validating the phone number
    if (!/^\d{10}$/.test(this.logindata.phoneNumber)) {
      this.dialog.open('Oops!', 'Phone number must be exactly 10 digits.', '', false, 'Okay');
      return;
    }

    const obj = {
      userId: this.logindata.id,
      name: this.logindata.name,
      email: this.logindata.email,
      phone: this.logindata.phoneNumber,
    };

    this.userService.updateCustomerProfile(obj, (response) => {

    })

    this.dialogRef.close({ data: this.logindata });
  }

  saveMoreInfo(): void {
    // Extracting values from input fields
    this.moreCustomerInfo.bloodGroup = this.bloodGroupInput.nativeElement.value;
    this.moreCustomerInfo.height = this.heightInput.nativeElement.value;
    this.moreCustomerInfo.fitnessGoals = this.fitnessGoalsInput.nativeElement.value;
    this.moreCustomerInfo.weight = this.weightInput.nativeElement.value;

    const obj = {
      userId: this.moreCustomerInfo.userId,
      height: this.moreCustomerInfo.height,
      fitnessGoals: this.moreCustomerInfo.fitnessGoals,
      weight: this.moreCustomerInfo.weight,
    };

    this.userService.updateCustomerMoreProfileInfo(obj, (response) => {
      if (response.success) {
      }
    })

    this.dialogRef.close({ data: this.moreCustomerInfo });
  }


  onCancel(): void {
    this.dialogRef.close();
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.logindata.Image = e.target.result; // Update the image path to the base64 string
      };

      reader.readAsDataURL(file);
    }
  }

}