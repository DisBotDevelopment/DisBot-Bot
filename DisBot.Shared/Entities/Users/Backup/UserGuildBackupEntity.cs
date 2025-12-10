using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Users.Backup;

public class UserGuildBackupEntity
{
    public int Id { get; set; }
    [Required] public string BackupJson { get; set; }
    public string? Name { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    [Required] public UserEntity User { get; set; }
}