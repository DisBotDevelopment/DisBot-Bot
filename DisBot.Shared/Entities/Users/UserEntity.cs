using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Entities.Guilds.Levels;
using DisBot.Shared.Entities.Users.Backup;
using DisBot.Shared.Entities.Users.Vanity;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Users;

public class UserEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public ulong UserId { get; set; }
    [Required] public string AccessToken { get; set; }
    [Required] public string RefreshToken { get; set; }
    
    public string? Username { get; set; }
    public DateTimeOffset? LastVote { get; set; } = null;
    public int BackupCount { get; set; } = 5000;
    
    public DateTimeOffset InvalidateTimestamp { get; set; }

    public UserApiEntity? Api { get; set; } 
    public List<UserGuildBackupEntity> GuildBackups { get; set; } = [];
    public List<GuildLevelEntity> Levels { get; set; } = [];
    public List<UserGuildVanityEntity> Vanities { get; set; } = [];
}