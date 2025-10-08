import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo.model';


// Interface to structure the user details response from the API
export interface UserDetails {
  name: string;
  userID: number;
  department: string;
  employeeNo:string
}


@Injectable({
  providedIn: 'root'
})
export class TodoService {
   // The base API URL for all HTTP requests.Rember To change it for own local host

  baseApiUrl:string ="https://localhost:7168/";
 // Default headers for the HTTP requests
  constructor(private http:HttpClient) { }
  Header: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'responseType': 'json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
  });
 // Add a new Todo item to the list
 AddNewLeave(newTodo:Todo):Observable<Todo>{
  newTodo.id='00000000-0000-0000-0000-000000000000';
  return this.http.post<Todo>(this.baseApiUrl+'api/Leave',newTodo)
}
UpdateLeave(newTodo: Todo): Observable<Todo> {
  const url = `${this.baseApiUrl}api/Leave/update-leave/${newTodo.id}`;
  return this.http.put<Todo>(url, newTodo);
}
// Get all Todo items for a specific user by userId
getAllLeavesById(userId: number):Observable<Todo[]>{
  return this.http.get<Todo[]>(this.baseApiUrl+'api/Leave/'+userId);
}
// Get all Todo items for a specific user by userId
getTotalLeaveDaysById(userId: number): Promise<any> {
  return this.http.get<any>(this.baseApiUrl + 'api/Leave/get-total-leave-days/' + userId).toPromise();
}
// Get all Todo items for a specific user by userId
getTotalLeaves() {
  return this.http.get<any>(this.baseApiUrl + 'api/Leave/all-leaves');
}
  updateTodoTitle(id: string, newTitle: string): Observable<any> {

    const url = `${this.baseApiUrl}api/TodoList/${id}/title`; 
    return this.http.put(url, JSON.stringify(newTitle), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
   // Get all Todo items
  getAllListTodos():Observable<Todo[]>{
    return this.http.get<Todo[]>(this.baseApiUrl+'api/TodoList');
  }
  // Get all Todo items for a specific user by userId
  getAllListTodoById(userId: number):Observable<Todo[]>{
    return this.http.get<Todo[]>(this.baseApiUrl+'api/TodoList/'+userId);
  }
   // Get user details by email (used for authentication or fetching user-specific data)
  getUser(email: string | null): Observable<UserDetails> {
    return this.http.get<UserDetails>(this.baseApiUrl+'api/User/GetUserByEmail/'+email);
  }
  // Add a new Todo item to the list
  AddNewTodo(newTodo:Todo):Observable<Todo>{
    newTodo.id='00000000-0000-0000-0000-000000000000';
    return this.http.post<Todo>(this.baseApiUrl+'api/TodoList',newTodo)
  }

   // Update a specific Todo item by its ID
  UpdateTodoById(id :string,todo:Todo):Observable<Todo>{
    
    return this.http.put<Todo>(this.baseApiUrl+'api/TodoList/'+id,todo);
  }
  // Delete a specific Todo item by its ID
  DeleteTodoById(id :string):Observable<Todo>{
    
    return this.http.delete<Todo>(this.baseApiUrl+'api/TodoList/'+id);
  }
    // Update the title of a specific Todo item by its ID
  UpdateTodoTitleById(id :string,todo:Todo):Observable<Todo>{
    
    return this.http.put<Todo>(this.baseApiUrl+'api/TodoList/'+id,todo);
  }
   // Register a new user in the system
  UserRegistration(data:any){
    
    return this.http.post(this.baseApiUrl+'api/User/Register',data,{headers: this.Header})
  }

}
