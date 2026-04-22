using System.ComponentModel.DataAnnotations;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.Automation;

public class GuildAutoDeleteEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public ulong ChannelId { get; set; }
    public bool IsActive { get; set; } = false;
    public int Time { get; set; }
    public ulong[] WhitelistedMessageIds { get; set; } = [];
    public ulong[] WhitelistedRoleIds { get; set; } = [];
    public ulong[] WhitelistedUserIds { get; set; } = [];
    
    public int GuildId { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}