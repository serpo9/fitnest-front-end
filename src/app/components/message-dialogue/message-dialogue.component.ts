import { Component, Inject, EventEmitter, Output } from "@angular/core";
import { UserService } from "src/app/services/user-service/user.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SnackBarService } from "src/app/services/snack-bar/snack-bar.service";
@Component({
  selector: "app-message-dialogue",
  templateUrl: "./message-dialogue.component.html",
  styleUrls: ["./message-dialogue.component.scss"],
})
export class MessageDialogueComponent {
  users: any[] = [];
  subject: string = "";
  message: string = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private dialogRef: MatDialogRef<MessageDialogueComponent>,
    private snackbar: SnackBarService
  ) { }

  @Output() sendMessage = new EventEmitter<{
    subject: string;
    message: string;
  }>();
  @Output() close = new EventEmitter<void>();

  onSend() {
    this.users.push(this.data);
    let obj = {
      users: JSON.stringify(this.users),
      subject: this.subject,
      message: this.message,
    };
    this.userService.sendNotification(obj, (res) => {
      if (res.success) {
        this.dialogRef.close();
        this.snackbar.showSnackBar('successfully sent message', 3000)
      } else {
        this.snackbar.showSnackBar('Not sent', 3000)
      }

    })
  }

  onClose() {
    this.dialogRef.close();
  }
}
