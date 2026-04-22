using System.ComponentModel.DataAnnotations;
using Shared.Entities.Users;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.Levels;

public class GuildLevelEntity : IActionTimestamps
{
    public int Id { get; set; }
    public ulong? Xp { get; set; }
    public int? CurrentLevel { get; set; }
    public ulong UserId { get; set; }
    public string[]? ClaimedXpDrops { get; set; }
    public int? CurrentStreakDay { get; set; }
    public string? RequiredXp { get; set; }
    public DateTimeOffset? LastXpStreakUpdate { get; set; }

    [Required] public GuildLevelSettingsEntity LevelSettings { get; set; }
    [Required] public UserEntity User { get; set; }
}