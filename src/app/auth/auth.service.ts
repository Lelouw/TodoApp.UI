import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'authToken'; // Key to store token in localStorage
  private readonly baseApiUrl = 'https://localhost:7168/'; // Base API URL Rember to change to your local 

  constructor(private http: HttpClient) {}

  /**
   * Checks if the user is authenticated by verifying the token in localStorage.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  
 /**
   * Logs the user in by sending their credentials to the login API.
   */

  login(email: string, password: string): Observable<any> {
    const loginEndpoint = `${this.baseApiUrl}api/User/Login`;
    return this.http.post<any>(loginEndpoint, { email, password }).pipe(
      tap((response) => {
        if (response?.token) {
          this.setToken(response.token); // Store token in localStorage
          this.setEmail(email);// Store email in localStorage
        }
      })
    );
  }

 // Remove the token from localStorage
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

 // Get the token from localStorage

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
/**
   * Stores the token in localStorage.
   * @param token - The authentication token to store.
   */
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
// Store the email in localStorage

  public setEmail(email: string): void {
    localStorage.setItem("email", email);
  }

  // Return the headers with the Authorization token
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
