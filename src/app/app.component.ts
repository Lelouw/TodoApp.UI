import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TodoApp.UI';
  constructor(private authService: AuthService, private router: Router) {}

  // function to logOut
  logout(): void {
    this.authService.logout(); // Clears the token
    this.router.navigate(['/login']); // Redirects to the login page
  }
}
