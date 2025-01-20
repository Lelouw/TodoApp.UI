import { Component, OnInit } from '@angular/core';
import { Todo } from 'src/app/models/todo.model';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit{
  todos:Todo[] =[];
  newTodo :Todo ={
    id:'',
    description:'',
    createdDate:new Date(),
    isCompleted:false,
    completedDate:new Date()
  }
  constructor(private todoServices:TodoService){}

   ngOnInit(): void {
     
    this.getAllTodoList();
   }
   getAllTodoList(){
    this.todoServices.getAllListTodos().subscribe({next:(todos) =>{this.todos=todos;}})
   }
   addTodo(){
    console.log("hi");
     this.todoServices.AddNewTodo(this.newTodo).subscribe({
      next:(todo) =>{
        this.getAllTodoList();
      }

     });
   }

   onCompletedChange(id:string ,todo:Todo){
    todo.isCompleted=!todo.isCompleted;
    this.todoServices.UpdateTodoById(id,todo).subscribe({
      next:(res) =>{
        this.getAllTodoList();
      }

     });
   }
   DeleteTodoById(id :string){
    //todo.isCompleted=!todo.isCompleted;
    this.todoServices.DeleteTodoById(id).subscribe({
      next:(response) =>{
        this.getAllTodoList();
      }

     });
   }
   
}
