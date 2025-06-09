import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {

  selectedType: string = '';
  users: any[] = [];
  subject: string = '';
  message: string = '';

  constructor(private http: HttpClient,
    private userService : UserService
  ) {}

  fetchUsers() {
    if (!this.selectedType) return;
    console.log(this.selectedType,"this is selectedtype");
    this.userService.getUsersForNotification(this.selectedType,(response)=>{
      if(response.success){
        this.users = response.data;
      }else{
        console.error('Error fetching users', response);
        this.users = [];
      }
    
    })
  }

  sendMessages() {
    if (!this.subject || !this.message || this.users.length === 0) {
      alert("Please fill subject, message and select users.");
      return;
    }
    let obj= {
      subject:this.subject ,
      message: this.message,
      users: JSON.stringify(this.users) 
    }  
  this.userService.sendNotification(obj,(response)=>{
    if(response.success){
      alert("Messages sent successfully!");
        this.subject = '';
        this.message = '';
        this.users = [];
        this.selectedType = '';
    }else{
      alert("Failed to send notifications.");
    }

 })
  }

}
