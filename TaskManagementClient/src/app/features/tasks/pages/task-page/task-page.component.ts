import { Component, inject, OnInit, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslocoService } from '@jsverse/transloco';
import { finalize } from 'rxjs';
import { TaskService } from '../../../../core/services/task.service';
import { TaskItem, CreateTaskRequest, UpdateTaskRequest } from '../../../../core/models/task.model';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { TaskListComponent } from '../../components/task-list/task-list.component';

@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [TaskFormComponent, TaskListComponent],
  templateUrl: './task-page.component.html',
})
export class TaskPageComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly toastr = inject(ToastrService);
  private readonly t = inject(TranslocoService);

  readonly tasks = signal<TaskItem[]>([]);
  readonly isSubmitting = signal(false);
  taskToEdit: TaskItem | null = null;

  ngOnInit(): void {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (response) => {
        if (response.success) this.tasks.set(response.data);
      },
    });
  }

  onSaveTask(task: CreateTaskRequest): void {
    this.isSubmitting.set(true);
    this.taskService.createTask(task).pipe(
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(
            this.t.translate('task.messages.addSuccess'),
            this.t.translate('task.messages.success')
          );
          this.loadTasks();
        }
      },
    });
  }

  onUpdateTask(event: { id: number; task: UpdateTaskRequest }): void {
    this.isSubmitting.set(true);
    this.taskService.updateTask(event.id, event.task).pipe(
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(
            this.t.translate('task.messages.updateSuccess'),
            this.t.translate('task.messages.success')
          );
          this.taskToEdit = null;
          this.loadTasks();
        }
      },
    });
  }

  onDeleteTask(id: number): void {
    if (!confirm(this.t.translate('task.messages.deleteConfirm'))) return;

    this.taskService.deleteTask(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(
            this.t.translate('task.messages.deleteSuccess'),
            this.t.translate('task.messages.success')
          );
          this.loadTasks();
        }
      },
    });
  }

  onEditTask(task: TaskItem): void {
    this.taskToEdit = { ...task };
  }

  onCancelEdit(): void {
    this.taskToEdit = null;
  }
}
