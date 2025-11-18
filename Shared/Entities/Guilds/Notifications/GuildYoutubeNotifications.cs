using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Notifications;

public class GuildYoutubeNotifications
{
    public int Id { get; set; }
    public required string YoutubeChannelId { get; set; }
    public required ulong ChannelId { get; set; }
    public string[]? Latest { get; set; } = [];
    public string[]? PingRoles { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public MessageTemplates.MessageTemplates? MessageTemplate { get; set; }
    public required Guild Guild { get; set; }
}