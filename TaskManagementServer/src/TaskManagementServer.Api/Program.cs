using FluentValidation;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;
using TaskManagementServer.Api.Data;
using TaskManagementServer.Api.Endpoints;
using TaskManagementServer.Api.Features.Tasks;
using TaskManagementServer.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Task Management API",
        Version = "v1",
        Description = "A RESTful API for managing tasks",
        Contact = new OpenApiContact
        {
            Name = "Task Management Team",
            Email = "support@taskmanagement.com"
        }
    });

    // Include XML comments if available
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

builder.Services.ConfigureHttpJsonOptions(options =>
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// Add FluentValidation validators from assembly
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

// Add Endpoints (Vertical Slice pattern)
builder.Services.AddEndpoints();

// Add JSON Task Repository - shared singleton, each feature wraps it via its own TaskRepository
builder.Services.AddScoped<JsonTaskRepository>();
builder.Services.AddScoped<GetAllTasks.ITaskRepository, GetAllTasks.TaskRepository>();
builder.Services.AddScoped<CreateTask.ITaskRepository, CreateTask.TaskRepository>();
builder.Services.AddScoped<UpdateTask.ITaskRepository, UpdateTask.TaskRepository>();
builder.Services.AddScoped<DeleteTask.ITaskRepository, DeleteTask.TaskRepository>();

// CORS for Angular dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Global error middleware (first in pipeline)
app.UseGlobalExceptionMiddleware();

// Swagger
// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    //app.UseHttpsRedirection();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Task Management API V1");
        c.RoutePrefix = string.Empty; // Serve Swagger UI at the app's root
    });
}

app.UseCors("AllowAngular");

// Map all endpoints automatically (Vertical Slice pattern)
app.MapEndpoints();

app.Run();
