using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.Entities.Guilds.Giveaways;

public class Giveaways
{
    public int Id { get; set; }

    [Column("UUID")] public required Guid Uuid { get; set; } = Guid.Empty;
    public string? MessageId { get; set; }
    public string? ChannelId { get; set; }
    public string? Prize { get; set; }
    public int Winners { get; set; }
    public string? Time { get; set; }
    public bool Ended { get; set; }
    public DateTimeOffset EndedAt { get; set; }
    public string? EndedBy { get; set; }
    public bool Paused { get; set; }
    public string? EndedMessage { get; set; }
    public bool Rerolled { get; set; }
    public string[] WinnerIds { get; set; } = [];
    public string? WinnerMessageTemplate { get; set; }
    public string? HostedBy { get; set; }
    public string? MessageTemplate { get; set; }
    public string? Content { get; set; }
    public string[] Entrys { get; set; } = [];
    public string[] Requirements { get; set; } = [];

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public required Guild Guild { get; set; }
}