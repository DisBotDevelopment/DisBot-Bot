using System.ComponentModel.DataAnnotations;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.Moderation.Settings;

public class GuildKickModerationSettingsEntity : IActionTimestamps
{
    public int Id { get; set; }
    public string DefaultReason { get; set; } = "Kicked {user.username} from guild by {moderator.username}";
    public string AuditLogReason { get; set; } = "Kicked {user.username} from guild by {moderator.username}";
    public bool NeedReason { get; set; } = false;

    public int ModerationId { get; set; }
    [Required] public GuildModerationEntity Moderation { get; set; }
}