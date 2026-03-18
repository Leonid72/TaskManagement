import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Priority, TaskStatus } from '../models/task.model';

export class TaskMockDb implements InMemoryDbService {
  createDb() {
    const tasks = [
      {
        id: 1,
        title: 'עיצוב ממשק משתמש',
        description: 'תכנון וייצור עמודי UI עבור פרויקט',
        priority: Priority.High,
        dueDate: '2026-04-01',
        status: TaskStatus.InProgress,
      },
      {
        id: 2,
        title: 'פיתוח API',
        description: 'יצירת שרת Minimal API עם .NET 9',
        priority: Priority.High,
        dueDate: '2026-04-05',
        status: TaskStatus.Done,
      },
      {
        id: 3,
        title: 'כתיבת בדיקות יחידה',
        description: null,
        priority: Priority.Medium,
        dueDate: '2026-04-10',
        status: TaskStatus.Todo,
      },
      {
        id: 4,
        title: 'תיעוד פרויקט',
        description: 'עדכון קובץ README עם הוראות הפעלה',
        priority: Priority.Low,
        dueDate: '2026-04-15',
        status: TaskStatus.Todo,
      },
    ];

    return { tasks };
  }

  // Wrap responses to match ApiResponse<T> format
  get(reqInfo: RequestInfo) {
    return reqInfo.utils.createResponse$(() => ({
      body: {
        success: true,
        message: 'Success',
        data: reqInfo.collection,
        errors: [],
      },
      status: 200,
    }));
  }

  post(reqInfo: RequestInfo) {
    const body = reqInfo.utils.getJsonBody(reqInfo.req) as Record<string, unknown>;
    const collection = reqInfo.collection as Record<string, unknown>[];
    const maxId = collection.length > 0
      ? Math.max(...collection.map(t => t['id'] as number))
      : 0;

    const newTask = { ...body, id: maxId + 1 };
    collection.push(newTask);

    return reqInfo.utils.createResponse$(() => ({
      body: { success: true, message: 'Task created', data: newTask, errors: [] },
      status: 201,
    }));
  }

  put(reqInfo: RequestInfo) {
    const id = +reqInfo.id!;
    const body = reqInfo.utils.getJsonBody(reqInfo.req) as Record<string, unknown>;
    const collection = reqInfo.collection as Record<string, unknown>[];
    const index = collection.findIndex(t => t['id'] === id);

    if (index === -1) {
      return reqInfo.utils.createResponse$(() => ({
        body: { success: false, message: 'Not found', data: null, errors: ['Task not found'] },
        status: 404,
      }));
    }

    collection[index] = { ...body, id };

    return reqInfo.utils.createResponse$(() => ({
      body: { success: true, message: 'Task updated', data: collection[index], errors: [] },
      status: 200,
    }));
  }

  delete(reqInfo: RequestInfo) {
    const id = +reqInfo.id!;
    const collection = reqInfo.collection as Record<string, unknown>[];
    const index = collection.findIndex(t => t['id'] === id);

    if (index !== -1) collection.splice(index, 1);

    return reqInfo.utils.createResponse$(() => ({
      body: { success: true, message: 'Task deleted', data: true, errors: [] },
      status: 200,
    }));
  }
}
