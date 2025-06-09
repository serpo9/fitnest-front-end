import { Component ,Inject} from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-assign-salary-dialog',
  templateUrl: './assign-salary-dialog.component.html',
  styleUrls: ['./assign-salary-dialog.component.scss']
})
export class AssignSalaryDialogComponent {
  salaryAmount: number | null = null;

  constructor(private dialogRef: MatDialogRef<AssignSalaryDialogComponent>,
    private userService:UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  ngOnInit() {

  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.salaryAmount) {
      let obj = {
        userId: this.data.id,
        salaryAmount : this.salaryAmount
      }

      this.userService.assignSalary(obj,(res)=>{
        this.dialogRef.close(res.data);
      })
    }
  }
}
