using System.ComponentModel.DataAnnotations;
using Shared.Entities.Guilds.Levels;
using Shared.Entities.Users.Backup;
using Shared.Entities.Users.Vanity;
using Shared.Interfaces;

namespace Shared.Entities.Users;

public class UserEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public ulong UserId { get; set; }
    [Required] public string AccessToken { get; set; }
    [Required] public string RefreshToken { get; set; }
    
    public string? Username { get; set; }
    public DateTimeOffset LastVote { get; set; }
    public int BackupCount { get; set; }
    
    public DateTimeOffset InvalidateTimestamp { get; set; }

    public UserApiEntity? Api { get; set; }
    public List<UserGuildBackupEntity> GuildBackups { get; set; } = [];
    public List<GuildLevelEntity> Levels { get; set; } = [];
    public List<UserGuildVanityEntity> Vanities { get; set; } = [];
}