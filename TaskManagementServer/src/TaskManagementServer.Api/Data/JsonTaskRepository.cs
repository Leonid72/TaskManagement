using System.Text.Json;
using System.Text.Json.Serialization;
using TaskManagementServer.Api.Features.Tasks;
using TaskManagementServer.Api.Models;

namespace TaskManagementServer.Api.Data;

public class JsonTaskRepository :
    GetAllTasks.ITaskRepository,
    CreateTask.ITaskRepository,
    UpdateTask.ITaskRepository,
    DeleteTask.ITaskRepository
{
    private readonly string _filePath;
    private readonly object _lock = new();
    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        Converters = { new JsonStringEnumConverter() }
    };

    public JsonTaskRepository(IWebHostEnvironment env)
    {
        _filePath = Path.Combine(env.ContentRootPath, "Data", "tasks.json");
        EnsureFileExists();
    }

    private void EnsureFileExists()
    {
        var directory = Path.GetDirectoryName(_filePath);
        if (!Directory.Exists(directory))
            Directory.CreateDirectory(directory!);

        if (!File.Exists(_filePath))
            File.WriteAllText(_filePath, "[]");
    }

    private List<TaskItem> ReadTasks()
    {
        var json = File.ReadAllText(_filePath);
        return JsonSerializer.Deserialize<List<TaskItem>>(json, _jsonOptions) ?? [];
    }

    private void WriteTasks(List<TaskItem> tasks)
    {
        var json = JsonSerializer.Serialize(tasks, _jsonOptions);
        File.WriteAllText(_filePath, json);
    }

    public Task<List<TaskItem>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        lock (_lock)
        {
            return Task.FromResult(ReadTasks());
        }
    }

    public Task<TaskItem> AddAsync(TaskItem task, CancellationToken cancellationToken = default)
    {
        lock (_lock)
        {
            var tasks = ReadTasks();
            task.Id = tasks.Count > 0 ? tasks.Max(t => t.Id) + 1 : 1;
            tasks.Add(task);
            WriteTasks(tasks);
            return Task.FromResult(task);
        }
    }

    public Task<TaskItem?> UpdateAsync(int id, TaskItem updatedTask, CancellationToken cancellationToken = default)
    {
        lock (_lock)
        {
            var tasks = ReadTasks();
            var existingTask = tasks.FirstOrDefault(t => t.Id == id);

            if (existingTask == null)
                return Task.FromResult<TaskItem?>(null);

            existingTask.Title = updatedTask.Title;
            existingTask.Description = updatedTask.Description;
            existingTask.Priority = updatedTask.Priority;
            existingTask.DueDate = updatedTask.DueDate;
            existingTask.Status = updatedTask.Status;

            WriteTasks(tasks);
            return Task.FromResult<TaskItem?>(existingTask);
        }
    }

    public Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        lock (_lock)
        {
            var tasks = ReadTasks();
            var task = tasks.FirstOrDefault(t => t.Id == id);

            if (task == null)
                return Task.FromResult(false);

            tasks.Remove(task);
            WriteTasks(tasks);
            return Task.FromResult(true);
        }
    }
}
