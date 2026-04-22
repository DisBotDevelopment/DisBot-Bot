using System.ComponentModel.DataAnnotations;
using Shared.Entities.Guilds.MessageTemplates;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.Notifications;

public class GuildYoutubeNotificationEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public string YoutubeChannelId { get; set; }
    public ulong ChannelId { get; set; }
    public string[]? Latest { get; set; } = [];
    public string[]? PingRoleIds { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public GuildMessageTemplateEntity? MessageTemplate { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}