using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Shared.Entities.Guilds.Moderation.Settings;

public class GuildKickModerationSettings
{
    public int Id { get; set; }
    public string DefaultReason { get; set; } = "Kicked {user.username} from guild by {moderator.username}";
    public string AuditLogReason { get; set; } = "Kicked {user.username} from guild by {moderator.username}";
    public bool NeedReason { get; set; } = false;

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildModerationEntity GuildModeration { get; set; }
}