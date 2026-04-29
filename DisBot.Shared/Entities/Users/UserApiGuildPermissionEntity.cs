using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Entities.Guilds;

namespace DisBot.Shared.Entities.Users;

public class UserApiGuildPermissionEntity
{
    public int Id { get; set; }
    public string[]? Permissions { get; set; }

    public int UserId { get; set; }
    public int GuildId { get; set; }
    [Required] public GuildEntity Guild { get; set; }
    [Required] public UserEntity User { get; set; }
}