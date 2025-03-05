import { Injectable } from '@angular/core';
import { Task } from '../types/task.type';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  public tasks$: Observable<Task[]>;

  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);

  public constructor() {
    this.loadTasks();
    this.tasks$ = this.tasksSubject.asObservable();
  }

  public addTask(task: Task): void {
    const newTask = { ...task, id: new Date().getTime() };
    this.tasks.push(newTask);
    this.updateTasks();
  }

  public editTask(updatedTask: Task): void {
    const index = this.tasks.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.updateTasks();
    }
  }

  public deleteTask(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.updateTasks();
  }

  public getTaskById(id: number): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  public moveTask(index: number, direction: number): void {
    if (index + direction >= 0 && index + direction < this.tasks.length) {
      [this.tasks[index], this.tasks[index + direction]] = [
        this.tasks[index + direction],
        this.tasks[index],
      ];
      this.updateTasks();
    }
  }

  private loadTasks(): void {
    const savedTasks = localStorage.getItem('tasks');
    console.log(savedTasks);
    this.tasks = savedTasks ? JSON.parse(savedTasks) : [];
    this.tasksSubject.next(this.tasks);
  }

  private saveTasks(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  private updateTasks(): void {
    this.saveTasks();
    console.log(this.tasks);
    this.tasksSubject.next([...this.tasks]);
  }
}
