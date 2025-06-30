import { Component, OnInit ,ViewChild} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user-service/user.service';
import { ROUTES } from 'src/app/app-routes.config';

export interface getTrainerSchedules {
  id: any;
  startfrom: string;
  duration: string;
  time: string;
  actions: string;
  capacity:string;
}
@Component({
  selector: 'app-yoursessions',
  templateUrl: './yoursessions.component.html',
  styleUrls: ['./yoursessions.component.scss']
})
export class YoursessionsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  isMobile: boolean = false;
  sidenavOpen: boolean = true;
  userId: any;
  searchTerm:any;
  isScrolled = false;
  isNavbarVisible = false;
  cachedData: getTrainerSchedules[] = []; // Store cached
  sessions: any[] = []; // Dynamically populated sessions
  selectedFilter: string = 'Search1';
  trainerColumns: string[] = [  'assignedClass',  'start','end','duration' ];
  dateRange = {
    start: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days before today
    end: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
  };
  getTrainerSchedulesData = new MatTableDataSource<getTrainerSchedules>([]);
  classScheduleData: any[] = []; // This will be filled from API
  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(
    private userService: UserService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });

    this.classByDays();
  }


  classByDays() {
    let days = JSON.stringify(this.daysOfWeek)
    this.userService.getTrainerClassByDays(days,(response)=>{
      this.classScheduleData=response.data;
    })
    // return this.classScheduleData.filter(c => c.day.toLowerCase() === day.toLowerCase());
  }
  getClassesByDay(day:any) {
      return this.classScheduleData.filter(c => c.day.toLowerCase() === day.toLowerCase());

    // this.daysOfWeek.forEach(day => {
    //   this.groupedClassData[day] = this.classScheduleData.filter(item => item.day === day);
    // });
  }

  contactUs() {
  }


  getinfo(routes: string) {
    this.sidenavOpen = true
    this.router.navigate([routes]);

  }
  goToPage(pagename: string) {
    this.router.navigateByUrl(pagename);
  }

  getTrainerSchedules() {
    this.userService.getTrainerSchedules((res) => {
      if (!res.success) {
      } else {
        const formattedData: getTrainerSchedules[] = res.data.map((Schedules: any) => ({
            id: Schedules.class_id,
            name: Schedules.trainer_name,
            number: Schedules.trainer_phone || 'N/A',
            email: Schedules.trainer_email,
            assignedClass: Schedules.class_name || 'Not Provided',
            startfrom: Schedules.start_time|| 'Pending', 
            endTime:Schedules.end_time|| 'Pending', 
            duration: this.getDuration(Schedules.start_time,Schedules.end_time)|| 'Pending', 
            status:Schedules.class_status,
            trainer:Schedules.trainer_name || 'Not Assigned',
            description:Schedules.class_description,
            capacity:Schedules.capacity,
            filledCapacity:Schedules.filledCapacity || 0,
            time:Schedules.time,
  
  
          
        }));
        this.getTrainerSchedulesData.data = formattedData;
          this.getTrainerSchedulesData.paginator = this.paginator;
        // Map API response to session format
        this.sessions = res.data.map((session: any) => ({
          // trainer: session.trainerName,
          className: session.class_name, // Format class name
          startTime: session.start_time, // Placeholder timing, adjust as needed
          endTime : session.end_time,
          duration : this.getDuration(session.start_time,session.end_time),
          description: session.description || "hello ",
          // image: this.getSessionImage(session.className), // Get image dynamically
         buttonText: "Join Now"
        }));
      }
    });
  }
   getDuration(startTime:any, endTime:any):string {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
  
    const start:any = new Date();
    start.setHours(startHour, startMin, 0);
  
    const end:any = new Date();
    end.setHours(endHour, endMin, 0);
  
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
  
    return `${hours}h ${minutes}m`;
  }
  
  // Example
  
  

  getSessionImage(className: string): string {
    const images: Record<string, string> = {
      "yoga_session": "/assets/images/yoga.webp",
      "personal_training": "/assets/images/personaltraining.jpeg",
      "muscle_gain": "/assets/images/musclegain.jpg",
      "weight_loss": "/assets/images/weightloss.jpg",
      "spinning & cardio": "/assets/images/spinningndcardio.webp"
    };
    return images[className.toLowerCase()] || "/assets/images/musclegain.jpg";
  }
  logout(){
      localStorage.removeItem('userType'); // Remove userType
      localStorage.removeItem('token');
      this.router.navigate([ROUTES.WELCOME]);
    }

    searchSchedules (searchTerm:any,status:any,activeclass:any){
      this.selectedFilter = activeclass
      let fromDate = this.dateRange.start;
      let toDate = this.dateRange.end;
    
      const formattedFromDate = fromDate ? this.formatDate(fromDate) : null;
      const formattedToDate = toDate ? this.formatDate(toDate) : null;  
      this.userService.searchSchedules(searchTerm,formattedFromDate,formattedToDate,status,(res) => {
        if (!res.success) {
        } else {
          const formattedData: getTrainerSchedules[] = res.data.map((Schedules: any) => ({
            id: Schedules.class_id,
              name: Schedules.trainer_name,
              number: Schedules.trainer_phone || 'N/A',
              email: Schedules.trainer_email,
              assignedClass: Schedules.class_name || 'Not Provided',
              startfrom: Schedules.startfrom|| 'Pending', 
              endTime:Schedules.endTime|| 'Pending', 
              duration: Schedules.class_duration_months || 'Pending', 
              status:Schedules.class_status,
              trainer:Schedules.trainer_name || 'Not Assigned',
              description:Schedules.class_description,
              capacity:Schedules.capacity,
              filledCapacity:Schedules.filledCapacity || 0,
              time:Schedules.time,
    
    
            
          }));
    
          this.getTrainerSchedulesData.data = formattedData;
          this.getTrainerSchedulesData.paginator = this.paginator; // Assign paginator
        }
      });}

      formatDate(date: any): string {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = d.getFullYear(); // Full year
      
        return `${year}-${month}-${day}`;
      }

    onSearchChange() {
      if (!this.searchTerm.trim()) {
        this.resetFilters(); // Call reset when input is empty
      }
    }
    resetFilters() {
      this.getTrainerSchedulesData.data = this.cachedData;
    }
  
}
