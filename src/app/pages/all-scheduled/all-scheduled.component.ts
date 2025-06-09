import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { DialogService } from 'src/app/services/dialog-service/dialog.service';
import { EditScheduleComponent } from 'src/app/dashboard/edit-schedule/edit-schedule.component';
import { TrainerSelectionDialogComponent } from 'src/app/components/trainer-selection-dialog/trainer-selection-dialog.component';
import { ROUTES } from 'src/app/app-routes.config';
import { duration } from 'moment';

export interface UserInfo {
  name: string;
  number: string;
  email: string;
  gender: string;
  userStatus: string;
}
export interface TrainerInfo {
  id: any;
  name: string;
  number: string;
  email: string;
  specialization: string;
  status: string; // Changed from "approval" to "status"
}

export interface getTrainerSchedules {
  id: any;
  startfrom: string;
  duration: string;
  time: string;
  actions: string;
  capacity:string;
}
export interface TrainerInfo {
  id: any;
  name: string;
  specialization: string;
  status: string; // Example: "Active", "Inactive"
}



@Component({
  selector: 'app-all-scheduled',
  templateUrl: './all-scheduled.component.html',
  styleUrls: ['./all-scheduled.component.scss']
})
export class AllScheduledComponent {

 @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  sidenavOpen: boolean = true;
  selectedFilter: string = 'Search1';
  trainerColumns: string[] = [  'assignedClass',  'start','end', 'trainer','capacity','filledCapacity','assign','delete','edit' ];
  displayedColumns: string[] = ['name', 'number', 'email', 'gender', 'userStatus'];
  trainerDetailsColumns: string[] = ['trainername', 'trainernumber', 'traineremail', 'specialization', 'status'];
  dateRange = {
    start: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days before today
    end: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
  };
  searchTerm: string = '';
  cachedData: getTrainerSchedules[] = []; // Store cached
  filteredData:getTrainerSchedules[] = []; // Store filtered data

  trainerDetailsDataSource = new MatTableDataSource<TrainerInfo>([]);
  dataSource = new MatTableDataSource<UserInfo>([]);
  getTrainerSchedulesData = new MatTableDataSource<getTrainerSchedules>([]);
  trainersBySpecialization: { [key: string]: TrainerInfo[] } = {};


  constructor(
    private http: HttpClient,
    private router: Router,
    private matdialog: MatDialog,
    private userService: UserService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadLocalStorageData();
    this.getSchedules();
    this.getAllTrainer();
    this.dataSource.filterPredicate = (data: UserInfo, filter: string) =>
      data.name.toLowerCase() === filter.toLowerCase();
  }
  selectedFiltertab(activeclass :any){
    this.selectedFilter = activeclass
    
  }

  loadLocalStorageData(): void {
    const storedData = localStorage.getItem('userList');
    if (storedData) {
      try {
        const userInfoData: UserInfo[] = JSON.parse(storedData);
      } catch (e) {
        console.error('Error parsing localStorage data:', e);
      }
    } else {
    }
  }


  getinfo(routes: string) {
    console.log(routes,"routes on the page")
    this.sidenavOpen = true
    // this.activelink = routes;
    this.router.navigate([routes]);

  }

  openTrainerPopup(classElement: any) {
    const dialogRef = this.matdialog.open(TrainerSelectionDialogComponent, {
      width: '400px',
      data: { trainersBySpecialization: this.trainersBySpecialization,
        classData: classElement
       }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        classElement.trainer = result.trainerName;
      }
    });
  }

  getSchedules(): void {
    this.userService.getSchedules((res) => {
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

        if (this.cachedData.length === 0) {
          this.cachedData = formattedData;
        }
        this.filteredData = formattedData;
        this.getTrainerSchedulesData.data = formattedData;
        this.getTrainerSchedulesData.paginator = this.paginator; // Assign paginator
      }
    });
  }

  getAllTrainer(): void {
    let fromDate = null;
    let toDate = null;
    this.userService.getallTrainerByStatus(fromDate, toDate,'active','', (res) => {
        if (!res.success) {
            return;
        }

        const formattedData: TrainerInfo[] = res.data.map((user: any) => ({
            id: user.id,
            name: user.name,
            specialization: user.specialization || "General",
            status: user.status, // Assuming status comes from API
        }));

        // Categorize trainers by specialization
        this.trainersBySpecialization = formattedData.reduce<Record<string, TrainerInfo[]>>((acc, trainer) => {
          if (!acc[trainer.specialization]) {
              acc[trainer.specialization] = [];
          }
          acc[trainer.specialization].push(trainer);
          return acc;
      }, {});
      

        console.log("Trainers grouped by specialization:", this.trainersBySpecialization);
    });
}


openEditDialog(element:any):void
{
  const dialogRef = this.matdialog.open(EditScheduleComponent,{
    width:'400px',
    data: { 
      scheduleData : element
    },
  })
  dialogRef.afterClosed().subscribe((updatedScheduleData) => {
    if (updatedScheduleData) {
      // Create a new array with the updated object
      this.getTrainerSchedulesData.data = this.getTrainerSchedulesData.data.map((schedule) =>
        schedule.id === updatedScheduleData.id ? { ...updatedScheduleData } : schedule
      );
      this.cdr.detectChanges(); // ✅ Force UI update
    }
  });
  
  

}


deleteSchedule(schedule:any):void{
  this.dialogService.open('Confirmation', 'Are you sure you want to delete?', '', true, 'Yes', (()=>{
    this.userService.deleteSchedule(schedule.id,(res)=>{
      if(res.success){
        const updatedData = this.getTrainerSchedulesData.data.filter(s => s.id !== schedule.id);
        this.getTrainerSchedulesData.data = updatedData;    }
        console.log("response",res);
        this.snackBar.open("Schedule deleted successfully!","close",{
            duration:3000
        });
    })
  }), 'No')
}


formatDate(date: any): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = d.getFullYear(); // Full year

  return `${year}-${month}-${day}`;
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


getSpecializations(): string[] {
  return Object.keys(this.trainersBySpecialization);
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
