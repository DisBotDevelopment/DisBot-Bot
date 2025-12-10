using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Moderation.Settings;

public class GuildUnmuteModerationSettings
{
    public int Id { get; set; }
    public string DefaultReason { get; set; } = "Unmuted member {user.username} by {moderator.username}";
    public string AuditLogReason { get; set; } = "Unmuted member {user.username} by {moderator.username}";
    public string[] Actions { get; set; } = [];
    public bool NeedReason { get; set; } = true;

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildModerationEntity Moderation { get; set; }
}