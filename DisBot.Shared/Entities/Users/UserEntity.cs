using System.ComponentModel.DataAnnotations;
using Shared.Entities.Guilds.Levels;
using Shared.Entities.Users.Backup;

namespace Shared.Entities.Users;

public class UserEntity
{
    public int Id { get; set; }
    [Required] public ulong UserId { get; set; }
    public string? Username { get; set; }
    public DateTimeOffset LastVote { get; set; }
    public int BackupCount { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public UserApiEntity? Api { get; set; }
    public List<UserGuildBackupEntity> GuildBackups { get; set; } = [];
    public List<GuildLevelEntity> Levels { get; set; } = [];
    public List<Vanity.UserGuildVanityEntity> Vanities { get; set; } = [];
}