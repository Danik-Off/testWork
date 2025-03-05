import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../types/task.type';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  @Input() public task: Task = {
    id: 0,
    title: '',
    description: '',
    dueDate: new Date(),
    completed: false,
  };

  public taskForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.taskForm = this.buildForm();
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        const taskId = Number(id);

        const taskToEdit = this.taskService.getTaskById(taskId);
        if (taskToEdit) {
          this.task = taskToEdit;

          this.taskForm.patchValue({
            title: taskToEdit.title,
            description: taskToEdit.description,
            dueDate: this.formatDateForInput(taskToEdit.dueDate),
          });
        }
      }
    });
  }

  public saveTask(): void {
    if (this.taskForm.invalid) {
      alert('Заполните все обязательные поля');
      return;
    }
    const formValue = this.taskForm.getRawValue();
    if (this.task.id) {
      const updatedTask: Task = {
        ...this.task,
        ...formValue,
        dueDate: new Date(formValue.dueDate),
      };
      this.taskService.editTask(updatedTask);
    } else {
      const newTask: Task = {
        id: Date.now(),
        ...formValue,
        dueDate: new Date(formValue.dueDate),
        completed: false,
      };
      this.taskService.addTask(newTask);
    }
    this.close();
  }

  public closeTask(): void {
    if (this.task && this.task.id) {
      const updatedTask = { ...this.task, completed: true };
      this.taskService.editTask(updatedTask);
      this.close();
    }
  }

  public openTask(): void {
    if (this.task && this.task.id) {
      const updatedTask = { ...this.task, completed: false };
      this.taskService.editTask(updatedTask);
      this.close();
    }
  }

  public cancel(): void {
    this.close();
  }

  public close(): void {
    this.router.navigate(['']);
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      dueDate: ['', [Validators.required]],
    });
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }
}
