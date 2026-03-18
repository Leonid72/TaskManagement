using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using TaskManagementServer.Api.Common;
using TaskManagementServer.Api.Data;
using TaskManagementServer.Api.Endpoints;
using TaskManagementServer.Api.Models;

namespace TaskManagementServer.Api.Features.Tasks;

public static class UpdateTask
{
    public record UpdateTaskRequest(
        string Title,
        string? Description,
        Priority Priority,
        string DueDate,
        Status Status);

    public record UpdateTaskResponse(
        int Id,
        string Title,
        string? Description,
        Priority Priority,
        string DueDate,
        Status Status);

    public interface ITaskRepository
    {
        Task<TaskItem?> UpdateAsync(int id, TaskItem task, CancellationToken cancellationToken = default);
    }

    public class TaskRepository : ITaskRepository
    {
        private readonly JsonTaskRepository _jsonRepository;

        public TaskRepository(JsonTaskRepository jsonRepository)
        {
            _jsonRepository = jsonRepository;
        }

        public async Task<TaskItem?> UpdateAsync(int id, TaskItem task, CancellationToken cancellationToken = default)
        {
            return await _jsonRepository.UpdateAsync(id, task, cancellationToken);
        }
    }

    public sealed class Validator : AbstractValidator<UpdateTaskRequest>
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
            app.MapPut("tasks/{id:int}", Handler).WithTags("Tasks");
        }
    }

    private static async Task<Results<Ok<ApiResponse<UpdateTaskResponse>>, BadRequest<ApiResponse<UpdateTaskResponse>>, NotFound<ApiResponse<UpdateTaskResponse>>>> Handler(
        int id,
        UpdateTaskRequest request,
        ITaskRepository repository,
        IValidator<UpdateTaskRequest> validator,
        CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
            return TypedResults.BadRequest(ApiResponse<UpdateTaskResponse>.ErrorResponse("Validation failed", errors));
        }

        var taskItem = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            Priority = request.Priority,
            DueDate = request.DueDate,
            Status = request.Status
        };

        var result = await repository.UpdateAsync(id, taskItem, cancellationToken);

        if (result is null)
            return TypedResults.NotFound(ApiResponse<UpdateTaskResponse>.ErrorResponse($"Task with id {id} not found"));

        var response = new UpdateTaskResponse(
            result.Id,
            result.Title,
            result.Description,
            result.Priority,
            result.DueDate,
            result.Status);

        return TypedResults.Ok(ApiResponse<UpdateTaskResponse>.SuccessResponse(response, "Task updated successfully"));
    }
}
