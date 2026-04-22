using System.ComponentModel.DataAnnotations;
using Shared.Interfaces;

namespace Shared.Entities.Guilds.ChannelLinks;

public class GuildChannelLinksEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public ulong ChannelId { get; set; }
    [Required] public string WebhookUrl { get; set; }
    public string[] SyncFlags { get; set; } = [];
    public ulong[] LinkedWith { get; set; } = [];
    public ulong[] UsersCanSelectIds { get; set; } = [];
    
    public List<GuildSyncedChannelLinkMessageEntity> SyncedChannelLinkMessages { get; set; } = [];
    
    public int GuildId { get; set; }
    [Required] public GuildEntity Guild { get; set; }
}