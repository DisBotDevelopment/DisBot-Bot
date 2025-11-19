using System.ComponentModel.DataAnnotations;
using Shared.Enums.Levels;

namespace Shared.Entities.Guilds.Levels;

public class GuildLevelRoleEntity
{
    public int Id { get; set; }
    [Required] public ulong RoleId { get; set; }
    [Required] public int Level { get; set; }

    public int Multiplier { get; set; }
    public LevelRoleRemoveType[]? Types { get; set; } = [LevelRoleRemoveType.ByStreak];

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public GuildLevelSettingsEntity GuildLevelSettings { get; set; }
}