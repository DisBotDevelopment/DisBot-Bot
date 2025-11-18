using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.Entities.Guilds.Notifications;

public class GuildSpotifyNotifications
{
    public int Id { get; set; }

    [Key] [Column("UUID")] public required Guid Uuid { get; set; }

    public required string ShowId { get; set; }
    public required ulong ChannelId { get; set; }
    public string[] Latests { get; set; } = [];
    public string[] PingRoles { get; set; } = [];

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public MessageTemplates.MessageTemplates? MessageTemplate { get; set; }
    public required Guild Guild { get; set; }
}