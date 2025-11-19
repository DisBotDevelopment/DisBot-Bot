using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Leave;

public class GuildLeaveImageDataEntity
{
    public int Id { get; set; }
    [Required] public string Title { get; set; }
    [Required] public string Text { get; set; }
    [Required] public string Subtitle { get; set; }
    [Required] public string Color { get; set; }
    public string? Background { get; set; }
    public string? Theme { get; set; }
    public string? Gradient { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildLeaveSetupEntity GuildLeaveSetup { get; set; }
}