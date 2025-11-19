using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Shared.Entities.Guilds.MessageTemplates;

namespace Shared.Entities.Guilds.Notifications;

public class GuildSpotifyNotificationEntity
{
    public int Id { get; set; }

    [Required] public string ShowId { get; set; }
    [Required] public ulong ChannelId { get; set; }
    public string[] Latest { get; set; } = [];
    public string[] PingRoleIds { get; set; } = [];

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public GuildMessageTemplateEntity? MessageTemplate { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}