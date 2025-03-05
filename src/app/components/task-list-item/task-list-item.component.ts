import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../types/task.type';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-list-item',
  imports: [CommonModule, DatePipe],
  templateUrl: './task-list-item.component.html',
  styleUrl: './task-list-item.component.scss',
})
export class TaskListItemComponent {
  @Input() public task!: Task;
  @Output() public deleteTask = new EventEmitter<number>();
  @Output() public editTask = new EventEmitter<number>();

  public getTaskClass(): string {
    const today = new Date();
    const dueDate = new Date(this.task.dueDate);
    const diffDays = (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24);

    if (this.task.completed) return 'task-item--completed';
    if (diffDays < 0) return 'task-item--expired';
    if (diffDays <= 3) return 'task-item--warning';
    return '';
  }

  public onEdit(): void {
    this.editTask.emit(this.task.id);
  }
  public onDelete(): void {
    this.deleteTask.emit(this.task.id);
  }
}
