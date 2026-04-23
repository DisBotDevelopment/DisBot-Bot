using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Moderation.Settings;

public class GuildUnwarnModerationSettingsEntity : IActionTimestamps
{
    public int Id { get; set; }
    public string DefaultReason { get; set; } = "Warn removed from {user.username} by {moderator.username}";
    public string AuditLogReason { get; set; } = "Warn removed from {user.username} by {moderator.username}";
    public string[] Actions { get; set; } = [];
    public bool NeedReason { get; set; } = true;

    public int ModerationId { get; set; }
    [Required] public GuildModerationEntity Moderation { get; set; }
}