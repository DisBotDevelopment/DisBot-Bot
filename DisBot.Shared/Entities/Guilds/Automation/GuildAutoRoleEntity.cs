using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Automation;

public class GuildAutoRoleEntity: IActionTimestamps
{
    public int Id { get; set; }
    public ulong[] RoleIds { get; set; } = [];
    
    public int GuildId { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}