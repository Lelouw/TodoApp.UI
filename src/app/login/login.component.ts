
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Email field with required and email validators
      password: ['', [Validators.required, Validators.minLength(6)]]  // Password field with required and min length validators
    });
  }
  onSubmit(): void {
      this.router.navigate(['/todos']);
  }
  // Method that is triggered when the form is submitted
  onSubmitold(): void {
      this.router.navigate(['/todos']);
    // If the form is invalid, stop the submission
    if (this.loginForm.invalid) {
      return;
    }
// Set isLoading to true when the form is being submitted
    this.isLoading = true;
    const { email, password } = this.loginForm.value;
 // Call the login method from AuthService to authenticate the user
    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.isLoading = false;

        this.router.navigate(['/todos']);  // Navigate to the dashboard after successful login
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Invalid login credentials';  // Show error if login fails
      }
    });
  }
// Getter for the email form control (for easy access in template)
  get email() {
    return this.loginForm.get('email');
  }
// Getter for the password form control (for easy access in template)
  get password() {
    return this.loginForm.get('password');
  }
}
