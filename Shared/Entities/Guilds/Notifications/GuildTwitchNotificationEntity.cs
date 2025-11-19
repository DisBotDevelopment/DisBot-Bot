using System.ComponentModel.DataAnnotations;
using Shared.Entities.Guilds.MessageTemplates;

namespace Shared.Entities.Guilds.Notifications;

public class GuildTwitchNotificationEntity
{
    public int Id { get; set; }
    [Required] public string TwitchChannelName { get; set; }
    public ulong ChannelId { get; set; }
    public bool IsLive { get; set; } = false;
    public string[]? PingRoleIds { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public GuildMessageTemplateEntity? MessageTemplateId { get; set; }
    [Required] public GuildEntity Guilds { get; set; }
}