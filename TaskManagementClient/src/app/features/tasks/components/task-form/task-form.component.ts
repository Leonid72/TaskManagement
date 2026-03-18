import { Component, EventEmitter, inject, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { TaskItem, CreateTaskRequest, UpdateTaskRequest, Priority, TaskStatus } from '../../../../core/models/task.model';
import { SelectDropdownComponent } from '../../../../shared/components/select-dropdown/select-dropdown.component';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../../../../shared/constants/task-options';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectDropdownComponent, TranslocoModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnChanges {
  @Input() taskToEdit: TaskItem | null = null;
  @Output() save = new EventEmitter<CreateTaskRequest>();
  @Output() update = new EventEmitter<{ id: number; task: UpdateTaskRequest }>();
  @Output() cancelEdit = new EventEmitter<void>();
  @Input() isSubmitting = false;

  private readonly fb = inject(FormBuilder);

  readonly priorityOptions = PRIORITY_OPTIONS;
  readonly statusOptions = STATUS_OPTIONS;

  taskForm: FormGroup;
  isEditMode = false;

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: [Priority.Medium, Validators.required],
      dueDate: ['', Validators.required],
      status: [TaskStatus.Todo, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit'] && this.taskToEdit) {
      this.isEditMode = true;
      this.taskForm.patchValue({
        title: this.taskToEdit.title,
        description: this.taskToEdit.description || '',
        priority: this.taskToEdit.priority,
        dueDate: this.taskToEdit.dueDate,
        status: this.taskToEdit.status,
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.value;

    if (this.isEditMode && this.taskToEdit) {
      this.update.emit({ id: this.taskToEdit.id, task: formValue as UpdateTaskRequest });
    } else {
      this.save.emit(formValue as CreateTaskRequest);
    }

    this.resetForm();
  }

  onCancel(): void {
    this.resetForm();
    this.cancelEdit.emit();
  }

  private resetForm(): void {
    this.isEditMode = false;
    this.taskToEdit = null;
    this.taskForm.reset({
      title: '',
      description: '',
      priority: Priority.Medium,
      dueDate: '',
      status: TaskStatus.Todo,
    });
  }
}
