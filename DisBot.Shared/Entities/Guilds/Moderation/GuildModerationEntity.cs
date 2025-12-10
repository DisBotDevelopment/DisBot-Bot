using System.ComponentModel.DataAnnotations;
using Shared.Entities.Guilds.Moderation.AutoModeration;
using Shared.Entities.Guilds.Moderation.ModerationScout;
using Shared.Entities.Guilds.Moderation.Settings;

namespace Shared.Entities.Guilds.Moderation;

public class GuildModerationEntity
{
    public int Id { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public List<GuildUserModerationEntity> UserModeration { get; set; } = [];
    public GuildModerationScoutEntity? ModerationScout { get; set; }

    public List<GuildAutoModerationEntity> AttachmentAutoModeration { get; set; } = [];

    public GuildKickModerationSettings? GuildKickModerationSettings { get; set; }
    public GuildBanModerationSettings? GuildBanModerationSettings { get; set; }
    public GuildUnbanModerationSettings? GuildUnBanModerationSettings { get; set; }
    public GuildMuteModerationSettings? GuildMuteModerationSettings { get; set; }
    public GuildUnmuteModerationSettings? GuildUnMuteModerationSettings { get; set; }
    public GuildUnwarnModerationSettings? GuildUnWarnModerationSettings { get; set; }
    public GuildWarnModerationSetting? GuildWarnModerationSetting { get; set; }

    [Required] public GuildEntity Guild { get; set; }
}