import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { TaskItem, Priority, TaskStatus } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [NgClass, TranslocoModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  @Input() tasks: TaskItem[] = [];
  @Output() edit = new EventEmitter<TaskItem>();
  @Output() delete = new EventEmitter<number>();

  getPriorityBadgeClass(priority: Priority): string {
    switch (priority) {
      case Priority.High:   return 'bg-danger';
      case Priority.Medium: return 'bg-warning text-dark';
      case Priority.Low:    return 'bg-success';
      default:              return 'bg-secondary';
    }
  }

  getStatusBadgeClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.Done:       return 'bg-success';
      case TaskStatus.InProgress: return 'bg-info text-dark';
      case TaskStatus.Todo:       return 'bg-secondary';
      default:                    return 'bg-secondary';
    }
  }

  onEdit(task: TaskItem): void {
    this.edit.emit(task);
  }

  onDelete(id: number): void {
    this.delete.emit(id);
  }
}
