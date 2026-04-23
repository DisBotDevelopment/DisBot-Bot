using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Moderation.Settings;

public class GuildUnbanModerationSettingsEntity : IActionTimestamps
{
    public int Id { get; set; }
    public string DefaultReason { get; set; } = "User {user.username} has been unbanned by {moderator.username}";
    public string AuditLogReason { get; set; } = "User {user.username} has been unbanned by {moderator.username}";
    public bool NeedReason { get; set; } = true;

    public int ModerationId { get; set; }
    [Required] public GuildModerationEntity Moderation { get; set; }
}