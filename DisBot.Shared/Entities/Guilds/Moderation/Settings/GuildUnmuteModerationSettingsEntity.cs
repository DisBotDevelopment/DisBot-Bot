using System.ComponentModel.DataAnnotations;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.Moderation.Settings;

public class GuildUnmuteModerationSettingsEntity : IActionTimestamps
{
    public int Id { get; set; }
    public string DefaultReason { get; set; } = "Unmuted member {user.username} by {moderator.username}";
    public string AuditLogReason { get; set; } = "Unmuted member {user.username} by {moderator.username}";
    public string[] Actions { get; set; } = [];
    public bool NeedReason { get; set; } = true;

    public int ModerationId { get; set; }
    [Required] public GuildModerationEntity Moderation { get; set; }
}