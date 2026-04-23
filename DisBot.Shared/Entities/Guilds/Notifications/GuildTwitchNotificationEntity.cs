using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Entities.Guilds.MessageTemplates;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Notifications;

public class GuildTwitchNotificationEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public string TwitchChannelName { get; set; }
    public ulong ChannelId { get; set; }
    public bool IsLive { get; set; } = false;
    public string[]? PingRoleIds { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public GuildMessageTemplateEntity? MessageTemplate { get; set; }
    [Required] public GuildEntity Guilds { get; set; }
}