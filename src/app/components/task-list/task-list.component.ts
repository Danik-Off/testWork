import { Component, OnInit } from '@angular/core';
import { Task } from '../../types/task.type';
import { TaskService } from '../../services/task.service';
import { CommonModule, DatePipe } from '@angular/common';
import { TaskListItemComponent } from '../task-list-item/task-list-item.component';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, TaskListItemComponent, DragDropModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  public tasks$: Observable<Task[]>;

  public constructor(
    private readonly taskService: TaskService,
    private readonly router: Router
  ) {
    this.tasks$ = taskService.tasks$;
    this.tasks$.subscribe((l) => console.log(l));
  }

  public addTask(): void {
    this.router.navigate(['/task/new']);
  }
  public editTask(id: number): void {
    this.router.navigate([`/task/edit/${id}`]);
  }

  public deleteTask(id: number): void {
    this.taskService.deleteTask(id);
  }

  public drop(event: CdkDragDrop<Task[]>): void {
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;
    const direction = currentIndex - previousIndex;
    this.taskService.moveTask(previousIndex, direction);
  }
}
