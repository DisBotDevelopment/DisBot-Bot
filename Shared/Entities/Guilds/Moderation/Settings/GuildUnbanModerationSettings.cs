using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Moderation.Settings;

public class GuildUnbanModerationSettings
{
    public int Id { get; set; }
    public string DefaultReason { get; set; } = "User {user.username} has been unbanned by {moderator.username}";
    public string AuditLogReason { get; set; } = "User {user.username} has been unbanned by {moderator.username}";
    public bool NeedReason { get; set; } = true;

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildModerationEntity GuildModeration { get; set; }
}