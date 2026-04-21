using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Moderation.Settings;

public class GuildWarnModerationSettingsEntity
{
    public int Id { get; set; }
    public string DefaultReason { get; set; } = "User {user.username} has been warned from {moderator.username}";
    public string AuditLogReason { get; set; } = "User {user.username} has been warned from {moderator.username}";
    public int Duration { get; set; } = 900000;
    public string[] Actions { get; set; } = [];
    public bool DeleteProveMessage { get; set; }
    public bool NeedReason { get; set; } = false;

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildModerationEntity Moderation { get; set; }
}