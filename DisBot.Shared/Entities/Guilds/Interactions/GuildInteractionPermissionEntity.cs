using System.ComponentModel.DataAnnotations;
using DisBot.Shared.Interfaces;

namespace DisBot.Shared.Entities.Guilds.Interactions;

public class GuildInteractionPermissionEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public int Type { get; set; }

    public string? CustomId { get; set; }
    public string? CommandName { get; set; }

    public ulong[] RoleIds { get; set; } = [];
    public ulong[] UserIds { get; set; } = [];
    public ulong[] ChannelIds { get; set; } = [];
    public bool DisableInternalUserPermission { get; set; } = false;
    public bool OnlyGuildOwner { get; set; } = false;
    public int? Cooldown { get; set; }
    
    public int GuildId { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}