using System.ComponentModel.DataAnnotations;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.Leave;

public class GuildLeaveImageDataEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public string Title { get; set; }
    [Required] public string Text { get; set; }
    [Required] public string Subtitle { get; set; }
    [Required] public string Color { get; set; }
    public string? Background { get; set; }
    public string? Theme { get; set; }
    public string? Gradient { get; set; }

    public int LeaveSetupId { get; set; }
    [Required] public GuildLeaveSetupEntity LeaveSetup { get; set; }
}