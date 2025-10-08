import { Component, OnInit,AfterViewInit,ViewChild ,Inject,TemplateRef} from '@angular/core';
import { Todo } from 'src/app/models/todo.model';
import { TodoService } from 'src/app/services/todo.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog'; 
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-hr',
  templateUrl: './hr.component.html',
  styleUrls: ['./hr.component.css']
})
export class HrComponent {
  leaveRequested = [
    { employeeName: "Joe Soap", days: 4, type: "Sick leave", balance: 9, startDate: "2024-11-27", returnDate: "2024-12-02" },
    { employeeName: "Jane Doe", days: 5, type: "Study leave", balance: 15, startDate: "2024-12-01", returnDate: "2024-12-07" },
    { employeeName: "Ricky Lake", days: 11, type: "Annual leave", balance: 11, startDate: "2024-12-13", returnDate: "2025-01-06" }
  ];
 
  public leaveRequests: any[] = [];
  claims = [
    { employeeName: "John Smith", amount: 2500, status: "Pending" },
    { employeeName: "Anna Brown", amount: 3200, status: "Approved" },
    { employeeName: "Peter White", amount: 1800, status: "Rejected" }
  ];
  @ViewChild('leaveRequestDialogTemplate') leaveRequestDialogTemplate!: TemplateRef<any>; 
  dialogRef!: MatDialogRef<any>; // Declare the dialogRef
  leaveRequest: FormGroup;
  public id: string = '';
  constructor(private todoServices:TodoService,public dialog: MatDialog,
    private snackBar: MatSnackBar ,
  ){this.leaveRequest = new FormGroup({
    leaveType: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    reason: new FormControl(''),
    attachment: new FormControl('') ,  // For file storage
    userId: new FormControl(''),
    leaveDays:new FormControl(''),
    department:new FormControl(''),
    employeeName:new FormControl(''),
    employeeEmail:new FormControl(''),
    isApproved: new FormControl(),
    comment: new FormControl(),
    id:new FormControl()

  });}
  
  ngOnInit(): void {
     
    
    this.getAllTodoList();  // Fetch all todos

    
  }
   // Refresh call getUserDetails and get all todos
   getAllTodoList() {
    this.todoServices.getTotalLeaves()
      .subscribe(
        (data: any[]) => {
          console.log('Total number of leave sent', data);
          console.log('Total number of leave sent', data);
          // Map the API data to match your component's leaveRequests structure
          this.leaveRequests = data.map(item => ({
            id:item.id,
            employeeName: item.employeeName,          // Mapping employee name
            employeeNo: item.employeeNo,              // Mapping employee number
            balance: item.balance,                    // Mapping balance (leave balance)
            type: item.leaveType,                     // Mapping leave type
            startDate: item.startDate,      // Mapping start date (converted to Date)
            returnDate: item.endDate,       // Mapping end date (converted to Date)
            reason: item.reason,                     // Mapping reason or comment
            attachment: item.attachment,               // Mapping attachment (base64 string or URL)
            userId: item.userId,                      // Mapping userId
            leaveDays: item.leaveDays,                // Mapping leave days (duration of leave)
            department: item.department,              // Mapping department name
            employeeEmail: item.employeeEmail,        // Mapping employee email
            isApproved: item.isApproved,
            comment:   item.comment, 
           
            // Mapping end date to return date
          }));
        },
        (error) => {
          console.error('Error fetching total leave days:', error);
        }
      );
  }
  
 // Open the Add Todo dialog
 openAddTodoDialog(data:any) {
  console.log('record', data);
  this.dialogRef = this.dialog.open(this.leaveRequestDialogTemplate, {
    width: '700px',
    height: 'auto',
    panelClass: 'custom-dialog-container' ,// Apply custom styles
  
  });
  this.leaveRequest.patchValue({
    id:data.id,
    leaveType: data.type,
    startDate: data?.startDate ? this.formatDate(data.startDate) : '',
    endDate: data?.returnDate ? this.formatDate(data.returnDate) : '',
    reason: data?.reason || '',
    attachment: data?.attachment || '',
    employeeName: data.employeeName, 
    employeeEmail: data.employeeEmail, 
    userId:data.userId,
    balance:data.balance,
    leaveDays: data.leaveDays, 
    comment:   data.comment, 

    
  });
  console.log('Total number of leave sent to the form',  this.leaveRequest.value);
}
formatDate(date: string): string {
  const dateObj = new Date(date);
  
  // Extract local year, month, and day to avoid UTC shift issues
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`; // Returns YYYY-MM-DD correctly
}
showSuccessMessage(message: string) {
  this.snackBar.open(message, 'Close', {
    duration: 6000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: ['success-snackbar'] // Ensure this class is applied
  });
}
submitLeaveRequest() {
     
 
}

declineRequest() {
  // Update leave request values
  this.leaveRequest.patchValue({ 
    isApproved: false,
   
  });

  console.log('Total number of leave sent on decline:', this.leaveRequest.value);

  // Call UpdateLeave with updated data
  this.todoServices.UpdateLeave(this.leaveRequest.value).subscribe({
    next: (todo) => {
      this.showSuccessMessage("Leave request declined successfully!");
      
      // Close dialog if it exists
      this.dialogRef?.close();
    },
    error: (err) => {
      console.error("Error declining leave request:", err);
  
    }
  });
}
approveRequest() {
  // Convert balance from string to number and subtract leaveDays
  let currentBalance = Number(this.leaveRequest.value.balance) || 0;
  let leaveDays = Number(this.leaveRequest.value.leaveDays) || 0;
  let newBalance = currentBalance - leaveDays;

  // Update leave request values
  this.leaveRequest.patchValue({ 
    isApproved: true,
    leaveDays: leaveDays,
    balance: newBalance.toString() // Convert back to string
  });

  console.log('Leave request updated:', this.leaveRequest.value);

  // Call UpdateLeave with updated data
  this.todoServices.UpdateLeave(this.leaveRequest.value).subscribe({
    next: (todo) => {
      this.showSuccessMessage("Leave request approved successfully!");
      
      // Close dialog if it exists
      this.dialogRef?.close();
    },
    error: (err) => {
      console.error("Error approving leave request:", err);
    }
  });
}

}
