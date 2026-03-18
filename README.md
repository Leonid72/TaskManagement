# Task Management System

A full-stack task management application built with Angular (Client) and .NET Minimal API (Server).

## Architecture

### Server - Vertical Slice Pattern
- **Framework**: .NET 9 Minimal API
- **Data Storage**: JSON file (`tasks.json`)
- **Pattern**: Vertical Slice Architecture - each feature (GetAllTasks, CreateTask, UpdateTask, DeleteTask) is self-contained
- **API Response**: Generic `ApiResponse<T>` wrapper with pagination support (`PagedResult<T>`)

### Client - Modular Architecture
- **Framework**: Angular 21 (Standalone Components)
- **UI**: Bootstrap 5 + ngx-toastr notifications
- **Forms**: Reactive Forms with validation
- **Structure**: Core (models, services) → Shared (header, footer) → Features (tasks)
- **RTL**: Full right-to-left Hebrew support

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [Angular CLI](https://angular.dev/) (`npm install -g @angular/cli`)

## Running the Server

```bash
cd TaskManagementServer
dotnet run --project src/TaskManagementServer.Api
```

Server runs at: `http://localhost:5000`

### API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/tasks?page=1&pageSize=10` | Get paginated tasks |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/{id}` | Update a task by ID |
| DELETE | `/tasks/{id}` | Delete a task by ID |

## Running the Client

```bash
cd TaskManagementClient
npm install
ng serve
```

Client runs at: `http://localhost:4200`

## Project Structure

```
TaskManagmentSystem/
├── TaskManagementServer/           # .NET Server (Vertical Slice)
│   └── src/TaskManagementServer.Api/
│       ├── Common/                 # ApiResponse, PagedResult
│       ├── Data/                   # JsonTaskRepository + tasks.json
│       ├── DTOs/                   # Request/Response DTOs
│       ├── Features/Tasks/         # Vertical slices (CRUD)
│       ├── Models/                 # TaskItem entity
│       └── Program.cs              # App configuration
│
└── TaskManagementClient/           # Angular Client (Modular)
    └── src/app/
        ├── core/                   # Models & Services
        ├── shared/layout/          # Header & Footer
        └── features/tasks/         # Task form, list & page
```
