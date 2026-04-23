using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Entities.Guilds.Moderation.AutoModeration;
using DisBot.Shared.Entities.Guilds.Moderation.ModerationScout;
using DisBot.Shared.Entities.Guilds.Moderation.Settings;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Moderation;

public class GuildModerationEntity : IActionTimestamps
{
    public int Id { get; set; }

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

    public int GuildId { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}