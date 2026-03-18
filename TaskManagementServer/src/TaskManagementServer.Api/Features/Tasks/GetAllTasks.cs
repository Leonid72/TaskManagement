using Microsoft.AspNetCore.Http.HttpResults;
using TaskManagementServer.Api.Common;
using TaskManagementServer.Api.Data;
using TaskManagementServer.Api.Endpoints;
using TaskManagementServer.Api.Models;

namespace TaskManagementServer.Api.Features.Tasks;

public static class GetAllTasks
{
    public record TaskItemResponse(
        int Id,
        string Title,
        string? Description,
        Priority Priority,
        string DueDate,
        Status Status);

    public interface ITaskRepository
    {
        Task<List<TaskItem>> GetAllAsync(CancellationToken cancellationToken = default);
    }

    public class TaskRepository : ITaskRepository
    {
        private readonly JsonTaskRepository _jsonRepository;

        public TaskRepository(JsonTaskRepository jsonRepository)
        {
            _jsonRepository = jsonRepository;
        }

        public async Task<List<TaskItem>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _jsonRepository.GetAllAsync(cancellationToken);
        }
    }

    public sealed class Endpoint : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapGet("tasks", Handler).WithTags("Tasks");
        }
    }

    private static async Task<Ok<ApiResponse<List<TaskItemResponse>>>> Handler(
        ITaskRepository repository,
        CancellationToken cancellationToken)
    {
        var tasks = await repository.GetAllAsync(cancellationToken);

        var response = tasks.Select(t => new TaskItemResponse(
            t.Id,
            t.Title,
            t.Description,
            t.Priority,
            t.DueDate,
            t.Status)).ToList();

        return TypedResults.Ok(ApiResponse<List<TaskItemResponse>>.SuccessResponse(response, "Tasks retrieved successfully"));
    }
}
