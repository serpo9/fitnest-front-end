import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user-service/user.service";
import { MatDialog } from "@angular/material/dialog";
import { SnackBarService } from "src/app/services/snack-bar/snack-bar.service";

@Component({
  selector: "app-add-subscription-plans",
  templateUrl: "./add-subscription-plans.component.html",
  styleUrls: ["./add-subscription-plans.component.scss"],
})
export class AddSubscriptionPlansComponent {
  membershipForm: FormGroup;
  visitorForm: FormGroup;
  submitted = false;
  showError = false;
  activeTab = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private matDialog: MatDialog,
    private snackbarService: SnackBarService
  ) {
    this.membershipForm = this.fb.group({
      planName: ["", Validators.required],
      description: ["", Validators.required],
      features: this.fb.array([this.createFeatureField()]), // Ensure at least one feature exists
      includesPersonalTrainer: ["No"],
      includesGroupClasses: ["No"],
      monthlyPrice: ["", Validators.required],
      quarterlyPrice: ["", Validators.required],
      yearlyPrice: ["", Validators.required],
      extraPersonalTrainerFee: [""],
      extraGroupClassFee: [""],
      status: ["active"],
      planType: ["membership"],
      doors: ["Door 1"],
    });

    this.visitorForm = this.fb.group({
      planName: ["", Validators.required],
      description: ["", Validators.required],
      days: ["", Validators.required],
      price: ["", Validators.required],
      status: ["active"],
      planType: ["visitor"],
      doors: ["Door 1"],
    });
  }

  createFeatureField(): FormGroup {
    return this.fb.group({
      feature: ["", Validators.required], // Define the control name properly
    });
  }

  // Getter for features FormArray
  get featuresArray(): FormArray {
    return this.membershipForm.get("features") as FormArray;
  }
  // Add a new feature input
  addFeature() {
    this.featuresArray.push(this.createFeatureField());
  }

  

  // Remove a specific feature input field
  removeFeature(index: number) {
    if (this.featuresArray.length > 1) {
      this.featuresArray.removeAt(index);
    }
  }

  submitForm() {
    this.submitted = true;
    const formDataValid = this.membershipForm.valid;
    const formData = this.membershipForm.value;

    // Convert 'Both' to array before using it
    let doorsValue = formData.doors;
    if (doorsValue === "Both") {
      doorsValue = ["Door 1", "Door 2"];
    } else {
      doorsValue = [doorsValue];
    }



    if (formDataValid) {
      this.showError = false;
      const featureList = this.featuresArray.controls.map(
        (control) => control.value.feature
      );

      // Create the full object to send to MembershipPlans table
      const finalData = {
        planName: formData.planName,
        description: formData.description,
        features: JSON.stringify(featureList), // Store features as JSON string in DB
        includesPersonalTrainer: formData.includesPersonalTrainer || "no",
        includesGroupClasses: formData.includesGroupClasses || "no",
        monthlyPrice: formData.monthlyPrice || "0",
        quarterlyPrice: formData.quarterlyPrice || "0",
        yearlyPrice: formData.yearlyPrice || "0",
        extraPersonalTrainerFee: formData.extraPersonalTrainerFee || "0",
        extraGroupClassFee: formData.extraGroupClassFee || "0",
        status: formData.status || "active",
        planType: formData.planType,
        doors: doorsValue,
      };

      this.userService.createMembershipPlan(finalData, (response) => {
        if (response.success) {
          this.membershipForm.reset();
          this.submitted = false;
          this.snackbarService.showSnackBar(
            "Subscription added successfully!",
            3000
          );
        }else{

        }
      });
    } else {
      this.showError = true;
    }
  }



  submitVisitorForm() {
    this.submitted = true;
    const formDataValid = this.visitorForm.valid;
    const formData = this.visitorForm.value;
    let doorsValue = formData.doors;
    if (doorsValue === "Both") {
      doorsValue = ["Door 1", "Door 2"];
    } else {
      doorsValue = [doorsValue];
    }
    if (formDataValid) {
      this.showError = false;

      // Create the full object to send to MembershipPlans table
      const finalData = {
        planName: formData.planName,
        description: formData.description,
        price: formData.price,
        days: formData.days,
        status: formData.status || "active",
        planType: formData.planType,
        doors: doorsValue,

      };

      this.userService.createVisitorPlan(finalData, (response) => {
        if (response.success) {
          this.visitorForm.reset();
          this.submitted = false;

          this.snackbarService.showSnackBar(
            "Subscription added successfully!",
            3000
          );
        }
      });
    } else {
      this.showError = true;
    }
  }

  activeForm(planName: any) {
    if (planName === "membership") {
      this.activeTab = true;
    } else {
      this.activeTab = false;
    }
  }
}
