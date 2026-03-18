namespace TaskManagementServer.Api.Models;

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Priority Priority { get; set; }
    public string DueDate { get; set; } = string.Empty;
    public Status Status { get; set; }
}
