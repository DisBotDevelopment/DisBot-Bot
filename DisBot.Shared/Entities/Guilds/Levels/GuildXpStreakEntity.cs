using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Entities.Guilds.MessageTemplates;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Levels;

public class GuildXpStreakEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public int Day { get; set; }
    public string? Nickname { get; set; }
    public int? BonusLevels { get; set; }
    public int? BonusXp { get; set; }
    public int? Multiplier { get; set; }
    public ulong[]? RoleRewardIds { get; set; } = [];
    
    public GuildMessageTemplateEntity? MessageTemplate { get; set; }
    [Required] public GuildLevelSettingsEntity LevelSettings { get; set; }
}