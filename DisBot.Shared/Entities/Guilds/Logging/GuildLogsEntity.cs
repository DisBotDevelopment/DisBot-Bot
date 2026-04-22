using System.ComponentModel.DataAnnotations;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.Logging;

public class GuildLogsEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public string LoggingType { get; set; }
    public string[] Notes { get; set; } = [];
    public string? LogMessage { get; set; }
    public string? LogJson { get; set; }

    [Required] public GuildEntity Guild { get; set; }
}