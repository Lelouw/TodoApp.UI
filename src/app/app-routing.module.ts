import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodosComponent } from './components/todos/todos.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth/auth.guard';
import { HrComponent } from './components/hr/hr.component';
const routes: Routes = [

  { path: 'login', component: LoginComponent },  // Route for the login page
  { path: 'register', component: RegisterComponent },  // Route for the registration page
  
  { path: 'hr', component:HrComponent },
  {path:'todos',component:TodosComponent},
  //{path:'todos',component:TodosComponent, canActivate: [authGuard]},// The 'authGuard' ensures the user is authenticated
  { path: '**', redirectTo: 'login' } // Default Router
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
