using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Moderation.Settings;

public class GuildMuteModerationSettings
{
    public int Id { get; set; }
    public string DefaultReason { get; set; } = "Muted user {user.username} by {moderator.username}.";
    public string AuditLogReason { get; set; } = "Muted user {user.username} by {moderator.username}.";
    public int Duration { get; set; } = 900000;
    public string[] Actions { get; set; } = [];
    public bool DeleteProveMessage { get; set; }
    public bool NeedReason { get; set; } = true;
    public bool UseTimeout { get; set; } = true;

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildModerationEntity Moderation { get; set; }
}