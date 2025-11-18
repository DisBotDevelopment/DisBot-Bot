namespace Shared.Entities.Guilds.Notifications;

public class GuildTwitchNotifications
{
    public int Id { get; set; }
    public string? TwitchChannelName { get; set; }
    public ulong ChannelId { get; set; }
    public bool Live { get; set; }
    public string[]? PingRoles { get; set; }

    public MessageTemplates.MessageTemplates? MessageTemplateId { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public required Guild Guilds { get; set; }
}