import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskItem, CreateTaskRequest, UpdateTaskRequest, ApiResponse } from '../models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  getTasks(): Observable<ApiResponse<TaskItem[]>> {
    return this.http.get<ApiResponse<TaskItem[]>>(this.apiUrl);
  }

  createTask(task: CreateTaskRequest): Observable<ApiResponse<TaskItem>> {
    return this.http.post<ApiResponse<TaskItem>>(this.apiUrl, task);
  }

  updateTask(id: number, task: UpdateTaskRequest): Observable<ApiResponse<TaskItem>> {
    return this.http.put<ApiResponse<TaskItem>>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }
}
