using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Guilds.Automation;

public class GuildAutoDeleteEntity
{
    public int Id { get; set; }
    [Required] public ulong ChannelId { get; set; }
    public bool IsActive { get; set; } = false;
    public int Time { get; set; }
    public ulong[] WhitelistedMessageIds { get; set; } = [];
    public ulong[] WhitelistedRoleIds { get; set; } = [];
    public ulong[] WhitelistedUserIds { get; set; } = [];
    
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    
    [Required] public GuildEntity Guild { get; set; }
}