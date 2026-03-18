# Task Management System

A full-stack task management application built with **Angular** (Client) and **.NET 9 Minimal API** (Server).

---

## Tech Stack

| | Technology |
|---|---|
| **Client** | Angular 21, Bootstrap 5, Bootstrap Icons, Transloco i18n |
| **Server** | .NET 9 Minimal API, FluentValidation, Swashbuckle |
| **State** | Angular Signals |
| **Forms** | Reactive Forms + ControlValueAccessor |
| **Storage** | JSON file (easily replaceable with any database) |

---

## Architecture

### Server — Vertical Slice Architecture
Each feature is **fully self-contained** — interface, repository, handler, validator and endpoint live together:

```
Features/Tasks/
├── GetAllTasks.cs   → ITaskRepository, TaskRepository, Handler, Endpoint
├── CreateTask.cs    → ITaskRepository, TaskRepository, Request, Response, Validator, Handler, Endpoint
├── UpdateTask.cs    → ITaskRepository, TaskRepository, Request, Response, Validator, Handler, Endpoint
└── DeleteTask.cs    → ITaskRepository, TaskRepository, Handler, Endpoint
```

### Client — Feature-based Architecture
```
src/app/
├── core/
│   ├── models/          # TaskItem, Priority enum, TaskStatus enum
│   ├── services/        # TaskService, LoggerService
│   └── interceptors/    # errorInterceptor (global HTTP error handling)
├── shared/
│   ├── components/      # SelectDropdownComponent (ControlValueAccessor)
│   ├── constants/       # PRIORITY_OPTIONS, STATUS_OPTIONS
│   └── layout/          # Header, Footer
└── features/tasks/
    ├── components/      # TaskFormComponent, TaskListComponent
    └── pages/           # TaskPageComponent
```

---

## Key Features

- ✅ **Vertical Slice** — each API feature owns its interface, repository and endpoint
- ✅ **Signals** — reactive state management without RxJS complexity
- ✅ **ControlValueAccessor** — reusable dropdown integrates with Reactive Forms natively
- ✅ **Global error handling** — HTTP interceptor catches all errors, shows translated toastr
- ✅ **i18n** — Transloco with Hebrew (`he.json`) translation file
- ✅ **Enums** — `Priority` (Low/Medium/High) and `TaskStatus` (Todo/InProgress/Done) on both client and server
- ✅ **`isSubmitting` signal** — button disabled during HTTP request, spinner shown
- ✅ **`finalize`** — loading state resets on both success and error
- ✅ **LoggerService** — environment-aware logging (dev only for log/warn, always for error)
- ✅ **FluentValidation** — server-side validation
- ✅ **Swagger UI** — available at `http://localhost:5000`
- ✅ **RTL** — full right-to-left Hebrew support

---

## Getting Started

### Prerequisites
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- Angular CLI: `npm install -g @angular/cli`

### Run the Server
```bash
cd TaskManagementServer
dotnet run --project src/TaskManagementServer.Api
```
Server: `http://localhost:5000`
Swagger: `http://localhost:5000/index.html`

### Run the Client
```bash
cd TaskManagementClient
npm install
ng serve
```
Client: `http://localhost:4200`

### Dependencies
| Package | Version |
|---------|---------|
| `@angular/core` | ^21.2.0 |
| `@jsverse/transloco` | ^8.2.1 |
| `bootstrap` | ^5.3.8 |
| `bootstrap-icons` | ^1.13.1 |
| `ngx-toastr` | ^20.0.5 |
| `rxjs` | ~7.8.0 |

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/tasks` | Get all tasks |
| `POST` | `/tasks` | Create a new task |
| `PUT` | `/tasks/{id}` | Update a task by ID |
| `DELETE` | `/tasks/{id}` | Delete a task by ID |

### Task Model
```json
{
  "id": 1,
  "title": "My Task",
  "description": "Optional description",
  "priority": "High",
  "dueDate": "2026-03-20",
  "status": "InProgress"
}
```

**Priority values:** `Low` | `Medium` | `High`
**Status values:** `Todo` | `InProgress` | `Done`

---

## Project Structure

```
TaskManagmentSystem/
├── TaskManagementServer/
│   └── src/TaskManagementServer.Api/
│       ├── Common/             # ApiResponse<T> wrapper
│       ├── Data/               # JsonTaskRepository
│       ├── Endpoints/          # IEndpoint, EndpointExtensions
│       ├── Features/Tasks/     # Vertical slices (CRUD)
│       ├── Middleware/         # GlobalExceptionMiddleware
│       ├── Models/             # TaskItem, Priority, Status
│       └── Program.cs
│
└── TaskManagementClient/
    └── src/app/
        ├── core/               # Models, Services, Interceptors
        ├── shared/             # Reusable components, constants, layout
        └── features/tasks/     # Task form, list, page
```
