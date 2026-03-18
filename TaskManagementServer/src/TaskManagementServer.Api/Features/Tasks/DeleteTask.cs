using Microsoft.AspNetCore.Http.HttpResults;
using TaskManagementServer.Api.Common;
using TaskManagementServer.Api.Data;
using TaskManagementServer.Api.Endpoints;

namespace TaskManagementServer.Api.Features.Tasks;

public static class DeleteTask
{
    public record DeleteTaskResponse(string Message);

    public interface ITaskRepository
    {
        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    }

    public class TaskRepository : ITaskRepository
    {
        private readonly JsonTaskRepository _jsonRepository;

        public TaskRepository(JsonTaskRepository jsonRepository)
        {
            _jsonRepository = jsonRepository;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _jsonRepository.DeleteAsync(id, cancellationToken);
        }
    }

    public sealed class Endpoint : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapDelete("tasks/{id:int}", Handler).WithTags("Tasks");
        }
    }

    private static async Task<Results<Ok<ApiResponse<DeleteTaskResponse>>, NotFound<ApiResponse<DeleteTaskResponse>>>> Handler(
        int id,
        ITaskRepository repository,
        CancellationToken cancellationToken)
    {
        var deleted = await repository.DeleteAsync(id, cancellationToken);

        if (!deleted)
            return TypedResults.NotFound(ApiResponse<DeleteTaskResponse>.ErrorResponse($"Task with id {id} not found"));

        return TypedResults.Ok(ApiResponse<DeleteTaskResponse>.SuccessResponse(
            new DeleteTaskResponse("Task deleted successfully"), "Task deleted successfully"));
    }
}
