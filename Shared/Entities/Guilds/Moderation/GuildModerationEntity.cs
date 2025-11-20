using System.ComponentModel.DataAnnotations;
using Shared.Entities.Guilds.Moderation.Settings;

namespace Shared.Entities.Guilds.Moderation;

public class GuildModerationEntity
{
    public int Id { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public GuildKickModerationSettings? GuildKickModerationSettings { get; set; }
    public GuildBanModerationSettings? GuildBanModerationSettings { get; set; }
    public GuildUnbanModerationSettings? GuildUnbanModerationSettings { get; set; }
    public GuildMuteModerationSettings? GuildMuteModerationSettings { get; set; }
    public GuildUnmuteModerationSettings? GuildUnmuteModerationSettings { get; set; }
    public GuildUnwarnModerationSettings? GuildUnwarnModerationSettings { get; set; }
    public GuildWarnModerationSetting? GuildWarnModerationSetting { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}