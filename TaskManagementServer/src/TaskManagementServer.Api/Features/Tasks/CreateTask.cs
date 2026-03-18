using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using TaskManagementServer.Api.Common;
using TaskManagementServer.Api.Data;
using TaskManagementServer.Api.Endpoints;
using TaskManagementServer.Api.Models;

namespace TaskManagementServer.Api.Features.Tasks;

public static class CreateTask
{
    public record CreateTaskRequest(
        string Title,
        string? Description,
        Priority Priority,
        string DueDate,
        Status Status);

    public record CreateTaskResponse(
        int Id,
        string Title,
        string? Description,
        Priority Priority,
        string DueDate,
        Status Status);

    public interface ITaskRepository
    {
        Task<TaskItem> AddAsync(TaskItem task, CancellationToken cancellationToken = default);
    }

    public class TaskRepository : ITaskRepository
    {
        private readonly JsonTaskRepository _jsonRepository;

        public TaskRepository(JsonTaskRepository jsonRepository)
        {
            _jsonRepository = jsonRepository;
        }

        public async Task<TaskItem> AddAsync(TaskItem task, CancellationToken cancellationToken = default)
        {
            return await _jsonRepository.AddAsync(task, cancellationToken);
        }
    }

    public sealed class Validator : AbstractValidator<CreateTaskRequest>
    {
        public Validator()
        {
            RuleFor(r => r.Title).NotEmpty().WithMessage("Title is required")
                .MinimumLength(3).WithMessage("Title must be at least 3 characters");
            RuleFor(r => r.DueDate).NotEmpty().WithMessage("DueDate is required");
        }
    }

    public sealed class Endpoint : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapPost("tasks", Handler).WithTags("Tasks");
        }
    }

    private static async Task<Results<Created<ApiResponse<CreateTaskResponse>>, BadRequest<ApiResponse<CreateTaskResponse>>>> Handler(
        CreateTaskRequest request,
        ITaskRepository repository,
        IValidator<CreateTaskRequest> validator,
        CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
            return TypedResults.BadRequest(ApiResponse<CreateTaskResponse>.ErrorResponse("Validation failed", errors));
        }

        var taskItem = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            Priority = request.Priority,
            DueDate = request.DueDate,
            Status = request.Status
        };

        var created = await repository.AddAsync(taskItem, cancellationToken);

        var response = new CreateTaskResponse(
            created.Id,
            created.Title,
            created.Description,
            created.Priority,
            created.DueDate,
            created.Status);

        return TypedResults.Created($"/tasks/{created.Id}",
            ApiResponse<CreateTaskResponse>.SuccessResponse(response, "Task created successfully"));
    }
}
