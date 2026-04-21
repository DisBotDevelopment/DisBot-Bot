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

    public GuildKickModerationSettingsEntity? GuildKickModerationSettings { get; set; }
    public GuildBanModerationSettingsEntity? GuildBanModerationSettings { get; set; }
    public GuildUnbanModerationSettingsEntity? GuildUnBanModerationSettings { get; set; }
    public GuildMuteModerationSettingsEntity? GuildMuteModerationSettings { get; set; }
    public GuildUnmuteModerationSettingsEntity? GuildUnMuteModerationSettings { get; set; }
    public GuildUnwarnModerationSettingsEntity? GuildUnWarnModerationSettings { get; set; }
    public GuildWarnModerationSettingsEntity? GuildWarnModerationSetting { get; set; }

    [Required] public GuildEntity Guild { get; set; }
}