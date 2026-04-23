using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Moderation.Settings;

public class GuildBanModerationSettingsEntity : IActionTimestamps
{
    public int Id { get; set; }

    public string DefaultReason { get; set; } =
        "Member {user.username} has been banned for {ban.duration} from this server by {moderation.username}.";

    public string AuditLogReason { get; set; } =
        "Member {user.username} has been banned for {ban.duration} from this server by {moderation.username}.";

    public int Duration { get; set; } = 0;
    public bool DeleteProveMessage { get; set; } = false;
    public bool NeedReason { get; set; } = true;
    
    public int ModerationId { get; set; }
    [Required] public GuildModerationEntity Moderation { get; set; }
}