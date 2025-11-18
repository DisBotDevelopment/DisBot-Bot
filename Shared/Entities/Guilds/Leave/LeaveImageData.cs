namespace Shared.Entities.Guilds.Leave;

public class LeaveImageData
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Text { get; set; }
    public string? Subtitle { get; set; }
    public string? Background { get; set; }
    public string? Theme { get; set; }
    public string? Color { get; set; }
    public string? Gradient { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public required GuildLeaveSetup GuildLeaveSetup { get; set; }
}