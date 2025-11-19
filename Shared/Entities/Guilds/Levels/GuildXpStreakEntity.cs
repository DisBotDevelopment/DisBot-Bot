using System.ComponentModel.DataAnnotations;
using Shared.Entities.Guilds.MessageTemplates;

namespace Shared.Entities.Guilds.Levels;

public class GuildXpStreakEntity
{
    public int Id { get; set; }
    [Required] public int Day { get; set; }
    public string? Nickname { get; set; }
    public int? BonusLevels { get; set; }
    public int? BonusXp { get; set; }
    public int? Multiplier { get; set; }
    public ulong[]? RoleRewardIds { get; set; } = [];

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public GuildMessageTemplateEntity? MessageTemplate { get; set; }
    [Required] public GuildLevelSettingsEntity GuildLevelSettings { get; set; }
}