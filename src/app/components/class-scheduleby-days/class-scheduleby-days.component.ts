import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-class-schedule',
  templateUrl: './class-scheduleby-days.component.html',
  styleUrls: ['./class-scheduleby-days.component.scss']
})
export class ClassSchedulebyDaysComponent implements OnInit {

  classScheduleData: any[] = []; // This will be filled from API
  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  constructor(
    private userService:UserService
  ){

  }

  ngOnInit() {
    // Simulate API call
    this.classScheduleData = [
      {
        "scheduleId": 1,
        "className": "Yoga",
        "startingTime": "12:20",
        "endTime": "13:20",
        "capacity": 10,
        "adminId": 1,
        "day": "Monday"
      },
      {
        "scheduleId": 1,
        "className": "Yoga",
        "startingTime": "12:20",
        "endTime": "13:20",
        "capacity": 10,
        "adminId": 1,
        "day": "Tuesday"
      },
      {
        "scheduleId": 3,
        "className": "Yoga",
        "startingTime": "12:20",
        "endTime": "13:20",
        "capacity": 78,
        "adminId": 1,
        "day": "Thursday"
      },
      {
        "scheduleId": 3,
        "className": "Yoga",
        "startingTime": "12:20",
        "endTime": "13:20",
        "capacity": 78,
        "adminId": 1,
        "day": "Friday"
      },
      {
        "scheduleId": 7,
        "className": "Yoga",
        "startingTime": "12:20",
        "endTime": "13:20",
        "capacity": 78,
        "adminId": 1,
        "day": "Sunday"
      },
      {
        "scheduleId": 7,
        "className": "Yoga",
        "startingTime": "12:20",
        "endTime": "13:20",
        "capacity": 78,
        "adminId": 1,
        "day": "Saturday"
      },
      {
        "scheduleId": 7,
        "className": "Yoga",
        "startingTime": "12:20",
        "endTime": "13:20",
        "capacity": 78,
        "adminId": 1,
        "day": "Wednesday"
      }
    ];
    this.classByDays()
  }



  classByDays() {
    let days = JSON.stringify(this.daysOfWeek)
    this.userService.getClassByDays(days,(response)=>{
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


}
