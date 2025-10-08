import { Component, OnInit,AfterViewInit,ViewChild ,Inject,TemplateRef} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit ,AfterViewInit {
  


  displayedColumns: string[] = ['description', 'startDate','endDate','leaveDays' ,'isApproved', 'actions'];

  dataSource = new MatTableDataSource<Todo>();
  
  
  selectedFile: File | null = null;
  todos:Todo[] =[];
  // New Todo object for adding todos
  newTodo :Todo ={
    id:'',
    title:'',
    createdDate:new Date(),
    isCompleted:false,
    completedDate:new Date(),
    userId:0,
    department:'',
    employeeName:'',
    employeeEmail:'',
    name:'',
    
  }
  leaveRequest: FormGroup;
  totalDaysLeft:number=0;
  public userName: string = '';
  public EmployeeNumber:string='';
  leaveDays: number = 0; // Initialize leaveDays
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild('leaveRequestDialogTemplate') leaveRequestDialogTemplate!: TemplateRef<any>; 
  @ViewChild('addTodoDialogTemplate') addTodoDialogTemplate!: TemplateRef<any>; // Template reference for Add Todo
  @ViewChild('editTodoDialogTemplate') editTodoDialogTemplate!: TemplateRef<any>; // Template reference for Edit Todo
  dialogRef!: MatDialogRef<any>; // Declare the dialogRef
 //selectedTodo: Todo = { id: '', title: '', createdDate: new Date(), isCompleted: false, completedDate: new Date(),userId:0 };

  constructor(private todoServices:TodoService,public dialog: MatDialog,
    private snackBar: MatSnackBar ,
  ){
    this.leaveRequest = new FormGroup({
      leaveType: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      reason: new FormControl('', [Validators.required, Validators.minLength(10)]),
      attachment: new FormControl('') ,  // For file storage
      userId: new FormControl(''),
      leaveDays:new FormControl(''),
      department:new FormControl(''),
      employeeName:new FormControl(''),
      employeeEmail:new FormControl(''),
      isCompleted: new FormControl(null),
      balance:new FormControl(''),
      employeeNo:new FormControl('')
    });
    
  }

   ngOnInit(): void {
     
    this.getUserDetails();  // Get user details
    this.getAllTodoList();  // Fetch all todos

    
    
   }
     // After view initialization, set up paginator and sorting
   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
 
  // Fetch user details based on email from localStorage
   getUserDetails() {
    this.todoServices.getUser(localStorage.getItem('email')).subscribe({
      next: (userDetails) => {
        console.log('User details:', userDetails);
  
        // Assign the userId from the API response to the newTodo object
        if (userDetails && userDetails.userID) {
          this.newTodo.department=userDetails.department;
          this.newTodo.userId = userDetails.userID;
          this.newTodo.name=userDetails.name;
          this.EmployeeNumber=userDetails.employeeNo;
        
           // Store the user's name in the public variable
       
          this.userName = userDetails.name;
       
          console.log('Updated newTodo:', this.newTodo);
        }
     
        this.todoServices.getTotalLeaveDaysById(userDetails.userID)
        .then((data) => {
          console.log('Total number of leave days remaining:', data);
          this.totalDaysLeft = data.totalLeaveDays;
        })
        .catch((error) => {
          console.error('Error fetching total leave days:', error);
        });
        this.getAllTodoListById(userDetails.userID);// Fetch todos for the user
      },error: (err) => {
        console.error('Error fetching user details:', err);
      },
    });
  }

   // Fetch all todos for the current user by their ID
  getAllTodoListById(userId: number){
    this.todoServices.getAllLeavesById(userId).subscribe({next:(todos) =>{ 
      
        this.dataSource.data = todos;// Update the data source for the table
        console.log('Todos for current user:', todos);
 }})
   }

   
  // Refresh call getUserDetails and get all todos
   getAllTodoList(){
    this.getUserDetails();
   
   }
    
   


   // Mark todo as completed or uncompleted
   onCompletedChange(id: string, event: any): void {
    // Extract the new completion state from the checkbox event
    const isCompleted = event.checked;
  
    // Find the todo item by ID from your current data source
    const todo = this.dataSource.data.find((item) => item.id === id);
  
    if (todo) {
     
      todo.isCompleted = isCompleted;
  
      // Call the service to update the todo in the backend
      this.todoServices.UpdateTodoById(id, todo).subscribe({
        next: (res) => {
         
          this.showSuccessMessage("Todo Completed successfully!");//sucess message
          this.getAllTodoList();// Refresh todo list
        },
        error: (err) => {
          console.error('Error updating todo:', err);
        },
      });
    }
  }
  

 // Apply filter for searching todos
   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); //Reset paginator to first page after filter
    }
  }

 

   // Open the Add Todo dialog
  openAddTodoDialog() {
    this.dialogRef = this.dialog.open(this.leaveRequestDialogTemplate, {
      width: '700px',
      height: 'auto',
      panelClass: 'custom-dialog-container' ,// Apply custom styles
    
    });
  }
    

  cancel() {
    if (this.dialogRef) {
      this.dialogRef.close(); // Close the dialog
    }
    this.newTodo.title='';// Clear the input field
  
  }
    // Show success message using MatSnackBar
  
    showSuccessMessage(message: string) {
      this.snackBar.open(message, 'Close', {
        duration: 6000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['success-snackbar'] // Ensure this class is applied
      });
    }
    
    

    onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file && file.size < 5 * 1024 * 1024) { // 5MB size limit
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          this.leaveRequest.patchValue({ attachment: base64String });
        };
        reader.readAsDataURL(file); // Converts file to Base64
      } else {
        alert("File size must be under 5MB.");
      }
    }
    
    submitLeaveRequest() {
     
      this.leaveRequest.patchValue({ userId: this.newTodo.userId });
      this.leaveRequest.patchValue({ leaveDays: this.leaveDays });
      this.leaveRequest.patchValue({ employeeEmail: localStorage.getItem('email') });
      this.leaveRequest.patchValue({ employeeName: this.newTodo.name});
      this.leaveRequest.patchValue({ department: this.newTodo.department});
      this.leaveRequest.patchValue({ isCompleted: null});
      this.leaveRequest.patchValue({ balance: (this.totalDaysLeft).toString()});
      this.leaveRequest.patchValue({ employeeNo: this.EmployeeNumber });
      this.todoServices.AddNewLeave(this.leaveRequest.value).subscribe({
        next:(todo) =>{
          this.getAllTodoList();
          this.showSuccessMessage("Leave added successfully!");
          if (this.dialogRef) {
            this.dialogRef.close(); // Close the dialog immediately after adding the new todo
          }
             // Reset newTodo object and form values
        
    
            //form.resetForm(); 
        }
  
       });
  
      console.log("Form submitted!",  this.selectedFile);
      console.log("Leave Request Submitted:", this.leaveRequest.value);
      if (this.leaveRequest.valid) {
        console.log("Leave Request Submitted:", this.leaveRequest.value);
       
       
    
      
        this.leaveRequest.reset(); // Reset form after submission
      } else {
      
      }
    }
  
    cancels() {
      this.leaveRequest.reset();
    }
    calculateLeaveDays() {
      const startDate = this.leaveRequest.get('startDate')?.value;
      const endDate = this.leaveRequest.get('endDate')?.value;
    
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Calculate difference in milliseconds and convert to days
        const timeDifference = end.getTime() - start.getTime();
        const totalDays = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1; // Include the start date
    
        if (totalDays < 1) {
          alert("End date must be after or equal to start date.");
          this.leaveRequest.patchValue({ endDate: '' }); // Reset invalid end date
          return 0;
        }
    
        return totalDays;
      }
      return 0;
    }
    
}
