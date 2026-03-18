export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum TaskStatus {
  Todo = 'Todo',
  InProgress = 'InProgress',
  Done = 'Done',
}

export interface TaskItem {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  dueDate: string;
  status: TaskStatus;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: Priority;
  dueDate: string;
  status: TaskStatus;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  priority: Priority;
  dueDate: string;
  status: TaskStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}
