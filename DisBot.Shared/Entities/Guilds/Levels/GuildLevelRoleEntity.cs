using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Enums.Levels;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Levels;

public class GuildLevelRoleEntity : IActionTimestamps
{ 
    public int Id { get; set; }
    [Required] public ulong RoleId { get; set; }
    [Required] public int Level { get; set; }

    public int Multiplier { get; set; }
    public LevelRoleRemoveType[]? Types { get; set; } = [LevelRoleRemoveType.ByStreak];

    [Required] public GuildLevelSettingsEntity LevelSettings { get; set; }
}