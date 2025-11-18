using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.Entities.Guilds.Logging;

public class GuildLogs
{
    public int Id { get; set; }
    [Column("UUID")] public required Guid Uuid { get; set; }

    public string[] Notes { get; set; } = [];
    public string? LogMessage { get; set; }
    [Column("LogJSON")] public string? LogJson { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public required Guild Guild { get; set; }
}