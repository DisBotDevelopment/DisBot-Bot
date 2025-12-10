using System.ComponentModel.DataAnnotations;
using NetCord.Gateway;

namespace Shared.Entities.Guilds.ChannelLinks;

public class GuildChannelLinksEntity
{
    public int Id { get; set; }
    [Required] public ulong ChannelId { get; set; }
    [Required] public string WebhookUrl { get; set; }
    public string[] SyncFlags { get; set; } = [];
    public ulong[] LinkedWith { get; set; } = [];
    public ulong[] UsersCanSelectIds { get; set; } = [];

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public List<GuildSyncedChannelLinkMessageEntity> SyncedChannelLinkMessages { get; set; } = [];
    [Required] public GuildEntity Guild { get; set; }
}