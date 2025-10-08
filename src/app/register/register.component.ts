import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoService } from 'src/app/services/todo.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;
  hide = true; // For toggling password visibility
  departments: string[] = ['HR', 'IT', 'SALES', 'LAW'];
  rolesMap: { [key: string]: string[] } = {
    HR: ['HR Manager', 'Recruitment Specialist', 'Employee Relations Officer', 'Payroll Administrator', 'Training & Development Coordinator', 'HR Business Partner', 'Benefits Administrator'],
    IT: ['Software Developer', 'IT Support Specialist', 'Network Administrator', 'Database Administrator', 'Cybersecurity Analyst', 'DevOps Engineer', 'Systems Architect', 'Cloud Engineer'],
    SALES: ['Sales Representative', 'Account Manager', 'Sales Executive', 'Business Development Manager', 'Customer Success Manager', 'Inside Sales Coordinator', 'Regional Sales Manager'],
    LAW: ['Legal Advisor', 'Paralegal', 'Contract Specialist', 'Corporate Lawyer', 'Compliance Officer', 'Litigation Associate', 'Intellectual Property Consultant']
  };
  filteredRoles: string[] = [];
  constructor(private fb: FormBuilder,private todoServices:TodoService,private router: Router) {
    // Initializing the registration form with validation rules
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      Lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      department: ['', Validators.required],
      role: ['', Validators.required],
      EmployeeNo :['', Validators.required]
    });
  }
  // Method called when the form is submitted
  onSubmit() {
      // Check if the form is valid before proceeding
    if (this.registerForm.valid) {
      console.log('Form Submitted:', this.registerForm.value);

      // Call the UserRegistration method from TodoService to register the user
      this.todoServices.UserRegistration(this.registerForm.value).subscribe({
        next:(todo) =>{
     
        
          this.registerForm.reset();
          this.router.navigate(['/login']); 
    
            // If registration is successful (response is 1), reset the form and navigate to the login page
            if(todo===1){
            this.registerForm.reset();
            this.router.navigate(['/login']); 
        }

        }
  
       });
      
    }
  }
 // Method to toggle password visibility
  togglePasswordVisibility() {
    this.hide = !this.hide;
  }
  onDepartmentChange(selectedDepartment: string) {
    this.filteredRoles = this.rolesMap[selectedDepartment] || [];
    this.registerForm.get('role')?.setValue(''); // Reset role selection
  }
}
