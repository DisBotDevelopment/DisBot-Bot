using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Users.Backup;

public class UserGuildBackupEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public string BackupJson { get; set; }
    public string? Name { get; set; }

    [Required] public UserEntity User { get; set; }
}