
import { CanActivateFn ,Router } from '@angular/router';
import { inject } from '@angular/core'; 
import { AuthService } from './auth.service';
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // Allow navigation if the user is authenticated
  } else {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } }); // Redirect to login
    return false;
  }
};

