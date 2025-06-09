import { Component, OnInit } from '@angular/core';
import { faShareSquare, faCalendar, faUserAlt, faShoppingBag, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { ThemePalette } from '@angular/material/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { ROUTES } from 'src/app/app-routes.config';

@Component({
  selector: 'app-getinfo',
  templateUrl: './getinfo.component.html',
  styleUrls: ['./getinfo.component.scss']
})
export class GetinfoComponent implements OnInit {
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
  disabled: boolean = false;
  showSpinners: boolean = true;
  touchUi: boolean = false;
  disableMinute: boolean = false;
  hideTime: boolean = false;
  dateControl = new FormControl();
  selectedDate: Date;
  userId: any;
  distance: any;
  getTicketId: any;
  
  sessions = [
    { trainer: "John Doe", className: "Personal Training", timing: "10:00 AM - 12:00 PM", duration: "4 Months", startDate: "2025-02-10", description: "One-on-one coaching for weight loss, muscle gain, endurance, or flexibility.", image: "/assets/images/personaltraining.jpeg" },
    { trainer: "Alex Smith", className: "Muscle Gain", timing: "12:30 PM - 2:30 PM", duration: "4 Months", startDate: "2025-02-15", description: "Boost muscle strength and endurance with resistance training.", image: "/assets/images/musclegain.jpg" },
    { trainer: "Sarah Johnson", className: "Weight Loss", timing: "3:00 PM - 5:00 PM", duration: "4 Months", startDate: "2025-02-20", description: "Burn fat efficiently with high-intensity workouts.", image: "/assets/images/weightloss.jpg" },
    { trainer: "Emily Davis", className: "Yoga", timing: "5:30 PM - 7:30 PM", duration: "4 Months", startDate: "2025-01-25", description: "Enhance flexibility, strength, and mental clarity through guided yoga sessions.", image: "/assets/images/yoga.webp" },
    { trainer: "Michael Brown", className: "Spinning & Cardio", timing: "8:00 PM - 10:00 PM", duration: "4 Months", startDate: "2025-03-01", description: "Enhance stamina and cardiovascular health with spinning and cardio.", image: "/assets/images/spinningndcardio.webp" }
  ];
  classNamehead: any;
  descriptionhead: any;
  
  constructor(private userService: UserService, private router: Router, private dialogService: DialogService) {
    this.selectedDate = new Date();
    this.selectedAmPm = this.selectedDate.getHours() < 12 ? 'AM' : 'PM';
  }

  ngOnInit(): void {
     this.sessions = history.state.sessionData;
    this.getAllTrainerSchedules();
  }

  get formattedClassName(): string {
    return this.classNamehead ? this.classNamehead.replace(/_/g, ' ').toUpperCase() : '';
  }
  


  contactUs() {
    // this.router.navigate([ROUTES.PRICE_PLAN]);
  }

  isUpcoming(startDate: string): boolean {
    return new Date(startDate) > new Date();
  }

  getAllTrainerSchedules() {
    const obj = this.sessions;
    this.userService.getAllTrainerSchdeules(obj, (res) => {
      if (!res.success || !res.data.length) {  
        // If API returns an empty data array, show the "No classes available" message
        this.sessions = [];  // Ensures *ngIf="sessions.length === 0" works
        this.classNamehead = "No Classes Available";
        this.descriptionhead = "Currently, no sessions are available. Please check back later.";
      } else {
        // Update UI with session details
        this.classNamehead = res.data[0].className;
        this.descriptionhead = res.data[0].description;
  
        // Map API response to match the session structure
        this.sessions = res.data.map((session: { trainerName: any; className: string; durationHours: any; durationMonths: any; startfrom: any; description: string }) => ({
          trainer: session.trainerName,
          className: session.className,
          timing: `${session.durationHours} PM`,  // Adjust format if needed
          duration: `${session.durationMonths} Months`,
          startDate: session.startfrom ? session.startfrom : "TBD",
          description: session.description,
          image: "/assets/images/yoga.webp" // Default image, update if API provides one
        }));
      }
    });
  }
  


  // goToPage(pagename: any) {
  //   this.router.navigateByUrl(pagename);
  //   }
}
