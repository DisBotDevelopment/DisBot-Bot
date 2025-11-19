using System.ComponentModel.DataAnnotations;
using NetCord.Gateway;

namespace Shared.Entities.Guilds.Automation;

public class GuildAutoRoleEntity
{
    public int Id { get; set; }
    public ulong[] RoleIds { get; set; } = [];
    [Required] public Guild Guild { get; set; }
}