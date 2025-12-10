using System.ComponentModel.DataAnnotations;
using NetCord.Gateway;

namespace Shared.Entities.Guilds.Automation;

public class GuildAutoRoleEntity
{
    public int Id { get; set; }
    public ulong[] RoleIds { get; set; } = [];
    
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    
    [Required] public GuildEntity Guild { get; set; }
}