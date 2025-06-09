import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { faShareSquare, faCalendar, faUserAlt, faShoppingBag, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faShareSquare, faCalendar, faUserAlt, faShoppingBag, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { NgxMatDatetimepicker } from '@angular-material-components/datetime-picker';
import { ThemePalette } from '@angular/material/core';
import { Time } from '@angular/common';
import { UserService } from 'src/app/services/user-service/user.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { ROUTES } from 'src/app/app-routes.config';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  // providers: [
  //   { provide: DateAdapter, useClass: NativeDateAdapter }
  // ],
  // standalone: true,
  // imports: [MatFormFieldModule, MatDatepickerModule, MatNativeDateModule],
})
export class HomeComponent implements OnInit {



  private hasReloadedKey = 'hasReloadedBooking';


  selectedAmPm: string;
  public enableMeridian = true;
  public color: ThemePalette = 'primary';
  range = true;
  faShareSquare = faShareSquare;
  faCalendar = faCalendar;
  faUserAlt = faUserAlt;
  faShoppingBag = faShoppingBag;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  panelOpenState = false;
  activeTab: string = 'All';
  isScrolled = false;
  isNavbarVisible = false;


  disabled: boolean = false;
  showSpinners: boolean = true;

  touchUi: boolean = false;
  disableMinute: boolean = false;
  hideTime: boolean = false;
  dateControl = new FormControl();
  initcomplete: any
  originAutocomplete: any
  options = ['Airport transfer', 'Hourly', 'Point to Point', 'Rush Hour', 'Group and Events Transfer', 'Private Transfer', 'City Tour Transfer'];


  count: number = 1;
  cities: any[] = [
    { img: '/assets/images/musclegain.webp', title: 'Muscle Gain' },
    { img: '/assets/images/weightloss.jpg', title: ' Weight Loss' },
    { img: '/assets/images/yoga.webp', title: 'Yoga' },
    { img: '/assets/images/personaltraining.jpeg', title: 'Personal Training' },
    { img: '/assets/images/spinningndcardio.jpg', title: 'Spinning & Cardio' }
  ];
  end: number = this.cities.length;

  cars: any[] = [];
  filteredCars = this.cars;
  gymname: any

  customOptionsTwo: OwlOptions = {
    loop: true,
    mouseDrag: true,
    rtl: false,
    touchDrag: true,
    pullDrag: false,
    dots: false,

    center: true,
    navSpeed: 700,
    navText: [
      `<img src='/assets/images/leftarrow.png'>`,
      `<img src='/assets/images/rightarrow.png'>`
    ],
    responsive: {
      0: {
        items: 1,
        margin: 20,
        dots: true
      },
      400: {
        items: 2,
        margin: 20
      },
      740: {
        items: 3,
        margin: 20
      },
      940: {
        items: 3,
        margin: 20
      }
    },
    nav: true
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    rtl: false,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    center: false,
    navSpeed: 700,
    navText: [
      `<img src='assets/images/leftarrow.png'>`,
      `<img src='assets/images/rightarrow.png'>`
    ],
    responsive: {
      0: {
        items: 1,
        margin: 20,
        dots: true
      },
      400: {
        items: 2,
        margin: 20
      },
      740: {
        items: 3,
        margin: 20
      },
      940: {
        items: 3,
        margin: 20
      }
    },
    nav: true
  }
  selectedDate: Date;
  // filteredCars: any[] = this.cars;
  destination: string | undefined;
  origin: string | undefined;

  userId: any;
  distance: any;
  getTicketId: any;
  gymPlans: any;

  // gymPlans = [
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
  //     addOns: {a
  //       personalTrainer: "$00 per session",
  //       groupClasses: "$00 per class"
  //     }
  //   }
  // ];

  constructor(private userService: UserService, private router: Router, private dialogService: DialogService,
    private snackbar: SnackBarService
  ) {
    this.selectedDate = new Date();
    this.selectedDate = new Date();
    this.selectedAmPm = this.selectedDate.getHours() < 12 ? 'AM' : 'PM';

  }
  contactUs(session: any) {
    this.router.navigate([ROUTES.GETINFO], { state: { sessionData: session } })
  }

  ngOnInit(): void {
    this.userService.getGymName((response) => {
      console.log(response.message, "here is got the gym name")
      this.gymname = response.gymName;
    });

    this.memerbershipPlans();
  }
  // LogOut(){
  //   localStorage.removeItem('userType'); // Remove userType
  //   localStorage.removeItem('token');
  //   this.router.navigate([ROUTES.WELCOME]);

  // }

  profile() {
    this.router.navigate([ROUTES.PROFILE]);
  }

  private reloadOnce(): void {
    if (!localStorage.getItem(this.hasReloadedKey)) {
      localStorage.setItem(this.hasReloadedKey, 'true');
      window.location.reload();
    }
  }

  choosefleet() {
    this.router.navigate([`choose-fleet`]);
  }

  onTranslated(event: SlidesOutputData) {

    if (event && event.slides) {
      const centerSlide = event.slides.find(slide => slide.center);
      if (centerSlide) {
        const slideId = centerSlide.id;
        if (slideId) {
          const idParts = slideId.split('-');
          if (idParts.length > 0) {
            const lastPart = idParts.pop();
            if (lastPart) {
              const activeIndex = parseInt(lastPart, 10) % this.cities.length;
              this.count = activeIndex + 1;
              this.highlightActiveSlide(activeIndex);
            } else {
              console.error('Last part of slide ID is undefined or null:', slideId);
            }
          } else {
            console.error('Slide ID parts array is empty:', slideId);
          }
        } else {
          console.error('Slide ID is undefined or null:', centerSlide);
        }
      } else {
        console.error('No center slide found:', event.slides);
      }
    } else {
      console.error('Event or event.slides is undefined:', event);
    }
  }

  highlightActiveSlide(centerIndex: number) {

    const slides = document.querySelectorAll('.owl-item');
    // Remove the 'start-active' class from all slides
    slides.forEach(slide => slide.classList.remove('start-active'));

    // Calculate the index of the slide before the center slide
    let beforeCenterIndex;
    if (centerIndex == 3) {
      beforeCenterIndex = (centerIndex - 3 + this.cities.length);
    } else if (centerIndex == 4) {
      beforeCenterIndex = (centerIndex - 3 + this.cities.length);
    } else {
      beforeCenterIndex = (centerIndex - 3 + this.cities.length) % this.cities.length;
    }

    if (slides[beforeCenterIndex]) {
      slides[beforeCenterIndex].classList.add('start-active');
    }
  }


  requestForSubscription(membershipId: any) {
    this.userService.requestSubscription(membershipId, (response) => {
      console.log(response.success, "response")
      if (response.success) {
        this.snackbar.showSnackBar(response.message, 3000);
      } else {
        console.log(response, "response");
        this.snackbar.showSnackBar(response.message, 3000);
      }
    })

  }

  //  calander

  goToPage(pagename: any) {
    this.router.navigateByUrl(pagename);
  }

  viewPlan(planId: any) {
    this.router.navigate([`/plan-details`, planId]);
  }
  logout() {
    localStorage.removeItem('userType'); // Remove userType
    localStorage.removeItem('token');
    this.router.navigate([ROUTES.WELCOME]);
  }

  memerbershipPlans() {
    this.userService.getMembershipPlan((response) => {
      this.gymPlans = response.data.map((plan: any, index: number) => ({
        ...plan,
        features: plan.features ? JSON.parse(plan.features) : [],
        imagePath: `/assets/images/plan-${index + 1}.webp`
      }));
    });
  }
}
