import { Component } from '@angular/core';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pricing-plan',
  templateUrl: './pricing-plan.component.html',
  styleUrls: ['./pricing-plan.component.scss']
})
export class PricingPlanComponent {
  gymname: any;
  gymPlans: any;
  planId: any;

  constructor(private dialogService: DialogService, private userService: UserService, private router: Router, private route: ActivatedRoute,) {
    this.userService.getGymName((response) => {
      this.gymname = response.gymName;
    });

    this.planId = this.route.snapshot.paramMap.get('id');
    this.userService.viewPlansById(this.planId, (response) => {

      this.gymPlans = response.data;

      this.gymPlans = this.gymPlans.map((plan: any, index: any) => ({
        ...plan,
        features: plan.features ? JSON.parse(plan.features) : [], // Convert to an array
        imagePath: `/assets/images/plan-${index + 1}.webp`
      }));
    })
  }
  //   gymPlans = [
  //   {
  //     id: 1,
  //     name: "Basic Gym Package",
  //     targetAudience: "Ideal for Beginners, casual gym-goers, or those focused on weight training, this package offers access to gym equipment, a general workout plan, and locker rooms during fixed hours. Personal training and group classes available as add-ons.",
  //     features: [
  //       "Access to gym equipment (weights, machines, free weights)",
  //       "General workout plan (self-guided)",
  //       "Locker room access",
  //       "Fixed gym hours (morning 5 AM – 10 AM, evening 2 PM – 8 PM)",
  //       "No personal trainer included",
  //       "No group classes"
  //     ],
  //     pricing: {
  //       monthly: "$00",
  //       quarterly: "$00",
  //       yearly: "$00"
  //     },
  //     addOns: {
  //       personalTrainer: "$00 per session",
  //       groupClasses: "$00 per class"
  //     }
  //   }
  // ];


  success() {
    this.dialogService.open('yeah!', "Your request has been processed successfully.", "", false, 'Okay');
  }

  goToPage(pageRoute: any) {
    this.router.navigate([pageRoute])
  }

}
